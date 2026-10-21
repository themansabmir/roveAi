# Sanity project setup (one-time)

Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage), then add datasets:

| Dataset | Used by |
|---------|---------|
| `production-rove` | `@rove/web` (Vercel) |
| `production-agency` | `@rove/agency-web` (Vercel) |
| `development-rove` | Local Rove marketing (optional) |
| `development-agency` | Local agency marketing (optional) |

Copy the **Project ID** into each app's `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
```

Create an API token with **Viewer** role for draft preview (`SANITY_API_READ_TOKEN`) and configure webhooks after deploy (see [MARKETING-CMS.md](./MARKETING-CMS.md)).

Deploy Studio from the repo:

```bash
pnpm --filter @rove/studio exec sanity deploy
```
