import { MapsBusiness, MapsProvider, MapsProviderError, MapsQuotaError, MapsSearchInput } from "./maps.types";

const SEARCH_URL = "https://api.app.outscraper.com/maps/search-v3";

export class OutscraperMapsProvider implements MapsProvider {
  constructor(private readonly apiKey: string) {}

  async search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    const response = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.apiKey,
      },
      body: JSON.stringify({
        query: [input.query],
        limit: input.limit,
        async: false,
        dropDuplicates: true,
      }),
    });

    if (response.status === 429) {
      throw new MapsQuotaError();
    }
    if (!response.ok) {
      throw new MapsProviderError(`Outscraper request failed with HTTP ${response.status}`);
    }

    const body: unknown = await response.json();
    return normalizeOutscraper(body);
  }
}

export function normalizeOutscraper(body: unknown): MapsBusiness[] {
  const found: MapsBusiness[] = [];
  const seen = new Set<string>();
  collect(body, found, seen);
  return found;
}

function collect(value: unknown, found: MapsBusiness[], seen: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, found, seen);
    return;
  }
  if (!value || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  const business = toBusiness(record);
  if (business) {
    if (!seen.has(business.providerId)) {
      seen.add(business.providerId);
      found.push(business);
    }
    return;
  }

  if ("data" in record) collect(record["data"], found, seen);
  if ("results" in record) collect(record["results"], found, seen);
}

function toBusiness(record: Record<string, unknown>): MapsBusiness | null {
  const name = text(record["name"]);
  const providerId = text(record["place_id"]) ?? text(record["google_id"]) ?? text(record["cid"]);
  if (!name || !providerId) return null;
  return {
    providerId,
    name,
    phone: text(record["phone"]),
    address: text(record["full_address"]) ?? text(record["address"]),
    city: text(record["city"]),
    region: text(record["state"]) ?? text(record["region"]),
    country: text(record["country"]) ?? text(record["country_code"]),
    rating: numberOrNull(record["rating"]),
    reviewCount: integerOrNull(record["reviews"] ?? record["reviews_count"]),
    websiteUrl: text(record["site"]) ?? text(record["website"]),
  };
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function numberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function integerOrNull(value: unknown): number | null {
  const parsed = numberOrNull(value);
  if (parsed == null) return null;
  return Math.max(0, Math.round(parsed));
}
