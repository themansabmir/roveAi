import {
  AuditStatus,
  CampaignStatus,
  Prisma,
  PrismaClient,
  QualificationStatus,
  WebsiteClass,
  WebsiteFilter,
} from "@prisma/client";
import { hostOf } from "./normalize";

export const MAPS_PROVIDER = "outscraper";
export const DISCOVER_QUEUE = "campaign.discover";

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

export interface LeadView {
  id: string;
  qualificationStatus: QualificationStatus;
  auditStatus: AuditStatus;
  business: {
    id: string;
    name: string;
    city: string | null;
    rating: number | null;
    reviewCount: number | null;
    websiteUrl: string | null;
    websiteClass: WebsiteClass;
  };
}

export interface JobView {
  id: string;
  status: string;
  attemptCount: number;
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
  jobs: { orderBy: { createdAt: "desc" as const }, take: 1 },
  leads: {
    orderBy: { createdAt: "asc" as const },
    include: { business: true },
  },
} satisfies Prisma.CampaignInclude;

type DetailRow = Prisma.CampaignGetPayload<{ include: typeof detailInclude }>;

export class CampaignRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
      data: { campaignId, organizationId, kind: "discover", status: "PENDING" },
    });
    return { id: job.id, status: job.status, attemptCount: job.attemptCount };
  }

  async setQueueJobId(jobId: string, queueJobId: string): Promise<void> {
    await this.prisma.job.update({ where: { id: jobId }, data: { queueJobId } });
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

  async beginJob(jobId: string): Promise<"ready" | "done"> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status === "CANCELLED" || job.status === "COMPLETED" || job.status === "FAILED") {
      return "done";
    }
    await this.prisma.job.update({
      where: { id: jobId },
      data: { status: "PROCESSING", attemptCount: { increment: 1 } },
    });
    return "ready";
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
      business: {
        id: lead.business.id,
        name: lead.business.name,
        city: lead.business.city,
        rating: lead.business.rating,
        reviewCount: lead.business.reviewCount,
        websiteUrl: lead.business.websiteUrl,
        websiteClass: lead.business.websiteClass,
      },
    })),
  };
}

function fromFilter(value: WebsiteFilter): "owned" | "missing" | "either" {
  if (value === "OWNED") return "owned";
  if (value === "MISSING") return "missing";
  return "either";
}
