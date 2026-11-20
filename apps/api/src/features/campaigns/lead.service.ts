import { ForbiddenError, NotFoundError, ConflictError, BadRequestError } from "@core/errors";
import { AuditModule, Prisma, ProspectStatus } from "@prisma/client";
import { CampaignRepository, LeadSummaryRow, LeadView, LeadsSummaryResult, TagView } from "./campaign.repository";
import { BulkLeadsInput, LeadsQuery, UpdateLeadInput, SelectiveAuditInput } from "./lead.schemas";
import { AuditScheduler } from "@features/audits/audit-scheduler";
import { CreditService } from "../credits/credit.service";
// ---------------------------------------------------------------------------
// CSV injection sanitization: prefix dangerous chars with a tab
// ---------------------------------------------------------------------------
function csvSafe(value: string | null | undefined): string {
  const str = value ?? "";
  return /^[=+\-@\t\r]/.test(str) ? `\t${str}` : str;
}

// ---------------------------------------------------------------------------
// ProspectStatus Lifecycle & Transition Validation
// ---------------------------------------------------------------------------
export const ALLOWED_PROSPECT_TRANSITIONS: Record<ProspectStatus, ProspectStatus[]> = {
  NEW: ["RESEARCHED", "QUALIFIED", "DISMISSED"],
  RESEARCHED: ["QUALIFIED", "CONTACTED", "DISMISSED", "NEW"],
  QUALIFIED: ["CONTACTED", "RESEARCHED", "DISMISSED", "NEW"],
  CONTACTED: ["QUALIFIED", "DISMISSED", "RESEARCHED"],
  DISMISSED: ["NEW", "RESEARCHED", "QUALIFIED"],
};

export function isValidStatusTransition(from: ProspectStatus, to: ProspectStatus): boolean {
  if (from === to) return true;
  return ALLOWED_PROSPECT_TRANSITIONS[from]?.includes(to) ?? false;
}

// ---------------------------------------------------------------------------
// computeNextAction — deterministic, no LLM calls
// AuditStatus values: PENDING | SKIPPED_NO_WEBSITE | SKIPPED_NOT_OWNED_SITE |
//                     SKIPPED_BY_ROBOTS | SKIPPED_BUDGET | UNREACHABLE | BLOCKED |
//                     LOW_TEXT | COMPLETED | FAILED
// AiStatus values: PENDING | SKIPPED_GATE | COMPLETED | UNAVAILABLE
// ProspectStatus values: NEW | RESEARCHED | QUALIFIED | CONTACTED | DISMISSED
// ---------------------------------------------------------------------------
export function computeNextAction(lead: {
  archivedAt: string | null;
  prospectStatus: string;
  opportunityScore: number | null;
  auditStatus: string;
  aiStatus: string;
  brief: { id: string; aiStatus: string } | null | undefined;
}): { label: string; tone: "primary" | "warning" | "neutral" | "success" | "danger" } {
  if (lead.archivedAt != null) {
    return { label: "Archived", tone: "neutral" };
  }

  switch (lead.prospectStatus as ProspectStatus) {
    case "DISMISSED":
      return { label: "Dismissed", tone: "neutral" };

    case "CONTACTED":
      return { label: "Follow up", tone: "primary" };

    case "QUALIFIED": {
      const briefAiStatus = lead.brief?.aiStatus ?? lead.aiStatus;
      if (briefAiStatus === "COMPLETED") return { label: "Review evidence", tone: "success" };
      if (briefAiStatus === "PENDING" || briefAiStatus === "QUEUED") return { label: "Brief generating", tone: "neutral" };
      if (briefAiStatus === "SKIPPED_GATE" || briefAiStatus === "UNAVAILABLE" || briefAiStatus === "NOT_REQUESTED") {
        return { label: "Generate brief", tone: "warning" };
      }
      return { label: "Generate brief", tone: "warning" };
    }

    case "RESEARCHED":
      if ((lead.opportunityScore ?? 0) >= 75) {
        return { label: "Qualify prospect", tone: "success" };
      }
      return { label: "Check service fit", tone: "warning" };

    case "NEW":
    default: {
      switch (lead.auditStatus) {
        case "NOT_AUDITED":
          return { label: "Run audit", tone: "neutral" };
        case "QUEUED":
          return { label: "Audit queued", tone: "neutral" };
        case "RUNNING":
          return { label: "Auditing...", tone: "neutral" };
        case "SKIPPED_NO_WEBSITE":
          return { label: "Pitch web design", tone: "primary" };
        case "UNREACHABLE":
        case "BLOCKED":
        case "LOW_TEXT":
        case "SKIPPED_BY_ROBOTS":
          return { label: "Manual review", tone: "warning" };
        case "FAILED":
          return { label: "Retry audit", tone: "danger" };
        case "COMPLETED":
        case "PARTIALLY_COMPLETED":
          return { label: "Review findings", tone: "primary" };
        case "PENDING":
        case "SKIPPED_BUDGET":
        case "SKIPPED_NOT_OWNED_SITE":
        default:
          return { label: "Run research", tone: "neutral" };
      }
    }
  }
}

