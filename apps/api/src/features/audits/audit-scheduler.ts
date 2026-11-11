import { JobKind, Prisma, PrismaClient } from "@prisma/client";
import { startOfUtcMonth } from "@features/campaigns/campaign.repository";
import { JobDispatcher } from "@features/jobs/job-dispatcher";
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
  private readonly dispatcher: JobDispatcher;

  constructor(
    private readonly prisma: PrismaClient,
    queue: JobPublisher,
    private readonly maxPages: number
  ) {
    this.dispatcher = new JobDispatcher(prisma, queue);
  }

  async schedule(campaignId: string): Promise<void> {
    console.log(`\n======================================================`);
    console.log(`[AuditScheduler.schedule] 🗓️ Starting audit scheduler for campaign: ${campaignId}`);
    console.log(`======================================================`);

    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status === "CANCELLED") {
      console.log(`[AuditScheduler.schedule] 🛑 Campaign ${campaignId} missing or cancelled`);
      return;
    }

    const leads = await this.prisma.campaignLead.findMany({
      where: {
        campaignId,
        auditStatus: "PENDING",
        business: { websiteClass: "OWNED_SITE" },
      },
      include: { business: true },
      orderBy: { id: "asc" },
    });

    console.log(`[AuditScheduler.schedule] 🎯 Found ${leads.length} qualified leads with OWNED_SITE in PENDING status`);

    if (leads.length === 0) {
      console.log(`[AuditScheduler.schedule] ℹ️ No pending leads to audit. Calling completeIfIdle()`);
      await this.completeIfIdle(campaignId);
      return;
    }

    await this.prisma.campaign.updateMany({
      where: { id: campaignId, status: "DISCOVERING" },
      data: { status: "PROCESSING" },
    });
    console.log(`[AuditScheduler.schedule] 🔄 Campaign ${campaignId} status -> PROCESSING`);

    const limits = await this.prisma.organization.findUniqueOrThrow({
      where: { id: campaign.organizationId },
      select: { pageFetchLimit: true, lighthouseRunLimit: true },
    });
    let pagesUsed = await this.used(campaign.organizationId, "WEBSITE_PAGE");
    let psiUsed = await this.used(campaign.organizationId, "LIGHTHOUSE_RUN");
    console.log(`[AuditScheduler.schedule] 📊 Monthly budget usage: pages=${pagesUsed}/${limits.pageFetchLimit}, psi=${psiUsed}/${limits.lighthouseRunLimit}`);

    for (const lead of leads) {
      const website = lead.business.websiteUrl;
      if (!website) {
        console.log(`[AuditScheduler.schedule] ⏭️ Skipping lead ${lead.id} (${lead.business.name}): no website URL`);
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
        console.log(`[AuditScheduler.schedule] ⚠️ Budget limit reached, skipping lead ${lead.id}`);
        await this.prisma.campaignLead.update({
          where: { id: lead.id },
          data: { auditStatus: "SKIPPED_BUDGET" },
        });
        continue;
      }
      const url = canonicalAuditUrl(website);
      console.log(`[AuditScheduler.schedule] 🚀 Dispatching parallel CRAWL and PSI jobs for: "${lead.business.name}" (${url})`);
      await this.ensureJob(lead.campaignId, campaign.organizationId, lead.id, "CRAWL");
      await this.ensureJob(lead.campaignId, campaign.organizationId, lead.id, "AUDIT");
      pagesUsed += this.maxPages;
      psiUsed += 1;
    }

    await this.completeIfIdle(campaignId);
  }

  private async ensureJob(
    campaignId: string,
    organizationId: string,
    leadId: string,
    kind: JobKind
  ): Promise<void> {
    let job = await this.prisma.job.findFirst({
      where: { campaignId, leadId, kind },
      orderBy: { createdAt: "desc" },
    });
    if (!job) {
      job = await this.prisma.job.create({
        data: { campaignId, organizationId, leadId, kind, status: "PENDING" },
      });
      console.log(`[AuditScheduler.ensureJob] 📋 Created ${kind} Job row: ${job.id} for lead: ${leadId}`);
    }
    if (job.dispatchedAt || job.status === "COMPLETED" || job.status === "CANCELLED") return;
    console.log(`[AuditScheduler.ensureJob] 📤 Dispatching ${kind} job ${job.id} for lead ${leadId}`);
    await this.dispatcher.dispatchJob(job.id);
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
