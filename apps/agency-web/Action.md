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

## Next actions
- **Service pages**: one page per core service (`/services/pipeline-generation`, `/services/sales-crm`, `/services/revenue-ops`). Each: problem, business impact, approach, process, deliverables, tools (reuse `StackFlow` single flow), where you decide, after handover, related case study, CTA. Point header "Services" to a new overview; retire `/what-we-build` (redirect).
- **How it works** (`/how-it-works`, legacy gemini `faq` page): rebuild in new system. Diagnose → Build → Run → Hand over, approval gates (content in `home.ts` → `control.gates`), handover detail, FAQ (reuse `homeContent.faq`).
- **About** (`/about`, legacy `why-us`): rebuild. Principles, ownership model, who we are. Remove unverified claims (e.g. "100% attributed", "Zero hallucination").
- **Contact** (`/contact`, legacy `build-system`): rebuild as a short booking form (name, work email, company, CRM, main problem). Wire to a real endpoint/scheduler.
- **Policy** (`/policy`): restyle; keep compliance content (US only, opt-out, 24h unsubscribe).
- **Work** (`/work`): case study detail pages in Problem → Approach → Implementation → Result format.
- **Cleanup**: delete unused legacy gemini pages/content (case-study, cta-page, data-flow, insight-resource, system-breakdown, system-selection, case-study-maybe) and old home components (`HomePageSections`, `CaseStudiesGrid`, `ClientMarquee`, `HomeFooter`, `RevenueLeakAudit`, etc.). Then drop the palette-bridge overrides in `globals.css`.
- **Brand loose ends**: replace `@syntropic.ai` emails; add real client and tool logos (`homeContent.clientMarquee.brands[].logo`, `tools[].logo` in `revops.ts`); check trademark and domain for "Rivet".
- **Legal**: add Privacy and Terms pages, link them in the footer.
- **Content needing owner sign-off**: comparison table "Typical agency" column; FAQ claims (no tool markup, workflows owned by client, optional ongoing operation).
- **QA**: run `next build` with the dev server stopped; check 375/768/1024/1440/1920; Lighthouse (performance, accessibility, SEO); `prefers-reduced-motion`.