// ---------------------------------------------------------------------------
// LeadService
// ---------------------------------------------------------------------------
export class LeadService {
  private readonly creditService: CreditService;

  constructor(
    private readonly repository: CampaignRepository,
    private readonly auditScheduler?: AuditScheduler,
    creditService?: CreditService
  ) {
    this.creditService = creditService ?? new CreditService(repository.prisma);
  }

  async list(
    organizationId: string,
    campaignId: string,
    query: LeadsQuery,
  ): Promise<LeadsSummaryResult & { rows: (LeadSummaryRow & { nextAction: ReturnType<typeof computeNextAction> })[] }> {
    const result = await this.repository.getLeadsSummary(organizationId, campaignId, {
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      prospectStatus: query.prospectStatus,
      scoreMin: query.scoreMin,
      scoreMax: query.scoreMax,
      tagIds: query.tagIds,
      archived: query.archived,
      savedOnly: query.savedOnly,
    });
    return {
      total: result.total,
      rows: result.rows.map((row) => ({
        ...row,
        nextAction: computeNextAction({
          archivedAt: row.archivedAt,
          prospectStatus: row.prospectStatus,
          opportunityScore: row.opportunityScore,
          auditStatus: row.auditStatus,
          aiStatus: row.aiStatus,
          brief: row.brief,
        }),
      })),
    };
  }

  async getDetail(organizationId: string, campaignId: string, leadId: string): Promise<LeadView> {
    const lead = await this.repository.getLeadDetail(organizationId, campaignId, leadId);
    if (!lead) throw new NotFoundError("Lead not found");
    return lead;
  }

  async update(
    organizationId: string,
    campaignId: string,
    leadId: string,
    input: UpdateLeadInput,
    userId: string,
  ): Promise<LeadView> {
    // Validate tag ownership before mutating
    if (input.tagIds?.length) {
      const ownedTags = await this.repository.prisma.prospectTag.findMany({
        where: { id: { in: input.tagIds }, organizationId },
        select: { id: true },
      });
      if (ownedTags.length !== input.tagIds.length) {
        throw new ForbiddenError("One or more tag IDs do not belong to this organization");
      }
    }

    // Validate status transition
    if (input.prospectStatus) {
      const current = await this.repository.prisma.campaignLead.findFirst({
        where: { id: leadId, campaignId, campaign: { organizationId } },
        select: { prospectStatus: true },
      });
      if (current && !isValidStatusTransition(current.prospectStatus, input.prospectStatus)) {
        throw new ConflictError(
          `Cannot transition prospect status from ${current.prospectStatus} to ${input.prospectStatus}`
        );
      }
    }

    const lead = await this.repository.updateLead(
      organizationId,
      campaignId,
      leadId,
      {
        prospectStatus: input.prospectStatus,
        notes: input.notes,
        savedAt: input.saved === true ? new Date() : input.saved === false ? null : undefined,
        savedByUserId: input.saved === true ? userId : input.saved === false ? null : undefined,
        archivedAt: input.archived === true ? new Date() : input.archived === false ? null : undefined,
        tagIds: input.tagIds,
      },
      userId
    );

    if (!lead) throw new NotFoundError("Lead not found");
    return lead;
  }

