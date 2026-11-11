import { describe, expect, it, vi } from "vitest";
import {
  computeLeadScoreBreakdown,
  confidenceFromBreakdown,
  persistLeadScore,
} from "./lead-scoring";
import { OPPORTUNITY_SCORE_DISCLAIMER } from "./score-types";
import { OpportunityConfidence } from "@prisma/client";

describe("Three-Dimensional Lead Scoring Engine (Orchestrator)", () => {
  const baseLead = {
    id: "lead-test-123",
    campaign: {
      niche: "Dental Clinics",
      serviceType: "Core Web Vitals & Speed Optimization",
      city: "Austin",
      region: "TX",
    },
    business: {
      category: "Dentist",
      rating: 4.8,
      reviewCount: 95,
      websiteUrl: "https://austindental.example.com",
      websiteClass: "OWNED_SITE",
      phone: "+15125550199",
      email: "hello@austindental.example.com",
      address: "100 Main St, Austin, TX",
    },
    audits: [
      {
        module: "PERFORMANCE",
        status: "COMPLETED",
        score: 32,
        observedAt: new Date("2026-11-10T10:00:00Z"),
        findings: [
          { code: "SLOW_LCP", severity: "HIGH", message: "LCP is 4.8s" },
          { code: "HIGH_CLS", severity: "MEDIUM", message: "CLS is 0.22" },
        ],
      },
      {
        module: "TECHNICAL_SEO",
        status: "COMPLETED",
        score: 45,
        observedAt: new Date("2026-11-10T10:00:00Z"),
        findings: [
          { code: "MISSING_TITLE", severity: "HIGH", message: "No title tag" },
        ],
      },
      {
        module: "WEBSITE_EXPERIENCE",
        status: "COMPLETED",
        score: 50,
        observedAt: new Date("2026-11-10T10:00:00Z"),
        findings: [
          { code: "NO_CONTACT_FORM", severity: "HIGH", message: "No lead form" },
        ],
      },
    ],
  };

  it("1. Severe technical deficiencies significantly increase the Gap Index", () => {
    const breakdown = computeLeadScoreBreakdown({ lead: baseLead });

    // Performance score 32 (30 pts) + CWV bottlenecks (13 pts) + SEO missing title (8 pts) + Experience (6 pts) = 57
    expect(breakdown.gapIndex).toBeGreaterThanOrEqual(50);
    expect(breakdown.dimensions.gap.availability).toBe("COMPLETE");
  });

  it("2. Strong alignment between agency service and business weaknesses yields high Agency Fit Score", () => {
    const breakdown = computeLeadScoreBreakdown({ lead: baseLead });

    // Service matches speed (SLOW_LCP) + niche match + single service offering = 60 + 10 + 20 = 90
    expect(breakdown.agencyFitScore).toBe(90);
    expect(breakdown.dimensions.fit.primaryMatch).toBe(60);
  });

  it("3. Commercial Viability reflects review activity and customer sentiment", () => {
    const breakdown = computeLeadScoreBreakdown({ lead: baseLead });

    // Review count: 95 (40 pts) + Rating: 4.8 (50 pts) = 90
    expect(breakdown.commercialViability).toBe(90);
    expect(breakdown.dimensions.viability.volumeSignal).toBe(40);
    expect(breakdown.dimensions.viability.sentimentSignal).toBe(50);
  });

  it("4. AUDIT_FAILED is NOT treated as a negative technical finding", () => {
    const failedLead = {
      ...baseLead,
      audits: [
        {
          module: "PERFORMANCE",
          status: "AUDIT_FAILED",
          score: null,
          observedAt: new Date(),
          findings: [],
        },
      ],
    };

    const breakdown = computeLeadScoreBreakdown({ lead: failedLead });

    // Gap index should not be inflated due to crawler failure; it should be null (UNAVAILABLE)
    // because OWNED_SITE requires at least one successful audit
    expect(breakdown.gapIndex).toBeNull();
    expect(breakdown.dimensions.gap.availability).toBe("UNAVAILABLE");
  });

  it("5. Priority rank uses renormalization formula when dimensions are missing", () => {
    // Lead with no agency service configured -> fit is UNAVAILABLE
    const unconfiguredAgencyLead = {
      ...baseLead,
      campaign: null,
    };

    const breakdown = computeLeadScoreBreakdown({
      lead: unconfiguredAgencyLead,
      serviceOffers: [],
    });

    expect(breakdown.agencyFitScore).toBeNull();
    expect(breakdown.dimensions.fit.availability).toBe("UNAVAILABLE");

    // Available weights = W_GAP (0.50) + W_VIAB (0.30) = 0.80 >= 0.50 threshold
    expect(breakdown.availableWeights).toBe(0.80);
    expect(breakdown.evalState).toBe("PARTIAL");

    // Renormalized: round((gapIndex * 0.50 + commercialViability * 0.30) / 0.80)
    const expectedRank = Math.round(
      ((breakdown.gapIndex! * 0.50) + (breakdown.commercialViability! * 0.30)) / 0.80
    );
    expect(breakdown.priorityRank).toBe(expectedRank);
  });

  it("6. Priority rank is null if available dimension weight < 0.50", () => {
    // Only commercial viability available (W_VIAB = 0.30 < 0.50)
    const sparseLead = {
      id: "sparse-lead-1",
      campaign: null,
      business: {
        category: "Plumber",
        rating: 4.5,
        reviewCount: 30,
        websiteUrl: "https://example.com",
        websiteClass: "OWNED_SITE",
      },
      audits: [
        {
          module: "PERFORMANCE",
          status: "AUDIT_FAILED",
          score: null,
          findings: [],
        },
      ],
    };

    const breakdown = computeLeadScoreBreakdown({
      lead: sparseLead,
      serviceOffers: [],
    });

    expect(breakdown.gapIndex).toBeNull();
    expect(breakdown.agencyFitScore).toBeNull();
    expect(breakdown.commercialViability).toBe(80); // 30 (rc 30) + 50 (rt 4.5) = 80
    expect(breakdown.availableWeights).toBe(0.30);
    expect(breakdown.priorityRank).toBeNull();
    expect(breakdown.evalState).toBe("UNAVAILABLE");
  });

  it("7. Scores are always clamped to the 0-100 range", () => {
    const extremeLead = {
      ...baseLead,
      audits: [
        {
          module: "PERFORMANCE",
          status: "COMPLETED",
          score: 5,
          findings: [
            { code: "SLOW_LCP" },
            { code: "HIGH_CLS" },
            { code: "HIGH_INP" },
          ],
        },
        {
          module: "TECHNICAL_SEO",
          status: "COMPLETED",
          score: 10,
          findings: [
            { code: "ROBOTS_NOINDEX" },
            { code: "MISSING_TITLE" },
            { code: "CANONICAL_MISMATCH" },
          ],
        },
        {
          module: "WEBSITE_EXPERIENCE",
          status: "COMPLETED",
          score: 10,
          findings: [
            { code: "NO_CONTACT_FORM" },
            { code: "NO_TEL_LINK" },
            { code: "PAGE_LOAD_TIMEOUT" },
          ],
        },
      ],
    };

    const breakdown = computeLeadScoreBreakdown({ lead: extremeLead });

    expect(breakdown.gapIndex!).toBeLessThanOrEqual(100);
    expect(breakdown.gapIndex!).toBeGreaterThanOrEqual(0);
    expect(breakdown.agencyFitScore!).toBeLessThanOrEqual(100);
    expect(breakdown.agencyFitScore!).toBeGreaterThanOrEqual(0);
    expect(breakdown.commercialViability!).toBeLessThanOrEqual(100);
    expect(breakdown.commercialViability!).toBeGreaterThanOrEqual(0);
    expect(breakdown.priorityRank!).toBeLessThanOrEqual(100);
    expect(breakdown.priorityRank!).toBeGreaterThanOrEqual(0);
  });

  it("8. Scores are deterministic given identical inputs", () => {
    const run1 = computeLeadScoreBreakdown({ lead: baseLead });
    const run2 = computeLeadScoreBreakdown({ lead: baseLead });

    expect(run1).toEqual(run2);
  });

  it("9. The disclaimer is returned verbatim in the breakdown", () => {
    const breakdown = computeLeadScoreBreakdown({ lead: baseLead });

    expect(breakdown.disclaimer).toBe(
      "Gap Index reflects technical deficiencies and potential service need. It is NOT a predictive probability of purchase."
    );
    expect(breakdown.disclaimer).toBe(OPPORTUNITY_SCORE_DISCLAIMER);
  });

  it("resolves evidence freshness according to strict precedence (FRESH / DEGRADED / STALE)", () => {
    // When latest attempt failed after a historical completed audit, freshness is DEGRADED
    const breakdown = computeLeadScoreBreakdown({
      lead: baseLead,
      latestAttempts: [
        {
          module: "PERFORMANCE",
          status: "AUDIT_FAILED",
          observedAt: new Date("2026-11-10T12:00:00Z"),
        },
      ],
    });

    expect(breakdown.evidenceFreshness).toBe("DEGRADED");
  });

  it("computes OpportunityConfidence correctly", () => {
    const fullBreakdown = computeLeadScoreBreakdown({ lead: baseLead });
    expect(confidenceFromBreakdown(fullBreakdown)).toBe(OpportunityConfidence.HIGH);

    const degradedBreakdown = computeLeadScoreBreakdown({
      lead: baseLead,
      latestAttempts: [
        {
          module: "PERFORMANCE",
          status: "AUDIT_FAILED",
          observedAt: new Date("2026-11-10T12:00:00Z"),
        },
      ],
    });
    // Freshness is DEGRADED, but weight is 1.0 (>= 0.70) => MEDIUM
    expect(confidenceFromBreakdown(degradedBreakdown)).toBe(OpportunityConfidence.MEDIUM);
  });

  it("persists LeadScore and updates CampaignLead opportunityScore atomically", async () => {
    const breakdown = computeLeadScoreBreakdown({ lead: baseLead });

    const txMock = {
      leadScore: {
        upsert: vi.fn().mockResolvedValue({}),
      },
      campaignLead: {
        update: vi.fn().mockResolvedValue({}),
      },
    };

    await persistLeadScore(txMock, "lead-test-123", breakdown);

    expect(txMock.leadScore.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { leadId: "lead-test-123" },
        create: expect.objectContaining({
          leadId: "lead-test-123",
          total: breakdown.priorityRank,
          evidenceScore: breakdown.gapIndex,
          fitScore: breakdown.agencyFitScore,
          relevanceScore: breakdown.commercialViability,
        }),
      })
    );

    expect(txMock.campaignLead.update).toHaveBeenCalledWith({
      where: { id: "lead-test-123" },
      data: {
        opportunityScore: breakdown.priorityRank,
      },
    });
  });
});
