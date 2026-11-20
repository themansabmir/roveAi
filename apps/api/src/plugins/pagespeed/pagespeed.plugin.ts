import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { parsePagespeedReport } from "./parse-report";
import { PagespeedError, PagespeedQuotaError, PagespeedReport, PagespeedUnreachableError } from "./pagespeed.types";

export const PAGESPEED_PLUGIN = "PagespeedPlugin";

export interface IPagespeedService extends IPlugin {
  runMobile(url: string): Promise<PagespeedReport>;
}

export class TokenBucket {
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(
    public readonly capacity: number,
    public readonly refillRatePerSecond: number
  ) {
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillRatePerSecond);
    this.lastRefillTimestamp = now;
  }

  get availableTokens(): number {
    this.refill();
    return this.tokens;
  }

  async acquire(cost = 1): Promise<void> {
    while (true) {
      this.refill();
      if (this.tokens >= cost) {
        this.tokens -= cost;
        return;
      }
      const needed = cost - this.tokens;
      const waitMs = Math.max(50, Math.ceil((needed / this.refillRatePerSecond) * 1000));
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

export class PagespeedPlugin implements IPagespeedService {
  public name = PAGESPEED_PLUGIN;
  private apiKey: string | undefined;
  private timeoutMs = 60_000;
  private limiter: TokenBucket = new TokenBucket(150, 150 / 60);

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.apiKey = config.PAGESPEED_API_KEY;
    this.timeoutMs = config.PSI_TIMEOUT_MS;
    const rpm = config.PSI_RATE_LIMIT_RPM ?? 150;
    this.limiter = new TokenBucket(rpm, rpm / 60);
    if (this.apiKey) {
      logger.info({ rpm }, "PageSpeed Insights API configured with token-bucket throttler");
    }
  }

  async runMobile(url: string): Promise<PagespeedReport> {
    if (!this.apiKey) {
      throw new PagespeedError("PAGESPEED_API_KEY is not configured");
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      await this.limiter.acquire(1);

      const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      endpoint.searchParams.set("url", url);
      endpoint.searchParams.set("strategy", "mobile");
      endpoint.searchParams.set("key", this.apiKey);
      endpoint.searchParams.append("category", "performance");
      endpoint.searchParams.append("category", "seo");

      const response = await fetch(endpoint, { signal: AbortSignal.timeout(this.timeoutMs) });

      if (response.status === 429) {
        if (attempt < maxRetries) {
          const isTest = process.env["NODE_ENV"] === "test";
          const backoffMs = isTest
            ? 10 * attempt
            : Math.pow(2, attempt) * 1000 + Math.floor(Math.random() * 500);
          logger.warn(
            { attempt, backoffMs, url },
            "PagespeedPlugin: rate limited by Google PSI (HTTP 429), retrying with exponential backoff"
          );
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        throw new PagespeedQuotaError();
      }

      if (!response.ok) {
        let errorBody = "(could not read body)";
        try { errorBody = await response.text(); } catch (_) { /* ignore */ }
        // PSI returns 400 when Lighthouse itself cannot load the target page
        // (site is down, DNS failure, firewall block, etc.). This is not a
        // transient error we should retry — treat it as UNREACHABLE.
        if (
          response.status === 400 &&
          /FAILED_DOCUMENT_REQUEST|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|ERR_TIMED_OUT|net::/i.test(errorBody)
        ) {
          throw new PagespeedUnreachableError(endpoint.searchParams.get("url") ?? url, errorBody.slice(0, 300));
        }
        throw new PagespeedError(`PageSpeed Insights returned HTTP ${response.status}: ${errorBody}`);
      }

      const raw: unknown = await response.json();
      return { raw, parsed: parsePagespeedReport(raw) };
    }

    throw new PagespeedQuotaError();
  }

  async shutdown(): Promise<void> {}
}
