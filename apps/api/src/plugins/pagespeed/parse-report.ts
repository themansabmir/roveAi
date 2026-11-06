import { PagespeedFinding, PagespeedMetric } from "./pagespeed.types";

export function parsePagespeedReport(body: unknown): PagespeedMetric {
  const root = asRecord(body);
  const lighthouse = asRecord(root?.lighthouseResult);
  const audits = asRecord(lighthouse?.audits);
  const categories = asRecord(lighthouse?.categories);
  const performance = asRecord(categories?.performance);
  const scoreValue = typeof performance?.score === "number" ? Math.round(performance.score * 100) : null;
  const lcp = numericAudit(audits, "largest-contentful-paint");
  const cls = numericAudit(audits, "cumulative-layout-shift");
  const inp = numericAudit(audits, "interaction-to-next-paint");
  const tbt = numericAudit(audits, "total-blocking-time");

  const metrics: Record<string, number | string | null> = {
    lighthouse_performance: scoreValue,
    lcp_ms: lcp,
    cls,
    inp_ms: inp,
    tbt_ms: tbt,
  };
  const crux = asRecord(root?.loadingExperience)?.metrics;
  if (crux && typeof crux === "object") {
    metrics.field_present = 1;
  }

  const findings: PagespeedFinding[] = [];
  if (lcp != null && lcp > 2500) {
    findings.push(metricFinding("SLOW_LCP", lcp > 4000 ? "HIGH" : "MEDIUM", "lcp_ms", lcp, "Largest Contentful Paint is slow in the mobile lab run."));
  }
  if (cls != null && cls > 0.1) {
    findings.push(metricFinding("HIGH_CLS", cls > 0.25 ? "HIGH" : "MEDIUM", "cls", cls, "Cumulative Layout Shift is above the lab threshold."));
  }
  if (inp != null && inp > 200) {
    findings.push(metricFinding("SLOW_INP", inp > 500 ? "HIGH" : "MEDIUM", "inp_ms", inp, "Interaction to Next Paint is slow in the mobile lab run."));
  }
  if (scoreValue != null && scoreValue < 90) {
    findings.push(
      metricFinding(
        "LOW_PERFORMANCE_SCORE",
        scoreValue < 50 ? "HIGH" : "MEDIUM",
        "lighthouse_performance",
        scoreValue,
        "Mobile lab performance score is below 90."
      )
    );
  }

  return { metrics, score: scoreValue, findings };
}

function metricFinding(
  code: string,
  severity: "MEDIUM" | "HIGH",
  metric: string,
  value: number,
  message: string
): PagespeedFinding {
  return {
    code,
    severity,
    source: "LAB",
    confidence: 0.99,
    message,
    evidence: { metric, value },
  };
}

function numericAudit(audits: Record<string, unknown> | null, key: string): number | null {
  const audit = asRecord(audits?.[key]);
  return typeof audit?.numericValue === "number" ? audit.numericValue : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}
