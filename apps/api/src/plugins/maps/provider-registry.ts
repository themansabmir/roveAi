import { AppConfig } from "@core/config";
import { MapsProvider } from "./maps.types";
import { FixtureMapsProvider } from "./fixture.provider";
import { OutscraperMapsProvider } from "./outscraper.provider";
import { SerpApiMapsProvider } from "./serpapi.provider";
import { GooglePlacesMapsProvider } from "./googleplaces.provider";

export type DiscoveryProviderKey = "OUTSCRAPER" | "SERPAPI" | "GOOGLE_PLACES" | "FIXTURE";

export const DISCOVERY_PROVIDER_KEYS: DiscoveryProviderKey[] = [
  "OUTSCRAPER",
  "SERPAPI",
  "GOOGLE_PLACES",
  "FIXTURE",
];

export interface DiscoveryProviderInfo {
  key: DiscoveryProviderKey;
  label: string;
  configured: boolean;
}

interface ProviderDefinition {
  key: DiscoveryProviderKey;
  label: string;
  /** Returns an instance when configured, otherwise null. */
  build(config: AppConfig): MapsProvider | null;
}

const DEFINITIONS: ProviderDefinition[] = [
  {
    key: "OUTSCRAPER",
    label: "Outscraper",
    build: (config) =>
      config.OUTSCRAPER_API_KEY ? new OutscraperMapsProvider(config.OUTSCRAPER_API_KEY) : null,
  },
  {
    key: "SERPAPI",
    label: "SerpAPI",
    build: (config) => (config.SERPAPI_API_KEY ? new SerpApiMapsProvider(config.SERPAPI_API_KEY) : null),
  },
  {
    key: "GOOGLE_PLACES",
    label: "Google Places",
    build: (config) =>
      config.GOOGLE_PLACES_API_KEY ? new GooglePlacesMapsProvider(config.GOOGLE_PLACES_API_KEY) : null,
  },
  {
    key: "FIXTURE",
    label: "Development sample",
    build: () => new FixtureMapsProvider(),
  },
];

/**
 * Builds concrete provider instances based on which API keys are configured.
 * FIXTURE is always available. Each adapter normalizes vendor payloads to the
 * canonical MapsBusiness shape, so the rest of the system never sees vendor data.
 */
export class DiscoveryProviderRegistry {
  private readonly instances = new Map<DiscoveryProviderKey, MapsProvider>();

  constructor(private readonly config: AppConfig) {
    for (const definition of DEFINITIONS) {
      const instance = definition.build(config);
      if (instance) this.instances.set(definition.key, instance);
    }
  }

  /** Returns a configured provider, or null when its API key is missing. */
  get(key: DiscoveryProviderKey): MapsProvider | null {
    return this.instances.get(key) ?? null;
  }

  isConfigured(key: DiscoveryProviderKey): boolean {
    return this.instances.has(key);
  }

  /** Metadata for the super-admin UI: label + whether a key is present. */
  describe(): DiscoveryProviderInfo[] {
    return DEFINITIONS.map((definition) => ({
      key: definition.key,
      label: definition.label,
      configured: this.instances.has(definition.key),
    }));
  }

  /** First real provider with a key, else FIXTURE in dev. Used as the seed default. */
  fallbackDefault(): DiscoveryProviderKey {
    for (const key of DISCOVERY_PROVIDER_KEYS) {
      if (key !== "FIXTURE" && this.instances.has(key)) return key;
    }
    return this.config.NODE_ENV === "production" ? "OUTSCRAPER" : "FIXTURE";
  }
}

export function isDiscoveryProviderKey(value: unknown): value is DiscoveryProviderKey {
  return typeof value === "string" && (DISCOVERY_PROVIDER_KEYS as string[]).includes(value);
}
