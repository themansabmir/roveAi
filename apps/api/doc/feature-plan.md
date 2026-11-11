# Rove — Feature plan & DB design

Derived from the single source of truth: [`MVP.md`](./MVP.md). This document bridges the MVP narrative to the regenerated Prisma schema at [`../prisma/schema.prisma`](../prisma/schema.prisma).

## Product scope decision (locked)

Rove **researches** local-business prospects and turns evidence into sales-ready opportunity briefs, then **hands them off to a CRM** (export or integration). It is **not** an outbound engine.

**In scope:** lead discovery, modular evidence audits, Google Business Profile + reviews, competitor/market comparison, deterministic opportunity scoring, AI reasoning briefs, scheduled re-audits + change detection, CRM export/integration, brief sharing + view analytics, CSV export.

**Out of scope (not modeled, not built):** sending cold email, dialing call scripts, outbound sequences, follow-up automation, "campaign launch." The MVP's cold-email / call-script *text* is retained only as **research output** inside a brief (`Brief.coldEmailDraft`, `Brief.callScriptDraft`) that the agency exports — Rove never sends it.

> Note on "ignore phase 1 and 2": we are not limiting the build to the MVP's Phase-1 MVP cut. The schema below covers all phases now; features are implemented incrementally against this one schema.

## Auth & roles (built)

- **Email/password** signup + login via Better Auth (`/api/auth/*`). Session cookie, `req.auth` populated by `attachSession`.
- **Organization onboarding:** signup provisions one agency `Organization` + an `owner` `Membership` and sets the active org (`POST /api/workspaces`).
- **Org roles** (`MembershipRole`): `owner`, `admin`, `member` — scoped to one organization.
- **Platform super admin:** `User.isSuperAdmin` boolean (not an org role). Oversees all organizations via `/api/admin/*` behind `requireSuperAdmin()`. No self-signup — promote with `pnpm --filter @rove/api db:promote-admin -- <email>`.
- `/api/me` returns the user (incl. `isSuperAdmin`), active organization, and org role.

> Billing: credit packs + ledger are modeled (`CreditAccount`, `CreditReservation`, `CreditLedger`, `CreditPack`, `Payment`). Monthly ceilings on `Organization` remain a second guardrail. Subscriptions / SaaS plans are still out of scope.

## The pipeline (MVP section 1)

```mermaid
flowchart LR
  A[Discovery\nOutscraper] --> B[Normalize & enrich]
  B --> C[Audit workers]
  C --> D[Deterministic score]
  D --> E[AI reasoning]
  E --> F[Opportunity brief]
  F --> G[CRM export / share]
  F -.Phase 3.-> H[Scheduled re-audit\nchange detection]
  H --> C
```

## Feature families → data model

### 1. Discovery & enrichment
Pull prospects from Outscraper, normalize domains/names/phones, classify website type, dedupe, queue work.

| Model | Role |
| --- | --- |
| `Campaign` | A research run with structured location (`city`,`region`,`country`), niche, service type, filters, `maxLeads`, optional re-audit cadence. |
| `ExclusionDomain` | Domains to exclude (existing clients). |
| `Business` | Per-org business record; provider ids, NAP, rating/reviews, website URL, `normalizedDomain`, `websiteClass`, raw provider payload. |
| `CampaignLead` | Join of campaign↔business carrying `qualificationStatus`, `auditStatus`, `aiStatus`, `opportunityScore`. |

Identity: `Business @@unique([organizationId, provider, providerId])` — two agencies may discover the same place; each owns its own copy. `CampaignLead @@unique([campaignId, businessId])`.

### 2. Website evidence audits (MVP section 2.A–2.F)
Crawl owned sites (max pages, SSRF-guarded), run modular analyzers, emit normalized findings.

| Model | Role |
| --- | --- |
| `WebsiteSnapshot` | Reusable crawl per org, keyed by `contentHash`. Stores title, headings, tech stack, text size. |
| `SnapshotPage` | Each fetched page; role (home/services/contact/…), extracted CTAs/contact/forms, R2 screenshot ref. |
| `TechnicalAudit` | One `AuditModule` run against a snapshot for a lead; sub-score, `metrics` JSON, tool name/version, device profile, `observedAt`. |
| `AuditFinding` | Normalized record (MVP section 4): `code`, `kind` (finding/opportunity/hypothesis), `severity`, `source` (lab/field/profile/crawl/derived), `confidence`, `evidence` JSON. |

Audit modules (`AuditModule` enum): technical SEO, performance, security (TLS), accessibility, website experience/conversion, local SEO, reputation, content, technology, competitor.

Snapshot reuse is **per organization only** — no cross-tenant cache.

### 3. Local SEO: Google Business Profile + reviews (MVP 2.C, 2.D)

