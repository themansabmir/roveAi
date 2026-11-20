import { AuditModule, AuditStatus, Prisma, PrismaClient } from "@prisma/client";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { JobDispatcher } from "@features/jobs/job-dispatcher";
import { JobPublisher } from "./audit-scheduler";
import { campaignOutcome, leadAuditStatus, REQUIRED_MODULES } from "./join";
import { computeLeadScoreBreakdown, persistLeadScore } from "./scoring/lead-scoring";
import { CreditService } from "../credits/credit.service";

export async function publishIfReady(
  prisma: PrismaClient,
  queue: JobPublisher,
  payload: AuditJobPayload
): Promise<void> {
  console.log(`[JoinBarrier.publishIfReady] 🔀 Evaluating lead completion for lead: ${payload.leadId} (jobId: ${payload.jobId})`);
  const { interpretJobId, interpretJobIds, completedReservations, settledLeadId } = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw(
      Prisma.sql`SELECT id FROM "campaign_lead" WHERE id = ${payload.leadId} FOR UPDATE`
    );
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
      return { interpretJobId: null, interpretJobIds: [], completedReservations: [], settledLeadId: null };
    }

    console.log(`[JoinBarrier.publishIfReady] 🎉 All modules reached terminal state! Updating lead ${payload.leadId} auditStatus -> "${status}"`);
    await tx.campaignLead.updateMany({
      where: { id: payload.leadId, auditStatus: { in: ["PENDING", "QUEUED", "RUNNING"] } },
      data: { auditStatus: status },
    });

    // Compute and persist 3D lead score (Gap Index, Fit Score, Commercial Viability)
    if (status === "COMPLETED" || status === "PARTIALLY_COMPLETED") {
      const fullLead = await tx.campaignLead.findUnique({
        where: { id: payload.leadId },
        include: {
          campaign: true,
          business: true,
          audits: { include: { findings: true } },
        },
      });

      if (fullLead && fullLead.business) {
        const serviceOffers = await tx.serviceOffer.findMany({
          where: { organizationId: payload.organizationId, active: true },
          select: { name: true, codes: true, active: true },
        });
        const latestAttempts = await tx.auditAttempt.findMany({
          where: { leadId: payload.leadId },
          orderBy: { observedAt: "desc" },
          distinct: ["module"],
          select: { module: true, status: true, observedAt: true },
        });
        const scoreBreakdown = computeLeadScoreBreakdown({
          lead: fullLead,
          serviceOffers,
          latestAttempts,
        });
        await persistLeadScore(tx, payload.leadId, scoreBreakdown);
        console.log(`[JoinBarrier.publishIfReady] 📊 Persisted 3D lead score (priorityRank: ${scoreBreakdown.priorityRank}, gapIndex: ${scoreBreakdown.gapIndex}) for lead ${payload.leadId}`);
      }
    }

    // ---------------------------------------------------------------------------
    // Batch-Level Join Barrier: increment completedLeadCount atomically
    // ---------------------------------------------------------------------------
    const currentLeadForBatch = await tx.campaignLead.findUnique({
      where: { id: payload.leadId },
      select: { auditBatchId: true },
    });

    const batch = currentLeadForBatch?.auditBatchId
      ? await tx.auditBatch.findUnique({
          where: { id: currentLeadForBatch.auditBatchId },
        })
      : await tx.auditBatch.findFirst({
          where: { campaignId: payload.campaignId, status: "PROCESSING" },
          orderBy: { createdAt: "desc" },
        });

    // Track whether top-N finalizer ran and produced job IDs to dispatch
    let topNInterpretJobIds: string[] = [];

    if (batch) {
      const updatedBatch = await tx.auditBatch.update({
        where: { id: batch.id },
        data: { completedLeadCount: { increment: 1 } },
      });

      const isLastLead = updatedBatch.completedLeadCount === batch.leadCount;

      if (batch.topNBriefsCount !== null) {
        // Top-N mode: do NOT dispatch INTERPRET per-lead.
        // Only when the last lead finishes do we select top N and queue briefs.
        if (isLastLead) {
          console.log(`[JoinBarrier.publishIfReady] 🏆 Last lead in batch ${batch.id}. Running top-N finalizer (N=${batch.topNBriefsCount}).`);
          const topLeads = await tx.campaignLead.findMany({
            where: {
              campaignId: payload.campaignId,
              auditBatchId: batch.id,
              aiStatus: "NOT_REQUESTED",
              auditStatus: { in: ["COMPLETED", "PARTIALLY_COMPLETED"] },
            },
            orderBy: { opportunityScore: "desc" },
            take: batch.topNBriefsCount,
            select: { id: true },
          });

          if (topLeads.length > 0) {
            const topLeadIds = topLeads.map((l) => l.id);
            await tx.campaignLead.updateMany({
              where: { id: { in: topLeadIds } },
              data: { aiStatus: "QUEUED" },
            });

            // Create INTERPRET Job rows for each top lead
            for (const topLead of topLeads) {
              let interpret = await tx.job.findFirst({
                where: { leadId: topLead.id, campaignId: payload.campaignId, kind: "INTERPRET" },
                orderBy: { createdAt: "desc" },
              });
              if (!interpret) {
                interpret = await tx.job.create({
                  data: {
                    campaignId: payload.campaignId,
                    organizationId: payload.organizationId,
                    leadId: topLead.id,
                    kind: "INTERPRET",
                    status: "PENDING",
                  },
                });
                console.log(`[JoinBarrier.publishIfReady] 📋 Created INTERPRET Job row for top-N lead ${topLead.id}: ${interpret.id}`);
              }
              if (!interpret.dispatchedAt) {
                topNInterpretJobIds.push(interpret.id);
              }
            }
          }
        } else {
          console.log(`[JoinBarrier.publishIfReady] ℹ️ Top-N mode: waiting for remaining ${batch.leadCount - updatedBatch.completedLeadCount} lead(s) in batch ${batch.id}.`);
        }

        // In top-N mode, skip the per-lead INTERPRET dispatch below
        const leads = await tx.campaignLead.findMany({
          where: { campaignId: payload.campaignId },
          select: { auditStatus: true },
        });
        const nextCampaign = campaignOutcome(leads.map((lead) => lead.auditStatus));
        const completedReservations: { id: string; units: number }[] = [];
        if (nextCampaign) {
          console.log(`[JoinBarrier.publishIfReady] 🏆 All campaign leads evaluated! Campaign status -> "${nextCampaign}"`);
          await tx.campaign.updateMany({
            where: { id: payload.campaignId, status: { in: ["PROCESSING", "DISCOVERING"] } },
            data: { status: nextCampaign },
          });
          const processingBatches = await tx.auditBatch.findMany({
            where: { campaignId: payload.campaignId, status: "PROCESSING" },
          });
          for (const pb of processingBatches) {
            await tx.auditBatch.update({
              where: { id: pb.id },
              data: {
                status: "COMPLETED",
                completedAt: new Date(),
                unitsConsumed: pb.unitsEstimated,
              },
            });
            if (pb.reservationId) {
              const units = typeof pb.unitsEstimated === "number" ? pb.unitsEstimated : (pb.unitsEstimated as any).toNumber();
              completedReservations.push({ id: pb.reservationId, units });
            }
          }
        }
        return { interpretJobId: null, interpretJobIds: topNInterpretJobIds, completedReservations, settledLeadId: payload.leadId };
      }
      // else: fall through to per-lead logic below (topNBriefsCount is null)
    }

    // ---------------------------------------------------------------------------
    // Per-lead campaign outcome check (existing logic)
    // ---------------------------------------------------------------------------
    const leads = await tx.campaignLead.findMany({
      where: { campaignId: payload.campaignId },
      select: { auditStatus: true },
    });
    const nextCampaign = campaignOutcome(leads.map((lead) => lead.auditStatus));
    const completedReservations: { id: string; units: number }[] = [];
    if (nextCampaign) {
      console.log(`[JoinBarrier.publishIfReady] 🏆 All campaign leads evaluated! Campaign status -> "${nextCampaign}"`);
      await tx.campaign.updateMany({
        where: { id: payload.campaignId, status: { in: ["PROCESSING", "DISCOVERING"] } },
        data: { status: nextCampaign },
      });
      const processingBatches = await tx.auditBatch.findMany({
        where: { campaignId: payload.campaignId, status: "PROCESSING" },
      });
      for (const pb of processingBatches) {
        await tx.auditBatch.update({
          where: { id: pb.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            unitsConsumed: pb.unitsEstimated,
          },
        });
        if (pb.reservationId) {
          const units = typeof pb.unitsEstimated === "number" ? pb.unitsEstimated : (pb.unitsEstimated as any).toNumber();
          completedReservations.push({ id: pb.reservationId, units });
        }
      }
    }

    const currentLead = await tx.campaignLead.findUnique({
      where: { id: payload.leadId },
      select: { aiStatus: true },
    });

    // Only dispatch INTERPRET if AI Brief generation was explicitly requested (aiStatus === "QUEUED" or "PENDING")
    if (currentLead?.aiStatus !== "QUEUED" && currentLead?.aiStatus !== "PENDING") {
      console.log(`[JoinBarrier.publishIfReady] ℹ️ AI Brief not requested for lead ${payload.leadId} (aiStatus: ${currentLead?.aiStatus}). Settling lead report.`);
      return { interpretJobId: null, interpretJobIds: [], completedReservations, settledLeadId: payload.leadId };
    }

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
      return { interpretJobId: null, interpretJobIds: [], completedReservations, settledLeadId: null };
    }

    return { interpretJobId: interpret.id, interpretJobIds: [], completedReservations, settledLeadId: null };
  });

  const creditService = new CreditService(prisma);
  if (settledLeadId) {
    await creditService.settleLeadReport(settledLeadId, { reason: "Complete audit report generated" }).catch(() => {});
  }

  // Finalize any completed credit reservations
  if (completedReservations.length > 0) {
    for (const res of completedReservations) {
      await creditService.commitReservation(res.id, res.units).catch(() => {});
    }
  }

  // Dispatch top-N INTERPRET jobs (finalizer path)
  if (interpretJobIds.length > 0) {
    const dispatcher = new JobDispatcher(prisma, queue);
    for (const jobId of interpretJobIds) {
      console.log(`[JoinBarrier.publishIfReady] 📤 Dispatching top-N interpret job ${jobId}`);
      await dispatcher.dispatchJob(jobId);
    }
    return;
  }

  if (!interpretJobId) return;
  console.log(`[JoinBarrier.publishIfReady] 📤 Dispatching downstream interpret job ${interpretJobId}`);
  const dispatcher = new JobDispatcher(prisma, queue);
  await dispatcher.dispatchJob(interpretJobId);
}
