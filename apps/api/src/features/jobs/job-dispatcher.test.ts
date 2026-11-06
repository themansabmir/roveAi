import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { buildApp } from "../../server";
import { registry } from "@core/registry";
import { IPrismaService, PRISMA_PLUGIN } from "@plugins/prisma/prisma.plugin";
import { JobDispatcher, MAX_DISPATCH_ATTEMPTS, DISPATCH_LEASE_MS } from "./job-dispatcher";

class MockQueue {
  published: Array<{ queue: string; payload: unknown; singletonKey?: string }> = [];
  shouldFail = false;
  returnNull = false;

  async publish<T extends object>(
    queue: string,
    payload: T,
    opts?: { singletonKey?: string }
  ): Promise<string | null> {
    if (this.shouldFail) {
      throw new Error("Simulated PubSub network failure");
    }
    this.published.push({ queue, payload, singletonKey: opts?.singletonKey });
    return this.returnNull ? null : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

const hasRealDb = Boolean(
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("HOST-pooler.REGION.aws.neon.tech")
);

describe.skipIf(!hasRealDb)("JobDispatcher — Lease-Based Outbox Dispatch", () => {
  let prisma: PrismaClient;
  let orgId: string;
  let campaignId: string;
  const orgIds: string[] = [];

  beforeAll(async () => {
    await buildApp();
    prisma = registry.get<IPrismaService>(PRISMA_PLUGIN).client;
  });

  afterAll(async () => {
    if (orgIds.length > 0) {
      await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
    }
    await registry.shutdownAll();
  });

  beforeEach(async () => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const org = await prisma.organization.create({
      data: { name: `Test Org ${id}`, slug: `test-org-${id}` },
    });
    orgId = org.id;
    orgIds.push(orgId);

    const campaign = await prisma.campaign.create({
      data: {
        organizationId: orgId,
        niche: "Dentists",
        serviceType: "SEO",
        city: "Austin",
        region: "TX",
        country: "USA",
        maxLeads: 10,
      },
    });
    campaignId = campaign.id;
  });

  it("atomically claims lease so only one concurrent caller dispatches the job", async () => {
    const job = await prisma.job.create({
      data: {
        organizationId: orgId,
        campaignId,
        kind: "DISCOVER",
        status: "PENDING",
      },
    });

    const queue1 = new MockQueue();
    const queue2 = new MockQueue();
    const dispatcher1 = new JobDispatcher(prisma, queue1);
    const dispatcher2 = new JobDispatcher(prisma, queue2);

    // Run both simultaneously
    const [result1, result2] = await Promise.all([
      dispatcher1.dispatchJob(job.id),
      dispatcher2.dispatchJob(job.id),
    ]);

    // Exactly one must win the lease
    expect(result1 !== result2).toBe(true);
    expect(queue1.published.length + queue2.published.length).toBe(1);

    const updated = await prisma.job.findUniqueOrThrow({ where: { id: job.id } });
    expect(updated.dispatchedAt).not.toBeNull();
    expect(updated.dispatchLockedAt).toBeNull();
    expect(updated.dispatchLockedBy).toBeNull();
    expect(updated.dispatchAttempts).toBe(1);
    // Crucial: status must remain PENDING (worker owns execution lifecycle)
    expect(updated.status).toBe("PENDING");
    // attemptCount must be untouched (worker counter, not dispatcher counter)
    expect(updated.attemptCount).toBe(0);
  });

  it("reclaims job if a previous instance crashed and lease expired", async () => {
    // Simulate a crash: job was claimed 3 minutes ago (expired lease) and never dispatched
    const job = await prisma.job.create({
      data: {
        organizationId: orgId,
        campaignId,
        kind: "DISCOVER",
        status: "PENDING",
        dispatchedAt: null,
        dispatchLockedAt: new Date(Date.now() - (DISPATCH_LEASE_MS + 60_000)), // 3 mins ago
        dispatchLockedBy: "dead-cloud-run-instance-id",
        dispatchAttempts: 1,
      },
    });

    const queue = new MockQueue();
    const dispatcher = new JobDispatcher(prisma, queue);

    const dispatched = await dispatcher.dispatchJob(job.id);
    expect(dispatched).toBe(true);
    expect(queue.published.length).toBe(1);

    const healed = await prisma.job.findUniqueOrThrow({ where: { id: job.id } });
    expect(healed.dispatchedAt).not.toBeNull();
    expect(healed.dispatchAttempts).toBe(2);
    expect(healed.dispatchLockedAt).toBeNull();
    expect(healed.dispatchLockedBy).toBeNull();
  });

  it("schedules exponential backoff on transient queue failures and clears the lease", async () => {
    const job = await prisma.job.create({
      data: {
        organizationId: orgId,
        campaignId,
        kind: "DISCOVER",
        status: "PENDING",
        dispatchedAt: null,
      },
    });

    const queue = new MockQueue();
    queue.shouldFail = true; // Simulate network outage
    const dispatcher = new JobDispatcher(prisma, queue);

    const success = await dispatcher.dispatchJob(job.id);
    expect(success).toBe(false);

    const failed = await prisma.job.findUniqueOrThrow({ where: { id: job.id } });
    expect(failed.dispatchedAt).toBeNull();
    expect(failed.dispatchLockedAt).toBeNull(); // lock released for retry
    expect(failed.dispatchLockedBy).toBeNull();
    expect(failed.dispatchAttempts).toBe(1);
    expect(failed.nextDispatchAt).not.toBeNull();
    // Next retry should be in ~30 seconds
    expect(failed.nextDispatchAt!.getTime()).toBeGreaterThan(Date.now() + 20_000);
  });

  it("dead-letters job as FAILED after max dispatch attempts", async () => {
    const job = await prisma.job.create({
      data: {
        organizationId: orgId,
        campaignId,
        kind: "DISCOVER",
        status: "PENDING",
        dispatchedAt: null,
        dispatchAttempts: MAX_DISPATCH_ATTEMPTS - 1, // 4 prior attempts
      },
    });

    const queue = new MockQueue();
    queue.shouldFail = true;
    const dispatcher = new JobDispatcher(prisma, queue);

    const success = await dispatcher.dispatchJob(job.id);
    expect(success).toBe(false);

    const dead = await prisma.job.findUniqueOrThrow({ where: { id: job.id } });
    expect(dead.status).toBe("FAILED");
    expect(dead.error).toContain(`Dispatch failed after ${MAX_DISPATCH_ATTEMPTS} attempts`);
    expect(dead.dispatchLockedAt).toBeNull();
    expect(dead.dispatchLockedBy).toBeNull();
  });
});