| Model | Role |
| --- | --- |
| `GbpProfile` | Per business: completeness score, categories, hours/photos/posts presence, owner responses, NAP consistency. |
| `Review` | Normalized review: rating, text, salted `authorHash` (no raw PII), sentiment, extracted themes, owner-responded. |

Healthcare guardrail (MVP): for healthcare niches, review text / patient stories are **not** sent to the model; findings stay technical.

### 4. Competitor & market intelligence (MVP 2.G)

| Model | Role |
| --- | --- |
| `CompetitorSet` | Comparison anchored on the subject lead; stores geography, category, `observedAt`, deterministic summary. |
| `Competitor` | Each comparator business: rating, review count, recent reviews, website/booking/contact signals. |

Store the comparator set + context + date; never claim a competitor "ranks higher in Google" from rating alone.

### 5. Deterministic opportunity engine (MVP section 4)
Normalize audit results, compute module sub-scores (`TechnicalAudit.score`) and a lead score (`CampaignLead.opportunityScore`, 0–100). Keep **finding / opportunity / hypothesis** separate (`FindingKind`).

### 6. AI reasoning → opportunity brief (MVP sections 4, 5)

| Model | Role |
| --- | --- |
| `Brief` | Per-lead reasoning output. `content` JSON (Zod-validated), `headlineOpportunity`, `suggestedService`, `confidence`, research text (`valueProposition`, `outreachAngle`, `coldEmailDraft`, `callScriptDraft`), `status` (draft→approved→published→archived), unguessable `publicToken`, optional R2 `pdfFile`. |
| `BriefEvent` | Share analytics: `VIEW` / `UNIQUE_VIEW` / `CTA_CLICK`, salted `visitorHash`, `suspectedBot`. No raw IP, no `viewCount` integer. |

Reasoning gate (MVP): only the top-K scored leads above a threshold go to the model; the rest get `aiStatus = SKIPPED_GATE` or a deterministic draft. Model failure → `aiStatus = UNAVAILABLE` with a deterministic draft. Untrusted page text is passed as data, never concatenated into the system prompt.

### 7. Re-audit & change detection (Phase 3)

| Model | Role |
| --- | --- |
| `Campaign.reauditCadence` / `lastReauditAt` | Schedule periodic re-audits (`OFF`/`WEEKLY`/`MONTHLY`/`QUARTERLY`). |
| `AuditChange` | Detected deltas: score up/down, finding resolved/new, content changed, went offline/online. |

### 8. CRM export / integration (the "execution" endpoint)

| Model | Role |
| --- | --- |
| `CrmConnection` | Per-org CRM connection; provider, encrypted credentials or webhook URL. |
| `CrmExport` | A push of a lead/brief to a CRM (or CSV/webhook); status, external id, payload for traceability. |

### 9. Files (Cloudflare R2)

| Model | Role |
| --- | --- |
| `StoredFile` | Object metadata only (bucket, key, type, size, checksum) for screenshots, PDFs, CSV exports, logos. |

### 10. Jobs & usage metering (guardrails)

| Model | Role |
| --- | --- |
| `Job` | Domain-visible job row (`DISCOVER`/`CRAWL`/`AUDIT`/`INTERPRET`/`COMPETITOR`/`REAUDIT`/`EXPORT`), decoupled from pg-boss retries. Optional `leadId` + `module` for per-lead work. |
| `UsageEvent` | Metered units: Maps records, pages fetched, Lighthouse runs, LLM in/out tokens, files stored; optional provider cost. |
| `Organization.{mapsRecordLimit,pageFetchLimit,llmTokenLimit}` | Monthly ceilings, refused before the next unit of work. |

### 11. Instruction, service profile, opportunities, credits (product layer)

| Model | Role |
| --- | --- |
| `Instruction` | NL task text → structured campaign draft. Does not run discovery. |
| `ServiceProfile` / `ServiceOffer` / `IdealClient` | Org-level skills and ideal-client defaults. `ServiceCode[]` is the matching vocabulary. |
| `BusinessIdentity` / `Business.duplicateOfBusinessId` | Intra-org dedupe keys (phone, domain, provider place). |
| `LeadOpportunity` / `LeadOpportunityEvidence` | Ranked, reasoned opportunities linked to `AuditFinding`s. |
| `LeadMatch` | Offer ↔ opportunity fit (0–100) with reasons. |
| `LeadScore` | Evidence / fit / relevance breakdown; `CampaignLead.opportunityScore` is the denormalized sort key. |
| `ProspectTag` / `LeadTag` / `SavedView` / `CampaignLead.savedAt` | Prospect organization. No second prospect table. |
| `CreditAccount` / `CreditReservation` / `CreditLedger` | Purchasable balance. Enqueue → reserve; success → commit; fail → release. |
| `CreditPack` / `Payment` | Catalog + gateway transactions. `providerRef` is webhook idempotency. |
| `Notification` / `ReviewItem` | Task alerts and human review queue. |
| `AnalyticsEvent` | Product usage. Do not reuse `BriefEvent` (public brief views). |

