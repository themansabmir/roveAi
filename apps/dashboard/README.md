# LocalBrief dashboard

LocalBrief is local business opportunity briefs for agencies. This package (`localbrief-dashboard`) is the React app agencies use to sign in and run campaigns.

Product rules live in [`../doc/README.md`](../doc/README.md). This file is setup and a map of the code.

## Setup

The API must be running first. See [`../backend/README.md`](../backend/README.md).

From `frontend/`:

```bash
npm install
npm run dev
```

Vite serves http://localhost:5173 and proxies `/api`, `/healthz`, and `/readyz` to http://localhost:3000. Cookies are sent with `withCredentials`. No frontend `.env` is required for local development.

## Checks

```bash
npm run lint
npm run build
```

## Routes

| Path | Who |
|---|---|
| `/login` | Signed-out users. Signed-in users are sent home. |
| `/` | Campaign list, behind the session. |
| `/campaigns/:campaignId` | Campaign detail, run, cancel, and leads. |

## Where code goes

```text
src/app/App.tsx                         routes
src/layout/DashboardLayout.tsx          sidebar shell
src/features/auth/                      session, login, protected routes
src/features/campaigns/                 campaign list, form, and detail
src/shared/api/                         axios client and TanStack Query
src/shared/ui/                          button, input, label, card, separator, dropdown-menu
```

Each feature is split into `presentation/` (pages), `application/` (hooks), `domain/` (types), and `infrastructure/` (HTTP). Pages do not call axios directly.

Use the semantic color tokens (`bg-primary`, `text-muted-foreground`, `border-border`). Do not hard-code palette colors.
