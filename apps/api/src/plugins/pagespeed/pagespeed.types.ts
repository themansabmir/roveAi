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
