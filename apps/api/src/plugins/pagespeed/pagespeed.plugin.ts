import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { parsePagespeedReport } from "./parse-report";
import { PagespeedError, PagespeedQuotaError, PagespeedReport, PagespeedUnreachableError } from "./pagespeed.types";

export const PAGESPEED_PLUGIN = "PagespeedPlugin";

export interface IPagespeedService extends IPlugin {
  runMobile(url: string): Promise<PagespeedReport>;
}

export class PagespeedPlugin implements IPagespeedService {
  public name = PAGESPEED_PLUGIN;
  private apiKey: string | undefined;
  private timeoutMs = 60_000;

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.apiKey = config.PAGESPEED_API_KEY;
    this.timeoutMs = config.PSI_TIMEOUT_MS;
    if (this.apiKey) logger.info("PageSpeed Insights API configured");
  }

  async runMobile(url: string): Promise<PagespeedReport> {
    if (!this.apiKey) {
      throw new PagespeedError("PAGESPEED_API_KEY is not configured");
    }
    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", "mobile");
    endpoint.searchParams.set("key", this.apiKey);
    endpoint.searchParams.append("category", "performance");
    endpoint.searchParams.append("category", "seo");

    const response = await fetch(endpoint, { signal: AbortSignal.timeout(this.timeoutMs) });
    if (response.status === 429) throw new PagespeedQuotaError();
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

  async shutdown(): Promise<void> {}
}
