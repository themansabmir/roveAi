# Rove: End-to-End Technical Workflow

This document explains the technical flow of the existing features in the Rove application, detailing how the frontend, backend, database schema, and background queue are connected.

## 1. High-Level Architecture

* **Frontend (`apps/dashboard`)**: A React 19 Single Page Application (SPA) built with Vite and React Router. It uses **TanStack Query** to manage server state and makes HTTP calls using `axios`.
* **Backend (`apps/api`)**: A Node.js Express server. It uses **Prisma** to communicate with PostgreSQL, **Better Auth** for session management, and **pg-boss** for background queueing.
* **Database (PostgreSQL via Prisma)**: Designed around **Tenancy**. The central entity is an `Organization` (an agency). All campaigns, leads, and jobs belong to an organization, ensuring data isolation between tenants.

---

## 2. Frontend Structure & API Calls

The frontend codebase (`apps/dashboard/src`) uses a Clean Architecture feature-folder structure. Inside each feature (e.g., `features/campaigns`), you have:

* **`presentation/`**: React components and views.
* **`application/`**: Custom hooks (TanStack Query hooks) that handle loading states and data mutations.
* **`infrastructure/`**: The `axios` API calls pointing to the backend (`http://localhost:3000`).
* **`domain/`**: TypeScript types and Zod schemas.

All frontend requests use a configured `axiosInstance` which automatically sends credentials (cookies) to the backend.

---

## 3. Detailed Workflow & Feature Mapping

Here is the exact technical flow from a user signing up to running a campaign.

### Step A: Authentication (`auth` feature)
1. **Frontend**: The user enters their email/password on the signup page.
2. **API Call**: `POST /api/auth/sign-up/email`
3. **Backend Engine**: 
   * Handled by the **Better Auth** middleware in `server.ts`. 
   * Better Auth automatically inserts a new `User` and `Session` into the database. 
   * A database hook in `better-auth.ts` intercepts the creation and automatically marks `emailVerified: true` (a convenience for MVP testing).
   * A secure HTTP-only session cookie is set on the client.

### Step B: Who Am I? (`me` feature)
1. **Frontend**: The app loads and needs to know if the user is logged in.
2. **API Call**: `GET /api/me`
3. **Backend Engine**:
   * The `meRouter` looks up the `User` based on the session cookie.
   * It also queries Prisma for the user's `Membership`s (to see which organizations they belong to).
   * Returns a payload of the user's details and their available workspaces.

### Step C: Workspace Creation (`workspaces` & `organizations` features)
1. **Frontend**: If the user has no organization (brand new user), the dashboard forces them to create a workspace (e.g., "Acme Agency").
2. **API Call**: `POST /api/workspaces`
3. **Backend Engine**:
   * The `workspaceRouter` creates a new `Organization` record in the database.
   * It creates a `Membership` record linking the `User` to the new `Organization` with the role of `owner`.
   * **Schema Mapping**: Every subsequent query the user makes will now be scoped to this `Organization.id`.

### Step D: Creating a Campaign (`campaigns` feature)
1. **Frontend**: Inside the dashboard, the user clicks "New Campaign" and enters a niche ("Dentists"), a city ("Delhi"), and a maximum lead count (e.g., 50).
2. **API Call**: `POST /api/organizations/:orgId/campaigns`
3. **Backend Engine**:
   * The `campaignsRouter` validates the input using Zod schemas.
   * `campaign.repository.ts` uses Prisma to create a `Campaign` record in the DB linked to the `organizationId`.
   * The campaign starts in the `DRAFT` status.

### Step E: Running Discovery & Audits (Multi-Stage Worker Pipeline)
1. **Frontend**: The user clicks the "Run Campaign" button.
2. **API Call**: `POST /api/organizations/:orgId/campaigns/:campaignId/run`
3. **Backend Engine (Synchronous)**:
   * Handled by `CampaignController.run` and `CampaignService.run`.
   * Checks organization limits via `usage_event` (`MAPS_RECORD`).
   * Atomically marks `Campaign.status = 'QUEUED'`.
   * Creates a `Job` record in the database (`kind: DISCOVER`, `status: PENDING`).
   * Pushes a job payload to **pg-boss** (`DISCOVER_QUEUE` = `campaign.discovery`).
   * Updates `job.queueJobId` with the queue message ID.
   * Immediately responds `200 OK` to the frontend with the campaign details.

