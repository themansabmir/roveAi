# Rove — Infrastructure & deployment stack

Locked stack (impacts how each piece deploys). Source of truth for product scope: [`apps/api/doc/MVP.md`](../apps/api/doc/MVP.md).

## Topology

```
                 ┌──────────────────────────┐
   Browser  ───▶ │ Vercel                    │
                 │  • @rove/web (Next.js)     │  marketing site      :443
                 │  • @rove/dashboard (SPA)   │  agency dashboard    :443
                 └─────────────┬────────────┘
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

- **`@rove/web`** (Next.js): marketing site. Native Vercel target. Set `NEXT_PUBLIC_API_BASE_URL` to the API's public URL. Root directory `apps/web`, `transpilePackages: ["@rove/ui"]` is already configured so the shared package builds.
- **`@rove/dashboard`** (Vite SPA): static build (`dist/`) served by Vercel. Set `VITE_API_BASE_URL` to the API URL. Because it's an SPA, add a catch-all rewrite to `index.html`.
- Monorepo on Vercel: create **two projects** pointing at the same repo, each with its own root directory (`apps/web`, `apps/dashboard`). Build command `pnpm build`, install `pnpm install`, with the repo root as the workspace. Turborepo remote caching optional.

**Auth/cookies:** the dashboard calls the API with `withCredentials`. For cookie auth across origins, serve the API on a subdomain of the same site (e.g. `api.rove.app` + `app.rove.app`) and set the auth cookie `Domain=.rove.app`, `SameSite=None; Secure`. `CORS_ORIGINS` on the API must list both Vercel origins.

### API + workers — EC2 / VPS

- **`@rove/api`**: Express server (`node dist/app.js`), port 3000. Build with `pnpm --filter @rove/api build`.
- **Worker**: `node dist/worker.js` as a **separate process/service** (systemd unit or PM2). It consumes pg-boss queues (`discover`, `crawl`, `audit`, `interpret`, `competitor`, `reaudit`, `export`).
- **Browser worker** (Phase 1+): Lighthouse and Playwright run in `apps/api/Dockerfile` target `browser` (`mcr.microsoft.com/playwright:v1.64.0-noble`). `WORKER_ROLE=browser` so this process does not consume discovery jobs. Shared memory is 1 GB, memory is capped at 2 GB, and the container sits on its own Compose network. Pin the `playwright` npm package to `1.64.0` when the audit plugin installs it, so it finds the browsers baked into that image.
- Put the API behind a reverse proxy (Caddy/nginx) terminating TLS, or an ALB. Health checks: `/healthz`, `/readyz`.
- **Compose:** `compose.yaml` is local Postgres only (apps stay on the host). `compose.prod.yaml` runs `api`, `worker`, and `browser-worker` on the VPS. Neon and R2 stay outside Compose. There is no Redis service; the queue is pg-boss on Postgres.
- **SSRF boundary (MVP section 7):** the fetch/browser workers crawl third-party sites. Block private IP ranges, loopback, link-local, and cloud-metadata endpoints; revalidate after DNS + redirects. Run browser/scan containers non-root, with CPU/memory limits, timeouts, and concurrency caps. This is a hard requirement, not optional.

### Database — Neon (Postgres)

- Postgres 17. Two URLs: **pooler** (`DATABASE_URL`, app/worker/pg-boss) and **direct** (`DIRECT_URL`, Prisma CLI/migrations).
- pg-boss uses the same database for the job queue.
- Migrations: `docker compose -f compose.prod.yaml --profile migrate run --rm migrate`, or `pnpm --filter @rove/api prisma:migrate:deploy` on the host. Run this before restarting the API.
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
| web (Vercel)   | `NEXT_PUBLIC_API_BASE_URL`                                                                |
| dashboard      | `VITE_API_BASE_URL`                                                                       |
| api / worker   | `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGINS`, `OUTSCRAPER_API_KEY`, `R2_*`, `OPENAI_API_KEY` (LLM), `PROPOSAL_EVENT_SALT` (brief analytics), CRM provider secrets |

## CI/CD outline

1. **Frontends:** Vercel builds on push (per-project root dir).
2. **API/worker:** build artifact (`dist/`) + Prisma client; ship to the VPS; run `prisma migrate deploy`; restart API and worker services.
3. One Prisma migration per schema change. Never edit an applied migration.
