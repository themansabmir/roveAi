import { parsePagespeedReport } from "./parse-report";

describe("parsePagespeedReport", () => {
  it("reads lab metrics and does not invent field data when CrUX is absent", () => {
    const parsed = parsePagespeedReport({
      lighthouseResult: {
        categories: { performance: { score: 0.48 } },
        audits: {
          "largest-contentful-paint": { numericValue: 4200 },
          "cumulative-layout-shift": { numericValue: 0.18 },
          "total-blocking-time": { numericValue: 300 },
        },
      },
    });
    expect(parsed.score).toBe(48);
    expect(parsed.metrics.lcp_ms).toBe(4200);
    expect(parsed.metrics.cls).toBe(0.18);
    expect(parsed.metrics.field_present).toBeUndefined();
    expect(parsed.findings.map((finding) => finding.code)).toEqual(["SLOW_LCP", "HIGH_CLS", "LOW_PERFORMANCE_SCORE"]);
    expect(parsed.findings.every((finding) => finding.source === "LAB")).toBe(true);
  });
});