  async getActivity(
    organizationId: string,
    campaignId: string,
    leadId: string,
  ): Promise<Array<{
    id: string;
    action: string;
    previousState: unknown;
    newState: unknown;
    createdAt: string;
    userName: string | null;
  }>> {
    return this.repository.getActivityLogs(organizationId, campaignId, leadId);
  }

  async bulk(
    organizationId: string,
    campaignId: string,
    input: BulkLeadsInput,
    userId: string,
  ): Promise<{ updatedCount: number }> {
    try {
      return await this.repository.bulkUpdateLeads(organizationId, campaignId, input.leadIds, input.action, {
        prospectStatus: input.prospectStatus,
        tagIds: input.tagIds,
        userId,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.startsWith("FORBIDDEN:")) throw new ForbiddenError(msg.replace("FORBIDDEN: ", ""));
      throw err;
    }
  }

  async listTags(organizationId: string): Promise<TagView[]> {
    return this.repository.listTags(organizationId);
  }

  async createTag(organizationId: string, name: string): Promise<TagView> {
    try {
      return await this.repository.createTag(organizationId, name);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("Unique constraint") ||
        (err as { code?: string }).code === "P2002"
      ) {
        throw new ConflictError(`Tag "${name}" already exists`);
      }
      throw err;
    }
  }

  async deleteTag(organizationId: string, tagId: string): Promise<void> {
    const deleted = await this.repository.deleteTag(organizationId, tagId);
    if (!deleted) throw new NotFoundError("Tag not found");
  }

