import { describe, expect, it, vi } from "vitest";
import { computeNextAction, LeadService } from "./lead.service";
import { CampaignRepository } from "./campaign.repository";
import { CreditService } from "@features/credits/credit.service";
import { ForbiddenError, NotFoundError, ConflictError } from "@core/errors";

describe("computeNextAction", () => {
  it("prioritizes archivedAt above all statuses", () => {
    const res = computeNextAction({
      archivedAt: "2026-11-11T00:00:00.000Z",
      prospectStatus: "QUALIFIED",
      opportunityScore: 90,
      auditStatus: "COMPLETED",
      aiStatus: "COMPLETED",
      brief: { id: "brief_1", aiStatus: "COMPLETED" },
    });
    expect(res).toEqual({ label: "Archived", tone: "neutral" });
  });

  it("returns Dismissed for DISMISSED prospects even when score is high", () => {
    const res = computeNextAction({
      archivedAt: null,
      prospectStatus: "DISMISSED",
      opportunityScore: 95,
      auditStatus: "COMPLETED",
      aiStatus: "COMPLETED",
      brief: { id: "brief_1", aiStatus: "COMPLETED" },
    });
    expect(res).toEqual({ label: "Dismissed", tone: "neutral" });
  });

  it("returns Follow up for CONTACTED prospects", () => {
    const res = computeNextAction({
      archivedAt: null,
      prospectStatus: "CONTACTED",
      opportunityScore: 50,
      auditStatus: "COMPLETED",
      aiStatus: "COMPLETED",
      brief: null,
    });
    expect(res).toEqual({ label: "Follow up", tone: "primary" });
  });

  describe("QUALIFIED status with different AI states", () => {
    it("returns 'Review evidence' when brief is COMPLETED", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "QUALIFIED",
        opportunityScore: 85,
        auditStatus: "COMPLETED",
        aiStatus: "COMPLETED",
        brief: { id: "brief_1", aiStatus: "COMPLETED" },
      });
      expect(res).toEqual({ label: "Review evidence", tone: "success" });
    });

    it("returns 'Brief generating' when AI brief is PENDING", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "QUALIFIED",
        opportunityScore: 85,
        auditStatus: "COMPLETED",
        aiStatus: "PENDING",
        brief: { id: "brief_1", aiStatus: "PENDING" },
      });
      expect(res).toEqual({ label: "Brief generating", tone: "neutral" });
    });

    it("returns 'Generate brief' when brief is missing or gate skipped", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "QUALIFIED",
        opportunityScore: 85,
        auditStatus: "COMPLETED",
        aiStatus: "SKIPPED_GATE",
        brief: null,
      });
      expect(res).toEqual({ label: "Generate brief", tone: "warning" });
    });
  });

  describe("RESEARCHED status", () => {
    it("returns 'Qualify prospect' when opportunity score >= 75", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "RESEARCHED",
        opportunityScore: 75,
        auditStatus: "COMPLETED",
        aiStatus: "PENDING",
        brief: null,
      });
      expect(res).toEqual({ label: "Qualify prospect", tone: "success" });
    });

    it("returns 'Check service fit' when opportunity score < 75", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "RESEARCHED",
        opportunityScore: 64,
        auditStatus: "COMPLETED",
        aiStatus: "PENDING",
        brief: null,
      });
      expect(res).toEqual({ label: "Check service fit", tone: "warning" });
    });
  });

  describe("NEW status auditStatus branches", () => {
    it("returns 'Pitch web design' when website is SKIPPED_NO_WEBSITE", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "NEW",
        opportunityScore: 80,
        auditStatus: "SKIPPED_NO_WEBSITE",
        aiStatus: "PENDING",
        brief: null,
      });
      expect(res).toEqual({ label: "Pitch web design", tone: "primary" });
    });

    it("returns 'Manual review' when crawl is blocked or unreachable", () => {
      for (const st of ["UNREACHABLE", "BLOCKED", "LOW_TEXT", "SKIPPED_BY_ROBOTS"]) {
        const res = computeNextAction({
          archivedAt: null,
          prospectStatus: "NEW",
          opportunityScore: 40,
          auditStatus: st,
          aiStatus: "PENDING",
          brief: null,
        });
        expect(res).toEqual({ label: "Manual review", tone: "warning" });
      }
    });

    it("returns 'Retry audit' when audit failed", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "NEW",
        opportunityScore: 20,
        auditStatus: "FAILED",
        aiStatus: "PENDING",
        brief: null,
      });
      expect(res).toEqual({ label: "Retry audit", tone: "danger" });
    });

    it("returns 'Review findings' when audit completed", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "NEW",
        opportunityScore: 70,
        auditStatus: "COMPLETED",
        aiStatus: "PENDING",
        brief: null,
      });
      expect(res).toEqual({ label: "Review findings", tone: "primary" });
    });

    it("returns 'Run research' for pending audits", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "NEW",
        opportunityScore: null,
        auditStatus: "PENDING",
        aiStatus: "PENDING",
        brief: null,
      });
      expect(res).toEqual({ label: "Run research", tone: "neutral" });
    });

    it("returns 'Run audit' for NOT_AUDITED status", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "NEW",
        opportunityScore: null,
        auditStatus: "NOT_AUDITED",
        aiStatus: "NOT_REQUESTED",
        brief: null,
      });
      expect(res).toEqual({ label: "Run audit", tone: "neutral" });
    });

    it("returns 'Audit queued' for QUEUED status", () => {
      const res = computeNextAction({
        archivedAt: null,
        prospectStatus: "NEW",
        opportunityScore: null,
        auditStatus: "QUEUED",
        aiStatus: "NOT_REQUESTED",
        brief: null,
      });
      expect(res).toEqual({ label: "Audit queued", tone: "neutral" });
    });
  });
});

