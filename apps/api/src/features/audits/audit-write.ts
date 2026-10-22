import { Prisma, PrismaClient } from "@prisma/client";
import { AuditWrite } from "./audit-scheduler";

export async function replaceAudit(prisma: PrismaClient, jobId: string, input: AuditWrite): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.technicalAudit.findUnique({
      where: { jobId_module: { jobId, module: input.module } },
    });
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