  async exportCsv(
    organizationId: string,
    campaignId: string,
    leadIds?: string[],
  ): Promise<string> {
    const rows = await this.repository.getLeadsForExport(organizationId, campaignId, leadIds);

    const headers = [
      "Business Name",
      "Website",
      "Website Class",
      "City",
      "Rating",
      "Review Count",
      "Score",
      "Prospect Status",
      "Next Action",
      "Audit Status",
      "Tags",
      "Notes",
      "Saved",
      "Archived",
    ];

    const lines = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) => {
        const nextAction = computeNextAction({
          archivedAt: r.archivedAt,
          prospectStatus: r.prospectStatus,
          opportunityScore: r.opportunityScore,
          auditStatus: r.auditStatus,
          aiStatus: r.aiStatus,
          brief: r.brief,
        });
        const cols = [
          csvSafe(r.business.name),
          csvSafe(r.business.websiteUrl),
          csvSafe(r.business.websiteClass),
          csvSafe(r.business.city),
          r.business.rating != null ? String(r.business.rating) : "",
          r.business.reviewCount != null ? String(r.business.reviewCount) : "",
          r.opportunityScore != null ? String(r.opportunityScore) : "",
          csvSafe(r.prospectStatus),
          csvSafe(nextAction.label),
          csvSafe(r.auditStatus),
          csvSafe(r.tags.map((t) => t.name).join("; ")),
          csvSafe(r.notes),
          r.savedAt ? "Yes" : "No",
          r.archivedAt ? "Yes" : "No",
        ];
        return cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
      }),
    ];

    return lines.join("\r\n");
  }

  // ---------------------------------------------------------------------------
  // Selective Auditing & AI Briefs (Phase 1 Decoupled Execution)
  // ---------------------------------------------------------------------------

  async runAudit(
    organizationId: string,
    campaignId: string,
    input: SelectiveAuditInput,
    userId?: string,
    idempotencyKey?: string,
  ): Promise<{ batchId: string; scheduledLeads: number; queuedJobs: number; duplicate?: boolean }> {
    // --- Fix 3: Idempotency guard (double-click protection) ---
    if (idempotencyKey) {
      const existing = await this.repository.prisma.auditBatch.findUnique({
        where: { idempotencyKey },
        select: { id: true },
      });
      if (existing) {
        return { batchId: existing.id, scheduledLeads: 0, queuedJobs: 0, duplicate: true };
      }
    }

    const dedupedIds = [...new Set(input.leadIds)].sort();
    if (dedupedIds.length === 0) {
      throw new BadRequestError("At least one lead ID must be provided");
    }

    // Verify all leadIds belong to this campaign and organization
    const owned = await this.repository.prisma.campaignLead.findMany({
      where: { id: { in: dedupedIds }, campaignId, campaign: { organizationId } },
      select: { id: true, auditStatus: true },
    });
    if (owned.length !== dedupedIds.length) {
      throw new ForbiddenError("One or more lead IDs do not belong to this campaign");
    }

    // Guard against re-auditing leads that are already actively processing in another batch
    const inFlight = owned.filter(
      (l) => l.auditStatus === "QUEUED" || l.auditStatus === "RUNNING" || l.auditStatus === "PENDING"
    );
    if (inFlight.length > 0) {
      throw new ConflictError(
        `Cannot start audit for leads currently in progress (${inFlight.map((l) => l.id).join(", ")}). Please wait for active audits to complete.`
      );
    }

    // Deterministic row locking in strictly ascending ID order to prevent deadlocks
    await this.repository.prisma.$transaction(async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT id FROM "campaign_lead" WHERE id IN (${Prisma.join(dedupedIds)}) ORDER BY id ASC FOR UPDATE`
      );
    });

    const estimatedUnits = dedupedIds.length;

    // --- Fix 1 step (a): Reserve credits atomically (already its own tx) ---
    const reservation = await this.creditService.reserveCredits(organizationId, dedupedIds, {
      campaignId,
      reason: `Reserved ${estimatedUnits} RU for selective prospect audit (${dedupedIds.length} leads)`,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    });

    const toolsRequested = (input.tools ?? ["CRAWL", "PERFORMANCE"]).map((t) =>
      t === "CRAWL" ? AuditModule.TECHNOLOGY : AuditModule.PERFORMANCE
    );

    if (!this.auditScheduler) {
      throw new Error("AuditScheduler not configured");
    }

    // Fetch lead+business data needed for job creation (outside tx to avoid unnecessary lock duration)
    const leads = await this.repository.prisma.campaignLead.findMany({
      where: { id: { in: dedupedIds } },
      include: { business: { select: { websiteUrl: true } } },
      orderBy: { id: "asc" },
    });

    // --- Fix 1 step (b): Atomically create AuditBatch + Job rows + update CampaignLead.auditStatus ---
    // This is the outbox pattern: AuditBatch and Job rows commit atomically.
    // If the server crashes after this tx commits but before dispatch, the
    // JobDispatcher polling sweep will re-dispatch any PENDING jobs on restart.
    const { batchId, jobIds, scheduledLeads } = await this.repository.prisma.$transaction(async (tx) => {
      // Create AuditBatch (Fix 3: store idempotencyKey; store topNBriefsCount)
      const batch = await tx.auditBatch.create({
        data: {
          organizationId,
          campaignId,
          requestedByUserId: userId || null,
          leadCount: dedupedIds.length,
          toolsRequested,
          generateAiBrief: input.generateAiBrief ?? false,
          unitsEstimated: new Prisma.Decimal(estimatedUnits),
          reservationId: reservation.id,
          status: "PROCESSING",
          ...(idempotencyKey ? { idempotencyKey } : {}),
          ...(input.topNBriefsCount !== undefined && { topNBriefsCount: input.topNBriefsCount }),
        },
      });

      // Link leads specifically to this batch for strict batch scoping
      await tx.campaignLead.updateMany({
        where: { id: { in: dedupedIds } },
        data: { auditBatchId: batch.id },
      });

      // Create Job rows atomically inside the same tx (outbox pattern — no dispatch here)
      // When topNBriefsCount is set, don't mark any leads as AI-queued upfront;
      // the join-barrier finalizer selects top-N after all leads complete.
      const { jobIds, scheduledLeads } = await this.auditScheduler!.createJobRows(
        tx,
        campaignId,
        organizationId,
        leads,
        {
          tools: input.tools ?? ["CRAWL", "PERFORMANCE"],
          generateAiBrief: input.topNBriefsCount !== undefined ? false : (input.generateAiBrief ?? false),
          aiBriefLeadIds: input.topNBriefsCount !== undefined ? [] : input.aiBriefLeadIds,
        }
      );

      // Record activity logs atomically in the same tx
      await tx.leadActivityLog.createMany({
        data: dedupedIds.map((leadId) => ({
          organizationId,
          leadId,
          userId: userId || null,
          action: "AUDIT_REQUESTED",
          newState: {
            tools: input.tools ?? ["CRAWL", "PERFORMANCE"],
            generateAiBrief: input.generateAiBrief ?? false,
            batchId: batch.id,
          },
        })),
      });

      return { batchId: batch.id, jobIds, scheduledLeads };
    });

    // --- Fix 1 step (c): Dispatch jobs AFTER the transaction commits ---
    // If this crashes, the outbox sweep (JobDispatcher.sweep) will re-dispatch PENDING jobs.
    await this.auditScheduler.dispatchJobs(jobIds);

    return { batchId, scheduledLeads, queuedJobs: jobIds.length };
  }

  async listAuditBatches(organizationId: string, campaignId: string) {
    const campaign = await this.repository.prisma.campaign.findUnique({
      where: { id: campaignId, organizationId },
      select: { id: true },
    });
    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    return this.repository.prisma.auditBatch.findMany({
      where: { campaignId, organizationId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  async generateBriefs(
    organizationId: string,
    campaignId: string,
    leadIds: string[],
    userId?: string,
  ): Promise<{
    queuedCount: number;
    reservationId?: string;
    unitsEstimated?: number;
    message: string;
    skipped?: Array<{ leadId: string; reason: string }>;
  }> {
    const dedupedIds = [...new Set(leadIds)].sort();
    if (dedupedIds.length === 0) {
      throw new BadRequestError("At least one lead ID must be provided");
    }

    // Verify all leadIds belong to this campaign and organization
    const owned = await this.repository.prisma.campaignLead.findMany({
      where: { id: { in: dedupedIds }, campaignId, campaign: { organizationId } },
      select: {
        id: true,
        auditStatus: true,
        aiStatus: true,
        business: {
          select: {
            name: true,
            websiteUrl: true,
            websiteClass: true,
          },
        },
      },
    });
    if (owned.length !== dedupedIds.length) {
      throw new ForbiddenError("One or more lead IDs do not belong to this campaign");
    }

    // Classify eligibility with clear reasons
    const skipped: Array<{ leadId: string; reason: string }> = [];

    for (const lead of owned) {
      if (!lead.business?.websiteUrl || lead.business.websiteClass !== "OWNED_SITE" || lead.auditStatus === "SKIPPED_NO_WEBSITE") {
        skipped.push({
          leadId: lead.id,
          reason: "Lead has no website (sales brief requires an active website to analyze)",
        });
      } else if (
        lead.auditStatus === "QUEUED" ||
        lead.auditStatus === "RUNNING" ||
        lead.auditStatus === "PENDING" ||
        lead.aiStatus === "QUEUED" ||
        lead.aiStatus === "PENDING"
      ) {
        skipped.push({
          leadId: lead.id,
          reason: "An audit or AI brief is already actively in progress",
        });
      } else if (
        lead.auditStatus === "UNREACHABLE" ||
        lead.auditStatus === "BLOCKED" ||
        lead.auditStatus === "SKIPPED_BUDGET"
      ) {
        skipped.push({
          leadId: lead.id,
          reason: `Lead website could not be audited (${lead.auditStatus})`,
        });
      }
    }

    const skippedIdSet = new Set(skipped.map((s) => s.leadId));
    const eligible = owned.filter((l) => !skippedIdSet.has(l.id));

    // If no leads are eligible, avoid silent queuedCount: 0 failure
    if (eligible.length === 0) {
      const primaryReason = skipped[0]?.reason ?? "prospects are not eligible";
      const message =
        dedupedIds.length === 1
          ? `0 briefs queued: 1 lead was skipped because ${primaryReason.toLowerCase()}`
          : `0 briefs queued: ${skipped.length} leads were skipped (${primaryReason.toLowerCase()})`;

      return {
        queuedCount: 0,
        message,
        skipped,
      };
    }

    const eligibleIds = eligible.map((l) => l.id).sort();

    // Deterministic row locking in strictly ascending ID order
    await this.repository.prisma.$transaction(async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT id FROM "campaign_lead" WHERE id IN (${Prisma.join(eligibleIds)}) ORDER BY id ASC FOR UPDATE`
      );
    });

    // Record activity logs
    await this.repository.prisma.leadActivityLog.createMany({
      data: eligibleIds.map((leadId) => ({
        organizationId,
        leadId,
        userId: userId || null,
        action: "BRIEF_REQUESTED",
        newState: { requestedAt: new Date().toISOString() },
      })),
    });

    // Separate leads that have already completed an audit vs. unaudited leads
    const unaudited = eligible.filter((l) => l.auditStatus === "NOT_AUDITED");
    const readyForBrief = eligible.filter((l) =>
      ["COMPLETED", "PARTIALLY_COMPLETED", "FAILED"].includes(l.auditStatus)
    );

    let queuedCount = 0;
    let reservationId: string | undefined;
    let unitsEstimated = 0;

    // 1. If any leads are unaudited, trigger technical audit with AI brief generation enabled
    if (unaudited.length > 0) {
      const auditResult = await this.runAudit(
        organizationId,
        campaignId,
        {
          leadIds: unaudited.map((l) => l.id),
          tools: ["CRAWL", "PERFORMANCE"],
          generateAiBrief: true,
        },
        userId
      );
      queuedCount += auditResult.scheduledLeads;
      const batch = await this.repository.prisma.auditBatch.findUnique({
        where: { id: auditResult.batchId },
        select: { reservationId: true, unitsEstimated: true },
      });
      if (batch?.reservationId) reservationId = batch.reservationId;
      if (batch?.unitsEstimated) unitsEstimated += Number(batch.unitsEstimated);
    }

    // 2. If any leads are already audited (COMPLETED, PARTIALLY_COMPLETED, FAILED), schedule AI brief directly
    if (readyForBrief.length > 0) {
      const readyIds = readyForBrief.map((l) => l.id);
      const existingItems = await this.repository.prisma.reservationItem.findMany({
        where: {
          leadId: { in: readyIds },
          status: { in: ["RESERVED", "COMMITTED"] },
        },
        select: { leadId: true },
      });
      const coveredLeadIds = new Set(existingItems.map((i) => i.leadId));
      const leadsNeedingReservation = readyIds.filter((id) => !coveredLeadIds.has(id));

      if (leadsNeedingReservation.length > 0) {
        const reservation = await this.creditService.reserveCredits(
          organizationId,
          leadsNeedingReservation,
          {
            campaignId,
            reason: `Reserved ${leadsNeedingReservation.length} RU for AI sales brief synthesis`,
          }
        );
        reservationId = reservation.id;
        unitsEstimated += leadsNeedingReservation.length;
      }

      if (!this.auditScheduler) {
        throw new Error("AuditScheduler not configured");
      }

      const result = await this.auditScheduler.scheduleAiBriefs(campaignId, readyIds);
      queuedCount += result.queuedCount;
    }

    let message = `Successfully queued AI sales brief synthesis for ${queuedCount} lead${queuedCount > 1 ? "s" : ""}.`;
    if (skipped.length > 0) {
      const reasonText = skipped[0]?.reason?.toLowerCase() ?? "not eligible";
      message += ` (${skipped.length} lead${skipped.length > 1 ? "s were" : " was"} skipped: ${reasonText})`;
    }

    return {
      queuedCount,
      reservationId,
      unitsEstimated,
      message,
      skipped,
    };
  }
}

