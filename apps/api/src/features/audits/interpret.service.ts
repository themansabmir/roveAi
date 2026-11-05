import { OpportunityConfidence, PrismaClient } from "@prisma/client";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { claimJob, releaseJob } from "@features/jobs/job-lock";
import { IAiService } from "@plugins/ai/ai.plugin";
import { AiEvidenceContext, BriefData, BriefDataSchema } from "@plugins/ai/ai.types";
import { finishJob } from "./audit-write";

export { BriefDataSchema };
export type { BriefData };

export class InterpretService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly ai: IAiService,
    private readonly jobTimeoutMs = 120_000
  ) {}

  async run(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void> {
    console.log(`[InterpretService.run] 🧠 Interpret AI reasoning started for lead: ${payload.leadId} (jobId: ${payload.jobId})`);
    const claim = await claimJob(this.prisma, payload.jobId, this.jobTimeoutMs);
    console.log(`[InterpretService.run] 🔒 Job claim result: "${claim}" for jobId: ${payload.jobId}`);
    if (claim === "done") return;
    if (claim !== "ready") return;

    try {
      await this.execute(payload);
    } catch (err) {
      const msg = errorMessage(err);
      if (meta.retrycount >= meta.retrylimit) {
        console.error(`[InterpretService.run] ❌ Interpret terminal failure:`, err);
        await finishJob(this.prisma, payload.jobId, "FAILED", msg);
      } else {
        console.warn(`[InterpretService.run] ⚠️ Retrying after error: ${msg}`);
        await releaseJob(this.prisma, payload.jobId);
      }
      throw err;
    }
  }

  private async execute(payload: AuditJobPayload): Promise<void> {
    const lead = await this.prisma.campaignLead.findUnique({
      where: { id: payload.leadId },
      include: {
        campaign: true,
        business: true,
        audits: {
          include: { findings: true },
        },
      },
    });

    if (!lead || lead.campaign.status === "CANCELLED") {
      console.log(`[InterpretService.execute] 🛑 Campaign lead missing or cancelled`);
      await finishJob(this.prisma, payload.jobId, "CANCELLED");
      return;
    }

    const snapshot = await this.prisma.websiteSnapshot.findFirst({
      where: {
        businessId: lead.businessId,
        organizationId: payload.organizationId,
      },
      orderBy: { createdAt: "desc" },
      include: { pages: true },
    });

    // 1. Calculate deterministic objective opportunity score
    const opportunityScore = this.computeOpportunityScore(lead, snapshot);
    console.log(`[InterpretService.execute] 🎯 Computed opportunity score: ${opportunityScore}/100 for lead ${lead.id}`);

    // 2. Synthesize AI brief via injected AI Plugin (Gemini -> OpenAI -> Deterministic Fallback)
    const context = this.buildEvidenceContext(lead, snapshot, opportunityScore);
    const { brief, modelName, tokenUsage } = await this.ai.generateOpportunityBrief(context);
    console.log(`[InterpretService.execute] ✨ Brief synthesized with model "${modelName}": "${brief.headlineOpportunity}"`);

    // 3. Database write: Brief record + Lead status & score update
    await this.prisma.$transaction(async (tx) => {
      const safeTechStack = Array.isArray(snapshot?.techStack) ? (snapshot.techStack as string[]) : [];

      await tx.brief.upsert({
        where: { leadId: lead.id },
        create: {
          organizationId: payload.organizationId,
          leadId: lead.id,
          status: "DRAFT",
          aiStatus: "COMPLETED",
          headlineOpportunity: brief.headlineOpportunity.slice(0, 300),
          suggestedService: brief.suggestedService.slice(0, 200),
          confidence: brief.confidence as OpportunityConfidence,
          valueProposition: brief.valueProposition,
          outreachAngle: brief.outreachAngle,
          coldEmailDraft: brief.coldEmailDraft,
          callScriptDraft: brief.callScriptDraft,
          content: {
            keyFindings: brief.keyFindings,
            metricsSummary: {
              opportunityScore,
              performanceAuditScore: lead.audits.find((a) => a.module === "PERFORMANCE")?.score ?? null,
              websiteClass: lead.business.websiteClass,
              techStack: safeTechStack,
            },
          },
          modelName,
        },
        update: {
          status: "DRAFT",
          aiStatus: "COMPLETED",
          headlineOpportunity: brief.headlineOpportunity.slice(0, 300),
          suggestedService: brief.suggestedService.slice(0, 200),
          confidence: brief.confidence as OpportunityConfidence,
          valueProposition: brief.valueProposition,
          outreachAngle: brief.outreachAngle,
          coldEmailDraft: brief.coldEmailDraft,
          callScriptDraft: brief.callScriptDraft,
          content: {
            keyFindings: brief.keyFindings,
            metricsSummary: {
              opportunityScore,
              performanceAuditScore: lead.audits.find((a) => a.module === "PERFORMANCE")?.score ?? null,
              websiteClass: lead.business.websiteClass,
              techStack: safeTechStack,
            },
          },
          modelName,
        },
      });

      await tx.campaignLead.update({
        where: { id: lead.id },
        data: {
          opportunityScore,
          aiStatus: "COMPLETED",
        },
      });

      if (tokenUsage?.inputTokens) {
        await tx.usageEvent.create({
          data: {
            organizationId: payload.organizationId,
            campaignId: payload.campaignId,
            kind: "LLM_INPUT_TOKEN",
            quantity: tokenUsage.inputTokens,
          },
        });
      }
      if (tokenUsage?.outputTokens) {
        await tx.usageEvent.create({
          data: {
            organizationId: payload.organizationId,
            campaignId: payload.campaignId,
            kind: "LLM_OUTPUT_TOKEN",
            quantity: tokenUsage.outputTokens,
          },
        });
      }
    });

    console.log(`[InterpretService.execute] ✅ Brief stored in DB for lead ${lead.id}`);
    await finishJob(this.prisma, payload.jobId, "COMPLETED");
  }

  /**
   * Deterministic opportunity scoring (0–100)
   * High score = high pain points = high value sales opportunity.
   */
  computeOpportunityScore(
    lead: {
      qualificationStatus?: string;
      auditStatus?: string;
      business: {
        websiteClass?: string | null;
        rating?: number | null;
        reviewCount?: number | null;
      };
      audits: Array<{
        module: string;
        score?: number | null;
        findings: Array<{ code: string; severity?: string }>;
      }>;
    },
    snapshot: {
      techStack?: unknown;
      pages?: Array<{ extracted?: unknown }>;
    } | null
  ): number {
    if (lead.qualificationStatus === "DISQUALIFIED") return 0;

    const wClass = lead.business.websiteClass;
    if (wClass === "MISSING") return 88;
    if (wClass === "SOCIAL_ONLY") return 78;
    if (wClass === "DIRECTORY_ONLY") return 72;

    let score = 40; // Baseline for owned site

    const perfAudit = lead.audits.find((a) => a.module === "PERFORMANCE");
    if (perfAudit && typeof perfAudit.score === "number") {
      if (perfAudit.score < 45) score += 25;
      else if (perfAudit.score < 70) score += 18;
      else if (perfAudit.score < 85) score += 8;
    }

    const findingCodes = new Set(lead.audits.flatMap((a) => a.findings.map((f) => f.code)));

    if (findingCodes.has("SLOW_LCP")) score += 10;
    if (findingCodes.has("HIGH_CLS")) score += 6;
    if (findingCodes.has("SLOW_INP")) score += 6;
    if (findingCodes.has("MISSING_TITLE")) score += 10;
    if (findingCodes.has("MISSING_META_DESCRIPTION")) score += 8;
    if (findingCodes.has("MISSING_H1") || findingCodes.has("MULTIPLE_H1")) score += 5;
    if (findingCodes.has("MISSING_ONLINE_BOOKING")) score += 12;
    if (findingCodes.has("MISSING_CONTACT_INFO")) score += 10;

    const hasForms = (snapshot?.pages ?? []).some((p) => {
      const ext = p.extracted as { forms?: unknown[] } | undefined;
      return (ext?.forms?.length ?? 0) > 0;
    });
    if (!hasForms && (snapshot?.pages?.length ?? 0) > 0) {
      score += 5;
    }

    const reviews = lead.business.reviewCount ?? 0;
    const rating = lead.business.rating ?? 0;
    if (reviews >= 50 && rating >= 4.0) {
      score += 8;
    } else if (reviews >= 10 && rating < 4.0) {
      score += 10;
    }

    return Math.min(99, Math.max(10, score));
  }

  buildEvidenceContext(
    lead: {
      campaign?: { niche?: string; serviceType?: string; city?: string; region?: string };
      business: {
        name: string;
        city?: string | null;
        rating?: number | null;
        reviewCount?: number | null;
        websiteUrl: string | null;
        websiteClass?: string | null;
      };
      audits: Array<{
        module: string;
        score?: number | null;
        metrics?: unknown;
        findings: Array<{
          code?: string;
          severity?: string;
          message?: string;
        }>;
      }>;
    },
    snapshot: {
      title?: string | null;
      techStack?: unknown;
      pages?: Array<unknown>;
    } | null,
    opportunityScore: number
  ): AiEvidenceContext {
    const perfAudit = lead.audits.find((a) => a.module === "PERFORMANCE");
    const perfMetrics = (perfAudit?.metrics as Record<string, unknown>) || {};

    const findingMessages = lead.audits.flatMap((a) =>
      a.findings.map((f) => f.message).filter((m): m is string => Boolean(m))
    );

    const techStack = Array.isArray(snapshot?.techStack)
      ? (snapshot.techStack as string[])
      : [];

    return {
      businessName: lead.business.name,
      niche: lead.campaign?.niche || "Local Business",
      serviceTarget: lead.campaign?.serviceType || "Digital Presence & Web Optimization",
      city: lead.campaign?.city || lead.business.city || "Local",
      rating: lead.business.rating ?? null,
      reviewCount: lead.business.reviewCount ?? null,
      websiteUrl: lead.business.websiteUrl ?? null,
      websiteClass: lead.business.websiteClass || "OWNED_SITE",
      techStack,
      lighthouseScore: typeof perfAudit?.score === "number" ? perfAudit.score : null,
      lcpMs: typeof perfMetrics.lcp_ms === "number" ? perfMetrics.lcp_ms : null,
      cls: typeof perfMetrics.cls === "number" ? perfMetrics.cls : null,
      findingMessages,
      opportunityScore,
    };
  }
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
