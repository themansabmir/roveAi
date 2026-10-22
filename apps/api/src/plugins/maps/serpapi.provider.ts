import { MapsBusiness, MapsProvider, MapsProviderError, MapsQuotaError, MapsSearchInput } from "./maps.types";

const SEARCH_URL = "https://serpapi.com/search.json";

export class SerpApiMapsProvider implements MapsProvider {
  constructor(private readonly apiKey: string) {}

  async search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    const url = new URL(SEARCH_URL);
    url.searchParams.set("engine", "google_maps");
    url.searchParams.set("type", "search");
    url.searchParams.set("q", input.query);
    url.searchParams.set("api_key", this.apiKey);

    const response = await fetch(url, { method: "GET" });

    if (response.status === 429) {
      throw new MapsQuotaError();
    }
    if (!response.ok) {
      throw new MapsProviderError(`SerpAPI request failed with HTTP ${response.status}`);
    }

    const body: unknown = await response.json();
    return normalizeSerpApi(body, input.limit);
  }
}

export function normalizeSerpApi(body: unknown, limit: number): MapsBusiness[] {
  if (!body || typeof body !== "object") return [];
  const record = body as Record<string, unknown>;
  const local = record["local_results"];
  const rows = Array.isArray(local) ? local : [];

  const found: MapsBusiness[] = [];
  const seen = new Set<string>();
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const business = toBusiness(item as Record<string, unknown>);
    if (!business || seen.has(business.providerId)) continue;
    seen.add(business.providerId);
    found.push(business);
    if (found.length >= limit) break;
  }
  return found;
}

function toBusiness(record: Record<string, unknown>): MapsBusiness | null {
  const name = text(record["title"]);
  const providerId = text(record["place_id"]) ?? text(record["data_id"]);
  if (!name || !providerId) return null;
  return {
    providerId,
    name,
    phone: text(record["phone"]),
    address: text(record["address"]),
    city: null,
    region: null,
    country: null,
    rating: numberOrNull(record["rating"]),
    reviewCount: integerOrNull(record["reviews"]),
    websiteUrl: text(record["website"]),
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
