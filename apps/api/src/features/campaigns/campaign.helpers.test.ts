import { classifyWebsite, exclusionMatches } from "./normalize";
import { expandQueries, MAX_MAPS_QUERIES } from "./queries";
import { normalizeOutscraper } from "@plugins/maps/outscraper.provider";

describe("campaign discovery helpers", () => {
  it("keeps query expansion inside the cap", () => {
    const queries = expandQueries({
      niche: "Dentist",
      serviceType: "Local SEO",
      city: "Austin",
      region: "Texas",
      country: "United States",
    });
    expect(queries.length).toBeGreaterThan(0);
    expect(queries.length).toBeLessThanOrEqual(MAX_MAPS_QUERIES);
    expect(new Set(queries.map((query) => query.toLowerCase())).size).toBe(queries.length);
  });

  it("classifies websites and matches exclusion hosts exactly", () => {
    expect(classifyWebsite(null)).toBe("MISSING");
    expect(classifyWebsite("https://instagram.com/socialsmile")).toBe("SOCIAL");
    expect(classifyWebsite("https://www.harbordental.example")).toBe("OWNED_SITE");
    expect(exclusionMatches("https://www.example.com/path", ["example.com"])).toBe(true);
    expect(exclusionMatches("https://blog.example.com", ["example.com"])).toBe(false);
    expect(exclusionMatches("https://blog.example.com", ["blog.example.com"])).toBe(true);
  });

  it("reads place id and website from an Outscraper payload", () => {
    const rows = normalizeOutscraper({
      status: "Success",
      data: [
        [
          {
            name: "Harbor Dental",
            place_id: "place-1",
            site: "https://harbordental.example",
            rating: "4.6",
            reviews: 12,
          },
        ],
      ],
    });
    expect(rows).toEqual([
      {
        providerId: "place-1",
        name: "Harbor Dental",
        phone: null,
        address: null,
        city: null,
        region: null,
        country: null,
        rating: 4.6,
        reviewCount: 12,
        websiteUrl: "https://harbordental.example",
      },
    ]);
  });
});
