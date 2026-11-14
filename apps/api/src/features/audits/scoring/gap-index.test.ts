import { describe, expect, it } from "vitest";
import { calculateGapIndex } from "./gap-index";

describe("calculateGapIndex", () => {
  it("1. Separates presence gap from technical gap for MISSING website", () => {
    const result = calculateGapIndex({
      websiteClass: "MISSING",
      audits: [],
    });

    expect(result.score).toBe(90);
    expect(result.presenceGap).toBe(90);
    expect(result.technicalGap).toBeNull();
    // Technical coverage is honestly reported as 0.0 (not 100%)
    expect(result.technicalCoverage).toBe(0.0);
    expect(result.presenceCoverage).toBe(1.0);
    expect(result.availability).toBe("COMPLETE");
  });

  it("2. Separates presence gap for SOCIAL website", () => {
    const result = calculateGapIndex({
      websiteClass: "SOCIAL",
      audits: [],
    });

    expect(result.score).toBe(65);
    expect(result.presenceGap).toBe(65);
    expect(result.technicalGap).toBeNull();
  });

  it("3. Calculates technical gap on OWNED_SITE with anti-duplication caps", () => {
    const result = calculateGapIndex({
      websiteClass: "OWNED_SITE",
      audits: [
        {
          module: "PERFORMANCE",
          status: "COMPLETED",
          score: 35, // <40: +30
          findings: [
            { code: "SLOW_LCP" }, // +8
            { code: "HIGH_CLS" }, // +5
            { code: "SLOW_INP" }, // +5 => sum 18, capped at 15
          ],
        },
        {
          module: "TECHNICAL_SEO",
          status: "COMPLETED",
          score: 40,
          findings: [
            { code: "MISSING_TITLE" }, // +8
            { code: "MISSING_META_DESCRIPTION" }, // +5 => sum 13, capped at 12
            { code: "MISSING_H1" }, // +4
            { code: "MULTIPLE_H1" }, // +2 => sum 6, capped at 6
            { code: "ROBOTS_NOINDEX" }, // +15
          ],
        },
        {
          module: "WEBSITE_EXPERIENCE",
          status: "COMPLETED",
          score: 50,
          findings: [
            { code: "NO_TEL_LINK" }, // +6
            { code: "NO_MAILTO" }, // +2 => sum 8, capped at 8
            { code: "NO_CONTACT_FORM" }, // +6
            { code: "NO_CLEAR_CTA" }, // +6 => sum 12, capped at 12
          ],
        },
      ],
    });

    // Perf: 30 + 15 = 45
    // SEO: 12 + 6 + 15 = 33
    // Exp: 8 + 12 = 20
    // Total: 45 + 33 + 20 = 98
    expect(result.score).toBe(98);
    expect(result.presenceGap).toBe(0);
    expect(result.technicalGap).toBe(98);
    expect(result.coverage).toBe(1.0);
    expect(result.availability).toBe("COMPLETE");
  });

  it("4. AUDIT_FAILED module yields 0 points and reduces coverage without fake penalties", () => {
    const result = calculateGapIndex({
      websiteClass: "OWNED_SITE",
      audits: [
        {
          module: "PERFORMANCE",
          status: "BLOCKED", // WAF blocked
          score: null,
          findings: [],
        },
        {
          module: "TECHNICAL_SEO",
          status: "COMPLETED",
          score: 50,
          findings: [{ code: "MISSING_TITLE" }], // +8
        },
        {
          module: "WEBSITE_EXPERIENCE",
          status: "COMPLETED",
          score: 60,
          findings: [{ code: "NO_TEL_LINK" }], // +6
        },
      ],
    });

    // Only SEO (8) + Exp (6) = 14
    expect(result.score).toBe(14);
    // 10 out of 14 probes assessed
    expect(result.coverage).toBeLessThan(1.0);
    expect(result.availability).toBe("PARTIAL");
    expect(result.missingProbes).toContain("probe_psi_mobile");
  });

  it("5. All modules AUDIT_FAILED yields null score and UNAVAILABLE", () => {
    const result = calculateGapIndex({
      websiteClass: "OWNED_SITE",
      audits: [
        { module: "PERFORMANCE", status: "FAILED", score: null, findings: [] },
        { module: "TECHNICAL_SEO", status: "UNREACHABLE", score: null, findings: [] },
        { module: "WEBSITE_EXPERIENCE", status: "BLOCKED", score: null, findings: [] },
      ],
    });

    expect(result.score).toBeNull();
    expect(result.availability).toBe("UNAVAILABLE");
    expect(result.coverage).toBe(0.0);
  });
});

