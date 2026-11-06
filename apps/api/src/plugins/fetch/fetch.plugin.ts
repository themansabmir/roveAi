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

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.timeoutMs = config.FETCH_TIMEOUT_MS;
    this.maxBytes = config.FETCH_MAX_BYTES;
  }

  fetch(url: string, maxBytes = this.maxBytes): Promise<FetchedDocument> {
    return fetchPublic(url, { timeoutMs: this.timeoutMs, maxBytes });
  }

  async shutdown(): Promise<void> {}
}
