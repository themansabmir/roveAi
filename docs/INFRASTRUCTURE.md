# Rove — Infrastructure & Deployment Topology

> **Source of Truth**: [`apps/api/doc/MVP.md`](../apps/api/doc/MVP.md)  
> **Operational Guide**: [`docs/ARCHITECTURE_AND_WORKERS.md`](./ARCHITECTURE_AND_WORKERS.md)

---

## 1. System Topology

```
                  ┌─────────────────────────────────────────┐
    Browser  ───▶ │ Vercel CDN                              │
                  │  • @rove/web (Next.js 15)        :443   │  SaaS marketing
                  │  • @rove/agency-web (Next.js 15) :443   │  Agency marketing
                  │  • @rove/dashboard (Vite React)  :443   │  Agency dashboard SPA
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │ Sanity (Content Lake)                   │
                  │  • @rove/studio (sanity deploy)         │
                  │  • Datasets: production-rove / agency   │
                  └─────────────────────────────────────────┘
                                       │ HTTPS (CORS + withCredentials)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ Compute Layer (GCP Cloud Run or VPS)    │
                  │  • @rove/api (Express 5 REST API)       │
                  │  • Background Workers                   │
                  │    - Discover (Apify/Outscraper)        │
                  │    - Crawl (SSRF-protected HTTP fetch) │
                  │    - PSI (PageSpeed Insights v5)        │
                  │    - Interpret (Gemini / OpenAI LLM)    │
                  └────────────┬──────────────────┬─────────┘
                               │                  │
                    Postgres   ▼                  ▼  Object Storage
             ┌─────────────────────┐    ┌──────────────────────────┐
             │ Neon Database       │    │ Google Cloud Storage     │
             │  Postgres 17        │    │ or Cloudflare R2         │
             │  • Pooler (API/app) │    │  - Audit HTML & files    │
             │  • Direct (Migrate) │    │  - Screenshots & PDFs    │
             └──────────┬──────────┘    └──────────────────────────┘
                        │
                        ▼  Asynchronous Queue Broker
             ┌─────────────────────────────────────────────────────┐
             │ Dual Queue Engine                                   │
             │  • Local / Monolith: pg-boss (Postgres queue)       │
             │  • Scaled Cloud: GCP Pub/Sub (Push Subscriptions)   │
             └─────────────────────────────────────────────────────┘
```

---

## 2. Infrastructure Components

### Frontend — Vercel
- **`@rove/web`** (Next.js 15): SaaS marketing site (`apps/web`). Connects to Sanity dataset `production-rove`.
- **`@rove/agency-web`** (Next.js 15): White-label / agency marketing portal (`apps/agency-web`).
- **`@rove/dashboard`** (Vite 6 + React 19 SPA): Agency control panel. Deployed as a static SPA with catch-all rewrites (`/* -> /index.html`). Configured via `VITE_API_BASE_URL`.
- **`@rove/studio`**: Sanity Studio v3. Deployed via `sanity deploy` to `*.sanity.studio`.
- **Cookie & CORS Architecture**: When hosting across domains (e.g. `app.rove.ai` and `api.rove.ai`), cookies use `SameSite=None; Secure; Domain=.rove.ai`. `CORS_ORIGINS` on the API lists the allowed frontend origins.

### Backend & Workers — Cloud Run or VPS
- **`@rove/api`**: Express 5 server listening on port 3000.
- **Worker Execution Modes**:
  1. **Monolithic / Local Mode (`QUEUE_DRIVER="pgboss"`)**: Workers subscribe via pg-boss inside a background Node process (`pnpm --filter @rove/api dev:worker`).
  2. **Cloud Serverless Mode (`QUEUE_DRIVER="pubsub"`)**: Workers run as stateless Cloud Run containers. Google Cloud Pub/Sub pushes incoming messages to dedicated endpoints:
     - `POST /push/discover`
     - `POST /push/crawl`
     - `POST /push/psi`
     - `POST /push/interpret`
     Push endpoints validate Google Cloud OIDC Bearer tokens matching `PUBSUB_PUSH_AUDIENCE`.
