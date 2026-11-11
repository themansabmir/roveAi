import { ForbiddenError, NotFoundError, ConflictError } from "@core/errors";
import { ProspectStatus } from "@prisma/client";
import { CampaignRepository, LeadSummaryRow, LeadView, LeadsSummaryResult, TagView } from "./campaign.repository";
import { BulkLeadsInput, LeadsQuery, UpdateLeadInput } from "./lead.schemas";

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
      if (briefAiStatus === "PENDING") return { label: "Brief generating", tone: "neutral" };
      if (briefAiStatus === "SKIPPED_GATE" || briefAiStatus === "UNAVAILABLE") {
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
  constructor(private readonly repository: CampaignRepository) {}

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
}

