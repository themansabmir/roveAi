import { MapsBusiness, MapsProvider, MapsProviderError, MapsQuotaError, MapsSearchInput } from "./maps.types";

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
].join(",");

export class GooglePlacesMapsProvider implements MapsProvider {
  constructor(private readonly apiKey: string) {}

  async search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    const response = await fetch(SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: input.query,
        pageSize: Math.min(Math.max(input.limit, 1), 20),
      }),
    });

    if (response.status === 429) {
      throw new MapsQuotaError();
    }
    if (!response.ok) {
      throw new MapsProviderError(`Google Places request failed with HTTP ${response.status}`);
    }

    const body: unknown = await response.json();
    return normalizeGooglePlaces(body, input.limit);
  }
}

export function normalizeGooglePlaces(body: unknown, limit: number): MapsBusiness[] {
  if (!body || typeof body !== "object") return [];
  const record = body as Record<string, unknown>;
  const places = record["places"];
  const rows = Array.isArray(places) ? places : [];

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
  const providerId = text(record["id"]);
  const name = displayName(record["displayName"]);
  if (!name || !providerId) return null;
  return {
    providerId,
    name,
    phone: text(record["nationalPhoneNumber"]) ?? text(record["internationalPhoneNumber"]),
    address: text(record["formattedAddress"]),
    city: null,
    region: null,
    country: null,
    rating: numberOrNull(record["rating"]),
    reviewCount: integerOrNull(record["userRatingCount"]),
    websiteUrl: text(record["websiteUri"]),
  };
}

function displayName(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  return text((value as Record<string, unknown>)["text"]);
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
