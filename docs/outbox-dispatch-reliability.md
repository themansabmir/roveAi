# Outbox & Dispatch Reliability: Evolution & Implementation Guide

> **Scope**: Covers every architectural change made to `Job` dispatch reliability — from the original simple design through two phases of iteration. Also serves as a step-by-step manual testing guide.

---

## Table of Contents

1. [Starting Point — The Simple Architecture](#1-starting-point--the-simple-architecture)
2. [Phase 1 — First Outbox Pattern](#2-phase-1--first-outbox-pattern)
3. [Phase 2 — Full Lease-Based Architecture](#3-phase-2--full-lease-based-architecture)
4. [Final Architecture Overview](#4-final-architecture-overview)
5. [Changed & New Files Reference](#5-changed--new-files-reference)
6. [Database Schema Changes](#6-database-schema-changes)
7. [Manual Testing Guide](#7-manual-testing-guide)

---

## 1. Starting Point — The Simple Architecture

### What was there

The original code published a queue message immediately in the same request as the database write — two separate, uncoordinated operations:

```
CampaignService.run()
  -> prisma.job.create()        <- DB write committed
  -> queue.publish()            <- Separate network call, can fail independently
  -> prisma.job.update(queueJobId)
```

The same pattern existed in `AuditScheduler.ensureJob()` for CRAWL/AUDIT jobs and in `publishIfReady()` for INTERPRET jobs.

### Problems with the original design

| # | Problem | Risk |
|---|---------|------|
| 1 | DB write succeeds, process crashes before `queue.publish()` | Job stuck in `PENDING` forever — never re-queued |
| 2 | Two Cloud Run instances find the same `PENDING` job simultaneously | Duplicate queue messages — duplicate business processing |
| 3 | `publishIfReady()` — CRAWL and PSI workers both finish at the same time | Both publish the INTERPRET job — AI brief generated twice |
| 4 | Publisher sets `status: "PROCESSING"` after `queue.publish()` | Fast worker sets `COMPLETED`, publisher then overwrites it back to `PROCESSING` |
| 5 | No separation between worker retries and dispatch retries | `attemptCount` used for both purposes simultaneously |

---

## 2. Phase 1 — First Outbox Pattern

### What was added

A single `dispatchedAt` column added to the `Job` table, used as an atomic dispatch lock:

```sql
-- Migration: 20261102071737_add_job_dispatched_at
ALTER TABLE "job" ADD COLUMN "dispatchedAt" TIMESTAMPTZ;
CREATE INDEX ON "job"("status", "dispatchedAt");
```

An outbox sweep function (`outbox-sweep.ts`) ran an atomic `UPDATE ... WHERE dispatchedAt IS NULL` before publishing. Wired into every worker startup via `run-role.ts`.

### What this solved

- **Duplicate messages**: Only one concurrent `UPDATE ... WHERE dispatchedAt IS NULL` can succeed. The loser gets `count === 0` and skips.
- **Basic crash recovery**: Jobs never published can be recovered at next worker restart or Cloud Scheduler invocation.

### Problems still remaining (your critique)

You identified 4 critical issues:

**1. Permanent lock on crash** — `dispatchedAt` was stamped *before* `queue.publish()`. A crash between stamp and publish permanently locks the job — the sweep will never see it again because `dispatchedAt IS NOT NULL`.

**2. Counter pollution** — `attemptCount` was shared between worker execution retries and dispatch retries. Dead-letter logic based on `attemptCount >= N` could fire due to business processing failures, not dispatch failures.

**3. Race condition in `publishIfReady()`** — The PostgreSQL advisory lock protects the transaction, but not the external `queue.publish()` call outside the transaction. Two concurrent workers could both exit the transaction and both publish the INTERPRET job.

**4. Status race** — Publisher wrote `status: "PROCESSING"` after `queue.publish()`. A fast worker could complete (`COMPLETED`) before this write, which then overwrites it back to `PROCESSING`.

---

## 3. Phase 2 — Full Lease-Based Architecture

### Schema changes

The single `dispatchedAt` column became five purpose-specific fields:

```prisma
// Phase 2 — migration: 20261103072922_add_job_dispatch_lease_fields
dispatchedAt     DateTime? @db.Timestamptz  // Broker-confirmed delivery receipt
dispatchLockedAt DateTime? @db.Timestamptz  // Expiring lease timestamp
dispatchLockedBy String?   @db.VarChar(64)  // UUID of the instance holding lease
dispatchAttempts Int       @default(0)      // Queue publishing attempts only
nextDispatchAt   DateTime? @db.Timestamptz  // Explicit scheduled retry time
```

### Core Architectural Changes

#### A. Lease expires — no permanent lock on crash

```sql
-- Phase 1 claim (permanent if crashed)
UPDATE job SET dispatchedAt = NOW()
  WHERE id = $1 AND dispatchedAt IS NULL;

-- Phase 2 claim (2-minute expiring lease)
UPDATE job
  SET "dispatchLockedAt" = NOW(),
      "dispatchLockedBy" = $lockToken,
      "dispatchAttempts" = "dispatchAttempts" + 1
  WHERE id = $1
    AND "dispatchedAt" IS NULL
    AND ("dispatchLockedAt" IS NULL OR "dispatchLockedAt" < NOW() - INTERVAL '2 minutes')
    AND ("nextDispatchAt" IS NULL OR "nextDispatchAt" <= NOW());
```

If the process crashes after claiming the lease, `dispatchedAt` stays `null`. After 2 minutes, the sweep reclaims the job automatically.

#### B. `dispatchedAt` stamped only after broker confirms

```typescript
// Phase 1: stamped BEFORE publish — crash = permanent loss
data: { dispatchedAt: new Date() }
await queue.publish(...)  // crash here = job gone forever

// Phase 2: stamped ONLY AFTER publish resolves successfully
const messageId = await queue.publish(queueName, payload);
await prisma.job.updateMany({
  where: { id: job.id, dispatchLockedBy: lockToken },
  data: {
    queueJobId: messageId,
    dispatchedAt: new Date(),   // broker confirmed
    dispatchLockedAt: null,     // release lease
    dispatchLockedBy: null,
  },
});
```

#### C. Separate dispatch counter vs. worker counter

| Field | Owned by | Meaning |
|-------|----------|---------|
| `attemptCount` | Business worker (`job-lock.ts`) | Times the worker tried to execute business logic |
| `dispatchAttempts` | `JobDispatcher` | Times we tried to publish to the queue broker |

Dead-lettering checks `dispatchAttempts >= MAX_DISPATCH_ATTEMPTS (5)`, never `attemptCount`.

#### D. Explicit backoff timestamp — no `updatedAt` fragility

```typescript
// Phase 1: fragile — any other field update resets the timer
const retryNotBefore = new Date(Date.now() - backoffSeconds * 1_000);
if (fresh.updatedAt > retryNotBefore) return; // skip

// Phase 2: explicit, immutable until explicitly replaced
const delaySeconds = Math.min(Math.pow(4, Math.max(0, attempts - 1)) * 30, 1800);
const nextDispatchAt = new Date(Date.now() + delaySeconds * 1000);
await prisma.job.updateMany({
  where: { id: job.id, dispatchLockedBy: lockToken },
  data: { nextDispatchAt, dispatchLockedAt: null, dispatchLockedBy: null },
});
```

**Delay schedule:** 1st retry -> 30s, 2nd -> 2m, 3rd -> 8m, 4th -> 30m (max).

#### E. Centralized dispatcher eliminates the `publishIfReady()` race

**Before:** `publishIfReady()`, `CampaignService.run()`, and `AuditScheduler.ensureJob()` each called `queue.publish()` directly — three separate code paths that could each independently cause the issues above.

**After:** All three delegate to `dispatcher.dispatchJob(jobId)`. The atomic lease claim (`updateMany`) is the single serialization point — concurrent callers on the same job get `count === 0` and immediately return without publishing.

#### F. Publisher never writes `status: "PROCESSING"`

The dispatcher only ever writes dispatch-lifecycle fields. The worker owns the execution status:

```
PENDING -> PROCESSING  (worker claimJob() in job-lock.ts)
        -> COMPLETED   (worker success)
        -> FAILED      (worker exhausted retries OR dispatcher dead-letters after 5 dispatch failures)
```

---

## 4. Final Architecture Overview

```
+------------------------------------------------------------------+
|  HTTP Request                                                    |
|  CampaignService.run()                                           |
|   1. prisma.job.create(DISCOVER, PENDING)                        |
|   2. dispatcher.dispatchJob(job.id) -------+                     |
+--------------------------------------------|---------+----------+
                                             |
+--------------------------------------------v--------------------+
|  JobDispatcher.dispatchJob(jobId)                               |
|                                                                  |
|  STEP 1 — Atomic lease claim                                    |
|    UPDATE job                                                    |
|      SET dispatchLockedAt=NOW(), dispatchLockedBy=UUID           |
|          dispatchAttempts++                                      |
|      WHERE dispatchedAt IS NULL                                  |
|        AND (dispatchLockedAt IS NULL OR expired > 2min)          |
|        AND (nextDispatchAt IS NULL OR elapsed)                   |
|    -> count=0: another instance won, return false (no publish)   |
|    -> count=1: this instance holds the lease, continue           |
|                                                                  |
|  STEP 2 — Build payload from DB (job + lead + business)         |
|                                                                  |
|  STEP 3 — queue.publish(queueName, payload)                     |
|    SUCCESS:                                                      |
|      UPDATE job SET dispatchedAt=NOW(),                          |
|                     queueJobId=messageId,                        |
|                     dispatchLockedAt=null, dispatchLockedBy=null |
|    FAILURE (transient):                                          |
|      UPDATE job SET nextDispatchAt=backoffTime,                  |
|                     dispatchLockedAt=null (released for retry)   |
|    FAILURE (5th attempt):                                        |
|      UPDATE job SET status=FAILED, error=...,                    |
|                     dispatchLockedAt=null                        |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|  Business Worker (discover / crawl / psi / interpret)            |
|                                                                  |
|  job-lock.ts claimJob()                                          |
|    UPDATE job SET status=PROCESSING, attemptCount++              |
|    WHERE status=PENDING OR (PROCESSING AND stale heartbeat)      |
|                                                                  |
|  Business logic executes ...                                     |
|    -> success: UPDATE job SET status=COMPLETED                   |
|    -> failure: queue redelivers, claimJob() retries              |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|  Outbox Sweep  (worker startup + Cloud Scheduler ~every 1min)    |
|                                                                  |
|  JobDispatcher.sweep()                                           |
|    SELECT id FROM job                                            |
|      WHERE status=PENDING AND dispatchedAt IS NULL               |
|        AND (dispatchLockedAt IS NULL OR expired)                 |
|        AND (nextDispatchAt IS NULL OR elapsed)                   |
|      ORDER BY createdAt ASC LIMIT 100                            |
|                                                                  |
|  for each: dispatchJob(id)   <- each call does its own           |
|                                  atomic lease claim              |
+------------------------------------------------------------------+
```

---

## 5. Changed & New Files Reference

### New Files

| File | Purpose |
|------|---------|
| [`job-dispatcher.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/jobs/job-dispatcher.ts) | **Core engine.** `JobDispatcher` class. `dispatchJob(jobId)` — atomic lease claim, publish, backoff/dead-letter. `sweep()` — finds undispatched candidates and calls `dispatchJob` for each. `IQueuePublisher` interface. Constants: `DISPATCH_LEASE_MS=120000`, `MAX_DISPATCH_ATTEMPTS=5`. |
| [`outbox-sweep.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/jobs/outbox-sweep.ts) | Thin wrapper. `runOutboxSweep(prisma, queue)` instantiates `JobDispatcher` and calls `sweep()`. Imported by `run-role.ts` (worker startup) and `sweep.ts` (Cloud Scheduler entry). |
| [`sweep.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/sweep.ts) | Standalone Cloud Scheduler entry point. Boots plugins, runs one sweep, exits cleanly. Deployed as a separate Cloud Run Job triggered by Cloud Scheduler every ~1 minute. |
| [`job-dispatcher.test.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/jobs/job-dispatcher.test.ts) | Integration tests using real DB. 4 test cases: concurrent lease contention, expired lease crash recovery, exponential backoff on failure, dead-lettering after 5 attempts. Uses `MockQueue` to simulate broker failures. |

### Modified Files

| File | What Changed |
|------|-------------|
| [`schema.prisma`](file:///Users/apple/Documents/roveAi/apps/api/prisma/schema.prisma) | `Job` model: added `dispatchedAt`, `dispatchLockedAt`, `dispatchLockedBy`, `dispatchAttempts`, `nextDispatchAt`. Added two new composite indexes for sweep queries. |
| [`audit-join.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/audit-join.ts) | `publishIfReady()`: replaced inline `queue.publish()` + status write with `new JobDispatcher(prisma, queue).dispatchJob(interpretJobId)`. Idempotency guard changed from `queueJobId != null` to `dispatchedAt != null`. |
| [`audit-scheduler.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/audits/audit-scheduler.ts) | `AuditScheduler`: `JobDispatcher` initialized in constructor. `ensureJob()` delegates to `this.dispatcher.dispatchJob()` instead of calling `queue.publish()` directly. |
| [`campaign.service.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/campaigns/campaign.service.ts) | `CampaignService`: `JobDispatcher` initialized in constructor. `run()` delegates to `this.dispatcher.dispatchJob()` instead of calling `queue.publish()` directly. |
| [`campaign.repository.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/features/campaigns/campaign.repository.ts) | `prisma` visibility changed from `private` to `public readonly` so `CampaignService` can pass it to `JobDispatcher`. |
| [`run-role.ts`](file:///Users/apple/Documents/roveAi/apps/api/src/entries/run-role.ts) | `runRole()` calls `runOutboxSweep(prisma, queue)` once at startup before subscribing to queue events, ensuring any jobs lost during a previous crash are recovered immediately on boot. |

### Migrations

| Migration | What it added |
|-----------|--------------|
| `20261102071737_add_job_dispatched_at` | Phase 1: `dispatchedAt` column, index on `(status, dispatchedAt)` |
| `20261103072922_add_job_dispatch_lease_fields` | Phase 2: `dispatchLockedAt`, `dispatchLockedBy`, `dispatchAttempts`, `nextDispatchAt`, index on `(status, dispatchedAt, nextDispatchAt)`, index on `(dispatchLockedAt)` |

---

## 6. Database Schema Changes

```prisma
// ── BEFORE (original simple architecture) ─────────────────────────
model Job {
  id             String    @id @default(cuid())
  campaignId     String
  organizationId String
  leadId         String?
  kind           JobKind   @default(DISCOVER)
  status         JobStatus @default(PENDING)
  attemptCount   Int       @default(0)       // mixed: worker + dispatch attempts
  queueJobId     String?   @db.VarChar(64)
  error          String?   @db.VarChar(1000)
  createdAt      DateTime  @default(now()) @db.Timestamptz
  updatedAt      DateTime  @updatedAt @db.Timestamptz

  @@index([campaignId, createdAt])
  @@index([organizationId, status])
  @@index([leadId, kind])
}

// ── AFTER (final lease-based architecture) ────────────────────────
model Job {
  id             String    @id @default(cuid())
  campaignId     String
  organizationId String
  leadId         String?
  kind           JobKind   @default(DISCOVER)
  status         JobStatus @default(PENDING)
  attemptCount   Int       @default(0)       // worker business execution ONLY
  queueJobId     String?   @db.VarChar(64)
  error          String?   @db.VarChar(1000)

  // Outbox dispatch lifecycle — owned exclusively by JobDispatcher
  dispatchedAt     DateTime? @db.Timestamptz  // broker confirmed receipt
  dispatchLockedAt DateTime? @db.Timestamptz  // lease expiry (null = unlocked)
  dispatchLockedBy String?   @db.VarChar(64)  // instance UUID that owns lease
  dispatchAttempts Int       @default(0)      // publishing attempts ONLY
  nextDispatchAt   DateTime? @db.Timestamptz  // earliest next retry time

  createdAt  DateTime @default(now()) @db.Timestamptz
  updatedAt  DateTime @updatedAt @db.Timestamptz

  @@index([campaignId, createdAt])
  @@index([organizationId, status])
  @@index([leadId, kind])
  @@index([status, dispatchedAt, nextDispatchAt])   // sweep candidate query
  @@index([dispatchLockedAt])                        // expired lease query
}
```

---

## 7. Manual Testing Guide

### Prerequisites

```bash
# Terminal 1 — run the dev server
pnpm dev

# Terminal 2 — postgres connection for observation
psql $DATABASE_URL
```

---

### Test 1 — Happy Path

**Goal:** Normal campaign run — job created, dispatched, lease cleared.

1. Trigger a campaign run (via the UI or API)
2. Immediately run:

```sql
SELECT id, kind, status,
       "dispatchedAt", "dispatchLockedAt", "dispatchLockedBy",
       "dispatchAttempts", "nextDispatchAt", "queueJobId"
FROM job
ORDER BY "createdAt" DESC LIMIT 5;
```

**Expected:**
- `dispatchedAt IS NOT NULL` — broker received the message
- `dispatchLockedAt IS NULL` — lease released on success
- `dispatchLockedBy IS NULL`
- `dispatchAttempts = 1`
- `queueJobId` contains a message ID string
- `status = 'PENDING'` (or `PROCESSING` if the worker already claimed it)
- `attemptCount = 0` (or `1` if the worker already ran)

---

### Test 2 — Automated Test Suite

Fastest way to verify all four guarantees in one shot:

```bash
# Dispatcher tests only
pnpm --filter @rove/api exec vitest run \
  src/features/jobs/job-dispatcher.test.ts

# Full test suite
pnpm --filter @rove/api test
```

**Covers:**
- `atomically claims lease so only one concurrent caller dispatches the job`
- `reclaims job if a previous instance crashed and lease expired`
- `schedules exponential backoff on transient queue failures and clears the lease`
- `dead-letters job as FAILED after max dispatch attempts`

---

### Test 3 — Simulate Crash Before Publish

**Goal:** Permanent lock is impossible. An expired lease is reclaimed by the next sweep.

```sql
-- Insert a job that looks like it was claimed 3 min ago but the process died
-- (dispatchedAt is still NULL = never published)
INSERT INTO job (
  id, "campaignId", "organizationId", kind, status,
  "dispatchedAt", "dispatchLockedAt", "dispatchLockedBy", "dispatchAttempts"
)
SELECT
  'test-crashed-job',
  id,           -- pick any real campaignId
  "organizationId",
  'DISCOVER',
  'PENDING',
  NULL,
  NOW() - INTERVAL '3 minutes',
  'dead-cloud-run-instance',
  1
FROM campaign LIMIT 1;
```

Trigger recovery (either restart a worker or run the sweep standalone):

```bash
pnpm --filter @rove/api exec ts-node \
  -r tsconfig-paths/register \
  src/entries/sweep.ts
```

```sql
SELECT id, status, "dispatchedAt", "dispatchLockedAt", "dispatchAttempts"
FROM job WHERE id = 'test-crashed-job';
```

**Expected:**
- `dispatchedAt IS NOT NULL` — healed by sweep
- `dispatchLockedAt IS NULL` — lease released
- `dispatchAttempts = 2` — incremented from 1

---

### Test 4 — Concurrent Double-Dispatch Race

**Goal:** Exactly one winner even with two dispatchers racing.

Open two `psql` terminals and paste the same UPDATE simultaneously (change `instance-A` to `instance-B` in terminal 2):

```sql
UPDATE job
  SET "dispatchLockedAt" = NOW(),
      "dispatchLockedBy" = 'instance-A',
      "dispatchAttempts" = "dispatchAttempts" + 1
  WHERE id = '<paste-any-pending-job-id>'
    AND "dispatchedAt" IS NULL
    AND ("dispatchLockedAt" IS NULL
         OR "dispatchLockedAt" < NOW() - INTERVAL '2 minutes');
```

**Expected:** One terminal prints `UPDATE 1`, the other prints `UPDATE 0`.
PostgreSQL row-level locking (SELECT FOR UPDATE under updateMany) guarantees exactly one winner.

Or run the automated test:

```bash
pnpm --filter @rove/api exec vitest run \
  src/features/jobs/job-dispatcher.test.ts \
  -t "atomically claims lease"
```

---

### Test 5 — Pub/Sub Failure + Exponential Backoff

**Goal:** On publish failure the lease is released and `nextDispatchAt` is set.

Temporarily break your queue driver (e.g., add `throw new Error("simulated")` at the top of `PgBossPlugin.publish()`), then trigger a campaign run.

```sql
SELECT id,
       "dispatchedAt",      -- NULL (never published)
       "dispatchLockedAt",  -- NULL (lease released on failure)
       "dispatchLockedBy",  -- NULL
       "dispatchAttempts",  -- 1
       "nextDispatchAt",    -- ~30 seconds from NOW
       status               -- PENDING (not FAILED yet)
FROM job ORDER BY "createdAt" DESC LIMIT 1;
```

Repeat until the 5th attempt to see dead-lettering:

```sql
SELECT id, status, error, "dispatchAttempts"
FROM job WHERE status = 'FAILED' AND "dispatchAttempts" > 0;
-- error: "Dispatch failed after 5 attempts: ..."
```

**Backoff schedule:**

| Attempt | `nextDispatchAt` delay |
|---------|----------------------|
| 1 | +30 seconds |
| 2 | +2 minutes |
| 3 | +8 minutes |
| 4 | +30 minutes |
| 5 | `status = FAILED` |

---

### Test 6 — Worker Status Race (Fast Worker)

**Goal:** Dispatcher never overwrites `COMPLETED` back to `PROCESSING`.

After a successful run:

```sql
SELECT id, status, "dispatchedAt", "attemptCount", "dispatchAttempts"
FROM job WHERE kind = 'DISCOVER'
ORDER BY "createdAt" DESC LIMIT 1;
```

**Expected:**
- `status = 'COMPLETED'` — set exclusively by the worker
- `dispatchedAt IS NOT NULL` — set exclusively by the dispatcher
- `attemptCount = 1` — incremented by the worker
- `dispatchAttempts = 1` — incremented by the dispatcher

The two counters and the status are completely independent concerns.

---

### Test 7 — Counter Isolation

After a campaign where the crawl worker retried internally (e.g., transient DNS failure):

```sql
SELECT id, kind, "attemptCount", "dispatchAttempts", status
FROM job WHERE kind IN ('CRAWL', 'AUDIT')
ORDER BY "createdAt" DESC LIMIT 5;
```

**Expected:** `dispatchAttempts = 1` (dispatched once successfully) while `attemptCount` may be 2 or 3 (worker retried business logic). The dead-letter threshold of 5 is only checked against `dispatchAttempts`, so business retries can never accidentally dead-letter a job at the dispatch level.

---

### SQL Cheatsheet

```sql
-- All undispatched PENDING jobs (sweep will pick these up)
SELECT id, kind, "dispatchAttempts", "nextDispatchAt", "createdAt"
FROM job
WHERE status = 'PENDING' AND "dispatchedAt" IS NULL
ORDER BY "createdAt" ASC;

-- Jobs with an active dispatch lease (sweep in progress right now)
SELECT id, kind, "dispatchLockedAt", "dispatchLockedBy", "dispatchAttempts"
FROM job
WHERE "dispatchLockedAt" IS NOT NULL AND "dispatchedAt" IS NULL;

-- Jobs with an EXPIRED lease (next sweep will reclaim these)
SELECT id, kind, "dispatchLockedAt", "dispatchLockedBy"
FROM job
WHERE "dispatchedAt" IS NULL
  AND "dispatchLockedAt" < NOW() - INTERVAL '2 minutes';

-- Dead-lettered dispatch failures
SELECT id, kind, status, error, "dispatchAttempts"
FROM job WHERE status = 'FAILED' AND "dispatchAttempts" > 0;

-- Full dispatch lifecycle snapshot (most recent 10 jobs)
SELECT id, kind, status,
       "attemptCount",    "dispatchAttempts",
       "dispatchedAt",    "dispatchLockedAt",
       "nextDispatchAt",  "queueJobId"
FROM job ORDER BY "createdAt" DESC LIMIT 10;
```
