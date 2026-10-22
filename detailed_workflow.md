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

### Step E: Running Discovery (Queue & Background Jobs)
1. **Frontend**: The user clicks the "Run Campaign" button.
2. **API Call**: `POST /api/organizations/:orgId/campaigns/:campaignId/run`
3. **Backend Engine (Synchronous)**:
   * The API updates the `Campaign` status to `QUEUED`.
   * It creates a `Job` record in the database (`kind: DISCOVER`).
   * It pushes a job payload to **pg-boss** (the PostgreSQL-based background queue).
   * It immediately responds `200 OK` to the frontend.
4. **Backend Engine (Asynchronous Worker)**:
   * A background worker process (`campaign.worker.ts`) picks up the job from pg-boss.
   * It hands off to `discovery.service.ts` to fetch data from **Outscraper** (or returns sample local data if no API key is set).
   * **Normalization**: It checks if these businesses already exist using `normalize.ts` (deduplicating by domain/phone).
   * **Database Mapping**: 
     * Creates new `Business` records for newly discovered companies.
     * Creates `CampaignLead` records. This is a join-table that links the discovered `Business` to the `Campaign`.
   * It updates the `Campaign` status to `COMPLETED`.

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
