import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { parsePagespeedReport } from "./parse-report";
import { PagespeedError, PagespeedQuotaError, PagespeedReport } from "./pagespeed.types";

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
      throw new PagespeedError(`PageSpeed Insights returned HTTP ${response.status}`);
    }
    const raw: unknown = await response.json();
    return { raw, parsed: parsePagespeedReport(raw) };
  }

  async shutdown(): Promise<void> {}
}
