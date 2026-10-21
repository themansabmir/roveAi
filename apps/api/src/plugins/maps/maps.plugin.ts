import { DiscoveryProvider } from "@prisma/client";
import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "../../core/config";
import { logger } from "../../core/logger";
import { PRISMA_PLUGIN, IPrismaService } from "../prisma/prisma.plugin";
import { PlatformSettingsRepository } from "@features/platform/platform-settings.repository";
import { MapsProvider, MapsProviderError, MapsSearchInput, MapsBusiness } from "./maps.types";
import {
  DiscoveryProviderInfo,
  DiscoveryProviderKey,
  DiscoveryProviderRegistry,
} from "./provider-registry";

export const MAPS_PLUGIN = "MapsPlugin";

/**
 * Service surface used by workers. `search` resolves the active provider from
 * the platform default on every call, so changing the default takes effect on
 * the next discovery run with no redeploy. `search` always returns the canonical
 * MapsBusiness shape regardless of the vendor behind it.
 */
export interface IMapsService extends IPlugin {
  search(input: MapsSearchInput): Promise<MapsBusiness[]>;
  listProviders(): DiscoveryProviderInfo[];
  getDefaultProvider(): Promise<DiscoveryProviderKey>;
  setDefaultProvider(provider: DiscoveryProviderKey, updatedByUserId: string): Promise<DiscoveryProviderKey>;
}

export class MapsPlugin implements IMapsService {
  public name = MAPS_PLUGIN;
  private registry!: DiscoveryProviderRegistry;
  private settings!: PlatformSettingsRepository;

  async initialize(pluginRegistry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.registry = new DiscoveryProviderRegistry(config);
    const prisma = pluginRegistry.get<IPrismaService>(PRISMA_PLUGIN).client;
    this.settings = new PlatformSettingsRepository(prisma);

    const describe = this.registry
      .describe()
      .filter((p) => p.configured)
      .map((p) => p.key)
      .join(", ");
    logger.info({ configured: describe || "none" }, "Discovery providers available");
  }

  /** Resolves the active provider per call, falling back if the default lacks a key. */
  private async resolveActive(): Promise<MapsProvider> {
    const fallback = this.registry.fallbackDefault();
    const stored = await this.settings.getDiscoveryProvider(fallback as DiscoveryProvider);
    const key = stored as DiscoveryProviderKey;

    const provider = this.registry.get(key);
    if (provider) return provider;

    const alternative = this.registry.get(fallback);
    if (alternative) {
      logger.warn({ requested: key, used: fallback }, "Default discovery provider lacks an API key; using fallback");
      return alternative;
    }
    throw new MapsProviderError(`No discovery provider is configured (default: ${key})`);
  }

  async search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    const provider = await this.resolveActive();
    return provider.search(input);
  }

  listProviders(): DiscoveryProviderInfo[] {
    return this.registry.describe();
  }

  async getDefaultProvider(): Promise<DiscoveryProviderKey> {
    const fallback = this.registry.fallbackDefault();
    const stored = await this.settings.getDiscoveryProvider(fallback as DiscoveryProvider);
    return stored as DiscoveryProviderKey;
  }

  async setDefaultProvider(
    provider: DiscoveryProviderKey,
    updatedByUserId: string
  ): Promise<DiscoveryProviderKey> {
    const stored = await this.settings.setDiscoveryProvider(provider as DiscoveryProvider, updatedByUserId);
    return stored as DiscoveryProviderKey;
  }

  async shutdown(): Promise<void> {}
}
