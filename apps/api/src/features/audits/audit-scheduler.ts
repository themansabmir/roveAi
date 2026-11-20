import { JobKind, Prisma, PrismaClient } from "@prisma/client";
import { startOfUtcMonth } from "@features/campaigns/campaign.repository";
import { JobDispatcher } from "@features/jobs/job-dispatcher";
import { exceedsCeiling } from "./budget";
import { canonicalAuditUrl } from "./url";

/** Minimal transactional client interface for Job creation inside a Prisma $transaction */
export type TxClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export interface JobPublisher {
  publish<T extends object>(
    queue: string,
    payload: T,
    opts?: { singletonKey?: string }
  ): Promise<string | null>;
}

export interface ScheduleAuditOptions {
  leadIds?: string[];
  tools?: ("CRAWL" | "PERFORMANCE")[];
  generateAiBrief?: boolean;
  aiBriefLeadIds?: string[];
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

  async schedule(
    campaignId: string,
    opts?: ScheduleAuditOptions
  ): Promise<{ scheduledLeads: number; queuedJobs: number }> {
    console.log(`\n======================================================`);
    console.log(`[AuditScheduler.schedule] 🗓️ Starting audit scheduler for campaign: ${campaignId}`);
    console.log(`======================================================`);

    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status === "CANCELLED") {
      console.log(`[AuditScheduler.schedule] 🛑 Campaign ${campaignId} missing or cancelled`);
      return { scheduledLeads: 0, queuedJobs: 0 };
    }

    const where: Prisma.CampaignLeadWhereInput = {
      campaignId,
      ...(opts?.leadIds?.length
        ? { id: { in: opts.leadIds } }
        : { auditStatus: { in: ["PENDING", "QUEUED"] } }),
      business: { websiteClass: "OWNED_SITE" },
    };

    const leads = await this.prisma.campaignLead.findMany({
      where,
      include: { business: true },
      orderBy: { id: "asc" },
    });

    console.log(`[AuditScheduler.schedule] 🎯 Found ${leads.length} qualified leads with OWNED_SITE`);

    if (leads.length === 0) {
      console.log(`[AuditScheduler.schedule] ℹ️ No pending leads to audit. Calling completeIfIdle()`);
      await this.completeIfIdle(campaignId);
      return { scheduledLeads: 0, queuedJobs: 0 };
    }

    await this.prisma.campaign.updateMany({
      where: { id: campaignId, status: { in: ["DISCOVERING", "COMPLETED"] } },
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

    const toolsToRun = opts?.tools ?? ["CRAWL", "PERFORMANCE"];
    let queuedJobs = 0;

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
        (toolsToRun.includes("CRAWL") && exceedsCeiling(pagesUsed, this.maxPages, limits.pageFetchLimit)) ||
        (toolsToRun.includes("PERFORMANCE") && exceedsCeiling(psiUsed, 1, limits.lighthouseRunLimit))
      ) {
        console.log(`[AuditScheduler.schedule] ⚠️ Budget limit reached, skipping lead ${lead.id}`);
        await this.prisma.campaignLead.update({
          where: { id: lead.id },
          data: { auditStatus: "SKIPPED_BUDGET" },
        });
        continue;
      }

      // Update lead states to mark audit in progress and set requested AI Brief flag
      let desiredAiStatus: "QUEUED" | "NOT_REQUESTED" | undefined = undefined;
      if (opts?.aiBriefLeadIds && opts.aiBriefLeadIds.length > 0) {
        desiredAiStatus = opts.aiBriefLeadIds.includes(lead.id) ? "QUEUED" : "NOT_REQUESTED";
      } else if (opts?.generateAiBrief !== undefined) {
        desiredAiStatus = opts.generateAiBrief ? "QUEUED" : "NOT_REQUESTED";
      }

      await this.prisma.campaignLead.update({
        where: { id: lead.id },
        data: {
          auditStatus: "PENDING",
          ...(desiredAiStatus ? { aiStatus: desiredAiStatus } : {}),
        },
      });

      const url = canonicalAuditUrl(website);
      console.log(`[AuditScheduler.schedule] 🚀 Dispatching tools [${toolsToRun.join(", ")}] for: "${lead.business.name}" (${url})`);

      if (toolsToRun.includes("CRAWL")) {
        await this.ensureJob(lead.campaignId, campaign.organizationId, lead.id, "CRAWL");
        pagesUsed += this.maxPages;
        queuedJobs += 1;
      }
      if (toolsToRun.includes("PERFORMANCE")) {
        await this.ensureJob(lead.campaignId, campaign.organizationId, lead.id, "AUDIT");
        psiUsed += 1;
        queuedJobs += 1;
      }
    }

