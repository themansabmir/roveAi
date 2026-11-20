import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { PagespeedPlugin, TokenBucket } from "./pagespeed.plugin";
import { PagespeedQuotaError } from "./pagespeed.types";

describe("TokenBucket", () => {
  it("initializes with full capacity", () => {
    const bucket = new TokenBucket(10, 2);
    expect(bucket.capacity).toBe(10);
    expect(bucket.availableTokens).toBeCloseTo(10, 1);
  });

  it("decrements tokens upon acquire", async () => {
    const bucket = new TokenBucket(10, 2);
    await bucket.acquire(3);
    expect(bucket.availableTokens).toBeCloseTo(7, 1);
  });

  it("refills tokens over time up to capacity", async () => {
    const bucket = new TokenBucket(10, 100); // 100 tokens/sec
    await bucket.acquire(8);
    expect(bucket.availableTokens).toBeCloseTo(2, 1);
    await new Promise((r) => setTimeout(r, 60)); // ~6 tokens refilled
    expect(bucket.availableTokens).toBeGreaterThan(5);
  });
});

describe("PagespeedPlugin rate limiting and backoff", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env["PAGESPEED_API_KEY"] = "test-api-key";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("retries on HTTP 429 and succeeds on subsequent attempt", async () => {
    const plugin = new PagespeedPlugin();
    (plugin as any).apiKey = "test-api-key";

    let calls = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls === 1) {
        return {
          status: 429,
          ok: false,
          text: async () => "Rate limit exceeded",
        };
      }
      return {
        status: 200,
        ok: true,
        json: async () => ({
          lighthouseResult: {
            categories: {
              performance: { score: 0.85 },
              seo: { score: 0.90 },
            },
            audits: {},
          },
        }),
      };
    });

    const report = await plugin.runMobile("https://example.com");
    expect(calls).toBe(2);
    expect(report.parsed.score).toBe(85);
  });

  it("throws PagespeedQuotaError when HTTP 429 persists across all retries", async () => {
    const plugin = new PagespeedPlugin();
    (plugin as any).apiKey = "test-api-key";

    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 429,
      ok: false,
      text: async () => "Rate limit exceeded",
    });

    await expect(plugin.runMobile("https://example.com")).rejects.toThrow(PagespeedQuotaError);
  }, 15000);
});
