import { describe, expect, it } from "vitest";
import { calculateAgencyFitScore } from "./agency-fit";

describe("Agency Fit Scoring Engine", () => {
  it("returns UNAVAILABLE when neither campaign serviceType nor organization ServiceOffers exist", () => {
    const result = calculateAgencyFitScore({
      campaignServiceType: undefined,
      campaignNiche: "Dental Clinics",
      serviceOffers: [],
      lead: {
        business: {
          websiteClass: "OWNED_SITE",
        },
        audits: [],
      },
    });

    expect(result.score).toBeNull();
    expect(result.availability).toBe("UNAVAILABLE");
    expect(result.coverage).toBe(0.0);
    expect(result.missingProbes).toContain(
      "No campaign serviceType or organization ServiceOffers configured"
    );
  });

  it("scores high fit (90) for Speed Optimization campaign targeting a lead with SLOW_LCP", () => {
    const result = calculateAgencyFitScore({
      campaignServiceType: "Page Speed & Core Web Vitals",
      campaignNiche: "Cosmetic Dentists",
      serviceOffers: [],
      lead: {
        business: {
          category: "Dentist",
          websiteClass: "OWNED_SITE",
        },
        audits: [
          {
            module: "PERFORMANCE",
            status: "COMPLETED",
            score: 35,
            findings: [{ code: "SLOW_LCP" }],
          },
        ],
      },
    });

    // Primary: 60 (CRITICAL_SPEED_MATCH)
    // Upsell: 10 (SINGLE_SERVICE_OFFERING)
    // Niche: 20 (TARGET_NICHE_MATCH)
    // Total = 90
    expect(result.score).toBe(90);
    expect(result.primaryMatch).toBe(60);
    expect(result.secondaryUpsell).toBe(10);
    expect(result.nicheAlignment).toBe(20);
    expect(result.availability).toBe("COMPLETE");
    expect(result.factors.some((f) => f.code === "CRITICAL_SPEED_MATCH")).toBe(true);
  });

  it("scores high fit (95) for Web Redesign campaign targeting a business without a website", () => {
    const result = calculateAgencyFitScore({
      campaignServiceType: "Website Redesign & Modern Web Presence",
      campaignNiche: "HVAC Contractors",
      serviceOffers: [],
      lead: {
        business: {
          category: "HVAC",
          websiteClass: "MISSING",
        },
        audits: [],
      },
    });

    // Primary: 60 (MISSING_WEBSITE_REBUILD_MATCH)
    // Upsell: 10 (SINGLE_SERVICE_OFFERING)
    // Niche: 20 (TARGET_NICHE_MATCH)
    // Total = 90
    expect(result.score).toBe(90);
    expect(result.primaryMatch).toBe(60);
    expect(result.secondaryUpsell).toBe(10);
    expect(result.nicheAlignment).toBe(20);
  });

  it("produces a genuine LOW fit score (not UNAVAILABLE) for a fast site with no performance flaws", () => {
    const result = calculateAgencyFitScore({
      campaignServiceType: "Performance & Core Web Vitals",
      campaignNiche: "Real Estate Agents",
      serviceOffers: [],
      lead: {
        business: {
          websiteClass: "OWNED_SITE",
        },
        audits: [
          {
            module: "PERFORMANCE",
            status: "COMPLETED",
            score: 98,
            findings: [],
          },
        ],
      },
    });

    // Primary: 0 (no performance issue)
    // Upsell: 0
    // Niche: 20 (niche matches)
    // Total = 20
    expect(result.score).toBe(20);
    expect(result.score).not.toBeNull();
    expect(result.availability).toBe("COMPLETE");
    expect(result.primaryMatch).toBe(0);
  });

  it("uses organization-level ServiceOffers when campaignServiceType is not set", () => {
    const result = calculateAgencyFitScore({
      campaignServiceType: null,
      campaignNiche: "Personal Injury Law",
      serviceOffers: [
        {
          name: "Technical SEO Audits",
          codes: ["TECHNICAL_SEO"],
          active: true,
        },
        {
          name: "Conversion Rate Optimization",
          codes: ["BOOKING_CONVERSION"],
          active: true,
        },
      ],
      lead: {
        business: {
          websiteClass: "OWNED_SITE",
        },
        audits: [
          {
            module: "TECHNICAL_SEO",
            status: "COMPLETED",
            score: 40,
            findings: [{ code: "ROBOTS_NOINDEX" }],
          },
        ],
      },
    });

    // Primary: 60 (CRITICAL_SEO_MATCH)
    // Upsell: 20 (MULTI_SERVICE_UPSELL, because 2 active service lines)
    // Niche: 20 (niche matched)
    // Total = 100
    expect(result.score).toBe(100);
    expect(result.primaryMatch).toBe(60);
    expect(result.secondaryUpsell).toBe(20);
    expect(result.nicheAlignment).toBe(20);
    expect(result.factors.some((f) => f.code === "MULTI_SERVICE_UPSELL")).toBe(true);
  });
});
