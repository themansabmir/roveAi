import { CommercialViabilityResult, ScoringFactor } from "./score-types";

export interface CommercialViabilityInput {
  reviewCount?: number | null;
  rating?: number | null;
}

export function calculateCommercialViability(input: CommercialViabilityInput): CommercialViabilityResult {
  const factors: ScoringFactor[] = [];
  const missingProbes: string[] = [];

  // ─── 1. Volume Signal (0 to 50 pts) ─────────────────────────────────────────
  let volumeSignal: number | null = null;
  const rc = input.reviewCount;

  if (typeof rc === "number" && !Number.isNaN(rc)) {
    if (rc >= 100) {
      volumeSignal = 50;
      factors.push({ code: "HIGH_REVIEW_VOLUME", label: `High customer engagement (${rc} reviews)`, impact: 50 });
    } else if (rc >= 50) {
      volumeSignal = 40;
      factors.push({ code: "ESTABLISHED_REVIEW_VOLUME", label: `Established local business (${rc} reviews)`, impact: 40 });
    } else if (rc >= 20) {
      volumeSignal = 30;
      factors.push({ code: "MODERATE_REVIEW_VOLUME", label: `Active customer volume (${rc} reviews)`, impact: 30 });
    } else if (rc >= 5) {
      volumeSignal = 20;
      factors.push({ code: "GROWING_REVIEW_VOLUME", label: `Modest review activity (${rc} reviews)`, impact: 20 });
    } else if (rc > 0) {
      volumeSignal = 10;
      factors.push({ code: "LOW_REVIEW_VOLUME", label: `Minimal review count (${rc} reviews)`, impact: 10 });
    } else {
      // Confirmed 0 reviews (VERIFIED_ABSENT)
      volumeSignal = 5;
      factors.push({ code: "ZERO_REVIEWS_VERIFIED", label: "Confirmed 0 customer reviews", impact: 5 });
    }
  } else {
    missingProbes.push("probe_review_count");
  }

  // ─── 2. Sentiment Signal (0 to 50 pts) ──────────────────────────────────────
  let sentimentSignal: number | null = null;
  const rt = input.rating;

  if (typeof rt === "number" && !Number.isNaN(rt)) {
    if (rt >= 4.5) {
      sentimentSignal = 50;
      factors.push({ code: "EXCELLENT_RATING", label: `Exceptional customer satisfaction (${rt.toFixed(1)}/5)`, impact: 50 });
    } else if (rt >= 4.0) {
      sentimentSignal = 40;
      factors.push({ code: "STRONG_RATING", label: `Strong local reputation (${rt.toFixed(1)}/5)`, impact: 40 });
    } else if (rt >= 3.5) {
      sentimentSignal = 30;
      factors.push({ code: "AVERAGE_RATING", label: `Average customer feedback (${rt.toFixed(1)}/5)`, impact: 30 });
    } else if (rt >= 3.0) {
      sentimentSignal = 20;
      factors.push({ code: "VULNERABLE_RATING", label: `Subpar customer sentiment (${rt.toFixed(1)}/5)`, impact: 20 });
    } else if (rt > 0) {
      sentimentSignal = 15;
      factors.push({ code: "CRITICAL_RATING", label: `Critical reputation challenge (${rt.toFixed(1)}/5)`, impact: 15 });
    } else {
      sentimentSignal = null;
      missingProbes.push("probe_rating");
    }
  } else {
    missingProbes.push("probe_rating");
  }

  // ─── 3. Aggregation & Availability Handling ─────────────────────────────────
  // Both available
  if (volumeSignal !== null && sentimentSignal !== null) {
    const score = Math.min(100, volumeSignal + sentimentSignal);
    return {
      score,
      availability: "COMPLETE",
      coverage: 1.0,
      volumeSignal,
      sentimentSignal,
      factors,
      missingProbes,
    };
  }

  // Only volume available
  if (volumeSignal !== null && sentimentSignal === null) {
    const score = Math.round((volumeSignal / 50) * 100);
    return {
      score,
      availability: "PARTIAL",
      coverage: 0.5,
      volumeSignal,
      sentimentSignal: null,
      factors,
      missingProbes,
    };
  }

  // Only sentiment available
  if (volumeSignal === null && sentimentSignal !== null) {
    const score = Math.round((sentimentSignal / 50) * 100);
    return {
      score,
      availability: "PARTIAL",
      coverage: 0.5,
      volumeSignal: null,
      sentimentSignal,
      factors,
      missingProbes,
    };
  }

  // Neither available
  return {
    score: null,
    availability: "UNAVAILABLE",
    coverage: 0.0,
    volumeSignal: null,
    sentimentSignal: null,
    factors: [],
    missingProbes,
  };
}

