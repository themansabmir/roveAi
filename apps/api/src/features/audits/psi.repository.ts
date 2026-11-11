import { PrismaClient } from "@prisma/client";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { claimJob, JobClaim, releaseJob } from "@features/jobs/job-lock";
import { publishIfReady } from "./audit-join";
import { AuditWrite, JobPublisher } from "./audit-scheduler";
import { finishJob, replaceAudit } from "./audit-write";

export class PsiRepository {
  constructor(private readonly prisma: PrismaClient) {}

  claimJob(jobId: string, timeoutMs: number): Promise<JobClaim> {
    return claimJob(this.prisma, jobId, timeoutMs);
  }

  releaseJob(jobId: string): Promise<void> {
    return releaseJob(this.prisma, jobId);
  }

  finishJob(
    jobId: string,
    status: "COMPLETED" | "FAILED" | "CANCELLED",
    error?: string
  ): Promise<void> {
    return finishJob(this.prisma, jobId, status, error);
  }

  publishIfReady(queue: JobPublisher, payload: AuditJobPayload): Promise<void> {
    return publishIfReady(this.prisma, queue, payload);
  }

  replaceAudit(jobId: string, input: AuditWrite): Promise<void> {
    return replaceAudit(this.prisma, jobId, input);
  }

  findLeadForPsi(leadId: string) {
    return this.prisma.campaignLead.findUnique({
      where: { id: leadId },
      include: { campaign: true },
    });
  }

  async createStoredPsiFile(input: {
    organizationId: string;
    bucket: string;
    objectKey: string;
    sizeBytes: number;
    checksum: string;
  }): Promise<void> {
    await this.prisma.storedFile.create({
      data: {
        organizationId: input.organizationId,
        kind: "PSI_JSON",
        bucket: input.bucket,
        objectKey: input.objectKey,
        contentType: "application/json",
        sizeBytes: input.sizeBytes,
        checksum: input.checksum,
      },
    });
  }

  async recordLighthouseUsage(organizationId: string, campaignId: string): Promise<void> {
    await this.prisma.usageEvent.create({
      data: {
        organizationId,
        campaignId,
        kind: "LIGHTHOUSE_RUN",
        quantity: 1,
      },
    });
  }

  async markLeadUnreachable(leadId: string): Promise<void> {
    await this.prisma.campaignLead.updateMany({
      where: { id: leadId, auditStatus: { notIn: ["COMPLETED", "UNREACHABLE"] } },
      data: { auditStatus: "UNREACHABLE" },
    });
  }

  findTodayCompletedPerformanceAudits(
    organizationId: string,
    excludeJobId: string,
    since: Date
  ) {
    return this.prisma.technicalAudit.findMany({
      where: {
        organizationId,
        module: "PERFORMANCE",
        status: "COMPLETED",
        observedAt: { gte: since },
        jobId: { not: excludeJobId },
      },
      include: { findings: true, lead: { include: { business: true } } },
      orderBy: { observedAt: "desc" },
      take: 50,
    });
  }
}

