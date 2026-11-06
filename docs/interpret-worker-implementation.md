# Interpret Worker & AI Opportunity Brief Pipeline: Architecture & Implementation

> **Scope**: This document details the end-to-end architecture, workflow, files, and functions introduced to complete the **Interpret Worker pipeline**. It covers the entire lifecycle from raw technical audit evidence through deterministic opportunity scoring, AI reasoning brief synthesis (Gemini/OpenAI/Fallback), database persistence, API exposure, and real-time dashboard UI presentation.

---

## Table of Contents

1. [High-Level Pipeline & End-to-End Workflow](#1-high-level-pipeline--end-to-end-workflow)
2. [Step-by-Step Implementation Details](#2-step-by-step-implementation-details)
   - [Step 1: InterpretService & Scoring Engine](#step-1-interpretservice--scoring-engine)
   - [Step 2: Worker Role Registration & Infrastructure](#step-2-worker-role-registration--infrastructure)
   - [Step 3: API & Repository Exposure](#step-3-api--repository-exposure)
   - [Step 4: Dashboard Presentation Layer](#step-4-dashboard-presentation-layer)
   - [Step 5: Automated Testing Suite](#step-5-automated-testing-suite)
3. [Complete Reference of Modified & Introduced Files](#3-complete-reference-of-modified--introduced-files)
4. [Configuration & Environment Variables](#4-configuration--environment-variables)
5. [Operational & Verification Guide](#5-operational--verification-guide)

---

## 1. High-Level Pipeline & End-to-End Workflow

The Rove AI pipeline runs in distinct stages, with the **Interpret Worker** acting as the final intelligence synthesis step:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 1: Discovery                                                     │
│ - DiscoverWorker queries Google Maps (Apify/Outscraper)                │
│ - Normalizes business records & creates CampaignLead rows              │
│ - AuditScheduler creates CRAWL and AUDIT jobs in Job table             │
│ - JobDispatcher publishes to audit.crawl and audit.psi                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 2: Parallel Auditing                                             │
│ ┌───────────────────────────────┐    ┌───────────────────────────────┐ │
│ │ CrawlWorker (audit.crawl)     │    │ PsiWorker (audit.psi)         │ │
│ │ - Crawls homepage & subpages  │    │ - Calls Google PageSpeed API  │ │
│ │ - Extracts CMS & tech stack   │    │ - Obtains mobile Lighthouse,  │ │
│ │ - Writes TECHNICAL_SEO and    │    │   LCP, CLS, INP metrics       │ │
│ │   WEBSITE_EXPERIENCE audits   │    │ - Writes PERFORMANCE audit    │ │
│ └───────────────┬───────────────┘    └───────────────┬───────────────┘ │
└─────────────────┼────────────────────────────────────┼─────────────────┘
                  │                                    │
                  └─────────────────┬──────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 3: Join Barrier & Outbox Lease Dispatch                          │
│ - publishIfReady() in audit-join.ts acquires advisory lock             │
│ - Checks if TECHNICAL_SEO, WEBSITE_EXPERIENCE, & PERFORMANCE audits   │
│   have all reached terminal state                                      │
│ - Creates an INTERPRET job with status = "PENDING"                     │
│ - JobDispatcher.dispatchJob() atomically claims lease and publishes    │
│   AuditJobPayload to AUDIT_READY_QUEUE ("audit.ready")                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 4: Interpret Worker (interpret.service.ts)                      │
│ 1. claimJob() acquires processing lock & increments attemptCount       │
│ 2. Gathers evidence: CampaignLead + Audits + Findings + Snapshot       │
│ 3. computeOpportunityScore(): Calculates deterministic score (0–100)   │
│ 4. generateBrief(): Synthesizes AI Opportunity Brief (Gemini/OpenAI)   │
│ 5. DB Transaction:                                                     │
│    - Upserts Brief table (headline, value prop, pitch, drafts)         │
│    - Updates CampaignLead (opportunityScore, aiStatus = "COMPLETED")   │
│    - Records token usage in UsageEvent (LLM_INPUT / LLM_OUTPUT)        │
│ 6. finishJob() sets INTERPRET job to "COMPLETED"                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 5: API & Dashboard Presentation                                  │
│ - CampaignRepository.getDetail() joins audits, findings, & brief       │
│ - OpportunityQueue: Displays real opportunityScore & "audited" tags    │
│ - LeadBriefDrawer:                                                     │
│   • Tab 1: AI Opportunity Brief (Headline, Pitch, Cold Email with      │
│            1-click Copy, Phone Script with 1-click Copy)               │
│   • Tab 2: Audit Findings (Lighthouse score, LCP in s, CLS, CMS badges,│
│            severity-tagged technical findings)                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Implementation Details

### Step 1: InterpretService & Scoring Engine

* **File**: [`apps/api/src/features/audits/interpret.service.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/interpret.service.ts)

#### 1. Evidence Gathering
Fetches the `CampaignLead` along with all relational evidence:
```typescript
const lead = await this.prisma.campaignLead.findUnique({
  where: { id: payload.leadId },
  include: {
    campaign: true,
    business: true,
    audits: { include: { findings: true } },
  },
});

const snapshot = await this.prisma.websiteSnapshot.findFirst({
  where: { businessId: lead.businessId, organizationId: payload.organizationId },
  orderBy: { createdAt: "desc" },
  include: { pages: true },
});
```

#### 2. Deterministic Opportunity Scoring (`computeOpportunityScore`)
The opportunity score (0–100) measures **how viable and lucrative the commercial opportunity is for an agency**:

| Condition | Score Impact | Rationale |
|---|---|---|
| `EXCLUDED_EXISTING_CLIENT` | `0` | Not a prospect |
| `FAILED` or `UNREACHABLE` site | `75` | Broken site = urgent sales opportunity |
| `websiteClass === "MISSING"` | `88` | Active business with no website |
| `websiteClass === "SOCIAL_ONLY"` | `78` | Relies solely on Facebook/Instagram |
| `websiteClass === "DIRECTORY_ONLY"` | `72` | Relies solely on Yelp/Google Maps |
| `websiteClass === "OWNED_SITE"` | Base `40` | Has a website, evaluated by technical evidence below: |
| **Lighthouse Performance < 45** | `+25` | Critical mobile performance failure |
| **Lighthouse Performance 45–69** | `+18` | Sub-par mobile performance |
| **Lighthouse Performance 70–84** | `+8` | Moderate optimization potential |
| **`SLOW_LCP` (> 2.5s)** | `+10` | Violates Core Web Vitals threshold |
| **`HIGH_CLS` (> 0.1)** | `+6` | Layout shift causing mobile visual jumps |
| **`SLOW_INP` (> 200ms)** | `+6` | Sluggish mobile touch responsiveness |
| **`MISSING_TITLE`** | `+10` | Elementary SEO oversight |
| **`MISSING_META_DESCRIPTION`** | `+8` | Truncated Google SERP snippet |
| **`MISSING_H1` or `MULTIPLE_H1`** | `+5` | Structural heading hierarchy issue |
| **`MISSING_ONLINE_BOOKING`** | `+12` | Missing booking automation |
| **`MISSING_CONTACT_INFO`** | `+10` | Hard for customers to reach out |
| **No lead capture forms on site** | `+5` | Missing contact/inquiry forms |
| **Reviews >= 50 and Rating >= 4.0** | `+8` | High customer trust + bad website = high cash flow lead |
| **Reviews >= 10 and Rating < 4.0** | `+10` | Reputation management opportunity |

*Output is clamped strictly to the range `[10, 99]`.*

#### 3. Structured AI Synthesis (`generateBrief`)
The output schema is strictly enforced via **Zod**:
```typescript
export const BriefDataSchema = z.object({
  headlineOpportunity: z.string().max(300),
  suggestedService: z.string().max(200),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]).default("HIGH"),
  valueProposition: z.string(),
  outreachAngle: z.string(),
  coldEmailDraft: z.string(),
  callScriptDraft: z.string(),
  keyFindings: z.array(z.string()).default([]),
});
```

* **Multi-Provider Fallback Hierarchy**:
  1. **Google Gemini** (`gemini-2.0-flash` / `gemini-1.5-flash`) via `generateContent` with `responseMimeType: "application/json"`.
  2. **OpenAI** (`gpt-4o-mini`) via Chat Completions with `response_format: { type: "json_object" }`.
  3. **Deterministic Evidence Fallback Engine**: If no API key is configured or offline, generates a bespoke, evidence-backed pitch directly from the LCP timing, CMS, review count, and audit findings so tests and local dev never break.

#### 4. Database Persistence
In a single atomic transaction:
- **`Brief`**: Upserted with `headlineOpportunity`, `suggestedService`, `confidence`, `valueProposition`, `outreachAngle`, `coldEmailDraft`, `callScriptDraft`, and `content` (containing metrics summary & key findings).
- **`CampaignLead`**: Updated with `opportunityScore` and `aiStatus = "COMPLETED"`.
- **`UsageEvent`**: Recorded for `LLM_INPUT_TOKEN` and `LLM_OUTPUT_TOKEN`.
- **`Job`**: Marked `COMPLETED` via `finishJob()`.

---

### Step 2: Worker Role Registration & Infrastructure

* **Queue Name**: `AUDIT_READY_QUEUE` (`"audit.ready"`).
* **Role Name**: `"interpret"`.

#### Files Configured:
1. **[`apps/api/src/features/audits/audit.workers.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/audit.workers.ts)**:
   - Added `interpret` to `AuditHandlers`.
   - Wired `buildAuditHandlers` to instantiate `new InterpretService(prisma, config.JOB_TIMEOUT_MS)`.
   - Updated `subscribeAuditRole` to handle `role === "interpret"` subscribing to `AUDIT_READY_QUEUE`.
2. **[`apps/api/src/entries/run-role.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/run-role.ts)**:
   - Extended `role` parameter type to `"discover" | "crawl" | "psi" | "interpret"`.
3. **[`apps/api/src/entries/push-server.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/push-server.ts)**:
   - Added Pub/Sub push delivery routing for the `"interpret"` worker role.
4. **[`apps/api/src/entries/interpret.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/interpret.ts)**:
   - Standalone CLI/container entry point running `runRole("interpret")`.
5. **[`apps/api/package.json`](file:///Users/apple/Documents/roveAi/apps/api/package.json)**:
   - Added `"dev:worker:interpret": "nodemon --exec ts-node -r tsconfig-paths/register src/entries/interpret.ts"`.
   - Added `"start:interpret": "node dist/entries/interpret.js"`.

---

### Step 3: API & Repository Exposure

* **File**: [`apps/api/src/features/campaigns/campaign.repository.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/campaigns/campaign.repository.ts)

#### 1. Updated `detailInclude` Query
```typescript
const detailInclude = {
  exclusions: true,
  jobs: { where: { kind: "DISCOVER" }, orderBy: { createdAt: "desc" as const }, take: 1 },
  leads: {
    orderBy: { createdAt: "asc" as const },
    include: {
      business: true,
      audits: {
        include: { findings: true },
        orderBy: { createdAt: "asc" as const },
      },
      brief: true,
    },
  },
} satisfies Prisma.CampaignInclude;
```

#### 2. Extended Domain Interfaces
- `AuditFindingView`: `id`, `code`, `severity`, `source`, `confidence`, `message`, `evidence`.
- `TechnicalAuditView`: `id`, `module`, `status`, `score`, `metrics`, `toolName`, `deviceProfile`, `observedAt`, `findings`.
- `BriefView`: `id`, `status`, `aiStatus`, `headlineOpportunity`, `suggestedService`, `confidence`, `valueProposition`, `outreachAngle`, `coldEmailDraft`, `callScriptDraft`, `content`, `modelName`.
- `LeadView`: Added `aiStatus`, `opportunityScore`, `audits`, and `brief`.

#### 3. Updated `toDetail()`
Maps each lead's real audits, findings, and brief records directly into the HTTP response returned by `GET /api/organizations/:orgId/campaigns/:campaignId`.

---

### Step 4: Dashboard Presentation Layer

#### 1. Domain Types & Signal Helpers
* **File**: [`apps/dashboard/src/features/campaigns/domain/campaign.ts`](file:///Users/apple/Documents/roveAi/apps/dashboard/src/features/campaigns/domain/campaign.ts)
  * Updated `CampaignLead` interface with `opportunityScore`, `aiStatus`, `audits`, and `brief`.
  * Updated `heuristicScore(lead)`: **Returns `lead.opportunityScore` when present**, falling back to the heuristic score only for un-audited leads.
  * Updated `primarySignal(lead)`: Prioritizes `lead.brief.headlineOpportunity` or primary audit metric (e.g. `"Slow mobile site (38/100)"`).

#### 2. Opportunity Queue Table
* **File**: [`apps/dashboard/src/features/campaigns/presentation/OpportunityQueue.tsx`](file:///Users/apple/Documents/roveAi/apps/dashboard/src/features/campaigns/presentation/OpportunityQueue.tsx)
  * Renders the true database `opportunityScore`.
  * Adds an `audited` badge below the score for leads with completed technical audits.
  * Displays a `Brief ready` badge next to the business name when an AI brief is generated.

#### 3. Lead Brief Drawer
* **File**: [`apps/dashboard/src/features/campaigns/presentation/LeadBriefDrawer.tsx`](file:///Users/apple/Documents/roveAi/apps/dashboard/src/features/campaigns/presentation/LeadBriefDrawer.tsx)
  * Built a two-tab drawer using `@rove/ui/components/tabs`:

##### Tab 1: "Opportunity Brief"
* **Headline Opportunity Card**: Displays the punchy sales headline, `suggestedService` pill, and `confidence` badge (`HIGH` / `MEDIUM`).
* **Value Proposition & Strategic Angle**: Explains the revenue impact and conversational approach for sales reps.
* **Cold Email Draft**: Formatted email copy with an interactive **"Copy Email"** button (with instant `"Copied!"` feedback).
* **Phone Outreach Script**: Structured opening and rebuttal hooks with an interactive **"Copy Script"** button.
* **Pending State**: Explains whether audits are still running or the AI reasoning worker is currently processing.

##### Tab 2: "Audit Findings"
* **Google PageSpeed Performance Card**:
  * Lighthouse Performance Score (0–100) with color tone badge.
  * Largest Contentful Paint (LCP) formatted in seconds (e.g. `4.2s`).
  * Cumulative Layout Shift (CLS) (e.g. `0.15`).
* **Detected Tech Stack**: Badges for CMS and frameworks (e.g. `WordPress`, `Elementor`, `Shopify`, `Wix`, `Next.js`).
* **Technical Issues List**: Severity-tagged list of all audit findings (`HIGH` in red, `MEDIUM` in amber, `INFO` in blue).
* **Business Identity**: Rating, review count, and a direct `Visit Website` link.

---

### Step 5: Automated Testing Suite

* **File**: [`apps/api/src/features/audits/interpret.service.test.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/interpret.service.test.ts)

Includes 4 automated unit tests:
1. `calculates high opportunity score for a business missing a website` (verifies 88/100 score).
2. `calculates high opportunity score for a slow site with critical SEO & performance flaws` (verifies 99/100 score).
3. `calculates low opportunity score for a fast, well-optimized site` (verifies 40/100 score).
4. `generates a high-fidelity structured brief compliant with BriefDataSchema` (validates Zod parsing and copy text).

All 16 test files (51 tests) across `@rove/api` pass with 100% success.

---

## 3. Complete Reference of Modified & Introduced Files

| File | Status | Functions / Interfaces | Description |
|---|---|---|---|
| [`interpret.service.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/interpret.service.ts) | **NEW** | `InterpretService`, `BriefDataSchema`, `computeOpportunityScore()`, `generateBrief()` | Core engine: calculates objective scores, calls LLM, saves Briefs, updates CampaignLeads. |
| [`interpret.service.test.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/interpret.service.test.ts) | **NEW** | 4 unit tests | Verifies deterministic scoring weights, Zod schema validation, and fallback synthesis. |
| [`interpret.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/interpret.ts) | **NEW** | `runRole("interpret")` | Standalone CLI & container worker entrypoint. |
| [`audit.workers.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/audit.workers.ts) | MODIFIED | `buildAuditHandlers()`, `subscribeAuditRole()` | Registered `interpret` role and subscribed to `AUDIT_READY_QUEUE`. |
| [`run-role.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/run-role.ts) | MODIFIED | `runRole()` | Extended supported role union to include `"interpret"`. |
| [`push-server.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/push-server.ts) | MODIFIED | `startPushServer()` | Added Pub/Sub push route for `"interpret"`. |
| [`config.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/core/config.ts) | MODIFIED | `ConfigSchema` | Added `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `LLM_MODEL`. |
| [`package.json` (api)](file:///Users/apple/Documents/roveAi/apps/api/package.json) | MODIFIED | scripts | Added `"dev:worker:interpret"` and `"start:interpret"`. |
| [`campaign.repository.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/campaigns/campaign.repository.ts) | MODIFIED | `detailInclude`, `LeadView`, `toDetail()` | Joined audits, findings, and brief into the campaign detail query. |
| [`campaign.ts` (dashboard)](file:///Users/apple/Documents/roveAi/apps/dashboard/src/features/campaigns/domain/campaign.ts) | MODIFIED | `CampaignLead`, `heuristicScore()`, `primarySignal()` | Added brief & audit views; prioritized real `opportunityScore` and AI headlines. |
| [`OpportunityQueue.tsx`](file:///Users/apple/Documents/roveAi/apps/dashboard/src/features/campaigns/presentation/OpportunityQueue.tsx) | MODIFIED | `OpportunityQueue` | Displays real audit score, "audited" label, and "Brief ready" status. |
| [`LeadBriefDrawer.tsx`](file:///Users/apple/Documents/roveAi/apps/dashboard/src/features/campaigns/presentation/LeadBriefDrawer.tsx) | MODIFIED | `LeadBriefDrawer` | Two-tab UI: Opportunity Brief (Pitch, Email, Script with copy buttons) and Audit Findings (Lighthouse, LCP, CLS, Tech Stack). |

---

## 4. Configuration & Environment Variables

Add any of the following optional variables to [`apps/api/.env`](file:///Users/apple/Documents/roveAi/apps/api/.env):

```env
# Google Gemini (Recommended — fastest structured outputs)
GEMINI_API_KEY="AIzaSy..."

# Or OpenAI
OPENAI_API_KEY="sk-..."

# Optional: Override the model (defaults to "gemini-2.0-flash" or "gpt-4o-mini")
LLM_MODEL="gemini-2.0-flash"
```

> **Zero-Config Guarantee**: If no API key is provided, `InterpretService` automatically engages its deterministic evidence synthesis engine. Local development, Docker builds, and automated CI pipelines run without external API dependencies.

---

## 5. Operational & Verification Guide

### 1. Verify Unit Tests & Typechecking
```bash
# Typecheck both projects
pnpm --filter @rove/api typecheck
pnpm --filter @rove/dashboard typecheck

# Run InterpretService unit tests
pnpm --filter @rove/api exec vitest run src/features/audits/interpret.service.test.ts

# Run complete API test suite
pnpm --filter @rove/api test
```

### 2. Run Local Development Workers
```bash
# Terminal 1: API Server
pnpm dev

# Terminal 2: Crawl Worker
pnpm --filter @rove/api dev:worker:crawl

# Terminal 3: PSI Worker
pnpm --filter @rove/api dev:worker:psi

# Terminal 4: Interpret Worker
pnpm --filter @rove/api dev:worker:interpret

# Terminal 5: Dashboard UI
pnpm dev:dashboard
```

### 3. Verify in Database
Once a campaign completes its audits and interpret pass, inspect the stored output:

```sql
-- 1. Check generated Opportunity Briefs
SELECT b.id, b."leadId", b."headlineOpportunity", b."suggestedService",
       b.confidence, b."modelName", b."createdAt"
FROM brief b
ORDER BY b."createdAt" DESC LIMIT 5;

-- 2. Check scored leads
SELECT l.id, l."opportunityScore", l."auditStatus", l."aiStatus"
FROM campaign_lead l
WHERE l."aiStatus" = 'COMPLETED'
ORDER BY l."opportunityScore" DESC LIMIT 5;
```
