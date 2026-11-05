import { AuditModule, AuditStatus, PrismaClient } from "@prisma/client";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { JobDispatcher } from "@features/jobs/job-dispatcher";
import { JobPublisher } from "./audit-scheduler";
import { campaignOutcome, leadAuditStatus, REQUIRED_MODULES } from "./join";

export async function publishIfReady(
  prisma: PrismaClient,
  queue: JobPublisher,
  payload: AuditJobPayload
): Promise<void> {
  console.log(`[JoinBarrier.publishIfReady] 🔀 Evaluating lead completion for lead: ${payload.leadId} (jobId: ${payload.jobId})`);
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
    const moduleSummary = [...latest.entries()].map(([mod, st]) => `${mod}: ${st}`).join(", ");
    console.log(`[JoinBarrier.publishIfReady] 📋 Module states for lead ${payload.leadId} -> [${moduleSummary || "none"}]`);

    const status = leadAuditStatus([...latest.entries()].map(([module, moduleStatus]) => ({ module, status: moduleStatus })));
    if (!status) {
      console.log(`[JoinBarrier.publishIfReady] ⏳ Sibling audit module still running for lead ${payload.leadId}. Exiting lock.`);
      return null;
    }

    console.log(`[JoinBarrier.publishIfReady] 🎉 All modules reached terminal state! Updating lead ${payload.leadId} auditStatus -> "${status}"`);
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
      console.log(`[JoinBarrier.publishIfReady] 📋 Created INTERPRET Job row: ${interpret.id}`);
    }
    if (interpret.dispatchedAt) {
      console.log(`[JoinBarrier.publishIfReady] ℹ️ INTERPRET job already dispatched (${interpret.queueJobId})`);
      return null;
    }

    const leads = await tx.campaignLead.findMany({
      where: { campaignId: payload.campaignId },
      select: { auditStatus: true },
    });
    const nextCampaign = campaignOutcome(leads.map((lead) => lead.auditStatus));
    if (nextCampaign) {
      console.log(`[JoinBarrier.publishIfReady] 🏆 All campaign leads evaluated! Campaign status -> "${nextCampaign}"`);
      await tx.campaign.updateMany({
        where: { id: payload.campaignId, status: { in: ["PROCESSING", "DISCOVERING"] } },
        data: { status: nextCampaign },
      });
    }
    return interpret.id;
  });

  if (!interpretJobId) return;
  console.log(`[JoinBarrier.publishIfReady] 📤 Dispatching downstream interpret job ${interpretJobId}`);
  const dispatcher = new JobDispatcher(prisma, queue);
  await dispatcher.dispatchJob(interpretJobId);
}
