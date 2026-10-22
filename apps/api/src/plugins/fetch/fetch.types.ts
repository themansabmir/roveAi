export interface FetchedDocument {
  url: string;
  finalUrl: string;
  httpStatus: number;
  headers: Record<string, string>;
  body: Buffer;
  contentType: string;
}

export interface PageFetcher {
  fetch(url: string, maxBytes?: number): Promise<FetchedDocument>;
}

export class FetchError extends Error {
  constructor(
    message: string,
    readonly code: "blocked" | "unreachable" | "timeout" | "too_large"
  ) {
    super(message);
    this.name = "FetchError";
  }
}
