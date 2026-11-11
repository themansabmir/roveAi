import type { Prisma } from "@prisma/client";
import { IPagespeedService } from "@plugins/pagespeed/pagespeed.plugin";
import { PagespeedUnreachableError } from "@plugins/pagespeed/pagespeed.types";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { IObjectStorage } from "@plugins/storage/storage.types";
import { JobPublisher } from "./audit-scheduler";
import { PsiRepository } from "./psi.repository";
import { canonicalAuditUrl, startOfUtcDay } from "./url";

export class PsiService {
  constructor(
    private readonly repository: PsiRepository,
    private readonly pagespeed: IPagespeedService,
    private readonly storage: IObjectStorage,
    private readonly queue: JobPublisher,
    private readonly jobTimeoutMs: number
  ) {}

  async run(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void> {
    console.log(`[PsiService.run] ⚡ PSI job started for lead: ${payload.leadId} (${payload.url})`);
    const claim = await this.repository.claimJob(payload.jobId, this.jobTimeoutMs);
    console.log(`[PsiService.run] 🔒 Job claim result: "${claim}" for jobId: ${payload.jobId}`);
    if (claim === "done") {
      console.log(`[PsiService.run] ⏩ Job already done, calling publishIfReady()`);
      await this.repository.publishIfReady(this.queue, payload);
      return;
    }
    if (claim !== "ready") return;

    try {
      await this.execute(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "pagespeed failed";
      // Site is simply unreachable — record it immediately, don't retry.
      if (err instanceof PagespeedUnreachableError) {
        console.warn(`[PsiService.run] ⚠️ Target site unreachable: ${message}`);
        await this.writeUnreachable(payload, message);
        await this.repository.publishIfReady(this.queue, payload);
        await this.repository.finishJob(payload.jobId, "FAILED", message);
        return;
      }
      if (meta.retrycount >= meta.retrylimit) {
        console.error(`[PsiService.run] ❌ PSI terminal failure: ${message}`);
        await this.fail(payload, message);
        await this.repository.publishIfReady(this.queue, payload);
        await this.repository.finishJob(payload.jobId, "FAILED", message);
        return;
      }
      await this.repository.releaseJob(payload.jobId);
      throw err;
    }
    console.log(`[PsiService.run] ✅ PSI completed for lead: ${payload.leadId}. Triggering publishIfReady()`);
    await this.repository.publishIfReady(this.queue, payload);
    await this.repository.finishJob(payload.jobId, "COMPLETED");
  }

  private async execute(payload: AuditJobPayload): Promise<void> {
    const lead = await this.repository.findLeadForPsi(payload.leadId);
    if (!lead || lead.campaign.status === "CANCELLED") {
      console.log(`[PsiService.execute] 🛑 Campaign lead missing or cancelled`);
      await this.repository.finishJob(payload.jobId, "CANCELLED");
      return;
    }

    const reused = await this.reuseToday(payload);
    if (reused) {
      console.log(`[PsiService.execute] ♻️ Reusing today's cached PSI audit for lead ${payload.leadId} (score: ${reused.score})`);
      await this.repository.replaceAudit(payload.jobId, {
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

    console.log(`[PsiService.execute] 🌐 Calling Google PageSpeed Insights API (mobile) for: ${payload.url}`);
    const report = await this.pagespeed.runMobile(payload.url);
    const objectKey = `org/${payload.organizationId}/pagespeed/${payload.jobId}.json`;
    const body = Buffer.from(JSON.stringify(report.raw));
    console.log(`[PsiService.execute] 💾 Saving raw PSI JSON to Object Storage (key: ${objectKey})`);
    const stored = await this.storage.put({
      objectKey,
      body,
      contentType: "application/json",
    });
    await this.repository.createStoredPsiFile({
      organizationId: payload.organizationId,
      bucket: stored.bucket,
      objectKey: stored.objectKey,
      sizeBytes: stored.sizeBytes,
      checksum: stored.checksum,
    });
    console.log(`[PsiService.execute] ✍️ Writing PERFORMANCE audit -> score: ${report.parsed.score}/100, LCP: ${report.parsed.metrics.lcp_ms}ms, CLS: ${report.parsed.metrics.cls} (${report.parsed.findings.length} findings)`);
    await this.repository.replaceAudit(payload.jobId, {
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
    await this.repository.recordLighthouseUsage(payload.organizationId, payload.campaignId);
    console.log(`[PsiService.execute] 📊 Recorded LIGHTHOUSE_RUN usage (+1)`);
  }

  private async fail(payload: AuditJobPayload, reason: string): Promise<void> {
    await this.repository.replaceAudit(payload.jobId, {
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

  private async writeUnreachable(payload: AuditJobPayload, reason: string): Promise<void> {
    await this.repository.replaceAudit(payload.jobId, {
      organizationId: payload.organizationId,
      leadId: payload.leadId,
      snapshotId: null,
      module: "PERFORMANCE",
      status: "UNREACHABLE",
      score: null,
      metrics: null,
      toolName: "pagespeed-insights",
      toolVersion: "v5",
      deviceProfile: "mobile",
      observedAt: new Date(),
      failureReason: reason.slice(0, 500),
      findings: [],
    });
    // Mark the lead itself as unreachable so the UI shows it correctly
    await this.repository.markLeadUnreachable(payload.leadId);
  }

  private async reuseToday(payload: AuditJobPayload) {
    const rows = await this.repository.findTodayCompletedPerformanceAudits(
      payload.organizationId,
      payload.jobId,
      startOfUtcDay()
    );
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
