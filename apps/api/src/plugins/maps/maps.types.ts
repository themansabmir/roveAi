export interface MapsSearchInput {
  query: string;
  limit: number;
}

export interface MapsBusiness {
  providerId: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  rating: number | null;
  reviewCount: number | null;
  websiteUrl: string | null;
}

export interface MapsProvider {
  search(input: MapsSearchInput): Promise<MapsBusiness[]>;
}

export class MapsQuotaError extends Error {
  constructor() {
    super("Maps provider returned HTTP 429");
    this.name = "MapsQuotaError";
  }
}

export class MapsProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MapsProviderError";
  }
}
