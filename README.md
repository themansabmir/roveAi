# Rove

Monorepo for Rove — an automated opportunity engine for local businesses. Outscraper supplies prospects, modular audits collect evidence, and an AI reasoning layer turns that evidence into sales-ready opportunity briefs. See [`apps/api/doc/MVP.md`](apps/api/doc/MVP.md) for the product vision.

## Structure

```
rove/
├── apps/
│   ├── web/         # Marketing website (Next.js, App Router) — port 3001
│   ├── dashboard/   # Agency dashboard SPA (React + Vite) — port 5173
│   └── api/         # Backend API + worker (Express, Prisma, Postgres, pg-boss) — port 3000
├── packages/
│   ├── ui/          # Shared Shadcn UI components, cn() util, Tailwind preset
│   └── config-ts/   # Shared TypeScript config bases
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Tooling

- **Package manager:** pnpm workspaces (`pnpm-workspace.yaml`)
- **Task runner:** Turborepo (`turbo.json`)
- **Shared UI:** `@rove/ui` (Shadcn "new-york" style, Radix primitives, Tailwind preset). Both `web` and `dashboard` consume it.
- **HTTP client:** `axios` in each frontend.

## Getting started

```bash
pnpm install

# apps/api needs a Postgres connection + secrets:
cp apps/api/.env.example apps/api/.env   # then fill in DATABASE_URL / DIRECT_URL / BETTER_AUTH_SECRET
pnpm --filter @rove/api prisma:generate
pnpm --filter @rove/api prisma:migrate

# optional: website env
cp apps/web/.env.example apps/web/.env
```

## Common commands

```bash
pnpm dev              # run all apps in dev (turbo)
pnpm dev:web          # Next.js website only
pnpm dev:dashboard    # React dashboard only
pnpm dev:api          # API only

pnpm build            # build everything
pnpm typecheck        # typecheck everything
pnpm test             # run tests (api)
pnpm lint             # lint everything
```

## Adding shared Shadcn components

Add components into `packages/ui` so every app can import them:

```bash
pnpm --filter @rove/ui ui:add <component>
```

Then import from `@rove/ui/components/<component>` and shared tokens from `@rove/ui/tailwind-preset`.
```ts
import { Button } from "@rove/ui/components/button"
import { cn } from "@rove/ui/lib/cn"
```

## Ports

| App       | Dev URL                 |
| --------- | ----------------------- |
| web       | http://localhost:3001   |
| dashboard | http://localhost:5173   |
| api       | http://localhost:3000   |
