import { Prisma, PrismaClient } from "@prisma/client";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { claimJob, JobClaim, releaseJob } from "@features/jobs/job-lock";
import { isUniqueViolation } from "@features/campaigns/campaign.repository";
import { publishIfReady } from "./audit-join";
import { AuditWrite, JobPublisher } from "./audit-scheduler";
import { finishJob, replaceAudit } from "./audit-write";

export class CrawlRepository {
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

  findLeadForCrawl(leadId: string) {
    return this.prisma.campaignLead.findUnique({
      where: { id: leadId },
      include: { campaign: true, business: true },
    });
  }

  findRecentSnapshot(organizationId: string, businessId: string, since: Date) {
    return this.prisma.websiteSnapshot.findFirst({
      where: {
        organizationId,
        businessId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
      include: { pages: { include: { htmlFile: true } } },
    });
  }

  findSnapshotByHash(organizationId: string, businessId: string, contentHash: string) {
    return this.prisma.websiteSnapshot.findUnique({
      where: {
        organizationId_businessId_contentHash: {
          organizationId,
          businessId,
          contentHash,
        },
      },
    });
  }

  async createSnapshot(input: {
    organizationId: string;
    businessId: string;
    fetchedUrl: string;
    finalUrl: string;
    httpStatus: number;
    contentHash: string;
    pageCount: number;
    robotsOutcome: string;
    title: string | null;
    headings: Prisma.InputJsonValue;
    techStack: Prisma.InputJsonValue;
    rawTextSize: number;
  }): Promise<{ id: string; created: boolean }> {
    try {
      const snapshot = await this.prisma.websiteSnapshot.create({
        data: {
          organizationId: input.organizationId,
          businessId: input.businessId,
          fetchedUrl: input.fetchedUrl,
          finalUrl: input.finalUrl,
          httpStatus: input.httpStatus,
          contentHash: input.contentHash,
          pageCount: input.pageCount,
          robotsOutcome: input.robotsOutcome,
          title: input.title,
          headings: input.headings,
          techStack: input.techStack,
          rawTextSize: input.rawTextSize,
        },
      });
      return { id: snapshot.id, created: true };
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      const raced = await this.prisma.websiteSnapshot.findUniqueOrThrow({
        where: {
          organizationId_businessId_contentHash: {
            organizationId: input.organizationId,
            businessId: input.businessId,
            contentHash: input.contentHash,
          },
        },
      });
      return { id: raced.id, created: false };
    }
  }

  async createSnapshotPageFile(input: {
    organizationId: string;
    snapshotId: string;
    url: string;
    httpStatus: number;
    role: string;
    bucket: string;
    objectKey: string;
    contentType: string;
    sizeBytes: number;
    checksum: string;
    extracted: Prisma.InputJsonValue;
  }): Promise<void> {
    const file = await this.prisma.storedFile.create({
      data: {
        organizationId: input.organizationId,
        kind: "HTML",
        bucket: input.bucket,
        objectKey: input.objectKey,
        contentType: input.contentType,
        sizeBytes: input.sizeBytes,
        checksum: input.checksum,
      },
    });
    await this.prisma.snapshotPage.create({
      data: {
        snapshotId: input.snapshotId,
        url: input.url,
        httpStatus: input.httpStatus,
        role: input.role,
        htmlFileId: file.id,
        extracted: input.extracted,
      },
    });
  }

  async recordPageUsage(
    organizationId: string,
    campaignId: string,
    quantity: number
  ): Promise<void> {
    await this.prisma.usageEvent.create({
      data: {
        organizationId,
        campaignId,
        kind: "WEBSITE_PAGE",
        quantity,
      },
    });
  }
}

