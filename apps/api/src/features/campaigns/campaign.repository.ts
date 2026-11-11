import {
  AiStatus,
  AuditStatus,
  CampaignStatus,
  Prisma,
  PrismaClient,
  ProspectStatus,
  QualificationStatus,
  WebsiteClass,
  WebsiteFilter,
} from "@prisma/client";
import { claimJob, JobClaim, releaseJob as releaseJobLock } from "@features/jobs/job-lock";
import { DISCOVER_QUEUE } from "@plugins/queue/queue.types";
import { loadConfig } from "@core/config";
import { hostOf } from "./normalize";

// export const MAPS_PROVIDER = "outscraper";
export const MAPS_PROVIDER = "apify";
export { DISCOVER_QUEUE };

const IN_FLIGHT: CampaignStatus[] = ["QUEUED", "DISCOVERING", "PROCESSING"];

export interface CampaignSummary {
  id: string;
  niche: string;
  serviceType: string;
  city: string;
  region: string;
  country: string;
  maxLeads: number;
  status: CampaignStatus;
  leadCount: number;
  createdAt: string;
}

export interface AuditFindingView {
  id: string;
  code: string;
  severity: string;
  source: string;
  confidence: number;
  message: string;
  evidence: unknown;
}

export interface TechnicalAuditView {
  id: string;
  module: string;
  status: string;
  score: number | null;
  metrics: unknown;
  toolName: string | null;
  deviceProfile: string | null;
  observedAt: string;
  findings: AuditFindingView[];
}

export interface BriefView {
  id: string;
  status: string;
  aiStatus: string;
  headlineOpportunity: string | null;
  suggestedService: string | null;
  confidence: string;
  valueProposition: string | null;
  outreachAngle: string | null;
  coldEmailDraft: string | null;
  callScriptDraft: string | null;
  content: unknown;
  modelName: string | null;
}

export interface LeadView {
  id: string;
  qualificationStatus: QualificationStatus;
  auditStatus: AuditStatus;
  aiStatus: AiStatus;
  prospectStatus: ProspectStatus;
  opportunityScore: number | null;
  scoreBreakdown?: unknown;
  notes: string | null;
  savedAt: string | null;
  archivedAt: string | null;
  tags: { id: string; name: string }[];
  business: {
    id: string;
    name: string;
    city: string | null;
    rating: number | null;
    reviewCount: number | null;
    websiteUrl: string | null;
    websiteClass: WebsiteClass;
  };
  audits: TechnicalAuditView[];
  brief: BriefView | null;
}

export interface JobView {
  id: string;
  status: string;
  attemptCount: number;
}

/** Lightweight row for the prospect table (no findings trees). */
export interface LeadSummaryRow {
  id: string;
  qualificationStatus: QualificationStatus;
  auditStatus: AuditStatus;
  aiStatus: AiStatus;
  prospectStatus: ProspectStatus;
  opportunityScore: number | null;
  scoreBreakdown: unknown;
  notes: string | null;
  savedAt: string | null;
  archivedAt: string | null;
  tags: { id: string; name: string }[];
  business: {
    id: string;
    name: string;
    city: string | null;
    rating: number | null;
    reviewCount: number | null;
    websiteUrl: string | null;
    websiteClass: WebsiteClass;
  };
  /** Audit summary (no findings). */
  audits: { id: string; module: string; status: string; score: number | null }[];
  brief: { id: string; aiStatus: string; headlineOpportunity: string | null } | null;
}

export interface TagView {
  id: string;
  name: string;
  leadCount: number;
}

export interface LeadsSummaryResult {
  rows: LeadSummaryRow[];
  total: number;
}

export interface CampaignDetail extends CampaignSummary {
  minRating: number | null;
  minReviewCount: number | null;
  websiteFilter: "owned" | "missing" | "either";
  exclusionDomains: string[];
  job: JobView | null;
  leads: LeadView[];
}

export interface DiscoveryCampaign {
  id: string;
  organizationId: string;
  niche: string;
  serviceType: string;
  city: string;
  region: string;
  country: string;
  maxLeads: number;
  minRating: number | null;
  minReviewCount: number | null;
  websiteFilter: WebsiteFilter;
  status: CampaignStatus;
  exclusionDomains: string[];
}

