import { Prisma, PrismaClient } from "@prisma/client";
import { AuditWrite } from "./audit-scheduler";
import { logger } from "@core/logger";

export async function replaceAudit(prisma: PrismaClient, jobId: string, input: AuditWrite): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // 1. Log immutable execution history in AuditAttempt
    const priorAttempts = await tx.auditAttempt.count({
      where: { jobId, module: input.module },
    });
    const attemptNumber = priorAttempts + 1;

    await tx.auditAttempt.create({
      data: {
        leadId: input.leadId,
        jobId,
        module: input.module,
        attemptNumber,
        status: input.status,
        score: input.score,
        failureReason: input.failureReason,
        observedAt: input.observedAt,
      },
    });

    // 2. Fetch canonical TechnicalAudit
    const existing = await tx.technicalAudit.findUnique({
      where: { jobId_module: { jobId, module: input.module } },
      include: { findings: true },
    });

    // Rule: Retrying a failed extraction must NEVER overwrite previously verified COMPLETED information
    if (existing?.status === "COMPLETED" && input.status !== "COMPLETED") {
      logger.warn(
        { jobId, module: input.module, incomingStatus: input.status, reason: input.failureReason },
        "replaceAudit: Preserving previously COMPLETED canonical audit findings; recorded attempt in AuditAttempt log"
      );
      await tx.technicalAudit.update({
        where: { id: existing.id },
        data: { failureReason: input.failureReason },
      });
      return;
    }

    // Monotonic timestamp guard: do not allow older out-of-order execution to overwrite newer canonical evidence
    if (existing && existing.observedAt && existing.observedAt > input.observedAt) {
      logger.warn(
        { jobId, module: input.module, existingObservedAt: existing.observedAt, inputObservedAt: input.observedAt },
        "replaceAudit: Ignoring stale out-of-order audit update"
      );
      return;
    }

    const data = {
      organizationId: input.organizationId,
      leadId: input.leadId,
      snapshotId: input.snapshotId,
      module: input.module,
      status: input.status,
      score: input.score,
      metrics: input.metrics === null ? Prisma.JsonNull : input.metrics,
      toolName: input.toolName,
      toolVersion: input.toolVersion,
      deviceProfile: input.deviceProfile,
      observedAt: input.observedAt,
      failureReason: input.failureReason,
    };

    const audit = existing
      ? await tx.technicalAudit.update({ where: { id: existing.id }, data })
      : await tx.technicalAudit.create({ data: { ...data, jobId } });

    if (existing) {
      await tx.auditFinding.deleteMany({ where: { auditId: existing.id } });
    }

    if (input.findings.length === 0) return;

    await tx.auditFinding.createMany({
      data: input.findings.map((finding) => ({
        auditId: audit.id,
        code: finding.code,
        kind: "FINDING" as const,
        severity: finding.severity,
        source: finding.source,
        confidence: finding.confidence,
        message: finding.message.slice(0, 1000),
        evidence:
          finding.evidence == null ? undefined : (finding.evidence as Prisma.InputJsonValue),
      })),
    });
  });
}

export async function finishJob(
  prisma: PrismaClient,
  jobId: string,
  status: "COMPLETED" | "FAILED" | "CANCELLED",
  error?: string
): Promise<void> {
  await prisma.job.updateMany({
    where: { id: jobId, status: { notIn: ["CANCELLED", "COMPLETED", "FAILED"] } },
    data: { status, error: error?.slice(0, 1000) },
  });
}
