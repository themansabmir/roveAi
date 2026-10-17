import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { ApifyMapsProvider } from "./apify.provider";
import { FixtureMapsProvider } from "./fixture.provider";
import { MapsProvider, MapsProviderError, MapsSearchInput, MapsBusiness } from "./maps.types";
import { OutscraperMapsProvider } from "./outscraper.provider";

export const MAPS_PLUGIN = "MapsPlugin";

class MissingKeyProvider implements MapsProvider {
  async search(): Promise<MapsBusiness[]> {
    throw new MapsProviderError(
      "No Maps API key configured. Set APIFY_TOKEN (preferred) or OUTSCRAPER_API_KEY in your .env."
    );
  }
}

export interface IMapsService extends IPlugin, MapsProvider {}

export class MapsPlugin implements IMapsService {
  public name = MAPS_PLUGIN;
  private provider: MapsProvider = new FixtureMapsProvider();

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();

    // 1. Apify is preferred — use it when APIFY_TOKEN is present
    if (config.APIFY_TOKEN) {
      this.provider = new ApifyMapsProvider(config.APIFY_TOKEN, config.APIFY_ACTOR);
      logger.info({ actor: config.APIFY_ACTOR }, "Maps provider: Apify");
      return;
    }

    // 2. Outscraper — legacy fallback when OUTSCRAPER_API_KEY is set
    if (config.OUTSCRAPER_API_KEY) {
      this.provider = new OutscraperMapsProvider(config.OUTSCRAPER_API_KEY);
      logger.info("Maps provider: Outscraper (legacy)");
      return;
    }

    // 3. Production with no key at all — fail loudly on first search
    if (config.NODE_ENV === "production") {
      this.provider = new MissingKeyProvider();
      logger.warn("No Maps provider API key found; discovery will fail in production");
      return;
    }

    // 4. Development / test — use fixture data so the pipeline works without real keys
    this.provider = new FixtureMapsProvider();
    logger.info("Maps provider: development sample (fixture)");
  }

  search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    return this.provider.search(input);
  }

  async shutdown(): Promise<void> {}
}