- **Outbox Recovery**: Cron-based sweeper (`src/entries/sweep.ts`) runs periodically to re-dispatch unleased jobs older than 30s.

### Database — Neon (Postgres 17)
- Dual connection strings:
  - **`DATABASE_URL`**: Connects through PgBouncer connection pooler (`-pooler.region.aws.neon.tech`). Used by the API server and worker processes.
  - **`DIRECT_URL`**: Connects directly to the compute instance. Required by Prisma CLI for schema migrations (`prisma.config.ts`).
- Migrations: Executed via `pnpm --filter @rove/api prisma:migrate:deploy`.

### Object Storage — GCS / Cloudflare R2
- The database (`StoredFile` table) tracks object metadata only (`bucket`, `objectKey`, `sizeBytes`, `checksum`, `contentType`).
- The storage abstraction (`StoragePlugin`) supports:
  - `LocalStorageProvider`: Writes directly to `.data/objects` for zero-friction local development.
  - `GcsStorageProvider`: Google Cloud Storage bucket (`GCS_BUCKET`) for production.

---

## 3. Environment Variable Matrix

| Variable | Scope | Purpose | Example / Default |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Global | Runtime environment | `development` / `production` |
| `PORT` | API | HTTP server listen port | `3000` |
| `DATABASE_URL` | API / Worker | Pooled PostgreSQL connection | `postgresql://user:pass@host-pooler.../db` |
| `DIRECT_URL` | API / Prisma | Direct PostgreSQL connection for migrations | `postgresql://user:pass@host.../db` |
| `BETTER_AUTH_SECRET` | API | Auth session signing key (>=32 chars) | `hex-or-base64-random-string` |
| `BETTER_AUTH_URL` | API | Base URL for auth callbacks | `http://localhost:3000` |
| `CORS_ORIGINS` | API | Allowed frontend origins (comma-separated) | `http://localhost:5173,http://localhost:3001` |
| `QUEUE_DRIVER` | API / Worker | Queue backend (`pgboss` or `pubsub`) | `pgboss` |
| `GCP_PROJECT_ID` | API / Worker | Google Cloud Project ID (if Pub/Sub enabled) | `rove-production` |
| `PUBSUB_PUSH_AUDIENCE` | API / Worker | Expected OIDC audience for push verification | `https://api.rove.ai/push` |
| `GCS_BUCKET` | Storage | GCS bucket for files and audit logs | `rove-storage-bucket` |
| `LOCAL_OBJECT_DIR` | Storage | Local storage fallback folder | `.data/objects` |
| `APIFY_TOKEN` | Maps | Apify API token for Google Maps scraping | `apify_api_...` |
| `APIFY_ACTOR` | Maps | Apify actor name | `scraperlink/google-maps-scraper` |
| `OUTSCRAPER_API_KEY` | Maps | Secondary discovery provider key | Optional in dev |
| `PAGESPEED_API_KEY` | Audit | Google PageSpeed Insights v5 key | `AIza...` |
| `RESEND_API_KEY` | Email | Resend email provider key | `re_...` |
| `SUPERADMIN_EMAIL` | Admin | Boot-time superadmin auto-provision email | `admin@rove.local` |
| `SUPERADMIN_PASSWORD` | Admin | Boot-time superadmin auto-provision password| `secretpassword123` |

---

## 4. Production CI/CD Pipeline

1. **Frontend Deployment (Vercel)**:
   - Root Directory set to target app (`apps/web`, `apps/agency-web`, `apps/dashboard`).
   - Builds triggered on push via Turborepo caching (`turbo run build --filter=<app>`).
2. **Database Migration Step**:
   - `pnpm --filter @rove/api prisma:migrate:deploy` runs in release step before container rollout.
3. **Container Rollout (Cloud Run / VPS)**:
   - Container built with Node 22 Alpine, compiling TypeScript to `dist/`.
   - Starts API (`node dist/app.js`) or worker roles (`node dist/entries/run-role.js <role>`).
   - Health probes query `/readyz` before routing traffic.