## Status fields (kept separate — one enum can't mean everything)

| Field | Lives on | Meaning |
| --- | --- | --- |
| `qualificationStatus` | `CampaignLead` | Lead qualification (new/qualified/excluded/…). |
| `auditStatus` | `CampaignLead` / `TechnicalAudit` | Crawl/audit lifecycle. |
| `aiStatus` | `CampaignLead` / `Brief` | Reasoning pass state. |
| `websiteClass` | `Business` | How the Maps URL is classified; only `OWNED_SITE` is crawled. |
| `status` (`CampaignStatus`) | `Campaign` | Run state machine (draft→…→completed/partial/failed/cancelled). |
| `status` (`BriefStatus`) | `Brief` | draft→approved→published→archived. |

## Campaign state machine

```
DRAFT → QUEUED → DISCOVERING → PROCESSING → COMPLETED
                                          ↘ PARTIALLY_COMPLETED (some leads failed)
                                          ↘ PAUSED  (provider quota / 429, work saved)
                                          ↘ FAILED  (discovery produced nothing)
                                          ↘ CANCELLED (operator cancel; finished leads stay)
```
A single dead website or one model failure never fails the campaign.

## Guardrails baked into the model (MVP section 7)

- **SSRF:** crawl workers block private/loopback/link-local/metadata targets, re-check after DNS + redirects. (Enforced in the fetch/browser plugin, not the DB.)
- **Per-tenant isolation:** snapshots, reviews, briefs, and AI output never shared across organizations.
- **PII:** reviews/analytics store salted hashes, not raw author identity or IP.
- **Untrusted input:** scraped HTML/review text is data; it can never override model instructions.
- **Budgets:** monthly ceilings per org refuse work before spend.

## Implementation Status & Verification Matrix

The core opportunity engine and worker pipeline have been implemented and verified:

| Milestone / Capability | Status | Implementation Details |
| :--- | :---: | :--- |
| **Dual-Plane Auth & RBAC** | ✅ Built | Better Auth session cookies, `platformRole`, `isSuperAdmin`, `requireSuperAdmin()`, `requireOrgRole()`, and automated superadmin seeding. |
| **Discovery Pipeline** | ✅ Built | Multi-provider architecture via `DiscoveryProviderRegistry`: Apify Google Maps (primary), Outscraper, SerpAPI, Google Places, and Fixture provider. |
| **Evidence Crawling** | ✅ Built | `CrawlWorker` with strict SSRF filtering (IP blocklists + redirect re-checks), robots.txt adherence, metadata extraction, and local/GCS storage. |
| **Performance Audits** | ✅ Built | `PsiWorker` with Google PageSpeed Insights v5 integration, Core Web Vitals (LCP, CLS, INP) parsing, and Lighthouse mobile scoring. |
| **Join Barrier & Sync** | ✅ Built | `publishIfReady()` barrier using transactional advisory locks (`pg_try_advisory_xact_lock`) to synchronize parallel crawl and PSI completions. |
| **Deterministic Scoring** | ✅ Built | Mathematical opportunity scoring engine computing `evidenceScore`, `fitScore`, `relevanceScore`, and `total` (0-100 `LeadScore`). |
| **Interpret AI Engine** | ✅ Built | Multi-provider LLM synthesis (Gemini 1.5/2.0, OpenAI GPT-4o, Deterministic fallback) generating value propositions, cold emails, and call scripts. |
| **Outbox & Sweep Reliability**| ✅ Built | Transactional outbox dispatch (`job-dispatcher.ts`) with lease mechanism and automated sweeper (`outbox-sweep.ts`) to recover orphaned jobs. |
| **Dual Queue Drivers** | ✅ Built | Local dev with `pg-boss` and production Cloud Run with Google Cloud Pub/Sub push architecture. |
| **Dual Storage Drivers** | ✅ Built | Local disk storage (`.data/objects`) and Google Cloud Storage (`GcsStorageProvider`). |
| **CRM Export & Integrations** | 🔄 Planned | CSV export and webhook handoffs to HubSpot, Pipedrive, and Salesforce. |
| **Scheduled Re-audits** | 🔄 Planned | Phase 3 cadence-based delta detection (`AuditChange`). |

The schema at `apps/api/prisma/schema.prisma` defines all tables and relationships for current and future phases. All 7 Prisma migrations have been successfully applied.
