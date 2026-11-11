import {
  AiStatus,
  AuditStatus,
  Business,
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
import { buildInitialEnrichmentState } from "@features/audits/evidence-state";

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

export interface SaveLeadInput {
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
}

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

  async saveLead(input: SaveLeadInput): Promise<boolean> {
    const saved = await this.saveLeadsBatch([input]);
    return saved > 0;
  }

  async saveLeadsBatch(inputs: SaveLeadInput[]): Promise<number> {
    const first = inputs[0];
    if (!first) return 0;

    const organizationId = first.organizationId;
    const campaignId = first.campaignId;

    // Deduplicate inputs in this batch by providerId
    const uniqueInputs: SaveLeadInput[] = [];
    const seenProviders = new Set<string>();
    for (const inp of inputs) {
      if (!seenProviders.has(inp.providerId)) {
        seenProviders.add(inp.providerId);
        uniqueInputs.push(inp);
      }
    }

    // 1. Batch fetch existing businesses by providerId in a single query
    const providerIds = uniqueInputs.map((i) => i.providerId);
    const existingByProvider = await this.prisma.business.findMany({
      where: {
        organizationId,
        provider: MAPS_PROVIDER,
        providerId: { in: providerIds },
      },
    });

    const businessMap = new Map<string, Business>();
    for (const b of existingByProvider) {
      businessMap.set(b.providerId, b);
    }

    // 2. For inputs not matched by providerId, check by verified phone or domain
    const unmatchedInputs = uniqueInputs.filter((i) => !businessMap.has(i.providerId));
    if (unmatchedInputs.length > 0) {
      const identityOrConditions: Prisma.BusinessWhereInput[] = [];
      for (const input of unmatchedInputs) {
        const domain = hostOf(input.websiteUrl);
        if (input.normalizedPhone || domain) {
          identityOrConditions.push({
            organizationId,
            normalizedName: input.normalizedName,
            ...(input.normalizedPhone
              ? { normalizedPhone: input.normalizedPhone }
              : domain
                ? { normalizedDomain: domain }
                : {}),
            ...(input.identityCity
              ? { city: { equals: input.identityCity, mode: "insensitive" } }
              : {}),
          });
        }
      }

      if (identityOrConditions.length > 0) {
        const existingByIdentity = await this.prisma.business.findMany({
          where: {
            organizationId,
            OR: identityOrConditions,
          },
        });

        for (const input of unmatchedInputs) {
          const domain = hostOf(input.websiteUrl);
          const matched = existingByIdentity.find((b) => {
            if (b.normalizedName !== input.normalizedName) return false;
            if (input.normalizedPhone && b.normalizedPhone === input.normalizedPhone) return true;
            if (domain && b.normalizedDomain === domain) return true;
            return false;
          });
          if (matched) {
            businessMap.set(input.providerId, matched);
          }
        }
      }
    }

    // 3. Resolve each business (update existing or create new)
    const matchesIdentity = (b: Business, input: SaveLeadInput): boolean => {
      if (b.normalizedName !== input.normalizedName) return false;
      const domain = hostOf(input.websiteUrl);
      const phoneOrDomainMatches =
        (input.normalizedPhone && b.normalizedPhone === input.normalizedPhone) ||
        (domain && b.normalizedDomain === domain);
      if (!phoneOrDomainMatches) return false;
      if (input.identityCity && b.city && b.city.toLowerCase() !== input.identityCity.toLowerCase()) {
        return false;
      }
      return true;
    };

    const resolvedBusinesses: { businessId: string; input: SaveLeadInput }[] = [];

    for (const input of uniqueInputs) {
      let business = businessMap.get(input.providerId);
      if (!business) {
        // Check if any business already resolved or created in this batch matches identity
        for (const prev of businessMap.values()) {
          if (matchesIdentity(prev, input)) {
            business = prev;
            businessMap.set(input.providerId, business);
            break;
          }
        }
      }

      const domain = hostOf(input.websiteUrl);

      if (business) {
        // Reconcile/update missing or refreshed fields on existing business
        const needsUpdate =
          (!business.phone && input.phone) ||
          (!business.websiteUrl && input.websiteUrl) ||
          (!business.address && input.address) ||
          (input.rating != null && business.rating !== input.rating) ||
          (input.reviewCount != null && business.reviewCount !== input.reviewCount) ||
          !business.enrichmentState;

        if (needsUpdate) {
          const enrichmentState = buildInitialEnrichmentState({
            phone: business.phone ?? input.phone,
            websiteUrl: business.websiteUrl ?? input.websiteUrl,
            address: business.address ?? input.address,
            rating: input.rating ?? business.rating,
            reviewCount: input.reviewCount ?? business.reviewCount,
            source: MAPS_PROVIDER,
          });

          business = await this.prisma.business.update({
            where: { id: business.id },
            data: {
              phone: business.phone ?? input.phone,
              normalizedPhone: business.normalizedPhone ?? input.normalizedPhone,
              websiteUrl: business.websiteUrl ?? input.websiteUrl,
              normalizedDomain: business.normalizedDomain ?? domain,
              address: business.address ?? input.address,
              rating: input.rating ?? business.rating,
              reviewCount: input.reviewCount ?? business.reviewCount,
              enrichmentState: enrichmentState as unknown as Prisma.InputJsonValue,
            },
          });
          businessMap.set(input.providerId, business);
        }
        resolvedBusinesses.push({ businessId: business.id, input });
      } else {
        const enrichmentState = buildInitialEnrichmentState({
          phone: input.phone,
          websiteUrl: input.websiteUrl,
          address: input.address,
          rating: input.rating,
          reviewCount: input.reviewCount,
          source: MAPS_PROVIDER,
        });

        try {
          const created = await this.prisma.business.create({
            data: {
              organizationId,
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
              enrichmentState: enrichmentState as unknown as Prisma.InputJsonValue,
            },
          });
          businessMap.set(input.providerId, created);
          resolvedBusinesses.push({ businessId: created.id, input });
        } catch (err) {
          if (!isUniqueViolation(err)) throw err;
          const raced = await this.prisma.business.findUnique({
            where: {
              organizationId_provider_providerId: {
                organizationId,
                provider: MAPS_PROVIDER,
                providerId: input.providerId,
              },
            },
          });
          if (!raced) throw err;
          businessMap.set(input.providerId, raced);
          resolvedBusinesses.push({ businessId: raced.id, input });
        }
      }
    }

    // 4. Batch query existing CampaignLead rows for this campaign to avoid N+1 and duplicates
    const allBusinessIds = Array.from(new Set(resolvedBusinesses.map((r) => r.businessId)));
    const existingCampaignLeads = await this.prisma.campaignLead.findMany({
      where: {
        campaignId,
        businessId: { in: allBusinessIds },
      },
      select: { businessId: true },
    });
    const existingBusinessIdSet = new Set(existingCampaignLeads.map((cl) => cl.businessId));

    // Filter to only new leads to insert
    const newLeadsData: Prisma.CampaignLeadCreateManyInput[] = [];
    const seenLeadBizIds = new Set<string>();

    for (const item of resolvedBusinesses) {
      if (!existingBusinessIdSet.has(item.businessId) && !seenLeadBizIds.has(item.businessId)) {
        seenLeadBizIds.add(item.businessId);
        newLeadsData.push({
          campaignId,
          businessId: item.businessId,
          qualificationStatus: item.input.qualificationStatus,
          auditStatus: item.input.auditStatus,
        });
      }
    }

    if (newLeadsData.length === 0) {
      return 0;
    }

    // Sort deterministically to maintain ordered inserts
    newLeadsData.sort((a, b) => a.businessId.localeCompare(b.businessId));

    // 5. Batch insert CampaignLead rows and usage event
    await this.prisma.$transaction(async (tx) => {
      await tx.campaignLead.createMany({
        data: newLeadsData,
        skipDuplicates: true,
      });

      await tx.usageEvent.create({
        data: {
          organizationId,
          campaignId,
          kind: "MAPS_RECORD",
          quantity: newLeadsData.length,
        },
      });
    });

    return newLeadsData.length;
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
    userId?: string,
  ): Promise<LeadView | null> {
    // Verify ownership and load previous state
    const existing = await this.prisma.campaignLead.findFirst({
      where: { id: leadId, campaignId, campaign: { organizationId } },
      select: {
        id: true,
        prospectStatus: true,
        notes: true,
        savedAt: true,
        archivedAt: true,
        tags: { select: { tagId: true } },
      },
    });
    if (!existing) return null;

    await this.prisma.$transaction(async (tx) => {
      // Deterministic row lock to prevent deadlock with concurrent updates
      await tx.$queryRaw(
        Prisma.sql`SELECT id FROM "CampaignLead" WHERE id = ${leadId} FOR UPDATE`
      );

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

      // Record Activity History Trail
      if (patch.prospectStatus && patch.prospectStatus !== existing.prospectStatus) {
        await tx.leadActivityLog.create({
          data: {
            organizationId,
            leadId,
            userId: userId ?? null,
            action: "STATUS_CHANGE",
            previousState: { prospectStatus: existing.prospectStatus },
            newState: { prospectStatus: patch.prospectStatus },
          },
        });
      }

      if (patch.notes !== undefined && patch.notes !== existing.notes) {
        await tx.leadActivityLog.create({
          data: {
            organizationId,
            leadId,
            userId: userId ?? null,
            action: "NOTES_UPDATED",
            previousState: { notes: existing.notes },
            newState: { notes: patch.notes },
          },
        });
      }

      if (patch.savedAt !== undefined && (patch.savedAt !== null) !== (existing.savedAt !== null)) {
        await tx.leadActivityLog.create({
          data: {
            organizationId,
            leadId,
            userId: userId ?? null,
            action: patch.savedAt ? "SAVED" : "UNSAVED",
          },
        });
      }

      if (patch.archivedAt !== undefined && (patch.archivedAt !== null) !== (existing.archivedAt !== null)) {
        await tx.leadActivityLog.create({
          data: {
            organizationId,
            leadId,
            userId: userId ?? null,
            action: patch.archivedAt ? "ARCHIVED" : "UNARCHIVED",
          },
        });
      }

      if (patch.tagIds !== undefined) {
        const prevTags = existing.tags.map((t) => t.tagId).sort();
        const nextTags = [...patch.tagIds].sort();
        if (JSON.stringify(prevTags) !== JSON.stringify(nextTags)) {
          await tx.leadActivityLog.create({
            data: {
              organizationId,
              leadId,
              userId: userId ?? null,
              action: "TAGS_UPDATED",
              previousState: { tagIds: prevTags },
              newState: { tagIds: nextTags },
            },
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
    // 1. Sort deterministically to enforce global lock acquisition order across transactions
    const dedupedIds = [...new Set(leadIds)].sort();
    if (dedupedIds.length === 0) {
      return { updatedCount: 0 };
    }

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
      // Deterministic row locking in strictly ascending ID order to eliminate database deadlocks
      await tx.$queryRaw(
        Prisma.sql`SELECT id FROM "CampaignLead" WHERE id IN (${Prisma.join(dedupedIds)}) ORDER BY id ASC FOR UPDATE`
      );

      switch (action) {
        case "UPDATE_STATUS":
          await tx.campaignLead.updateMany({
            where: { id: { in: dedupedIds } },
            data: { prospectStatus: opts.prospectStatus },
          });
          break;
        case "ADD_TAGS": {
          const tagIds = [...new Set(opts.tagIds ?? [])].sort();
          if (tagIds.length > 0) {
            const tagAssignments = dedupedIds.flatMap((leadId) =>
              tagIds.map((tagId) => ({ leadId, tagId }))
            );
            await tx.leadTag.createMany({
              data: tagAssignments,
              skipDuplicates: true,
            });
          }
          break;
        }
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

      // Record activity logs in a single batch query (eliminates N+1 query bottleneck)
      await tx.leadActivityLog.createMany({
        data: dedupedIds.map((leadId) => ({
          organizationId,
          leadId,
          userId: opts.userId ?? null,
          action: `BULK_${action}`,
          newState: { action, prospectStatus: opts.prospectStatus, tagIds: opts.tagIds },
        })),
      });
    });

    return { updatedCount: dedupedIds.length };
  }

  // ---------------------------------------------------------------------------
  // Activity Log Trail
  // ---------------------------------------------------------------------------

  async getActivityLogs(
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
    const lead = await this.prisma.campaignLead.findFirst({
      where: { id: leadId, campaignId, campaign: { organizationId } },
      select: { id: true },
    });
    if (!lead) return [];

    const rows = await this.prisma.leadActivityLog.findMany({
      where: { leadId, organizationId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { name: true, email: true } } },
    });

    return rows.map((r) => ({
      id: r.id,
      action: r.action,
      previousState: r.previousState,
      newState: r.newState,
      createdAt: r.createdAt.toISOString(),
      userName: r.user?.name ?? r.user?.email ?? null,
    }));
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
