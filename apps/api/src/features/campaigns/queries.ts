export const MAX_MAPS_QUERIES = 8;

export function expandQueries(input: {
  niche: string;
  serviceType: string;
  city: string;
  region: string;
  country: string;
}): string[] {
  const niche = input.niche.trim();
  const city = input.city.trim();
  const region = input.region.trim();
  const country = input.country.trim();
  const service = input.serviceType.trim();
  const candidates = [
    `${niche} in ${city}, ${region}`,
    `${niche} ${city}`,
    `${niche} near ${city}`,
    `best ${niche} ${city}`,
    `${niche} ${city} ${country}`,
    `${service} ${niche} ${city}`,
    `${niche} services ${city}`,
    `local ${niche} ${city} ${region}`,
  ];

  const seen = new Set<string>();
  const queries: string[] = [];
  for (const candidate of candidates) {
    const query = candidate.replace(/\s+/g, " ").trim();
    const key = query.toLowerCase();
    if (!query || seen.has(key)) continue;
    seen.add(key);
    queries.push(query);
    if (queries.length === MAX_MAPS_QUERIES) break;
  }
  return queries;
}
