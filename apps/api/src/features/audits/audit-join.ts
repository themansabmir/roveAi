import { AuditModule, AuditStatus, PrismaClient } from "@prisma/client";
import { AUDIT_READY_QUEUE, AuditJobPayload } from "@plugins/queue/queue.types";
import { JobPublisher } from "./audit-scheduler";
import { campaignOutcome, leadAuditStatus, REQUIRED_MODULES } from "./join";

export async function publishIfReady(
  prisma: PrismaClient,
  queue: JobPublisher,
  payload: AuditJobPayload
): Promise<void> {
  const interpretJobId = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${payload.leadId}, ${0}::bigint))`;
    const audits = await tx.technicalAudit.findMany({
      where: { leadId: payload.leadId, module: { in: REQUIRED_MODULES } },
      orderBy: { createdAt: "desc" },
      select: { module: true, status: true },
    });
    const latest = new Map<AuditModule, AuditStatus>();
    for (const audit of audits) {
      if (!latest.has(audit.module)) latest.set(audit.module, audit.status);
    }
    const status = leadAuditStatus([...latest.entries()].map(([module, moduleStatus]) => ({ module, status: moduleStatus })));
    if (!status) return null;

    await tx.campaignLead.updateMany({
      where: { id: payload.leadId, auditStatus: "PENDING" },
      data: { auditStatus: status },
    });

    let interpret = await tx.job.findFirst({
      where: { leadId: payload.leadId, campaignId: payload.campaignId, kind: "INTERPRET" },
      orderBy: { createdAt: "desc" },
    });
    if (!interpret) {
      interpret = await tx.job.create({
        data: {
          campaignId: payload.campaignId,
          organizationId: payload.organizationId,
          leadId: payload.leadId,
          kind: "INTERPRET",
          status: "PENDING",
        },
      });
    }
    if (interpret.queueJobId) return null;

    const leads = await tx.campaignLead.findMany({
      where: { campaignId: payload.campaignId },
      select: { auditStatus: true },
    });
    const nextCampaign = campaignOutcome(leads.map((lead) => lead.auditStatus));
    if (nextCampaign) {
      await tx.campaign.updateMany({
        where: { id: payload.campaignId, status: { in: ["PROCESSING", "DISCOVERING"] } },
        data: { status: nextCampaign },
      });
    }
    return interpret.id;
  });

  if (!interpretJobId) return;
  const messageId = await queue.publish(AUDIT_READY_QUEUE, { ...payload, jobId: interpretJobId });
  if (!messageId) return;
  await prisma.job.updateMany({
    where: { id: interpretJobId, queueJobId: null },
    data: { queueJobId: messageId, status: "COMPLETED" },
  });
}
