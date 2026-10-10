import { MapsBusiness, MapsProvider, MapsSearchInput } from "./maps.types";

export class FixtureMapsProvider implements MapsProvider {
  async search(input: MapsSearchInput): Promise<MapsBusiness[]> {
    const city = cityFromQuery(input.query);
    const rows: MapsBusiness[] = [
      {
        providerId: "fixture-harbor",
        name: "Harbor Dental",
        phone: "+1 512 555 0101",
        address: `100 Main St, ${city}`,
        city,
        region: null,
        country: null,
        rating: 4.6,
        reviewCount: 42,
        websiteUrl: "https://www.harbordental.example",
      },
      {
        providerId: "fixture-social",
        name: "Social Smile Studio",
        phone: "+1 512 555 0102",
        address: null,
        city,
        region: null,
        country: null,
        rating: 4.2,
        reviewCount: 18,
        websiteUrl: "https://instagram.com/socialsmile",
      },
      {
        providerId: "fixture-missing",
        name: "No Site Clinic",
        phone: "+1 512 555 0103",
        address: null,
        city,
        region: null,
        country: null,
        rating: 3.4,
        reviewCount: 4,
        websiteUrl: null,
      },
      {
        providerId: "fixture-harbor",
        name: "Harbor Dental",
        phone: "+1 512 555 0101",
        address: `100 Main St, ${city}`,
        city,
        region: null,
        country: null,
        rating: 4.6,
        reviewCount: 42,
        websiteUrl: "https://www.harbordental.example",
      },
    ];
    return rows.slice(0, Math.max(0, input.limit));
  }
}

function cityFromQuery(query: string): string {
  const match = query.match(/\bin\s+([^,]+)/i);
  const city = match?.[1]?.trim();
  return city && city.length > 0 ? city : "Sample City";
}
