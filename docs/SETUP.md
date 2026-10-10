# Rove — Local setup, install & run

How to install, configure, and run all three apps (website, dashboard, API) on your machine.

## 1. Prerequisites

| Tool       | Version          | Notes                                        |
| ---------- | ---------------- | -------------------------------------------- |
| Node.js    | >= 22            | `node -v`                                    |
| pnpm       | >= 9             | `npm i -g pnpm` if missing                   |
| PostgreSQL | 16/17            | Local, Docker, or a Neon dev branch          |
| Git        | any              |                                              |

The monorepo uses **pnpm workspaces** + **Turborepo**.

```
rove/
├── apps/
│   ├── web/         @rove/web       Next.js marketing site      → http://localhost:3001
│   ├── dashboard/   @rove/dashboard React + Vite dashboard SPA  → http://localhost:5173
│   └── api/         @rove/api       Express + Prisma + worker   → http://localhost:3000
└── packages/
    ├── ui/          @rove/ui        shared Shadcn UI + Tailwind preset
    └── config-ts/   @rove/config-ts shared tsconfig bases
```

## 2. Install

From the repo root:

```bash
pnpm install
```

This installs every workspace package in one pass and links `@rove/ui` / `@rove/config-ts` into the apps.

## 3. Configure environment

### API (`apps/api`)

```bash
cp apps/api/.env.example apps/api/.env
```

Fill in:

| Var                   | What                                                                 |
| --------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL`        | Postgres **pooler** URL (app + worker + pg-boss)                      |
| `DIRECT_URL`          | Postgres **direct** URL (Prisma CLI / migrations)                    |
| `BETTER_AUTH_SECRET`  | Random string, >= 32 chars                                           |
| `BETTER_AUTH_URL`     | `http://localhost:3000`                                             |
| `CORS_ORIGINS`        | `http://localhost:5173,http://localhost:3001`                       |
| `OUTSCRAPER_API_KEY`  | Optional in dev (empty = sample data). Required in prod.             |

> With Neon: `DATABASE_URL` uses the host containing `-pooler`; `DIRECT_URL` is the same URL with `-pooler` removed. With local Postgres, both can be the same URL.

### Website (`apps/web`)

```bash
cp apps/web/.env.example apps/web/.env
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Dashboard (`apps/dashboard`)

Create `apps/dashboard/.env` only if you need to override the API base:

```
VITE_API_BASE_URL=http://localhost:3000
```

The Vite dev server already proxies `/api`, `/healthz`, `/readyz` to `http://localhost:3000`.

## 4. Database (Prisma)

```bash
# generate the Prisma client (safe without a live DB connection)
pnpm --filter @rove/api prisma:generate

# create / apply migrations against your dev database
pnpm --filter @rove/api prisma:migrate
```

The schema lives at `apps/api/prisma/schema.prisma`. Prisma 7 keeps connection URLs in `apps/api/prisma.config.ts` (reads `DIRECT_URL`), not in the schema.

### Quick local Postgres with Docker (optional)

```bash
docker run --name rove-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=rove -p 5432:5432 -d postgres:17
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rove?schema=public
# DIRECT_URL=postgresql://postgres:postgres@localhost:5432/rove?schema=public
```

## 5. Run

### Everything at once (Turborepo)

```bash
pnpm dev
```

### Individually

```bash
pnpm dev:web          # Next.js website   → http://localhost:3001
pnpm dev:dashboard    # React dashboard   → http://localhost:5173
pnpm dev:api          # API               → http://localhost:3000
```

### API background worker

The queue worker (discovery, crawl, audit, interpret jobs) runs as a separate process:

```bash
pnpm --filter @rove/api dev:worker
```

Set `WORKER_ENABLED=false` in `apps/api/.env` to keep the API process from also running the worker inline.

## 6. Build / typecheck / test / lint

```bash
pnpm build        # build all (turbo)
pnpm typecheck    # typecheck all
pnpm test         # run tests (api)
pnpm lint         # lint all
```

Scope to one package with `--filter`:

```bash
pnpm --filter @rove/api test
pnpm turbo run build --filter @rove/web
```

## 7. Shared UI (Shadcn)

Shared components live in `packages/ui`. Add new ones there so both frontends get them:

```bash
pnpm --filter @rove/ui ui:add <component>
```

Import in any app:

```ts
import { Button } from "@rove/ui/components/button"
import { cn } from "@rove/ui/lib/cn"
```

Both `web` and `dashboard` extend the shared Tailwind preset (`@rove/ui/tailwind-preset`).

## 8. Ports summary

| App       | URL                     |
| --------- | ----------------------- |
| web       | http://localhost:3001   |
| dashboard | http://localhost:5173   |
| api       | http://localhost:3000   |

## 9. Deployment targets

See [`docs/INFRASTRUCTURE.md`](./INFRASTRUCTURE.md). Short version: website + dashboard on **Vercel**, API + worker on an **EC2/VPS**, database on **Neon**, files on **Cloudflare R2**.
