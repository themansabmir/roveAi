import { JobKind, Prisma, PrismaClient } from "@prisma/client";
import { CRAWL_QUEUE, PSI_QUEUE } from "@plugins/queue/queue.types";
import { startOfUtcMonth } from "@features/campaigns/campaign.repository";
import { exceedsCeiling } from "./budget";
import { canonicalAuditUrl } from "./url";

export interface JobPublisher {
  publish<T extends object>(
    queue: string,
    payload: T,
    opts?: { singletonKey?: string }
  ): Promise<string | null>;
}

export class AuditScheduler {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly queue: JobPublisher,
    private readonly maxPages: number
  ) {}

  async schedule(campaignId: string): Promise<void> {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status === "CANCELLED") return;

    const leads = await this.prisma.campaignLead.findMany({
      where: {
        campaignId,
        auditStatus: "PENDING",
        business: { websiteClass: "OWNED_SITE" },
      },
      include: { business: true },
    });

    if (leads.length === 0) {
      await this.completeIfIdle(campaignId);
      return;
    }

    await this.prisma.campaign.updateMany({
      where: { id: campaignId, status: "DISCOVERING" },
      data: { status: "PROCESSING" },
    });

    const limits = await this.prisma.organization.findUniqueOrThrow({
      where: { id: campaign.organizationId },
      select: { pageFetchLimit: true, lighthouseRunLimit: true },
    });
    let pagesUsed = await this.used(campaign.organizationId, "WEBSITE_PAGE");
    let psiUsed = await this.used(campaign.organizationId, "LIGHTHOUSE_RUN");

    for (const lead of leads) {
      const website = lead.business.websiteUrl;
      if (!website) {
        await this.prisma.campaignLead.update({
          where: { id: lead.id },
          data: { auditStatus: "SKIPPED_NO_WEBSITE" },
        });
        continue;
      }
      if (
        exceedsCeiling(pagesUsed, this.maxPages, limits.pageFetchLimit) ||
        exceedsCeiling(psiUsed, 1, limits.lighthouseRunLimit)
      ) {
        await this.prisma.campaignLead.update({
          where: { id: lead.id },
          data: { auditStatus: "SKIPPED_BUDGET" },
        });
        continue;
      }
      const url = canonicalAuditUrl(website);
      await this.ensureJob(lead.campaignId, campaign.organizationId, lead.id, lead.businessId, "CRAWL", CRAWL_QUEUE, url);
      await this.ensureJob(lead.campaignId, campaign.organizationId, lead.id, lead.businessId, "AUDIT", PSI_QUEUE, url);
      pagesUsed += this.maxPages;
      psiUsed += 1;
    }

    await this.completeIfIdle(campaignId);
  }

  private async ensureJob(
    campaignId: string,
    organizationId: string,
    leadId: string,
    businessId: string,
    kind: JobKind,
    queue: string,
    url: string
  ): Promise<void> {
    let job = await this.prisma.job.findFirst({
      where: { campaignId, leadId, kind },
      orderBy: { createdAt: "desc" },
    });
    if (!job) {
      job = await this.prisma.job.create({
        data: { campaignId, organizationId, leadId, kind, status: "PENDING" },
      });
    }
    if (job.queueJobId || job.status === "COMPLETED" || job.status === "CANCELLED") return;
    const messageId = await this.queue.publish(
      queue,
      { organizationId, campaignId, leadId, businessId, jobId: job.id, url },
      { singletonKey: `${kind.toLowerCase()}:${leadId}` }
    );
    if (messageId) {
      await this.prisma.job.update({ where: { id: job.id }, data: { queueJobId: messageId } });
    }
  }

  private async used(organizationId: string, kind: "WEBSITE_PAGE" | "LIGHTHOUSE_RUN"): Promise<number> {
    const aggregate = await this.prisma.usageEvent.aggregate({
      where: { organizationId, kind, createdAt: { gte: startOfUtcMonth() } },
      _sum: { quantity: true },
    });
    return aggregate._sum.quantity ?? 0;
  }

  private async completeIfIdle(campaignId: string): Promise<void> {
    const leads = await this.prisma.campaignLead.findMany({
      where: { campaignId },
      select: { auditStatus: true },
    });
    if (leads.some((lead) => lead.auditStatus === "PENDING")) return;
    const failed = leads.some((lead) =>
      lead.auditStatus === "FAILED" || lead.auditStatus === "UNREACHABLE" || lead.auditStatus === "BLOCKED"
    );
    await this.prisma.campaign.updateMany({
      where: { id: campaignId, status: { in: ["DISCOVERING", "PROCESSING"] } },
      data: { status: failed ? "PARTIALLY_COMPLETED" : "COMPLETED" },
    });
  }
}

export type AuditWrite = {
  organizationId: string;
  leadId: string;
  snapshotId: string | null;
  module: "TECHNICAL_SEO" | "WEBSITE_EXPERIENCE" | "PERFORMANCE";
  status: "COMPLETED" | "FAILED" | "SKIPPED_BY_ROBOTS" | "UNREACHABLE" | "BLOCKED";
  score: number | null;
  metrics: Prisma.InputJsonValue | null;
  toolName: string;
  toolVersion: string;
  deviceProfile: string | null;
  observedAt: Date;
  failureReason: string | null;
  findings: Array<{
    code: string;
    severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    source: "CRAWL" | "LAB" | "FIELD";
    confidence: number;
    message: string;
    evidence?: Record<string, unknown> | null;
  }>;
};
