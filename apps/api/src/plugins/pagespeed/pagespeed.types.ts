export interface PagespeedMetric {
  metrics: Record<string, number | string | null>;
  score: number | null;
  findings: PagespeedFinding[];
}

export interface PagespeedFinding {
  code: string;
  severity: "MEDIUM" | "HIGH";
  source: "LAB" | "FIELD";
  confidence: number;
  message: string;
  evidence: Record<string, unknown>;
}

export interface PagespeedReport {
  raw: unknown;
  parsed: PagespeedMetric;
}

export class PagespeedQuotaError extends Error {
  constructor() {
    super("PageSpeed Insights returned HTTP 429");
    this.name = "PagespeedQuotaError";
  }
}

export class PagespeedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PagespeedError";
  }
}

/**
 * PSI returned HTTP 400 with a Lighthouse FAILED_DOCUMENT_REQUEST error,
 * meaning the target site itself is down or unreachable — not a bug in our code.
 * Callers should record UNREACHABLE and skip retries.
 */
export class PagespeedUnreachableError extends Error {
  constructor(url: string, detail: string) {
    super(`PSI could not load ${url}: ${detail}`);
    this.name = "PagespeedUnreachableError";
  }
}