export function startOfUtcMonth(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

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
      score: true,
    },
  },
} satisfies Prisma.CampaignInclude;

type DetailRow = Prisma.CampaignGetPayload<{ include: typeof detailInclude }>;

export class CampaignRepository {
  constructor(public readonly prisma: PrismaClient) { }

  async list(organizationId: string): Promise<CampaignSummary[]> {
    const rows = await this.prisma.campaign.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { leads: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      niche: row.niche,
      serviceType: row.serviceType,
      city: row.city,
      region: row.region,
      country: row.country,
      maxLeads: row.maxLeads,
      status: row.status,
      leadCount: row._count.leads,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async getDetail(organizationId: string, campaignId: string): Promise<CampaignDetail | null> {
    const row = await this.prisma.campaign.findFirst({
      where: { id: campaignId, organizationId },
      include: detailInclude,
    });
    return row ? toDetail(row) : null;
  }

  async create(input: {
    organizationId: string;
    niche: string;
    serviceType: string;
    city: string;
    region: string;
    country: string;
    maxLeads: number;
    minRating: number | null;
    minReviewCount: number | null;
    websiteFilter: WebsiteFilter;
    exclusionDomains: string[];
  }): Promise<CampaignDetail> {
    const row = await this.prisma.campaign.create({
      data: {
        organizationId: input.organizationId,
        niche: input.niche,
        serviceType: input.serviceType,
        city: input.city,
        region: input.region,
        country: input.country,
        maxLeads: input.maxLeads,
        minRating: input.minRating,
        minReviewCount: input.minReviewCount,
        websiteFilter: input.websiteFilter,
        exclusions: {
          create: input.exclusionDomains.map((domain) => ({ domain })),
        },
      },
      include: detailInclude,
    });
    return toDetail(row);
  }

  async mapsUsedThisMonth(organizationId: string, now = new Date()): Promise<number> {
    const aggregate = await this.prisma.usageEvent.aggregate({
      where: {
        organizationId,
        kind: "MAPS_RECORD",
        createdAt: { gte: startOfUtcMonth(now) },
      },
      _sum: { quantity: true },
    });
    return aggregate._sum.quantity ?? 0;
  }

  async mapsRecordLimit(organizationId: string): Promise<number> {
    const organization = await this.prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
      select: { mapsRecordLimit: true },
    });
    return organization.mapsRecordLimit;
  }

  async claimRun(organizationId: string, campaignId: string): Promise<"claimed" | "busy" | "missing"> {
    const existing = await this.prisma.campaign.findFirst({
      where: { id: campaignId, organizationId },
      select: { id: true },
    });
    if (!existing) return "missing";

    const claimed = await this.prisma.campaign.updateMany({
      where: {
        id: campaignId,
        organizationId,
        status: { notIn: IN_FLIGHT },
      },
      data: { status: "QUEUED" },
    });
    return claimed.count === 1 ? "claimed" : "busy";
  }

  async latestJob(campaignId: string): Promise<JobView | null> {
    const job = await this.prisma.job.findFirst({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    });
    return job ? { id: job.id, status: job.status, attemptCount: job.attemptCount } : null;
  }

  async createJob(campaignId: string, organizationId: string): Promise<JobView> {
    const job = await this.prisma.job.create({
      data: { campaignId, organizationId, kind: "DISCOVER", status: "PENDING" },
    });
    return { id: job.id, status: job.status, attemptCount: job.attemptCount };
  }

  async setQueueJobId(jobId: string, queueJobId: string): Promise<void> {
    await this.prisma.job.update({ where: { id: jobId }, data: { queueJobId, dispatchedAt: new Date() } });
  }

