import { OpportunityConfidence, Prisma, PrismaClient } from "@prisma/client";
import { AiBriefResult, BriefData } from "@plugins/ai/ai.types";
import { claimJob, JobClaim, releaseJob } from "@features/jobs/job-lock";
import { finishJob } from "./audit-write";
import { persistLeadScore } from "./scoring/lead-scoring";
import { LeadScoreBreakdown } from "./scoring/score-types";

export class InterpretRepository {
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

  findLeadForInterpret(leadId: string) {
    return this.prisma.campaignLead.findUnique({
      where: { id: leadId },
      include: {
        campaign: true,
        business: true,
        audits: {
          include: { findings: true },
        },
      },
    });
  }

  findLatestSnapshot(organizationId: string, businessId: string) {
    return this.prisma.websiteSnapshot.findFirst({
      where: {
        businessId,
        organizationId,
      },
      orderBy: { createdAt: "desc" },
      include: { pages: true },
    });
  }

  findActiveServiceOffers(organizationId: string) {
    return this.prisma.serviceOffer.findMany({
      where: { organizationId, active: true },
      select: { name: true, codes: true, active: true },
    });
  }

  findLatestAuditAttempts(leadId: string) {
    return this.prisma.auditAttempt.findMany({
      where: { leadId },
      orderBy: { observedAt: "desc" },
      distinct: ["module"],
      select: { module: true, status: true, observedAt: true },
    });
  }

  async saveInterpretation(input: {
    organizationId: string;
    campaignId: string;
    leadId: string;
    opportunityScore: number;
    scoreBreakdown: LeadScoreBreakdown;
    brief: BriefData;
    modelName: string;
    tokenUsage?: AiBriefResult["tokenUsage"];
    performanceAuditScore: number | null;
    websiteClass: string;
    techStack: string[];
  }): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Deterministic row lock on CampaignLead to strictly follow the ORDER BY id ASC protocol
      // and prevent deadlocks with concurrent bulk user edits
      await tx.$queryRaw(
        Prisma.sql`SELECT id FROM "CampaignLead" WHERE id = ${input.leadId} FOR UPDATE`
      );

      await persistLeadScore(tx, input.leadId, input.scoreBreakdown);

      const briefFields = {
        status: "DRAFT" as const,
        aiStatus: "COMPLETED" as const,
        headlineOpportunity: input.brief.headlineOpportunity.slice(0, 300),
        suggestedService: input.brief.suggestedService.slice(0, 200),
        confidence: input.brief.confidence as OpportunityConfidence,
        valueProposition: input.brief.valueProposition,
        outreachAngle: input.brief.outreachAngle,
        coldEmailDraft: input.brief.coldEmailDraft,
        callScriptDraft: input.brief.callScriptDraft,
        content: {
          keyFindings: input.brief.keyFindings,
          metricsSummary: {
            opportunityScore: input.opportunityScore,
            gapIndex: input.scoreBreakdown.gapIndex,
            agencyFitScore: input.scoreBreakdown.agencyFitScore,
            commercialViability: input.scoreBreakdown.commercialViability,
            evalState: input.scoreBreakdown.evalState,
            evidenceFreshness: input.scoreBreakdown.evidenceFreshness,
            performanceAuditScore: input.performanceAuditScore,
            websiteClass: input.websiteClass,
            techStack: input.techStack,
          },
        },
        modelName: input.modelName,
      };

      await tx.brief.upsert({
        where: { leadId: input.leadId },
        create: {
          organizationId: input.organizationId,
          leadId: input.leadId,
          ...briefFields,
        },
        update: briefFields,
      });

      await tx.campaignLead.update({
        where: { id: input.leadId },
        data: {
          opportunityScore: input.opportunityScore,
          aiStatus: "COMPLETED",
        },
      });

      if (input.tokenUsage?.inputTokens) {
        await tx.usageEvent.create({
          data: {
            organizationId: input.organizationId,
            campaignId: input.campaignId,
            kind: "LLM_INPUT_TOKEN",
            quantity: input.tokenUsage.inputTokens,
          },
        });
      }
      if (input.tokenUsage?.outputTokens) {
        await tx.usageEvent.create({
          data: {
            organizationId: input.organizationId,
            campaignId: input.campaignId,
            kind: "LLM_OUTPUT_TOKEN",
            quantity: input.tokenUsage.outputTokens,
          },
        });
      }
    });
  }
}

