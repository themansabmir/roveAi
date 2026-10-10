# LocalBrief API

LocalBrief is local business opportunity briefs for agencies. This package (`localbrief`) is the HTTP API and the queue worker.

Product rules live in [`../doc/README.md`](../doc/README.md). This file is setup and a map of the code.

## Setup

From `backend/`:

```bash
npm install
copy .env.example .env
```

Fill `backend/.env` with a Postgres URL, a direct (non-pooler) `DIRECT_URL` for Prisma CLI, and a `BETTER_AUTH_SECRET` of at least 32 characters. `.env.example` stays placeholders. Do not commit a real password.

`OUTSCRAPER_API_KEY` is optional in development. When it is empty, discovery uses a small built-in sample so the campaign screen can be tried. Production discovery calls Outscraper and requires the key.

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Run

Use two terminals, both from `backend/`:

```bash
npm run dev          # API on port 3000
npm run dev:worker   # pg-boss consumer for campaign discovery
```

The dashboard (port 5173) proxies `/api` to this process. Start it from `frontend/` with `npm run dev`.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## Where code goes

```text
prisma/schema.prisma          data model
src/app.ts                    API process
src/worker.ts                 worker process
src/server.ts                 middleware and route mounting
src/core/                     config, errors, logger
src/middleware/               session and organization access
src/plugins/prisma/           database
src/plugins/queue/            pg-boss
src/plugins/maps/             Maps provider (Outscraper HTTP, or the dev sample)
src/features/auth/            Better Auth
src/features/workspaces/      one agency workspace on signup
src/features/campaigns/       campaign routes and discovery
```

A feature is `routes → controller → service → repository`, with Zod in `*.schemas.ts`. Routes and controllers only handle HTTP. Services throw typed errors from `src/core/errors.ts`. Vendor API keys stay inside plugins. Features call the plugin.

Better Auth is mounted on `/api/auth/*` before `express.json()`, because it needs the raw body.

Campaign routes are `/api/organizations/:organizationId/campaigns`. Membership is required. There is no staff bypass.
