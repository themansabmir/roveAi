import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { fetchPublic } from "./http-fetch";
import { FetchedDocument, PageFetcher } from "./fetch.types";

export const FETCH_PLUGIN = "FetchPlugin";

export interface IFetchService extends IPlugin, PageFetcher {}

export class FetchPlugin implements IFetchService {
  public name = FETCH_PLUGIN;
  private timeoutMs = 10_000;
  private maxBytes = 1_500_000;
  private domainDelayMs = 500;
  private lastDomainAccess: Map<string, number> = new Map();

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.timeoutMs = config.FETCH_TIMEOUT_MS;
    this.maxBytes = config.FETCH_MAX_BYTES;
    this.domainDelayMs = config.CRAWL_DOMAIN_DELAY_MS ?? 500;
  }

  async fetch(url: string, maxBytes = this.maxBytes): Promise<FetchedDocument> {
    await this.applyDomainPoliteness(url);
    return fetchPublic(url, { timeoutMs: this.timeoutMs, maxBytes });
  }

  // TODO: Move in-memory domain politeness rate limiter to Redis before scaling to multiple API/worker instances
  private async applyDomainPoliteness(url: string): Promise<void> {
    if (this.domainDelayMs <= 0) return;
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      const now = Date.now();
      const lastAccess = this.lastDomainAccess.get(hostname);
      if (lastAccess) {
        const elapsed = now - lastAccess;
        if (elapsed < this.domainDelayMs) {
          const delay = this.domainDelayMs - elapsed;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      this.lastDomainAccess.set(hostname, Date.now());

      if (this.lastDomainAccess.size > 1000) {
        const threshold = Date.now() - this.domainDelayMs * 4;
        for (const [host, time] of this.lastDomainAccess.entries()) {
          if (time < threshold) this.lastDomainAccess.delete(host);
        }
      }
    } catch {
      // Invalid URL handled by fetchPublic
    }
  }

  async shutdown(): Promise<void> {
    this.lastDomainAccess.clear();
  }
}
