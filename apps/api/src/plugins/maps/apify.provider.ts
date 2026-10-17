import { MapsBusiness, MapsProvider, MapsProviderError, MapsQuotaError, MapsSearchInput } from "./maps.types";

/**
 * Apify Google Maps Scraper provider.
 *
 * Uses the run-sync-get-dataset-items endpoint so the HTTP call blocks until
 * the actor run finishes and returns the dataset rows directly — no polling
 * required.
 *
 * Compatible actor slugs (configured via APIFY_ACTOR env var):
 *  - scraperlink/google-maps-scraper  (default — already in your .env)
 *  - compass~crawler-google-places    (official Apify actor)
 *
 * scraperlink actor input:
 *   { query: string[], num: number }
 *   Response: JSON array of place objects.
 *
 * compass actor input:
 *   { searchStringsArray: string[], maxCrawledPlacesPerSearch: number }
 *   Response: JSON array of place objects.
 */

const APIFY_BASE_URL = "https://api.apify.com/v2/acts";

export class ApifyMapsProvider implements MapsProvider {
  private readonly actorSlug: string;

  constructor(
    private readonly apiToken: string,
    actorSlug: string = "scraperlink/google-maps-scraper"
  ) {
    this.actorSlug = actorSlug;
  }

  async search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    const url =
      `${APIFY_BASE_URL}/${encodeURIComponent(this.actorSlug)}/run-sync-get-dataset-items` +
      `?token=${encodeURIComponent(this.apiToken)}&format=json&clean=true`;

    const body = buildActorInput(this.actorSlug, input);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 402 || response.status === 429) {
      throw new MapsQuotaError();
    }
    if (!response.ok) {
      throw new MapsProviderError(
        `Apify actor "${this.actorSlug}" responded with HTTP ${response.status}`
      );
    }

    const data: unknown = await response.json();
    return normalizeApify(data);
  }
}

/** Build the correct actor input depending on which actor is used. */
function buildActorInput(
  actorSlug: string,
  input: MapsSearchInput
): Record<string, unknown> {
  const isCompass =
    actorSlug.includes("compass") || actorSlug.includes("crawler-google-places");

  if (isCompass) {
    return {
      searchStringsArray: [input.query],
      maxCrawledPlacesPerSearch: input.limit,
    };
  }

  // scraperlink/google-maps-scraper and similar actors
  return {
    query: [input.query],
    num: input.limit,
  };
}

// ─── Normalizers ────────────────────────────────────────────────────────────

export function normalizeApify(body: unknown): MapsBusiness[] {
  if (!Array.isArray(body)) {
    throw new MapsProviderError("Apify response was not a JSON array");
  }

  const seen = new Set<string>();
  const results: MapsBusiness[] = [];

  for (const item of body) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const business = toBusiness(record);
    if (!business) continue;
    if (seen.has(business.providerId)) continue;
    seen.add(business.providerId);
    results.push(business);
  }

  return results;
}

function toBusiness(record: Record<string, unknown>): MapsBusiness | null {
  // Name field: "title" (scraperlink & compass), fallback "name"
  const name = text(record["title"]) ?? text(record["name"]);

  // Provider ID: placeId > cid > url (Google Maps URL contains unique ID)
  const providerId =
    text(record["placeId"]) ??
    text(record["place_id"]) ??
    text(record["cid"]) ??
    text(record["url"]);

  if (!name || !providerId) return null;

  // Address fields
  const address =
    text(record["address"]) ??
    joinStrings([text(record["street"]), text(record["city"])]);

  const city = text(record["city"]);
  const region = text(record["state"]) ?? text(record["region"]);
  const country = text(record["countryCode"]) ?? text(record["country"]);

  // Rating: "totalScore" (compass/scraperlink), fallback "rating"
  const rating = numberOrNull(record["totalScore"]) ?? numberOrNull(record["rating"]);

  // Review count: "reviewsCount", fallback "reviews"
  const reviewCount =
    integerOrNull(record["reviewsCount"]) ?? integerOrNull(record["reviews"]);

  // Website: "website" in both actors
  const websiteUrl = text(record["website"]);

  // Phone: "phone" in both
  const phone = text(record["phone"]);

  return {
    providerId,
    name,
    phone,
    address,
    city,
    region,
    country,
    rating,
    reviewCount,
    websiteUrl,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function joinStrings(parts: (string | null)[]): string | null {
  const joined = parts.filter(Boolean).join(", ");
  return joined.length > 0 ? joined : null;
}

function numberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)))
    return Number(value);
  return null;
}

function integerOrNull(value: unknown): number | null {
  const parsed = numberOrNull(value);
  if (parsed == null) return null;
  return Math.max(0, Math.round(parsed));
}