  async cancel(organizationId: string, campaignId: string): Promise<CampaignDetail | null> {
    const existing = await this.getDetail(organizationId, campaignId);
    if (!existing) return null;
    if (existing.status === "COMPLETED" || existing.status === "FAILED" || existing.status === "CANCELLED") {
      return existing;
    }
    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "CANCELLED" },
    });
    await this.prisma.job.updateMany({
      where: { campaignId, status: { in: ["PENDING", "PROCESSING"] } },
      data: { status: "CANCELLED" },
    });
    return this.getDetail(organizationId, campaignId);
  }

  async loadForDiscovery(campaignId: string): Promise<DiscoveryCampaign | null> {
    const row = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { exclusions: true },
    });
    if (!row) return null;
    return {
      id: row.id,
      organizationId: row.organizationId,
      niche: row.niche,
      serviceType: row.serviceType,
      city: row.city,
      region: row.region,
      country: row.country,
      maxLeads: row.maxLeads,
      minRating: row.minRating,
      minReviewCount: row.minReviewCount,
      websiteFilter: row.websiteFilter,
      status: row.status,
      exclusionDomains: row.exclusions.map((entry) => entry.domain),
    };
  }

  async markDiscovering(campaignId: string): Promise<boolean> {
    const updated = await this.prisma.campaign.updateMany({
      where: { id: campaignId, status: { in: ["QUEUED", "PAUSED", "DISCOVERING", "PROCESSING"] } },
      data: { status: "DISCOVERING" },
    });
    return updated.count === 1;
  }

  async campaignStatus(campaignId: string): Promise<CampaignStatus | null> {
    const row = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { status: true },
    });
    return row?.status ?? null;
  }

  async countLeads(campaignId: string): Promise<number> {
    return this.prisma.campaignLead.count({ where: { campaignId } });
  }

  async setCampaignStatus(campaignId: string, status: CampaignStatus): Promise<void> {
    await this.prisma.campaign.updateMany({
      where: { id: campaignId, status: { not: "CANCELLED" } },
      data: { status },
    });
  }

  async beginJob(jobId: string): Promise<JobClaim> {
    return claimJob(this.prisma, jobId, loadConfig().JOB_TIMEOUT_MS);
  }

  async releaseJob(jobId: string): Promise<void> {
    await releaseJobLock(this.prisma, jobId);
  }

  async setJobStatus(jobId: string, status: "COMPLETED" | "FAILED" | "CANCELLED"): Promise<void> {
    await this.prisma.job.updateMany({
      where: { id: jobId, status: { notIn: ["CANCELLED", "COMPLETED", "FAILED"] } },
      data: { status },
    });
  }

  async saveLead(input: {
    organizationId: string;
    campaignId: string;
    providerId: string;
    name: string;
    normalizedName: string;
    phone: string | null;
    normalizedPhone: string | null;
    address: string | null;
    city: string | null;
    identityCity: string | null;
    region: string | null;
    country: string | null;
    rating: number | null;
    reviewCount: number | null;
    websiteUrl: string | null;
    websiteClass: WebsiteClass;
    qualificationStatus: QualificationStatus;
    auditStatus: AuditStatus;
  }): Promise<boolean> {
    const domain = hostOf(input.websiteUrl);
    const existingByProvider = await this.prisma.business.findUnique({
      where: {
        organizationId_provider_providerId: {
          organizationId: input.organizationId,
          provider: MAPS_PROVIDER,
          providerId: input.providerId,
        },
      },
    });

    const existingByIdentity = existingByProvider
      ? existingByProvider
      : await this.prisma.business.findFirst({
        where: {
          organizationId: input.organizationId,
          normalizedName: input.normalizedName,
          normalizedPhone: input.normalizedPhone,
          ...(input.identityCity
            ? { city: { equals: input.identityCity, mode: "insensitive" } }
            : { city: null }),
        },
      });

    let business = existingByIdentity;
    if (!business) {
      try {
        business = await this.prisma.business.create({
          data: {
            organizationId: input.organizationId,
            provider: MAPS_PROVIDER,
            providerId: input.providerId,
            name: input.name.slice(0, 255),
            normalizedName: input.normalizedName,
            phone: input.phone,
            normalizedPhone: input.normalizedPhone,
            address: input.address,
            city: input.city,
            region: input.region,
            country: input.country,
            rating: input.rating,
            reviewCount: input.reviewCount,
            websiteUrl: input.websiteUrl,
            normalizedDomain: domain,
            websiteClass: input.websiteClass,
          },
        });
      } catch (err) {
        if (!isUniqueViolation(err)) throw err;
        const raced = await this.prisma.business.findUnique({
          where: {
            organizationId_provider_providerId: {
              organizationId: input.organizationId,
              provider: MAPS_PROVIDER,
              providerId: input.providerId,
            },
          },
        });
        if (!raced) throw err;
        business = raced;
      }
    }

    try {
      await this.prisma.campaignLead.create({
        data: {
          campaignId: input.campaignId,
          businessId: business.id,
          qualificationStatus: input.qualificationStatus,
          auditStatus: input.auditStatus,
        },
      });
    } catch (err) {
      if (isUniqueViolation(err)) return false;
      throw err;
    }

    await this.prisma.usageEvent.create({
      data: {
        organizationId: input.organizationId,
        campaignId: input.campaignId,
        kind: "MAPS_RECORD",
        quantity: 1,
      },
    });
    return true;
  }

  // ---------------------------------------------------------------------------
  // Prospect workspace — leads list (lightweight, paginated)
  // ---------------------------------------------------------------------------

  async getLeadsSummary(
    organizationId: string,
    campaignId: string,
    opts: {
      page: number;
      pageSize: number;
      search?: string;
      prospectStatus?: ProspectStatus;
      scoreMin?: number;
      scoreMax?: number;
      tagIds?: string[];
      archived: boolean;
      savedOnly: boolean;
    },
  ): Promise<LeadsSummaryResult> {
    const where: Prisma.CampaignLeadWhereInput = {
      campaignId,
      campaign: { organizationId },
      archivedAt: opts.archived ? { not: null } : null,
      ...(opts.savedOnly ? { savedAt: { not: null } } : {}),
      ...(opts.prospectStatus ? { prospectStatus: opts.prospectStatus } : {}),
      ...(opts.scoreMin != null || opts.scoreMax != null
        ? {
            opportunityScore: {
              ...(opts.scoreMin != null ? { gte: opts.scoreMin } : {}),
              ...(opts.scoreMax != null ? { lte: opts.scoreMax } : {}),
            },
          }
        : {}),
      ...(opts.tagIds?.length
        ? { tags: { some: { tagId: { in: opts.tagIds } } } }
        : {}),
      ...(opts.search
        ? {
            business: {
              OR: [
                { name: { contains: opts.search, mode: "insensitive" as const } },
                { city: { contains: opts.search, mode: "insensitive" as const } },
                { normalizedDomain: { contains: opts.search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.campaignLead.findMany({
        where,
        orderBy: { opportunityScore: "desc" },
        skip: (opts.page - 1) * opts.pageSize,
        take: opts.pageSize,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              city: true,
              rating: true,
              reviewCount: true,
              websiteUrl: true,
              websiteClass: true,
            },
          },
          audits: {
            select: { id: true, module: true, status: true, score: true },
            orderBy: { createdAt: "asc" as const },
          },
          brief: {
            select: { id: true, aiStatus: true, headlineOpportunity: true },
          },
          tags: { include: { tag: { select: { id: true, name: true } } } },
          score: { select: { breakdown: true } },
        },
      }),
      this.prisma.campaignLead.count({ where }),
    ]);

    return {
      total,
      rows: rows.map((r) => ({
        id: r.id,
        qualificationStatus: r.qualificationStatus,
        auditStatus: r.auditStatus,
        aiStatus: r.aiStatus,
        prospectStatus: r.prospectStatus,
        opportunityScore: r.opportunityScore,
        scoreBreakdown: r.score?.breakdown ?? null,
        notes: r.notes,
        savedAt: r.savedAt?.toISOString() ?? null,
        archivedAt: r.archivedAt?.toISOString() ?? null,
        tags: r.tags.map((lt) => ({ id: lt.tag.id, name: lt.tag.name })),
        business: r.business,
        audits: r.audits,
        brief: r.brief
          ? {
              id: r.brief.id,
              aiStatus: r.brief.aiStatus,
              headlineOpportunity: r.brief.headlineOpportunity,
            }
          : null,
      })),
    };
  }

  // ---------------------------------------------------------------------------
  // Single lead detail (full — includes findings for the drawer)
  // ---------------------------------------------------------------------------

  async getLeadDetail(organizationId: string, campaignId: string, leadId: string): Promise<LeadView | null> {
    const r = await this.prisma.campaignLead.findFirst({
      where: { id: leadId, campaignId, campaign: { organizationId } },
      include: {
        business: true,
        audits: {
          include: { findings: true },
          orderBy: { createdAt: "asc" as const },
        },
        brief: true,
        score: true,
        tags: { include: { tag: { select: { id: true, name: true } } } },
      },
    });
    if (!r) return null;
    return {
      id: r.id,
      qualificationStatus: r.qualificationStatus,
      auditStatus: r.auditStatus,
      aiStatus: r.aiStatus,
      prospectStatus: r.prospectStatus,
      opportunityScore: r.opportunityScore,
      scoreBreakdown: r.score?.breakdown ?? null,
      notes: r.notes,
      savedAt: r.savedAt?.toISOString() ?? null,
      archivedAt: r.archivedAt?.toISOString() ?? null,
      tags: r.tags.map((lt) => ({ id: lt.tag.id, name: lt.tag.name })),
      business: {
        id: r.business.id,
        name: r.business.name,
        city: r.business.city,
        rating: r.business.rating,
        reviewCount: r.business.reviewCount,
        websiteUrl: r.business.websiteUrl,
        websiteClass: r.business.websiteClass,
      },
      audits: r.audits.map((a) => ({
        id: a.id,
        module: a.module,
        status: a.status,
        score: a.score,
        metrics: a.metrics,
        toolName: a.toolName,
        deviceProfile: a.deviceProfile,
        observedAt: a.observedAt.toISOString(),
        findings: a.findings.map((f) => ({
          id: f.id,
          code: f.code,
          severity: f.severity,
          source: f.source,
          confidence: f.confidence,
          message: f.message,
          evidence: f.evidence,
        })),
      })),
      brief: r.brief
        ? {
            id: r.brief.id,
            status: r.brief.status,
            aiStatus: r.brief.aiStatus,
            headlineOpportunity: r.brief.headlineOpportunity,
            suggestedService: r.brief.suggestedService,
            confidence: r.brief.confidence,
            valueProposition: r.brief.valueProposition,
            outreachAngle: r.brief.outreachAngle,
            coldEmailDraft: r.brief.coldEmailDraft,
            callScriptDraft: r.brief.callScriptDraft,
            content: r.brief.content,
            modelName: r.brief.modelName,
          }
        : null,
    };
  }

  // ---------------------------------------------------------------------------
  // Single lead update
  // ---------------------------------------------------------------------------

  async updateLead(
    organizationId: string,
    campaignId: string,
    leadId: string,
    patch: {
      prospectStatus?: ProspectStatus;
      notes?: string;
      savedAt?: Date | null;
      savedByUserId?: string | null;
      archivedAt?: Date | null;
      tagIds?: string[];
    },
  ): Promise<LeadView | null> {
    // Verify ownership
    const existing = await this.prisma.campaignLead.findFirst({
      where: { id: leadId, campaignId, campaign: { organizationId } },
      select: { id: true },
    });
    if (!existing) return null;

    await this.prisma.$transaction(async (tx) => {
      await tx.campaignLead.update({
        where: { id: leadId },
        data: {
          ...(patch.prospectStatus != null ? { prospectStatus: patch.prospectStatus } : {}),
          ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
          ...(patch.savedAt !== undefined ? { savedAt: patch.savedAt, savedByUserId: patch.savedByUserId ?? null } : {}),
          ...(patch.archivedAt !== undefined ? { archivedAt: patch.archivedAt } : {}),
        },
      });

      if (patch.tagIds !== undefined) {
        await tx.leadTag.deleteMany({ where: { leadId } });
        if (patch.tagIds.length > 0) {
          await tx.leadTag.createMany({
            data: patch.tagIds.map((tagId) => ({ leadId, tagId })),
            skipDuplicates: true,
          });
        }
      }
    });

    return this.getLeadDetail(organizationId, campaignId, leadId);
  }

  // ---------------------------------------------------------------------------
  // Bulk update — atomic with pre-flight ownership validation
  // ---------------------------------------------------------------------------

  async bulkUpdateLeads(
    organizationId: string,
    campaignId: string,
    leadIds: string[],
    action: string,
    opts: { prospectStatus?: ProspectStatus; tagIds?: string[]; userId?: string },
  ): Promise<{ updatedCount: number }> {
    const dedupedIds = [...new Set(leadIds)];

    // Pre-flight: verify all leadIds belong to this campaign/org
    const owned = await this.prisma.campaignLead.findMany({
      where: { id: { in: dedupedIds }, campaignId, campaign: { organizationId } },
      select: { id: true },
    });
    if (owned.length !== dedupedIds.length) {
      throw new Error("FORBIDDEN: one or more lead IDs do not belong to this campaign");
    }

    // If tags involved, verify ownership
    if (opts.tagIds?.length) {
      const ownedTags = await this.prisma.prospectTag.findMany({
        where: { id: { in: opts.tagIds }, organizationId },
        select: { id: true },
      });
      if (ownedTags.length !== opts.tagIds.length) {
        throw new Error("FORBIDDEN: one or more tag IDs do not belong to this organization");
      }
    }

    await this.prisma.$transaction(async (tx) => {
      switch (action) {
        case "UPDATE_STATUS":
          await tx.campaignLead.updateMany({
            where: { id: { in: dedupedIds } },
            data: { prospectStatus: opts.prospectStatus },
          });
          break;
        case "ADD_TAGS":
          for (const leadId of dedupedIds) {
            await tx.leadTag.createMany({
              data: (opts.tagIds ?? []).map((tagId) => ({ leadId, tagId })),
              skipDuplicates: true,
            });
          }
          break;
        case "REMOVE_TAGS":
          await tx.leadTag.deleteMany({
            where: { leadId: { in: dedupedIds }, tagId: { in: opts.tagIds ?? [] } },
          });
          break;
        case "SAVE":
          await tx.campaignLead.updateMany({
            where: { id: { in: dedupedIds } },
            data: { savedAt: new Date(), savedByUserId: opts.userId ?? null },
          });
          break;
        case "UNSAVE":
          await tx.campaignLead.updateMany({
            where: { id: { in: dedupedIds } },
            data: { savedAt: null, savedByUserId: null },
          });
          break;
        case "ARCHIVE":
          await tx.campaignLead.updateMany({
            where: { id: { in: dedupedIds } },
            data: { archivedAt: new Date() },
          });
          break;
        case "UNARCHIVE":
          await tx.campaignLead.updateMany({
            where: { id: { in: dedupedIds } },
            data: { archivedAt: null },
          });
          break;
      }
    });

    return { updatedCount: dedupedIds.length };
  }

  // ---------------------------------------------------------------------------
  // Tags CRUD
  // ---------------------------------------------------------------------------

  async listTags(organizationId: string): Promise<TagView[]> {
    const tags = await this.prisma.prospectTag.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      include: { _count: { select: { leads: true } } },
    });
    return tags.map((t) => ({ id: t.id, name: t.name, leadCount: t._count.leads }));
  }

  async createTag(organizationId: string, name: string): Promise<TagView> {
    const tag = await this.prisma.prospectTag.create({
      data: { organizationId, name },
      include: { _count: { select: { leads: true } } },
    });
    return { id: tag.id, name: tag.name, leadCount: tag._count.leads };
  }

  async deleteTag(organizationId: string, tagId: string): Promise<boolean> {
    const existing = await this.prisma.prospectTag.findFirst({
      where: { id: tagId, organizationId },
      select: { id: true },
    });
    if (!existing) return false;
    await this.prisma.prospectTag.delete({ where: { id: tagId } });
    return true;
  }

  // ---------------------------------------------------------------------------
  // CSV export (returns all matching rows — no pagination)
  // ---------------------------------------------------------------------------

  async getLeadsForExport(
    organizationId: string,
    campaignId: string,
    leadIds?: string[],
  ): Promise<LeadSummaryRow[]> {
    const where: Prisma.CampaignLeadWhereInput = {
      campaignId,
      campaign: { organizationId },
      ...(leadIds?.length ? { id: { in: leadIds } } : {}),
    };
    const rows = await this.prisma.campaignLead.findMany({
      where,
      orderBy: { opportunityScore: "desc" },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            city: true,
            rating: true,
            reviewCount: true,
            websiteUrl: true,
            websiteClass: true,
          },
        },
        audits: {
          select: { id: true, module: true, status: true, score: true },
        },
        brief: { select: { id: true, aiStatus: true, headlineOpportunity: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        score: { select: { breakdown: true } },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      qualificationStatus: r.qualificationStatus,
      auditStatus: r.auditStatus,
      aiStatus: r.aiStatus,
      prospectStatus: r.prospectStatus,
      opportunityScore: r.opportunityScore,
      scoreBreakdown: r.score?.breakdown ?? null,
      notes: r.notes,
      savedAt: r.savedAt?.toISOString() ?? null,
      archivedAt: r.archivedAt?.toISOString() ?? null,
      tags: r.tags.map((lt) => ({ id: lt.tag.id, name: lt.tag.name })),
      business: r.business,
      audits: r.audits,
      brief: r.brief
        ? {
            id: r.brief.id,
            aiStatus: r.brief.aiStatus,
            headlineOpportunity: r.brief.headlineOpportunity,
          }
        : null,
    }));
  }
}

