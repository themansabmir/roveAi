import { describe, expect, it, vi } from "vitest";
import {
  evaluateField,
  extractBusinessEvidence,
  extractLegacyFieldState,
  resolveFreshness,
  present,
  verifiedAbsent,
  auditFailed,
  notAssessed,
} from "./evidence-state";
import { replaceAudit } from "./audit-write";

describe("Quad-State Evidence Contract", () => {
  it("1. Successful extraction with a phone number returns PRESENT", () => {
    const result = evaluateField(() => "+15125550100", { source: "google_places" });
    expect(result.status).toBe("PRESENT");
    if (result.status === "PRESENT") {
      expect(result.value).toBe("+15125550100");
      expect(result.source).toBe("google_places");
    }
  });

  it("2. Successful extraction without a phone number returns VERIFIED_ABSENT", () => {
    const result = evaluateField(() => null, { source: "google_places" });
    expect(result.status).toBe("VERIFIED_ABSENT");
    expect(result.value).toBeNull();
    if (result.status === "VERIFIED_ABSENT") {
      expect(result.source).toBe("google_places");
    }

    const emptyResult = evaluateField(() => "   ", { source: "google_places" });
    expect(emptyResult.status).toBe("VERIFIED_ABSENT");
    expect(emptyResult.value).toBeNull();
  });

  it("3. Google blocking the request returns AUDIT_FAILED", () => {
    const result = evaluateField(() => {
      throw new Error("HTTP 403 Forbidden: Google bot blocked");
    });
    expect(result.status).toBe("AUDIT_FAILED");
    expect(result.value).toBeNull();
    if (result.status === "AUDIT_FAILED") {
      expect(result.error).toContain("403 Forbidden");
    }
  });

  it("4. Network timeout returns AUDIT_FAILED", () => {
    const result = evaluateField(() => {
      throw new Error("ETIMEDOUT: Connection timed out after 30000ms");
    });
    expect(result.status).toBe("AUDIT_FAILED");
    expect(result.value).toBeNull();
    if (result.status === "AUDIT_FAILED") {
      expect(result.error).toContain("ETIMEDOUT");
    }
  });

  it("5. Extraction/parsing exception returns AUDIT_FAILED", () => {
    const result = evaluateField(() => {
      throw new TypeError("Cannot read properties of undefined (reading 'split')");
    });
    expect(result.status).toBe("AUDIT_FAILED");
    expect(result.value).toBeNull();
    if (result.status === "AUDIT_FAILED") {
      expect(result.error).toContain("Cannot read properties of undefined");
    }
  });

  it("6. Unperformed probe returns NOT_ASSESSED", () => {
    const unassessed = notAssessed("Budget limit reached; crawl skipped", "scheduler");
    expect(unassessed.status).toBe("NOT_ASSESSED");
    expect(unassessed.value).toBeNull();
    if (unassessed.status === "NOT_ASSESSED") {
      expect(unassessed.reason).toContain("Budget limit");
    }
  });

  it("7. Partial extraction does not invalidate successfully retrieved fields", () => {
    const profile = extractBusinessEvidence({
      phone: "+15125550199",
      email: null,
      address: "100 Congress Ave, Austin, TX",
      rating: 4.8,
      reviewCount: 42,
      websiteUrl: "https://example.com",
      provider: "apify",
      providerRaw: {
        title: "Example Business",
        phone: "+15125550199",
        email_error: "Email scraper encountered captcha",
      },
    });

    // Phone is PRESENT
    expect(profile.phone.status).toBe("PRESENT");
    if (profile.phone.status === "PRESENT") {
      expect(profile.phone.value).toBe("+15125550199");
    }

    // Email is AUDIT_FAILED due to parsing error in raw
    expect(profile.email.status).toBe("AUDIT_FAILED");
    if (profile.email.status === "AUDIT_FAILED") {
      expect(profile.email.error).toContain("captcha");
    }

    // Address and rating are PRESENT
    expect(profile.address.status).toBe("PRESENT");
    expect(profile.rating.status).toBe("PRESENT");
    expect(profile.reviewCount.status).toBe("PRESENT");
  });

  it("8. Legacy record with missing providerRaw defaults to NOT_ASSESSED, not VERIFIED_ABSENT", () => {
    const state = extractLegacyFieldState(null, "phone", null);
    expect(state.status).toBe("NOT_ASSESSED");
    expect(state.value).toBeNull();
    if (state.status === "NOT_ASSESSED") {
      expect(state.reason).toContain("providerRaw is missing");
    }
  });

  it("9. Failed retries do not overwrite previously verified data incorrectly", async () => {
    const mockTx = {
      auditAttempt: {
        count: vi.fn().mockResolvedValue(1),
        create: vi.fn().mockResolvedValue({ id: "attempt-2" }),
      },
      technicalAudit: {
        findUnique: vi.fn().mockResolvedValue({
          id: "audit-123",
          status: "COMPLETED",
          score: 85,
          observedAt: new Date(Date.now() - 3600_000),
          findings: [{ id: "f1", code: "SLOW_LCP" }],
        }),
        update: vi.fn().mockResolvedValue({}),
        create: vi.fn(),
      },
      auditFinding: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
    };

    const mockPrisma = {
      $transaction: async (fn: (tx: any) => Promise<any>) => fn(mockTx),
    } as any;

    // Retry fails with BLOCKED:
    await replaceAudit(mockPrisma, "job-1", {
      organizationId: "org-1",
      leadId: "lead-1",
      snapshotId: null,
      module: "PERFORMANCE",
      status: "BLOCKED",
      score: null,
      metrics: null,
      toolName: "pagespeed-insights",
      toolVersion: "v5",
      deviceProfile: "mobile",
      observedAt: new Date(),
      failureReason: "Cloudflare 403",
      findings: [],
    });

    // Attempt history was logged!
    expect(mockTx.auditAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        jobId: "job-1",
        module: "PERFORMANCE",
        attemptNumber: 2,
        status: "BLOCKED",
        failureReason: "Cloudflare 403",
      }),
    });

    // Findings must NOT be deleted!
    expect(mockTx.auditFinding.deleteMany).not.toHaveBeenCalled();
    // And canonical audit status must NOT be changed to BLOCKED (only failureReason recorded):
    expect(mockTx.technicalAudit.update).toHaveBeenCalledWith({
      where: { id: "audit-123" },
      data: { failureReason: "Cloudflare 403" },
    });
  });

  it("10. Freshness Precedence resolves strictly and unambiguously", () => {
    const now = new Date("2026-11-10T12:00:00Z");

    // 1. No successful audit exists -> UNAUDITED
    expect(resolveFreshness(null, null, now)).toBe("UNAUDITED");

    // 2. Latest attempt failed, with historical successful evidence -> DEGRADED
    const recentSuccessful = { observedAt: "2026-11-10T11:00:00Z" };
    const failedRetry = { status: "BLOCKED", observedAt: "2026-11-10T11:30:00Z" };
    expect(resolveFreshness(recentSuccessful, failedRetry, now)).toBe("DEGRADED");

    // 3. Last successful evidence is older than 7 days -> STALE
    const oldSuccessful = { observedAt: "2026-10-01T12:00:00Z" };
    const noNewAttempt = { status: "COMPLETED", observedAt: "2026-10-01T12:00:00Z" };
    expect(resolveFreshness(oldSuccessful, noNewAttempt, now)).toBe("STALE");

    // 4. Latest attempt succeeded and is recent -> FRESH
    expect(resolveFreshness(recentSuccessful, { status: "COMPLETED", observedAt: "2026-11-10T11:00:00Z" }, now)).toBe("FRESH");
  });
});
