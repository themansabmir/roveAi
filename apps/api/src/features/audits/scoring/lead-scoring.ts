import { OpportunityConfidence } from "@prisma/client";
import { calculateGapIndex } from "./gap-index";
import { calculateCommercialViability } from "./commercial-viability";
import { calculateAgencyFitScore } from "./agency-fit";
import {
  EvidenceFreshness,
  resolveFreshness,
  extractBusinessEvidence,
} from "../evidence-state";
import {
  LeadScoreBreakdown,
  OPPORTUNITY_SCORE_DISCLAIMER,
  EvaluationState,
} from "./score-types";

export interface CalculateLeadScoreInput {
  lead: {
    id: string;
    organizationId?: string;
    campaign?: {
      niche?: string;
      serviceType?: string;
      city?: string;
      region?: string;
    } | null;
    business: {
      category?: string | null;
      rating?: number | null;
      reviewCount?: number | null;
      websiteUrl?: string | null;
      websiteClass?: string | null;
      phone?: string | null;
      email?: string | null;
      address?: string | null;
      provider?: string | null;
      providerRaw?: unknown;
      enrichmentState?: unknown;
    };
    audits?: Array<{
      module: string;
      status: string;
      score?: number | null;
      observedAt?: Date | string;
      metrics?: unknown;
      findings?: Array<{ code: string; severity?: string; message?: string }>;
    }>;
  };
  serviceOffers?: Array<{ name: string; codes: string[]; active: boolean }>;
  latestAttempts?: Array<{
    module: string;
    status: string;
    observedAt: Date | string;
  }>;
  maxPagesConfigured?: number;
}

export function computeLeadScoreBreakdown(input: CalculateLeadScoreInput): LeadScoreBreakdown {
  const { lead } = input;

  // ─── 1. Dimension Calculations ──────────────────────────────────────────────
  const gapResult = calculateGapIndex({
    websiteClass: lead.business.websiteClass,
    audits: lead.audits ?? [],
    maxPagesConfigured: input.maxPagesConfigured,
  });

  // Extract verified business commercial signals
  const businessEvidence = extractBusinessEvidence(lead.business);
  const viabilityResult = calculateCommercialViability({
    reviewCount: businessEvidence.reviewCount.status === "PRESENT" ? businessEvidence.reviewCount.value : (
      businessEvidence.reviewCount.status === "VERIFIED_ABSENT" ? 0 : null
    ),
    rating: businessEvidence.rating.status === "PRESENT" ? businessEvidence.rating.value : null,
  });

  const fitResult = calculateAgencyFitScore({
    campaignServiceType: lead.campaign?.serviceType,
    campaignNiche: lead.campaign?.niche,
    serviceOffers: input.serviceOffers,
    lead: {
      business: lead.business,
      audits: lead.audits,
    },
  });

  // ─── 2. Evidence Freshness Resolution ───────────────────────────────────────
  const latestAttemptMap = new Map(
    (input.latestAttempts ?? []).map((att) => [att.module, att])
  );

  const moduleFreshnessList: EvidenceFreshness[] = [];
  let mostRecentVerifiedDate: Date | null = null;

  for (const module of ["PERFORMANCE", "TECHNICAL_SEO", "WEBSITE_EXPERIENCE"]) {
    const audit = (lead.audits ?? []).find((a) => a.module === module && a.status === "COMPLETED");
    if (audit?.observedAt) {
      const d = new Date(audit.observedAt);
      if (!mostRecentVerifiedDate || d > mostRecentVerifiedDate) {
        mostRecentVerifiedDate = d;
      }
    }
    const latestAttempt = latestAttemptMap.get(module);
    moduleFreshnessList.push(resolveFreshness(audit, latestAttempt));
  }

  let evidenceFreshness: EvidenceFreshness = "FRESH";
  if (moduleFreshnessList.some((f) => f === "DEGRADED")) {
    evidenceFreshness = "DEGRADED";
  } else if (moduleFreshnessList.some((f) => f === "STALE")) {
    evidenceFreshness = "STALE";
  } else if (moduleFreshnessList.every((f) => f === "UNAUDITED")) {
    evidenceFreshness = "UNAUDITED";
  }

  // ─── 3. Renormalized Composite Priority Calculation ─────────────────────────
  const W_GAP = 0.50;
  const W_VIAB = 0.30;
  const W_FIT = 0.20;

  let availableWeightSum = 0;
  let weightedScoreSum = 0;
  let availableDimensionCount = 0;

  if (gapResult.score !== null) {
    availableWeightSum += W_GAP;
    weightedScoreSum += gapResult.score * W_GAP;
    availableDimensionCount += 1;
  }

  if (viabilityResult.score !== null) {
    availableWeightSum += W_VIAB;
    weightedScoreSum += viabilityResult.score * W_VIAB;
    availableDimensionCount += 1;
  }

  if (fitResult.score !== null) {
    availableWeightSum += W_FIT;
    weightedScoreSum += fitResult.score * W_FIT;
    availableDimensionCount += 1;
  }

  // Minimum Evidence-Weight Threshold: requires at least 0.50 total weight to compute a priority rank
  let priorityRank: number | null = null;
  let evalState: EvaluationState = "UNAVAILABLE";

  if (availableWeightSum >= 0.50) {
    const rawRank = Math.round(weightedScoreSum / availableWeightSum);
    priorityRank = Math.max(0, Math.min(100, rawRank));
    evalState = availableDimensionCount === 3 ? "COMPLETE" : "PARTIAL";
  }

  return {
    gapIndex: gapResult.score,
    agencyFitScore: fitResult.score,
    commercialViability: viabilityResult.score,
    priorityRank,
    dimensions: {
      gap: gapResult,
      viability: viabilityResult,
      fit: fitResult,
    },
    evalState,
    availableWeights: Number(availableWeightSum.toFixed(2)),
    evidenceFreshness,
    lastVerifiedAt: mostRecentVerifiedDate ? mostRecentVerifiedDate.toISOString() : null,
    disclaimer: OPPORTUNITY_SCORE_DISCLAIMER,
  };
}

export function confidenceFromBreakdown(breakdown: LeadScoreBreakdown): OpportunityConfidence {
  if (breakdown.evalState === "COMPLETE" && breakdown.evidenceFreshness === "FRESH") {
    return OpportunityConfidence.HIGH;
  }
  if (breakdown.availableWeights >= 0.70) {
    return OpportunityConfidence.MEDIUM;
  }
  return OpportunityConfidence.LOW;
}

/**
 * Persists calculated LeadScore into database atomically within an existing transaction or client.
 */
export async function persistLeadScore(
  tx: { leadScore: { upsert: any }; campaignLead: { update: any } },
  leadId: string,
  breakdown: LeadScoreBreakdown
): Promise<void> {
  const confidence = confidenceFromBreakdown(breakdown);

  await tx.leadScore.upsert({
    where: { leadId },
    create: {
      leadId,
      total: breakdown.priorityRank,
      evidenceScore: breakdown.gapIndex,
      fitScore: breakdown.agencyFitScore,
      relevanceScore: breakdown.commercialViability,
      confidence,
      breakdown: breakdown as unknown as object,
    },
    update: {
      total: breakdown.priorityRank,
      evidenceScore: breakdown.gapIndex,
      fitScore: breakdown.agencyFitScore,
      relevanceScore: breakdown.commercialViability,
      confidence,
      breakdown: breakdown as unknown as object,
      computedAt: new Date(),
    },
  });

  await tx.campaignLead.update({
    where: { id: leadId },
    data: {
      opportunityScore: breakdown.priorityRank,
    },
  });
}