function toDetail(row: DetailRow): CampaignDetail {
  const job = row.jobs[0];
  return {
    id: row.id,
    niche: row.niche,
    serviceType: row.serviceType,
    city: row.city,
    region: row.region,
    country: row.country,
    maxLeads: row.maxLeads,
    minRating: row.minRating,
    minReviewCount: row.minReviewCount,
    websiteFilter: fromFilter(row.websiteFilter),
    status: row.status,
    leadCount: row.leads.length,
    createdAt: row.createdAt.toISOString(),
    exclusionDomains: row.exclusions.map((entry) => entry.domain),
    job: job ? { id: job.id, status: job.status, attemptCount: job.attemptCount } : null,
    leads: row.leads.map((lead) => ({
      id: lead.id,
      qualificationStatus: lead.qualificationStatus,
      auditStatus: lead.auditStatus,
      aiStatus: lead.aiStatus,
      prospectStatus: lead.prospectStatus,
      opportunityScore: lead.opportunityScore,
      scoreBreakdown: lead.score?.breakdown ?? null,
      notes: lead.notes,
      savedAt: lead.savedAt?.toISOString() ?? null,
      archivedAt: lead.archivedAt?.toISOString() ?? null,
      tags: [],
      business: {
        id: lead.business.id,
        name: lead.business.name,
        city: lead.business.city,
        rating: lead.business.rating,
        reviewCount: lead.business.reviewCount,
        websiteUrl: lead.business.websiteUrl,
        websiteClass: lead.business.websiteClass,
      },
      audits: lead.audits.map((a) => ({
        id: a.id,
        module: a.module,
        status: a.status,
        score: a.score,
        metrics: a.metrics,
        toolName: a.toolName,
        deviceProfile: a.deviceProfile,
        observedAt: a.observedAt.toISOString(),
        findings: a.findings.map((f) => ({
          id: f.id,
          code: f.code,
          severity: f.severity,
          source: f.source,
          confidence: f.confidence,
          message: f.message,
          evidence: f.evidence,
        })),
      })),
      brief: lead.brief
        ? {
            id: lead.brief.id,
            status: lead.brief.status,
            aiStatus: lead.brief.aiStatus,
            headlineOpportunity: lead.brief.headlineOpportunity,
            suggestedService: lead.brief.suggestedService,
            confidence: lead.brief.confidence,
            valueProposition: lead.brief.valueProposition,
            outreachAngle: lead.brief.outreachAngle,
            coldEmailDraft: lead.brief.coldEmailDraft,
            callScriptDraft: lead.brief.callScriptDraft,
            content: lead.brief.content,
            modelName: lead.brief.modelName,
          }
        : null,
    })),
  };
}

function fromFilter(value: WebsiteFilter): "owned" | "missing" | "either" {
  if (value === "OWNED") return "owned";
  if (value === "MISSING") return "missing";
  return "either";
}
