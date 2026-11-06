# Rove — Local Setup & Development Guide

> Quick guide to installing, configuring, and running all applications and background workers in the Rove monorepo.

---

## 1. Prerequisites

| Tool | Required Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 22.0.0` | `node -v` | LTS recommended |
| **pnpm** | `>= 9.0.0` | `pnpm -v` | Install via `npm i -g pnpm` if missing |
| **PostgreSQL**| `16` or `17` | `psql --version` | Local, Docker, or Neon database |

The monorepo uses **pnpm workspaces** orchestrated by **Turborepo**:

```
rove/
├── apps/
│   ├── web/         Next.js 15 SaaS Marketing Website       → http://localhost:3001
│   ├── agency-web/  Next.js 15 Agency Marketing Portal      → http://localhost:3002
│   ├── dashboard/   Vite 6 + React 19 Dashboard SPA         → http://localhost:5173
│   ├── studio/      Sanity Studio v3 Content Management     → http://localhost:3333
│   └── api/         Express 5 + Prisma 7 API & Worker       → http://localhost:3000
└── packages/
    ├── ui/          Shared Shadcn / Radix / Tailwind components
    ├── cms/         Shared Sanity schemas and client
    └── config-ts/   Shared TypeScript configurations
```

---

## 2. Installation

From the monorepo root:

```bash
pnpm install
```

This installs dependencies across all workspaces in a single pass and automatically links internal packages (`@rove/ui`, `@rove/cms`, `@rove/config-ts`).

---

## 3. Environment Configuration

### API (`apps/api`)

Copy the template environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Key environment variables:

```dotenv
# Database Connections
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roveai"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/roveai"

# Server & Auth
NODE_ENV="development"
PORT=3000
LOG_LEVEL="info"
CORS_ORIGINS="http://localhost:5173,http://localhost:3001,http://localhost:3002"
BETTER_AUTH_SECRET="replace-with-a-random-string-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Background Worker Settings
WORKER_ENABLED="false"     # Set to "false" to run workers in separate processes
QUEUE_DRIVER="pgboss"

# Map Discovery Keys
APIFY_TOKEN=""             # Recommended for deep Maps discovery
APIFY_ACTOR="scraperlink/google-maps-scraper"
OUTSCRAPER_API_KEY=""      # Optional fallback

# Performance Audit (PageSpeed Insights)
PAGESPEED_API_KEY=""       # Free from Google Cloud Console

# Default Superadmin Auto-Provisioning (created on first server boot)
SUPERADMIN_EMAIL="admin@rove.local"
SUPERADMIN_PASSWORD="supersecretpassword123"
SUPERADMIN_NAME="Super Admin"
```

### Frontends (`apps/web`, `apps/agency-web`, `apps/dashboard`)

```bash
# Web marketing
cp apps/web/.env.example apps/web/.env

# Agency marketing
cp apps/agency-web/.env.example apps/agency-web/.env
```

`apps/dashboard` proxies API calls to `http://localhost:3000` automatically via Vite config.

---

## 4. Database Initialization & Migrations

Ensure your PostgreSQL server is running and a database (e.g. `roveai`) exists:

```bash
# 1. Generate Prisma Client
pnpm --filter @rove/api prisma:generate

# 2. Apply existing schema migrations
pnpm --filter @rove/api prisma:migrate:deploy
```

*(Note: Prisma 7 reads `DIRECT_URL` from `apps/api/prisma.config.ts`)*.

---

## 5. Running the Application

### Option A: Run Everything via Turborepo
To start all 5 applications in parallel:

```bash
pnpm dev
```

### Option B: Run Apps Individually

| Command | App | URL |
| :--- | :--- | :--- |
| `pnpm dev:api` | Backend API | http://localhost:3000 |
| `pnpm dev:dashboard` | Agency Dashboard SPA | http://localhost:5173 |
| `pnpm dev:web` | SaaS Marketing Site | http://localhost:3001 |
| `pnpm dev:agency-web`| Agency Portal | http://localhost:3002 |
| `pnpm dev:studio` | Sanity Studio | http://localhost:3333 |

---

## 6. Running Background Workers

When `WORKER_ENABLED="false"` in `apps/api/.env`, queue jobs are queued in PostgreSQL (`pg-boss`) and processed by dedicated worker processes:

```bash
# Run all-in-one worker (handles discover, crawl, psi, and interpret queues)
pnpm run dev:worker

# Or run targeted individual workers
pnpm --filter @rove/api dev:worker:crawl    # Only crawl & SEO audits
pnpm --filter @rove/api dev:worker:psi      # Only PageSpeed Insights audits
```

### Outbox Recovery Sweep
If a worker crashes or is stopped with `Ctrl+C` while a job is pending, run the outbox sweeper to reclaim leases:

```bash
node -r tsconfig-paths/register apps/api/src/entries/sweep.ts
```

---

## 7. Build, Typecheck, and Tests

```bash
# Typecheck all packages
pnpm typecheck

# Run test suites
pnpm test

# Build all production bundles
pnpm build
```

---

## 8. Ports Reference

| Service | Port | Protocol | Description |
| :--- | :--- | :--- | :--- |
| `api` | `3000` | HTTP | Express 5 REST API & Better Auth |
| `web` | `3001` | HTTP | Next.js 15 customer marketing site |
| `agency-web`| `3002` | HTTP | Next.js 15 agency marketing portal |
| `dashboard` | `5173` | HTTP | Vite React agency control panel |
| `studio` | `3333` | HTTP | Sanity Studio CMS |
| `postgres` | `5432` | TCP | PostgreSQL 16/17 database |
