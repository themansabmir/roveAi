# Marketing CMS (Sanity)

Content for **Rove SaaS marketing** (`@rove/web`) and **agency marketing** (`@rove/agency-web`) lives in one Sanity project with separate datasets. The product dashboard’s “agency workspace” is unrelated — that is tenant data in Postgres.

## Datasets

| Dataset | Next app | Vercel `NEXT_PUBLIC_SANITY_DATASET` |
|---------|----------|-------------------------------------|
| `production-rove` | `apps/web` | `production-rove` |
| `production-agency` | `apps/agency-web` | `production-agency` |
| `development-rove` | local web | `development-rove` |
| `development-agency` | local agency-web | `development-agency` |

Setup: [sanity-project-setup.md](./sanity-project-setup.md)

## Studio

- Code: [`apps/studio`](../apps/studio)
- Local: `pnpm dev:studio` (port 3333)
- Deploy: `pnpm --filter @rove/studio deploy` → `*.sanity.studio`
- Workspaces: **Rove SaaS** (`/rove`) and **Agency** (`/agency`)

## Document types

**Rove dataset:** `roveSiteSettings`, `roveSolution`, `roveBlogPost`, `roveAuthor`, `roveCategory`, `rovePage`

**Agency dataset:** `agencySiteSettings`, `agencyService`, `agencyCaseStudy`, `agencyBlogPost`, `agencyPage`

Singleton IDs in Studio: `roveSiteSettings`, `agencySiteSettings`.

## Preview (draft mode)

Generate secrets (`SANITY_PREVIEW_SECRET`) and open:

```
https://<rove-site>/api/draft?secret=...&type=roveBlogPost&slug=my-post
https://<agency-site>/api/draft?secret=...&type=agencyService&slug=seo
```

Exit preview: `/api/disable-draft` (Rove web only; agency can add the same route if needed).

Requires `SANITY_API_READ_TOKEN` (Viewer) on Vercel.

## On-publish revalidation (ISR)

1. Set `SANITY_REVALIDATE_SECRET` on each Vercel project.
2. In Sanity → API → Webhooks, POST to:
   - Rove: `https://<rove-domain>/api/revalidate?secret=<secret>`
   - Agency: `https://<agency-domain>/api/revalidate?secret=<secret>`
3. Filter webhooks by dataset or use separate secrets per site.

Payload uses `_type` and `slug.current` to revalidate specific paths plus cache tag `sanity` / `sanity-agency`.

## SEO conventions

- Every document type includes optional `seo` (title, description, canonical path, noindex, OG image).
- URLs are locale-prefixed (`/en/...`) for future i18n; only `en` is enabled today.
- Reserved slugs: see `ROVE_RESERVED_SEGMENTS` / `AGENCY_RESERVED_SEGMENTS` in `@rove/cms/constants`.
- Agency services: `indexable: false` excludes from sitemap and slug static generation.

## Shared package

Schema, GROQ, and metadata helpers: [`packages/cms`](../packages/cms).
