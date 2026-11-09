# Rivet agency site: next actions

## Context
- App: `apps/agency-web` (Next 15, Tailwind, Sanity). Brand: **Rivet** (formerly Syntropic/Throughline). Name in `src/content/brand.ts`.
- Positioning: RevOps for B2B firms (10–50 staff) that sell through a sales team. **One-time build, in the client's own accounts, keeps running after a 30-day handover.** No public pricing (scoped on a call).
- 3 core services (`src/content/revops.ts` → `services`):
  1. Pipeline generation (Marketing → Leads)
  2. Sales and CRM system (Sales → Pipeline)
  3. Revenue operations (Revenue → Retention)
- Design system: tokens in `src/app/globals.css` (`--rv-*`), component classes (`rv-container`, `rv-btn-*`, `rv-heading`, `rv-display`, `rv-prose`) in `tailwind.config.ts` plugin. Emerald = automated, amber diamond = human approval. Fonts: Bricolage Grotesque / Geist / Geist Mono.
- Homepage done: `src/components/home/HomePage.tsx` (hero revenue curve, marquee, problem showcase, service card stack, process, tool flow, case bento, comparison, FAQ, CTA).
- Shared chrome: `SiteHeader`, `SiteFooter`, `PageIntro`, `NotFoundView` in `src/components/site/`.
- Rules: no invented metrics, clients or integrations. No small-print disclaimer lines. Primary CTA everywhere = "Book a 30-minute review" → `/contact`.

## Done (phase 2)
- Service pages: `/services` overview + `/services/{pipeline-generation,sales-crm-system,revenue-operations}` (`components/services/ServicePage.tsx`, content in `revops.ts` → `services.items`). Other CMS service slugs still render.
- Rebuilt `/how-it-works`, `/about`, `/contact`, `/policy` as real routes. Policy content in `content/policy.ts`.
- Contact form posts to `/api/contact` → forwards JSON to `CONTACT_WEBHOOK_URL` (returns 503 until set).
- Legacy gemini pages, content, assets and old home components deleted; palette bridge removed. Old URLs 308-redirect via `content/siteMap.ts`.
- Inner pages no longer reuse homepage sections: `/services` has a stage map + symptom finder (`components/services/ServicesOverview.tsx`), service pages show a static tool chain, How it works has a 5-phase timeline + process FAQ. Inner pages close with `components/site/CtaPanel.tsx`.
- Header "Services" is a hover/click mega-menu listing the three service pages; mobile menu lists them under Services.
- Work: `/work` bento grid + "What we measure" section; case study pages at `/work/{roister,codeninjas,rivet-outbound}` (content in `content/work.ts`, views in `components/work/`). CMS case studies still render.

## Next actions
- **Set `CONTACT_WEBHOOK_URL`** (n8n/Make/Slack) or swap in a scheduler (Cal.com) on `/contact`.
- **Policy vs positioning conflict**: `content/policy.ts` handover says "internal agent code… remain ours" and "Automation stops after handover unless your team can operate it". Homepage says "keeps running after our contract ends". Owner must reconcile.
- **Work** (`/work`): get client sign-off on case study briefs and step details in `content/work.ts`; add measured results when available.
- **Brand loose ends**: real contact/privacy emails on the Rivet domain; real client and tool logos (`homeContent.clientMarquee.brands[].logo`, `tools[].logo` in `revops.ts`); check trademark and domain for "Rivet".
- **Legal**: add Privacy and Terms pages, link them in the footer.
- **Content needing owner sign-off**: comparison table "Typical agency" column; FAQ claims (no tool markup, workflows owned by client, optional ongoing operation); service-page copy in `revops.ts`.
- **Tidy**: `home.ts` still holds unused legacy blocks (audit, positioningStatement, threeParts, pricing, etc.).
- **QA**: run `next build` with the dev server stopped; check 375/768/1024/1440/1920; Lighthouse (performance, accessibility, SEO); `prefers-reduced-motion`.
