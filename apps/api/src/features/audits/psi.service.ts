import { Prisma, PrismaClient } from "@prisma/client";
import { IPagespeedService } from "@plugins/pagespeed/pagespeed.plugin";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { IObjectStorage } from "@plugins/storage/storage.types";
import { claimJob, releaseJob } from "@features/jobs/job-lock";
import { publishIfReady } from "./audit-join";
import { JobPublisher } from "./audit-scheduler";
import { finishJob, replaceAudit } from "./audit-write";
import { canonicalAuditUrl, startOfUtcDay } from "./url";

export class PsiService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly pagespeed: IPagespeedService,
    private readonly storage: IObjectStorage,
    private readonly queue: JobPublisher,
    private readonly jobTimeoutMs: number
  ) {}

  async run(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void> {
    const claim = await claimJob(this.prisma, payload.jobId, this.jobTimeoutMs);
    if (claim === "done") {
      await publishIfReady(this.prisma, this.queue, payload);
      return;
    }
    if (claim !== "ready") return;

    try {
      await this.execute(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "pagespeed failed";
      if (meta.retrycount >= meta.retrylimit) {
        await this.fail(payload, message);
        await publishIfReady(this.prisma, this.queue, payload);
        await finishJob(this.prisma, payload.jobId, "FAILED", message);
        return;
      }
      await releaseJob(this.prisma, payload.jobId);
      throw err;
    }
    await publishIfReady(this.prisma, this.queue, payload);
    await finishJob(this.prisma, payload.jobId, "COMPLETED");
  }

  private async execute(payload: AuditJobPayload): Promise<void> {
    const lead = await this.prisma.campaignLead.findUnique({
      where: { id: payload.leadId },
      include: { campaign: true },
    });
    if (!lead || lead.campaign.status === "CANCELLED") {
      await finishJob(this.prisma, payload.jobId, "CANCELLED");
      return;
    }

    const reused = await this.reuseToday(payload);
    if (reused) {
      await replaceAudit(this.prisma, payload.jobId, {
        organizationId: payload.organizationId,
        leadId: payload.leadId,
        snapshotId: reused.snapshotId,
        module: "PERFORMANCE",
        status: "COMPLETED",
        score: reused.score,
        metrics: (reused.metrics ?? null) as Prisma.InputJsonValue | null,
        toolName: reused.toolName ?? "pagespeed-insights",
        toolVersion: reused.toolVersion ?? "v5",
        deviceProfile: "mobile",
        observedAt: reused.observedAt,
        failureReason: null,
        findings: reused.findings.map((finding) => ({
          code: finding.code,
          severity: finding.severity,
          source: finding.source === "FIELD" ? "FIELD" : "LAB",
          confidence: finding.confidence,
          message: finding.message,
          evidence: asRecord(finding.evidence),
        })),
      });
      return;
    }

    const report = await this.pagespeed.runMobile(payload.url);
    const objectKey = `org/${payload.organizationId}/pagespeed/${payload.jobId}.json`;
    const body = Buffer.from(JSON.stringify(report.raw));
    const stored = await this.storage.put({
      objectKey,
      body,
      contentType: "application/json",
    });
    await this.prisma.storedFile.create({
      data: {
        organizationId: payload.organizationId,
        kind: "PSI_JSON",
        bucket: stored.bucket,
        objectKey: stored.objectKey,
        contentType: "application/json",
        sizeBytes: stored.sizeBytes,
        checksum: stored.checksum,
      },
    });
    await replaceAudit(this.prisma, payload.jobId, {
      organizationId: payload.organizationId,
      leadId: payload.leadId,
      snapshotId: null,
      module: "PERFORMANCE",
      status: "COMPLETED",
      score: report.parsed.score,
      metrics: { ...report.parsed.metrics, rawObjectKey: stored.objectKey },
      toolName: "pagespeed-insights",
      toolVersion: "v5",
      deviceProfile: "mobile",
      observedAt: new Date(),
      failureReason: null,
      findings: report.parsed.findings,
    });
    await this.prisma.usageEvent.create({
      data: {
        organizationId: payload.organizationId,
        campaignId: payload.campaignId,
        kind: "LIGHTHOUSE_RUN",
        quantity: 1,
      },
    });
  }

  private async fail(payload: AuditJobPayload, reason: string): Promise<void> {
    await replaceAudit(this.prisma, payload.jobId, {
      organizationId: payload.organizationId,
      leadId: payload.leadId,
      snapshotId: null,
      module: "PERFORMANCE",
      status: "FAILED",
      score: null,
      metrics: null,
      toolName: "pagespeed-insights",
      toolVersion: "v5",
      deviceProfile: "mobile",
      observedAt: new Date(),
      failureReason: reason.slice(0, 500),
      findings: [],
    });
  }

  private async reuseToday(payload: AuditJobPayload) {
    const rows = await this.prisma.technicalAudit.findMany({
      where: {
        organizationId: payload.organizationId,
        module: "PERFORMANCE",
        status: "COMPLETED",
        observedAt: { gte: startOfUtcDay() },
        jobId: { not: payload.jobId },
      },
      include: { findings: true, lead: { include: { business: true } } },
      orderBy: { observedAt: "desc" },
      take: 50,
    });
    return (
      rows.find((row) => {
        const website = row.lead.business.websiteUrl;
        if (!website) return false;
        try {
          return canonicalAuditUrl(website) === canonicalAuditUrl(payload.url);
        } catch {
          return false;
        }
      }) ?? null
    );
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}
