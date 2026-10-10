import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { FixtureMapsProvider } from "./fixture.provider";
import { MapsProvider, MapsProviderError, MapsSearchInput, MapsBusiness } from "./maps.types";
import { OutscraperMapsProvider } from "./outscraper.provider";

export const MAPS_PLUGIN = "MapsPlugin";

class MissingKeyProvider implements MapsProvider {
  async search(): Promise<MapsBusiness[]> {
    throw new MapsProviderError("OUTSCRAPER_API_KEY is required in production");
  }
}

export interface IMapsService extends IPlugin, MapsProvider {}

export class MapsPlugin implements IMapsService {
  public name = MAPS_PLUGIN;
  private provider: MapsProvider = new FixtureMapsProvider();

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    if (config.OUTSCRAPER_API_KEY) {
      this.provider = new OutscraperMapsProvider(config.OUTSCRAPER_API_KEY);
      logger.info("Maps provider: Outscraper");
      return;
    }
    if (config.NODE_ENV === "production") {
      this.provider = new MissingKeyProvider();
      logger.warn("OUTSCRAPER_API_KEY is missing; Maps discovery will fail");
      return;
    }
    this.provider = new FixtureMapsProvider();
    logger.info("Maps provider: development sample");
  }

  search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    return this.provider.search(input);
  }

  async shutdown(): Promise<void> {}
}