4. **Background Discovery Worker (`campaign.discovery`)**:
   * A worker process running `runRole("discover")` consumes from `campaign.discovery`.
   * `DiscoveryService.run()` marks `job.status = 'PROCESSING'` and `Campaign.status = 'DISCOVERING'`.
   * Queries Google Maps data via the configured provider (`Apify`, `Outscraper`, `SerpApi`, etc.).
   * Classifies websites (`OWNED_SITE`, `SOCIAL_OR_DIRECTORY`, `MISSING`), filters by rating/reviews, and checks exclusion domains.
   * **Deduplication & Ingestion**:
     * Deduplicates and creates or reuses `Business` records.
     * Inserts `CampaignLead` rows linking each business to the campaign (`auditStatus: PENDING`).
     * Records usage events (`usage_event` with `kind: MAPS_RECORD`).
   * Calls `AuditScheduler.schedule(campaignId)` and marks the discovery job `COMPLETED`.

5. **Audit Scheduling & Parallel Queue Dispatch (`AuditScheduler`)**:
   * Transitions `Campaign.status = 'PROCESSING'`.
   * Validates monthly quota limits (`pageFetchLimit` and `lighthouseRunLimit`).
   * For each qualified `CampaignLead`, dispatches two parallel jobs:
     * **Crawl Job**: Queued to `CRAWL_QUEUE` (`audit.crawl`) with `kind: CRAWL`.
     * **PSI Job**: Queued to `PSI_QUEUE` (`audit.psi`) with `kind: AUDIT`.

6. **Parallel Audit Workers**:
   * **Crawl Worker (`CrawlService`)**:
     * Fetches robots.txt, sitemaps, homepage, and subpages up to `CRAWL_MAX_PAGES`.
     * Saves raw page HTML to Object Storage (`.data/objects` or GCS) and records `StoredFile` (`kind: HTML`).
     * Saves `WebsiteSnapshot` and `SnapshotPage` rows.
     * Analyzes SEO and Website Experience; creates 2 `TechnicalAudit` records (`TECHNICAL_SEO` & `WEBSITE_EXPERIENCE`) and associated `AuditFinding` rows.
     * Records `UsageEvent` (`WEBSITE_PAGE`).
     * Calls `publishIfReady()`.
   * **PSI Worker (`PsiService`)**:
     * Runs Google Lighthouse mobile audit (concurrency: 1).
     * Saves raw Lighthouse report to Object Storage (`StoredFile` with `kind: PSI_JSON`).
     * Creates 1 `TechnicalAudit` record (`PERFORMANCE`) with Core Web Vitals (`lcp_ms`, `cls`, etc.) and `AuditFinding` rows.
     * Records `UsageEvent` (`LIGHTHOUSE_RUN`).
     * Calls `publishIfReady()`.

7. **Join Barrier & Downstream AI Pipeline (`publishIfReady`)**:
   * Acquires a Postgres advisory transaction lock on `leadId`.
   * Once all 3 required audit modules (`TECHNICAL_SEO`, `WEBSITE_EXPERIENCE`, `PERFORMANCE`) are finished:
     * Updates `CampaignLead.auditStatus` to `COMPLETED` (or error state).
     * Creates an `INTERPRET` job and publishes to `AUDIT_READY_QUEUE` (`audit.ready`) for AI Opportunity Scoring and Brief Generation.
     * Checks if all leads in the campaign are finished; if so, updates `Campaign.status` to `COMPLETED`.

> 💡 **For full technical details, diagrams, and exact database table traces, see [campaign_execution_flow.md](file:///Users/apple/Documents/roveAi/campaign_execution_flow.md).**

### Step F: Dashboard Polling & Health Checks
* **Frontend**: While the campaign is running, the frontend refetches the campaign details periodically.
* **API Call**: `GET /api/organizations/:orgId/campaigns/:campaignId`
* **Backend**: Returns the updated `Campaign` along with an array of mapped `CampaignLead`s and their nested `Business` details.
* **Health Check**: The dashboard occasionally pings `GET /healthz` (handled by `healthRouter`) which runs a Prisma query `SELECT 1` and checks if the pg-boss queue is alive to show system status.

---

## 4. Summary of the Database Schema Connections

Whenever you view a lead in the dashboard, here is how the database stitched it together:

1. You are a **`User`** authenticated via a **`Session`**.
2. You have a **`Membership`** that gives you access to an **`Organization`**.
3. The **`Organization`** owns a **`Campaign`** (e.g., "Delhi Dentists").
4. The **`Campaign`** contains many **`CampaignLead`** rows.
5. Each **`CampaignLead`** points to a specific **`Business`** record (which holds the physical address, website URL, and Google rating).

Because of this strict relational mapping enforced by Prisma, data is completely isolated between different agencies using the platform.