describe("LeadService", () => {
  const fakeRepo = {
    prisma: {
      prospectTag: {
        findMany: vi.fn(),
      },
    },
    getLeadsSummary: vi.fn(),
    getLeadDetail: vi.fn(),
    updateLead: vi.fn(),
    bulkUpdateLeads: vi.fn(),
    listTags: vi.fn(),
    createTag: vi.fn(),
    deleteTag: vi.fn(),
    getLeadsForExport: vi.fn(),
  } as unknown as CampaignRepository;

  const service = new LeadService(fakeRepo);

  it("sanitizes CSV formula injection characters with a tab prefix", async () => {
    vi.mocked(fakeRepo.getLeadsForExport).mockResolvedValueOnce([
      {
        id: "lead_1",
        qualificationStatus: "NEW",
        auditStatus: "COMPLETED",
        aiStatus: "COMPLETED",
        prospectStatus: "QUALIFIED",
        opportunityScore: 88,
        scoreBreakdown: null,
        notes: "=cmd|'/C calc'!A0",
        savedAt: "2026-11-11T00:00:00.000Z",
        archivedAt: null,
        tags: [{ id: "tag_1", name: "+VIP-Lead" }],
        business: {
          id: "biz_1",
          name: "@Dangerous Dental",
          city: "Austin",
          rating: 4.8,
          reviewCount: 120,
          websiteUrl: "-https://example.com",
          websiteClass: "OWNED_SITE",
        },
        audits: [],
        brief: null,
      },
    ]);

    const csv = await service.exportCsv("org_1", "camp_1");
    expect(csv).toContain('"\t@Dangerous Dental"');
    expect(csv).toContain('"\t-https://example.com"');
    expect(csv).toContain('"\t=cmd|\'/C calc\'!A0"');
    expect(csv).toContain('"Yes"'); // saved
    expect(csv).toContain('"No"'); // not archived
  });

  it("validates tag ownership in update() and throws ForbiddenError if tag belongs to another org", async () => {
    vi.mocked(fakeRepo.prisma.prospectTag.findMany).mockResolvedValueOnce([
      { id: "tag_owned" } as any,
    ]);

    await expect(
      service.update(
        "org_1",
        "camp_1",
        "lead_1",
        { tagIds: ["tag_owned", "tag_attacker"] },
        "user_1"
      )
    ).rejects.toThrow(ForbiddenError);
  });

  it("propagates FORBIDDEN error from bulk update into ForbiddenError", async () => {
    vi.mocked(fakeRepo.bulkUpdateLeads).mockRejectedValueOnce(
      new Error("FORBIDDEN: one or more lead IDs do not belong to this campaign")
    );

    await expect(
      service.bulk(
        "org_1",
        "camp_1",
        { leadIds: ["lead_1"], action: "SAVE" },
        "user_1"
      )
    ).rejects.toThrow(ForbiddenError);
  });

  describe("runAudit and generateBriefs", () => {
    const mockAuditScheduler = {
      schedule: vi.fn().mockResolvedValue({ scheduledLeads: 2, queuedJobs: 4 }),
      createJobRows: vi.fn().mockResolvedValue({ jobIds: ["j1", "j2", "j3", "j4"], scheduledLeads: 2 }),
      dispatchJobs: vi.fn().mockResolvedValue(undefined),
      scheduleAiBriefs: vi.fn().mockResolvedValue({ queuedCount: 2 }),
    };

    const mockCreditService = {
      reserveCredits: vi.fn().mockResolvedValue({ id: "res_abc", amount: 16 }),
      commitReservation: vi.fn().mockResolvedValue({ status: "COMMITTED" }),
      releaseReservation: vi.fn().mockResolvedValue({ status: "RELEASED" }),
      getBalance: vi.fn().mockResolvedValue({ balance: 500, lifetimeGranted: 500, lifetimeConsumed: 0 }),
    } as unknown as CreditService;

    const mockPrisma = {
      prospectTag: { findMany: vi.fn() },
      campaignLead: {
        findMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      auditBatch: {
        create: vi.fn().mockResolvedValue({ id: "batch_abc" }),
        findUnique: vi.fn().mockResolvedValue(null),
      },
      reservationItem: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      leadActivityLog: {
        createMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
      $queryRaw: vi.fn(),
      $transaction: vi.fn(),
    };
    mockPrisma.$transaction.mockImplementation((cb: any) => cb(mockPrisma));

    const repoWithPrisma = {
      ...fakeRepo,
      prisma: mockPrisma,
    } as unknown as CampaignRepository;

    const auditService = new LeadService(repoWithPrisma, mockAuditScheduler as any, mockCreditService);

    it("throws ForbiddenError if lead IDs do not belong to campaign", async () => {
      mockPrisma.campaignLead.findMany.mockResolvedValueOnce([
        { id: "lead_1", auditStatus: "NOT_AUDITED" },
      ]); // only 1 returned when 2 requested

      await expect(
        auditService.runAudit(
          "org_1",
          "camp_1",
          { leadIds: ["lead_1", "lead_alien"], tools: ["CRAWL"] },
          "user_1"
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it("throws ConflictError if any requested leads are currently QUEUED, RUNNING, or PENDING", async () => {
      mockPrisma.campaignLead.findMany.mockResolvedValueOnce([
        { id: "lead_1", auditStatus: "RUNNING" },
        { id: "lead_2", auditStatus: "NOT_AUDITED" },
      ]);

      await expect(
        auditService.runAudit(
          "org_1",
          "camp_1",
          { leadIds: ["lead_1", "lead_2"], tools: ["CRAWL"] },
          "user_1"
        )
      ).rejects.toThrow(ConflictError);
    });

    it("successfully creates audit batch, activity logs, and schedules jobs", async () => {
      mockPrisma.campaignLead.findMany
        .mockResolvedValueOnce([
          { id: "lead_1", auditStatus: "NOT_AUDITED" },
          { id: "lead_2", auditStatus: "NOT_AUDITED" },
        ])
        .mockResolvedValueOnce([
          { id: "lead_1", business: { websiteUrl: "https://example.com" } },
          { id: "lead_2", business: { websiteUrl: "https://example.com" } },
        ]);

      const result = await auditService.runAudit(
        "org_1",
        "camp_1",
        { leadIds: ["lead_2", "lead_1"], tools: ["CRAWL", "PERFORMANCE"], generateAiBrief: true },
        "user_1"
      );

      expect(result).toEqual({
        batchId: "batch_abc",
        scheduledLeads: 2,
        queuedJobs: 4,
      });

      // Verify batch was created
      expect(mockPrisma.auditBatch.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          organizationId: "org_1",
          campaignId: "camp_1",
          leadCount: 2,
          generateAiBrief: true,
        }),
      });

      // Verify job rows created atomically via outbox pattern
      expect(mockAuditScheduler.createJobRows).toHaveBeenCalledWith(
        expect.anything(),
        "camp_1",
        "org_1",
        expect.anything(),
        expect.objectContaining({
          tools: ["CRAWL", "PERFORMANCE"],
          generateAiBrief: true,
        })
      );
      expect(mockAuditScheduler.dispatchJobs).toHaveBeenCalledWith(["j1", "j2", "j3", "j4"]);
    });

    it("successfully triggers generateBriefs for owned leads", async () => {
      mockPrisma.campaignLead.findMany.mockResolvedValueOnce([
        { id: "lead_1", auditStatus: "COMPLETED" },
        { id: "lead_2", auditStatus: "COMPLETED" },
      ]);

      const result = await auditService.generateBriefs(
        "org_1",
        "camp_1",
        ["lead_1", "lead_2"],
        "user_1"
      );

      expect(result).toEqual({
        queuedCount: 2,
        reservationId: "res_abc",
        unitsEstimated: 2,
      });
      expect(mockAuditScheduler.scheduleAiBriefs).toHaveBeenCalledWith("camp_1", ["lead_1", "lead_2"]);
    });
  });
});

