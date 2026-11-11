import { AuditJobPayload } from "@plugins/queue/queue.types";
import { IAiService } from "@plugins/ai/ai.plugin";
import { AiEvidenceContext, BriefData, BriefDataSchema } from "@plugins/ai/ai.types";
import { InterpretRepository } from "./interpret.repository";
import { computeLeadScoreBreakdown } from "./scoring/lead-scoring";
import { LeadScoreBreakdown } from "./scoring/score-types";

export { BriefDataSchema };
export type { BriefData };

export class InterpretService {
  constructor(
    private readonly repository: InterpretRepository,
    private readonly ai: IAiService,
    private readonly jobTimeoutMs = 120_000
  ) {}

  async run(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void> {
    console.log(`[InterpretService.run] 🧠 Interpret AI reasoning started for lead: ${payload.leadId} (jobId: ${payload.jobId})`);
    const claim = await this.repository.claimJob(payload.jobId, this.jobTimeoutMs);
    console.log(`[InterpretService.run] 🔒 Job claim result: "${claim}" for jobId: ${payload.jobId}`);
    if (claim === "done") return;
    if (claim !== "ready") return;

    try {
      await this.execute(payload);
    } catch (err) {
      const msg = errorMessage(err);
      if (meta.retrycount >= meta.retrylimit) {
        console.error(`[InterpretService.run] ❌ Interpret terminal failure:`, err);
        await this.repository.finishJob(payload.jobId, "FAILED", msg);
      } else {
        console.warn(`[InterpretService.run] ⚠️ Retrying after error: ${msg}`);
        await this.repository.releaseJob(payload.jobId);
      }
      throw err;
    }
  }

  private async execute(payload: AuditJobPayload): Promise<void> {
    const lead = await this.repository.findLeadForInterpret(payload.leadId);

    if (!lead || lead.campaign.status === "CANCELLED") {
      console.log(`[InterpretService.execute] 🛑 Campaign lead missing or cancelled`);
      await this.repository.finishJob(payload.jobId, "CANCELLED");
      return;
    }

    const snapshot = await this.repository.findLatestSnapshot(
      payload.organizationId,
      lead.businessId
    );

    // 1. Fetch agency service offers and execution attempts for lead scoring
    const serviceOffers = await this.repository.findActiveServiceOffers(payload.organizationId);
    const latestAttempts = await this.repository.findLatestAuditAttempts(payload.leadId);

    // 2. Calculate deterministic 3D lead score breakdown & composite priority rank
    const scoreBreakdown = computeLeadScoreBreakdown({
      lead,
      serviceOffers,
      latestAttempts,
    });
    const opportunityScore = scoreBreakdown.priorityRank ?? 0;
    console.log(`[InterpretService.execute] 🎯 3D Score: gapIndex=${scoreBreakdown.gapIndex}, fit=${scoreBreakdown.agencyFitScore}, viability=${scoreBreakdown.commercialViability} -> priorityRank=${scoreBreakdown.priorityRank}`);

    // 3. Synthesize AI brief via injected AI Plugin (Gemini -> OpenAI -> Deterministic Fallback)
    const context = this.buildEvidenceContext(lead, snapshot, opportunityScore, scoreBreakdown);
    const { brief, modelName, tokenUsage } = await this.ai.generateOpportunityBrief(context);
    console.log(`[InterpretService.execute] ✨ Brief synthesized with model "${modelName}": "${brief.headlineOpportunity}"`);

    // 4. Database write: Persist LeadScore, Brief record + Lead status & score update
    const safeTechStack = Array.isArray(snapshot?.techStack) ? (snapshot.techStack as string[]) : [];
    await this.repository.saveInterpretation({
      organizationId: payload.organizationId,
      campaignId: payload.campaignId,
      leadId: lead.id,
      opportunityScore,
      scoreBreakdown,
      brief,
      modelName,
      tokenUsage,
      performanceAuditScore: lead.audits.find((a) => a.module === "PERFORMANCE")?.score ?? null,
      websiteClass: lead.business.websiteClass,
      techStack: safeTechStack,
    });

    console.log(`[InterpretService.execute] ✅ Brief & LeadScore stored in DB for lead ${lead.id}`);
    await this.repository.finishJob(payload.jobId, "COMPLETED");
  }

  /**
   * Deterministic opportunity scoring (0–100).
   * Kept for backward compatibility with existing tests and callers.
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
    opportunityScore: number,
    scoreBreakdown?: LeadScoreBreakdown
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
      scoreBreakdown: scoreBreakdown
        ? {
            gapIndex: scoreBreakdown.gapIndex,
            agencyFitScore: scoreBreakdown.agencyFitScore,
            commercialViability: scoreBreakdown.commercialViability,
            priorityRank: scoreBreakdown.priorityRank,
            disclaimer: scoreBreakdown.disclaimer,
            evidenceFreshness: scoreBreakdown.evidenceFreshness,
          }
        : undefined,
    };
  }
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
