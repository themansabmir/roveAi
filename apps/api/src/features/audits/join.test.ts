import { campaignOutcome, leadAuditStatus } from "./join";

describe("audit join", () => {
  it("waits until every required module is terminal", () => {
    expect(
      leadAuditStatus([
        { module: "TECHNICAL_SEO", status: "COMPLETED" },
        { module: "WEBSITE_EXPERIENCE", status: "COMPLETED" },
      ])
    ).toBeNull();
  });

  it("publishes a failed lead without failing every skipped lead into a hard failure", () => {
    expect(
      leadAuditStatus([
        { module: "TECHNICAL_SEO", status: "UNREACHABLE" },
        { module: "WEBSITE_EXPERIENCE", status: "UNREACHABLE" },
        { module: "PERFORMANCE", status: "FAILED" },
      ])
    ).toBe("UNREACHABLE");
    expect(campaignOutcome(["COMPLETED", "UNREACHABLE", "SKIPPED_NO_WEBSITE"])).toBe("PARTIALLY_COMPLETED");
    expect(campaignOutcome(["COMPLETED", "SKIPPED_BUDGET"])).toBe("COMPLETED");
    expect(campaignOutcome(["COMPLETED", "PENDING"])).toBeNull();
  });
});
