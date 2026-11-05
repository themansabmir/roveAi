/**
 * JobDispatcher — Centralized, lease-based Outbox publisher.
 *
 * Architecture & Guarantees:
 * 1. LEASE-BASED CLAIM:
 *    Uses an expiring lease (`dispatchLockedAt` + `dispatchLockedBy`) rather than
 *    prematurely stamping `dispatchedAt`. If a Cloud Run instance crashes right
 *    after claiming the lease, the lease expires after 2 minutes and another sweep
 *    reclaims the job. The job is NEVER permanently lost.
 *
 * 2. BROKER-CONFIRMED DISPATCH:
 *    `dispatchedAt` is stamped ONLY AFTER `queue.publish()` resolves successfully.
 *
 * 3. SEPARATE DISPATCH LIFECYCLE FROM WORKER STATUS:
 *    The dispatcher NEVER sets `status: "PROCESSING"`. The business worker owns the
 *    execution lifecycle (PENDING -> PROCESSING -> COMPLETED/FAILED). This eliminates
 *    race conditions where a fast worker finishes before the publisher updates the row.
 *
 * 4. DEDICATED DISPATCH RETRY COUNTER:
 *    Uses `dispatchAttempts` and explicit `nextDispatchAt` for exponential backoff,
 *    keeping worker business execution `attemptCount` completely independent.
 *
 * 5. SINGLETON & CONCURRENCY COORDINATION:
 *    Coordinated across `publishIfReady()`, `CampaignService.run()`, `AuditScheduler`,
 *    and background sweep. Concurrent dispatchers on the same job atomically fail
 *    to claim (`count === 0`) and exit without double-publishing.
 */

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { logger } from "@core/logger";
import {
  DISCOVER_QUEUE,
  CRAWL_QUEUE,
  PSI_QUEUE,
  AUDIT_READY_QUEUE,
  DiscoverPayload,
  AuditJobPayload,
} from "@plugins/queue/queue.types";

export interface IQueuePublisher {
  publish<T extends object>(
    queue: string,
    payload: T,
    opts?: { singletonKey?: string }
  ): Promise<string | null>;
}

// 2-minute lease window for dispatch locks:
export const DISPATCH_LEASE_MS = 2 * 60 * 1000;
// Maximum queue dispatch attempts before dead-lettering as FAILED:
export const MAX_DISPATCH_ATTEMPTS = 5;

