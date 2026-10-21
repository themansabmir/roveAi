# Rove — Infrastructure & deployment stack

Locked stack (impacts how each piece deploys). Source of truth for product scope: [`apps/api/doc/MVP.md`](../apps/api/doc/MVP.md).

## Topology

```
                 ┌──────────────────────────┐
   Browser  ───▶ │ Vercel                    │
                 │  • @rove/web (Next.js)     │  Rove SaaS marketing :443
                 │  • @rove/agency-web        │  agency marketing    :443
                 │  • @rove/dashboard (SPA)   │  product dashboard   :443
                 └─────────────┬────────────┘
                               │
                 ┌─────────────▼────────────┐
                 │ Sanity (Content Lake)     │
                 │  • Studio (sanity deploy) │
                 │  • datasets: rove/agency  │
                 └──────────────────────────┘
                               │ HTTPS (axios, withCredentials)
                               ▼
                 ┌──────────────────────────┐
                 │ EC2 / VPS                 │
                 │  • @rove/api (Express)     │  REST API            :3000
                 │  • worker (pg-boss)        │  discover/crawl/     
                 │  • browser worker          │  audit/interpret     
                 └───┬───────────────┬───────┘
                     │               │
          Postgres   ▼               ▼  object storage
         ┌────────────────┐   ┌────────────────────┐
         │ Neon           │   │ Cloudflare R2       │
         │  Postgres 17   │   │  screenshots, PDFs, │
         │  pooler+direct │   │  CSV exports, logos │
         └────────────────┘   └────────────────────┘
                     │
                     ▼  hand-off (no outbound by us)
         ┌────────────────────────────────────────┐
         │ CRM: HubSpot / Pipedrive / Salesforce / │
         │ Zoho / webhook / CSV                     │
         └────────────────────────────────────────┘
```

## Components

### Frontend — Vercel

- **`@rove/web`** (Next.js): Rove SaaS marketing. Root `apps/web`. Sanity dataset `production-rove`. See [`docs/MARKETING-CMS.md`](./MARKETING-CMS.md).
- **`@rove/agency-web`** (Next.js): separate agency/services marketing site. Root `apps/agency-web`. Sanity dataset `production-agency`.
- **`@rove/dashboard`** (Vite SPA): static build (`dist/`) served by Vercel. Set `VITE_API_BASE_URL` to the API URL. Because it's an SPA, add a catch-all rewrite to `index.html`.
- **`@rove/studio`**: Sanity Studio; deploy with `sanity deploy` (hosted on `*.sanity.studio`), not on Vercel by default.
- Monorepo on Vercel: create **one project per app** (`apps/web`, `apps/agency-web`, `apps/dashboard`) in the same repo. Install at repo root (`pnpm install`), set each project's root directory, build with `pnpm build` (or `turbo run build --filter=...`). `transpilePackages` includes `@rove/ui` and `@rove/cms`.

**Marketing env (Vercel):** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SANITY_PREVIEW_SECRET`. Optional on Rove web: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_DASHBOARD_URL`.

**Auth/cookies:** the dashboard calls the API with `withCredentials`. For cookie auth across origins, serve the API on a subdomain of the same site (e.g. `api.rove.app` + `app.rove.app`) and set the auth cookie `Domain=.rove.app`, `SameSite=None; Secure`. `CORS_ORIGINS` on the API must list both Vercel origins.

### API + workers — EC2 / VPS

- **`@rove/api`**: Express server (`node dist/app.js`), port 3000. Build with `pnpm --filter @rove/api build`.
- **Worker**: `node dist/worker.js` as a **separate process/service** (systemd unit or PM2). It consumes pg-boss queues (`discover`, `crawl`, `audit`, `interpret`, `competitor`, `reaudit`, `export`).
- **Browser worker** (Phase 1+): Lighthouse / Playwright / sitespeed audits run browser jobs. These need more CPU + shared memory. Keep them on their own process (and ideally their own instance or container with `shm_size`) so a heavy crawl doesn't starve the API.
- Put the API behind a reverse proxy (Caddy/nginx) terminating TLS, or an ALB. Health checks: `/healthz`, `/readyz`.
- **SSRF boundary (MVP section 7):** the fetch/browser workers crawl third-party sites. Block private IP ranges, loopback, link-local, and cloud-metadata endpoints; revalidate after DNS + redirects. Run browser/scan containers non-root, with CPU/memory limits, timeouts, and concurrency caps. This is a hard requirement, not optional.

### Database — Neon (Postgres)

- Postgres 17. Two URLs: **pooler** (`DATABASE_URL`, app/worker/pg-boss) and **direct** (`DIRECT_URL`, Prisma CLI/migrations).
- pg-boss uses the same database for the job queue.
- Migrations: `pnpm --filter @rove/api prisma:migrate:deploy` in the API's release step on the VPS.
- Prisma 7 keeps the connection URL in `apps/api/prisma.config.ts` (reads `DIRECT_URL`).

### Files — Cloudflare R2

- S3-compatible object storage. The DB (`StoredFile`) stores `bucket`, `objectKey`, `contentType`, `sizeBytes`, `checksum` — never the bytes.
- Used for: audit screenshots (`SnapshotPage.screenshotFileId`), brief PDFs (`Brief.pdfFileId`), CSV exports, agency logos (`Organization.logoFileId`).
- Serve downloads via short-lived presigned URLs from the API; do not make buckets public.
- API env (add to `.env.example` when the file plugin lands): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`.

### CRM — hand-off, not outbound

The product researches and exports. It does **not** send cold email or run sequences. CRM integration is modeled by `CrmConnection` + `CrmExport` (HubSpot, Pipedrive, Salesforce, Zoho, generic webhook, or CSV). OAuth tokens / API keys are encrypted at rest by the app layer before being stored in `CrmConnection.credentials`.

## Environment variables by service

| Service        | Key vars                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------- |
| web (Vercel)   | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_*`, `SANITY_*`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_DASHBOARD_URL` |
| agency-web     | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_*`, `SANITY_*` (agency dataset)               |
| dashboard      | `VITE_API_BASE_URL`                                                                       |
| studio (CLI)   | `SANITY_STUDIO_PROJECT_ID`, optional dataset overrides                                    |
| api / worker   | `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGINS`, `OUTSCRAPER_API_KEY`, `R2_*`, `OPENAI_API_KEY` (LLM), `PROPOSAL_EVENT_SALT` (brief analytics), CRM provider secrets |

## CI/CD outline

1. **Frontends:** Vercel builds on push (per-project root dir).
2. **API/worker:** build artifact (`dist/`) + Prisma client; ship to the VPS; run `prisma migrate deploy`; restart API and worker services.
3. One Prisma migration per schema change. Never edit an applied migration.
