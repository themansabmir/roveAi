/**
 * Lead Scoring Engine Types & Contracts
 */

export const OPPORTUNITY_SCORE_DISCLAIMER =
  "Gap Index reflects technical deficiencies and potential service need. It is NOT a predictive probability of purchase." as const;

export type DimensionAvailability = "COMPLETE" | "PARTIAL" | "UNAVAILABLE";

export type EvaluationState = "COMPLETE" | "PARTIAL" | "UNAVAILABLE";

export interface ScoringFactor {
  code: string;
  label: string;
  impact: number;
  evidence?: Record<string, unknown>;
}

export interface DimensionResult {
  score: number | null; // 0-100 when available; null when UNAVAILABLE
  availability: DimensionAvailability;
  coverage: number; // 0.0 to 1.0 ratio of applicable probes assessed
  factors: ScoringFactor[];
  missingProbes: string[];
}

export interface GapIndexResult extends DimensionResult {
  presenceGap: number;
  technicalGap: number | null;
  technicalCoverage: number;
  presenceCoverage: number;
}

export interface CommercialViabilityResult extends DimensionResult {
  volumeSignal: number | null;
  sentimentSignal: number | null;
}

export interface AgencyFitResult extends DimensionResult {
  primaryMatch: number;
  secondaryUpsell: number;
  nicheAlignment: number;
}

/**
 * Specification contract: includes exact numbers (or null) + mandatory disclaimer
 */
export interface LeadScoreBreakdown {
  gapIndex: number | null;
  agencyFitScore: number | null;
  commercialViability: number | null;

  // Composite priority ranking (null if insufficient evidence weight)
  priorityRank: number | null;

  // Granular dimension breakdowns:
  dimensions: {
    gap: GapIndexResult;
    viability: CommercialViabilityResult;
    fit: AgencyFitResult;
  };

  evalState: EvaluationState;
  availableWeights: number;
  evidenceFreshness: "FRESH" | "STALE" | "DEGRADED" | "UNAUDITED";
  lastVerifiedAt: string | null;

  disclaimer: "Gap Index reflects technical deficiencies and potential service need. It is NOT a predictive probability of purchase.";
}