export class JobDispatcher {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly queue: IQueuePublisher
  ) { }

  /**
   * Atomically claims an expiring lease and publishes a specific job by ID.
   * If another process/worker has already claimed the lease or the job is already
   * dispatched or backoff has not elapsed, returns false immediately.
   */
  async dispatchJob(jobId: string): Promise<boolean> {
    const lockToken = randomUUID();
    const now = new Date();
    const leaseCutoff = new Date(Date.now() - DISPATCH_LEASE_MS);

    // 1. Atomically claim an expiring lease
    const claim = await this.prisma.job.updateMany({
      where: {
        id: jobId,
        status: "PENDING",
        dispatchedAt: null,
        OR: [
          { nextDispatchAt: null },
          { nextDispatchAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { dispatchLockedAt: null },
              { dispatchLockedAt: { lt: leaseCutoff } },
            ],
          },
        ],
      },
      data: {
        dispatchLockedAt: now,
        dispatchLockedBy: lockToken,
        dispatchAttempts: { increment: 1 },
      },
    });

    if (claim.count === 0) {
      // Another instance owns an active lease, or the job is already dispatched
      return false;
    }

    // 2. Fetch full job details for queue payload
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        lead: {
          select: {
            id: true,
            businessId: true,
            business: { select: { id: true, websiteUrl: true } },
          },
        },
      },
    });

    if (!job) return false;

    // 3. Resolve destination queue and payload
    try {
      let queueName: string;
      let payload: object;
      let singletonKey: string | undefined;

      switch (job.kind) {
        case "DISCOVER": {
          queueName = DISCOVER_QUEUE;
          const p: DiscoverPayload = { campaignId: job.campaignId, jobId: job.id };
          payload = p;
          singletonKey = `discover:${job.campaignId}`;
          break;
        }
        case "CRAWL": {
          queueName = CRAWL_QUEUE;
          const url = job.lead?.business?.websiteUrl ?? "";
          const p: AuditJobPayload = {
            organizationId: job.organizationId,
            campaignId: job.campaignId,
            leadId: job.leadId ?? "",
            businessId: job.lead?.businessId ?? "",
            jobId: job.id,
            url,
          };
          payload = p;
          singletonKey = job.leadId ? `crawl:${job.leadId}` : undefined;
          break;
        }
        case "AUDIT": {
          queueName = PSI_QUEUE;
          const url = job.lead?.business?.websiteUrl ?? "";
          const p: AuditJobPayload = {
            organizationId: job.organizationId,
            campaignId: job.campaignId,
            leadId: job.leadId ?? "",
            businessId: job.lead?.businessId ?? "",
            jobId: job.id,
            url,
          };
          payload = p;
          singletonKey = job.leadId ? `psi:${job.leadId}` : undefined;
          break;
        }
        case "INTERPRET": {
          queueName = AUDIT_READY_QUEUE;
          const url = job.lead?.business?.websiteUrl ?? "";
          const p: AuditJobPayload = {
            organizationId: job.organizationId,
            campaignId: job.campaignId,
            leadId: job.leadId ?? "",
            businessId: job.lead?.businessId ?? "",
            jobId: job.id,
            url,
          };
          payload = p;
          break;
        }
        default:
          logger.warn({ kind: job.kind, jobId: job.id }, "JobDispatcher: unsupported job kind for dispatch");
          // Release lease
          await this.prisma.job.updateMany({
            where: { id: job.id, dispatchLockedBy: lockToken },
            data: { dispatchLockedAt: null, dispatchLockedBy: null },
          });
          return false;
      }

      const messageId = await this.queue.publish(queueName, payload, singletonKey ? { singletonKey } : undefined);

      // 4. Mark successfully dispatched
      // DO NOT set status: "PROCESSING" here! Worker owns the execution lifecycle.
      await this.prisma.job.updateMany({
        where: { id: job.id, dispatchLockedBy: lockToken },
        data: {
          queueJobId: messageId,
          dispatchedAt: new Date(),
          dispatchLockedAt: null,
          dispatchLockedBy: null,
          nextDispatchAt: null,
        },
      });

      logger.info({ jobId: job.id, kind: job.kind, queueName, messageId }, "JobDispatcher: published job successfully");
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error({ err, jobId: job.id, kind: job.kind }, "JobDispatcher: failed to publish message");

      // 5. Exponential backoff or dead-letter
      const attempts = job.dispatchAttempts; // includes current attempt incremented in step 1
      if (attempts >= MAX_DISPATCH_ATTEMPTS) {
        logger.error({ jobId: job.id, attempts }, "JobDispatcher: max dispatch attempts reached, dead-lettering job");
        await this.prisma.job.updateMany({
          where: { id: job.id, dispatchLockedBy: lockToken },
          data: {
            status: "FAILED",
            error: `Dispatch failed after ${MAX_DISPATCH_ATTEMPTS} attempts: ${errorMsg}`,
            dispatchLockedAt: null,
            dispatchLockedBy: null,
          },
        });
      } else {
        // Delays: 1st retry -> 30s, 2nd -> 120s, 3rd -> 480s, 4th -> 1800s max
        const delaySeconds = Math.min(Math.pow(4, Math.max(0, attempts - 1)) * 30, 1800);
        const nextDispatchAt = new Date(Date.now() + delaySeconds * 1000);
        await this.prisma.job.updateMany({
          where: { id: job.id, dispatchLockedBy: lockToken },
          data: {
            nextDispatchAt,
            dispatchLockedAt: null,
            dispatchLockedBy: null,
          },
        });
      }
      return false;
    }
  }

  /**
   * Sweeps and recovers any PENDING jobs whose lease has expired and whose retry
   * backoff has elapsed.
   */
  async sweep(): Promise<{ dispatched: number; totalCandidates: number }> {
    const now = new Date();
    const leaseCutoff = new Date(Date.now() - DISPATCH_LEASE_MS);

    const candidates = await this.prisma.job.findMany({
      where: {
        status: "PENDING",
        dispatchedAt: null,
        OR: [
          { nextDispatchAt: null },
          { nextDispatchAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { dispatchLockedAt: null },
              { dispatchLockedAt: { lt: leaseCutoff } },
            ],
          },
        ],
      },
      select: { id: true, kind: true },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    if (candidates.length > 0) {
      logger.info({ count: candidates.length }, "JobDispatcher.sweep: found candidate jobs to dispatch");
    }

    let dispatched = 0;
    for (const candidate of candidates) {
      const ok = await this.dispatchJob(candidate.id);
      if (ok) dispatched++;
    }

    return { dispatched, totalCandidates: candidates.length };
  }
}