    await this.completeIfIdle(campaignId);
    return { scheduledLeads: leads.length, queuedJobs };
  }

  async scheduleAiBriefs(
    campaignId: string,
    leadIds: string[]
  ): Promise<{ queuedCount: number; skippedLeads: Array<{ leadId: string; reason: string }> }> {
    const campaign = await this.prisma.campaign.findUniqueOrThrow({ where: { id: campaignId } });
    
    // Strict allowlist: only leads that actually underwent audit AND have a real owned website
    const leads = await this.prisma.campaignLead.findMany({
      where: {
        id: { in: leadIds },
        campaignId,
        auditStatus: { in: ["COMPLETED", "PARTIALLY_COMPLETED", "FAILED"] },
        business: {
          websiteUrl: { not: null },
          websiteClass: "OWNED_SITE",
        },
      },
      select: { id: true },
      orderBy: { id: "asc" },
    });

    const eligibleIds = new Set(leads.map((l) => l.id));
    const skippedLeads: Array<{ leadId: string; reason: string }> = [];
    for (const id of leadIds) {
      if (!eligibleIds.has(id)) {
        skippedLeads.push({
          leadId: id,
          reason: "Lead missing website or not in COMPLETED, PARTIALLY_COMPLETED, or FAILED status",
        });
      }
    }

    let queuedCount = 0;
    for (const lead of leads) {
      await this.prisma.campaignLead.update({
        where: { id: lead.id },
        data: { aiStatus: "PENDING" },
      });
      await this.ensureJob(campaignId, campaign.organizationId, lead.id, "INTERPRET");
      queuedCount += 1;
    }
    return { queuedCount, skippedLeads };
  }

  /**
   * Creates Job rows for a set of leads within an external Prisma transaction (tx).
   * Returns the IDs of newly created Job rows so the caller can dispatch them
   * AFTER the transaction commits — implementing the outbox pattern.
   *
   * Does NOT dispatch anything itself. Use `dispatchJobs(jobIds)` after tx commit.
   */
  async createJobRows(
    tx: TxClient,
    campaignId: string,
    organizationId: string,
    leads: Array<{ id: string; business: { websiteUrl: string | null } }>,
    opts: {
      tools: ("CRAWL" | "PERFORMANCE")[];
      generateAiBrief?: boolean;
      aiBriefLeadIds?: string[];
    }
  ): Promise<{ jobIds: string[]; scheduledLeads: number }> {
    const toolsToRun = opts.tools;
    const jobIds: string[] = [];
    let scheduledLeads = 0;

    for (const lead of leads) {
      if (!lead.business.websiteUrl) continue;

      // Determine AI status
      let desiredAiStatus: "QUEUED" | "NOT_REQUESTED" | undefined;
      if (opts.aiBriefLeadIds && opts.aiBriefLeadIds.length > 0) {
        desiredAiStatus = opts.aiBriefLeadIds.includes(lead.id) ? "QUEUED" : "NOT_REQUESTED";
      } else if (opts.generateAiBrief !== undefined) {
        desiredAiStatus = opts.generateAiBrief ? "QUEUED" : "NOT_REQUESTED";
      }

      // Update lead auditStatus + aiStatus inside the tx
      await tx.campaignLead.update({
        where: { id: lead.id },
        data: {
          auditStatus: "PENDING",
          ...(desiredAiStatus ? { aiStatus: desiredAiStatus } : {}),
        },
      });

      if (toolsToRun.includes("CRAWL")) {
        const existing = await tx.job.findFirst({
          where: { campaignId, leadId: lead.id, kind: "CRAWL", status: { in: ["PENDING", "PROCESSING"] } },
          select: { id: true, dispatchedAt: true, status: true },
          orderBy: { createdAt: "desc" },
        });
        if (!existing || existing.dispatchedAt || existing.status === "COMPLETED" || existing.status === "CANCELLED") {
          const job = await tx.job.create({
            data: { campaignId, organizationId, leadId: lead.id, kind: "CRAWL", status: "PENDING", dispatchedAt: null },
          });
          jobIds.push(job.id);
        } else {
          jobIds.push(existing.id);
        }
      }

      if (toolsToRun.includes("PERFORMANCE")) {
        const existing = await tx.job.findFirst({
          where: { campaignId, leadId: lead.id, kind: "AUDIT", status: { in: ["PENDING", "PROCESSING"] } },
          select: { id: true, dispatchedAt: true, status: true },
          orderBy: { createdAt: "desc" },
        });
        if (!existing || existing.dispatchedAt || existing.status === "COMPLETED" || existing.status === "CANCELLED") {
          const job = await tx.job.create({
            data: { campaignId, organizationId, leadId: lead.id, kind: "AUDIT", status: "PENDING", dispatchedAt: null },
          });
          jobIds.push(job.id);
        } else {
          jobIds.push(existing.id);
        }
      }

      scheduledLeads += 1;
    }

    return { jobIds, scheduledLeads };
  }

  /**
   * Dispatches a list of Job IDs (by ID) after a transaction has committed.
   * Errors are swallowed per-job: the outbox sweep will re-dispatch on restart.
   */
  async dispatchJobs(jobIds: string[]): Promise<void> {
    for (const jobId of jobIds) {
      await this.dispatcher.dispatchJob(jobId).catch((err: unknown) => {
        console.warn(`[AuditScheduler.dispatchJobs] ⚠️ Failed to dispatch job ${jobId}:`, err);
      });
    }
  }

  private async ensureJob(
    campaignId: string,
    organizationId: string,
    leadId: string,
    kind: JobKind
  ): Promise<void> {
    let job = await this.prisma.job.findFirst({
      where: { campaignId, leadId, kind, status: { in: ["PENDING", "PROCESSING"] } },
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
