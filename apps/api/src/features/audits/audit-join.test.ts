import { describe, expect, it, vi } from "vitest";
import { publishIfReady } from "./audit-join";

describe("audit-join — Batch Scoping & Join Barrier", () => {
  it("scopes top-N finalizer strictly to current batchId and aiStatus: NOT_REQUESTED", async () => {
    // Campaign has two batches: batch-1 and batch-2
    // batch-1 leads: lead-1 (score 95, batch-1), lead-2 (score 85, batch-1)
    // batch-2 leads: lead-3 (score 60, batch-2), lead-4 (score 90, batch-2)
    // When batch-2 completes with topNBriefsCount: 1, it must select lead-4, NOT lead-1 from batch-1!

    const mockLeadsDb: Record<string, any> = {
      "lead-3": {
        id: "lead-3",
        campaignId: "camp-1",
        organizationId: "org-1",
        auditBatchId: "batch-2",
        auditStatus: "COMPLETED",
        aiStatus: "NOT_REQUESTED",
        opportunityScore: 60,
        business: { name: "Biz 3", websiteUrl: "https://biz3.com" },
        campaign: { id: "camp-1" },
        audits: [],
      },
      "lead-4": {
        id: "lead-4",
        campaignId: "camp-1",
        organizationId: "org-1",
        auditBatchId: "batch-2",
        auditStatus: "COMPLETED",
        aiStatus: "NOT_REQUESTED",
        opportunityScore: 90,
        business: { name: "Biz 4", websiteUrl: "https://biz4.com" },
        campaign: { id: "camp-1" },
        audits: [],
      },
    };

    let findManyFilterCaptured: any = null;
    let leadsUpdatedToQueued: string[] = [];

    const mockTx: any = {
      $queryRaw: vi.fn().mockResolvedValue([{ id: "lead-4" }]),
      technicalAudit: {
        findMany: vi.fn().mockResolvedValue([
          { module: "TECHNICAL_SEO", status: "COMPLETED" },
          { module: "WEBSITE_EXPERIENCE", status: "COMPLETED" },
          { module: "PERFORMANCE", status: "COMPLETED" },
        ]),
      },
      campaignLead: {
        update: vi.fn().mockResolvedValue({}),
        updateMany: vi.fn().mockImplementation((args) => {
          if (args.data?.aiStatus === "QUEUED") {
            leadsUpdatedToQueued = args.where.id.in;
          }
          return { count: 1 };
        }),
        findUnique: vi.fn().mockImplementation((args) => {
          const lead = mockLeadsDb[args.where.id];
          return Promise.resolve(lead ? { ...lead, auditBatchId: lead.auditBatchId } : null);
        }),
        findMany: vi.fn().mockImplementation((args) => {
          if (args.where?.auditBatchId) {
            findManyFilterCaptured = args.where;
            // Filter strictly by auditBatchId and aiStatus: NOT_REQUESTED
            const matching = Object.values(mockLeadsDb).filter(
              (l) =>
                l.auditBatchId === args.where.auditBatchId &&
                l.aiStatus === args.where.aiStatus &&
                args.where.auditStatus?.in?.includes(l.auditStatus)
            );
            matching.sort((a, b) => (b.opportunityScore ?? 0) - (a.opportunityScore ?? 0));
            const topN = args.take ? matching.slice(0, args.take) : matching;
            return Promise.resolve(topN.map((l) => ({ id: l.id })));
          }
          // Default findMany for campaign outcome check
          return Promise.resolve([
            { auditStatus: "COMPLETED" },
            { auditStatus: "COMPLETED" },
          ]);
        }),
      },
      serviceOffer: { findMany: vi.fn().mockResolvedValue([]) },
      auditAttempt: { findMany: vi.fn().mockResolvedValue([]) },
      leadScore: { upsert: vi.fn().mockResolvedValue({}) },
      auditBatch: {
        findUnique: vi.fn().mockResolvedValue({
          id: "batch-2",
          campaignId: "camp-1",
          status: "PROCESSING",
          leadCount: 2,
          topNBriefsCount: 1, // Top 1 requested for batch-2
          completedLeadCount: 1, // 1 lead already completed; this is the 2nd
          unitsEstimated: 2,
        }),
        findFirst: vi.fn(),
        update: vi.fn().mockImplementation((args) => {
          return Promise.resolve({
            id: "batch-2",
            completedLeadCount: 2, // Now last lead!
          });
        }),
        findMany: vi.fn().mockResolvedValue([]),
      },
      campaign: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
      job: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: "job-interpret-lead-4", dispatchedAt: null }),
      },
    };

    const mockPrisma: any = {
      $transaction: vi.fn().mockImplementation((cb) => cb(mockTx)),
      reservationItem: { findFirst: vi.fn().mockResolvedValue(null) },
      job: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        findUnique: vi.fn().mockResolvedValue({
          id: "job-interpret-lead-4",
          kind: "INTERPRET",
          campaignId: "camp-1",
          organizationId: "org-1",
          leadId: "lead-4",
          status: "PENDING",
        }),
        update: vi.fn().mockResolvedValue({}),
      },
    };

    const mockQueue: any = {
      publish: vi.fn().mockResolvedValue("q-job-123"),
    };

    await publishIfReady(mockPrisma, mockQueue, {
      jobId: "job-audit-4",
      leadId: "lead-4",
      campaignId: "camp-1",
      organizationId: "org-1",
    });

    // 1. Verify that the query strictly filters by batchId and aiStatus: NOT_REQUESTED
    expect(findManyFilterCaptured).toEqual(
      expect.objectContaining({
        campaignId: "camp-1",
        auditBatchId: "batch-2",
        aiStatus: "NOT_REQUESTED",
        auditStatus: { in: ["COMPLETED", "PARTIALLY_COMPLETED"] },
      })
    );

    // 2. Verify that ONLY lead-4 (from batch-2) was queued, NOT any lead from batch-1
    expect(leadsUpdatedToQueued).toEqual(["lead-4"]);
  });
});
