import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { FetchPlugin } from "./fetch.plugin";
import * as httpFetch from "./http-fetch";

describe("FetchPlugin domain politeness", () => {
  let fetchPublicSpy: any;

  beforeEach(() => {
    fetchPublicSpy = vi.spyOn(httpFetch, "fetchPublic").mockResolvedValue({
      url: "https://example.com",
      finalUrl: "https://example.com",
      httpStatus: 200,
      headers: {},
      body: Buffer.from("<html><body>Test</body></html>"),
      contentType: "text/html",
    });
  });

  afterEach(() => {
    fetchPublicSpy.mockRestore();
  });

  it("applies politeness delay between consecutive requests to the same hostname", async () => {
    const plugin = new FetchPlugin();
    // Initialize with a 150ms delay for fast test execution
    (plugin as any).domainDelayMs = 150;

    const start = Date.now();
    await plugin.fetch("https://client-a.com/page1");
    await plugin.fetch("https://client-a.com/page2");
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(130);
    expect(fetchPublicSpy).toHaveBeenCalledTimes(2);
  });

  it("does not delay requests to different hostnames", async () => {
    const plugin = new FetchPlugin();
    (plugin as any).domainDelayMs = 200;

    const start = Date.now();
    await plugin.fetch("https://alpha-site.com/home");
    await plugin.fetch("https://beta-site.com/home");
    const elapsed = Date.now() - start;

    // Concurrency / independent domains should not wait for each other
    expect(elapsed).toBeLessThan(150);
    expect(fetchPublicSpy).toHaveBeenCalledTimes(2);
  });
});

