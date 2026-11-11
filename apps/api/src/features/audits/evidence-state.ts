/**
 * Quad-State Evidence Contract (EP-Evidence)
 *
 * Explicit verification states across field and probe levels:
 * 1. PRESENT: Attribute verified to exist with a valid value.
 * 2. VERIFIED_ABSENT: Attribute verified to NOT exist.
 * 3. AUDIT_FAILED: Check failed due to error, timeout, or WAF/bot block.
 * 4. NOT_ASSESSED: Check was not performed (budget, out of scope, or prerequisites missing).
 *
 * CRITICAL RULE:
 * AUDIT_FAILED must NEVER be treated as VERIFIED_ABSENT.
 * Unknown information must NOT be interpreted as a negative business attribute.
 */

export type VerificationStatus = "PRESENT" | "VERIFIED_ABSENT" | "AUDIT_FAILED" | "NOT_ASSESSED";

export type ProbeCategory = "PERFORMANCE" | "SEO" | "EXPERIENCE" | "BUSINESS";

/**
 * Strict discriminated union for field-level attributes (phone, email, rating, etc.)
 */
export type FieldResult<T> =
  | {
      status: "PRESENT";
      value: T;
      source: string;
      checkedAt: string;
    }
  | {
      status: "VERIFIED_ABSENT";
      value: null;
      source: string;
      checkedAt: string;
    }
  | {
      status: "AUDIT_FAILED";
      value: null;
      error: string;
      source: string;
      checkedAt: string;
    }
  | {
      status: "NOT_ASSESSED";
      value: null;
      reason: string;
      source: string;
      checkedAt: string;
    };

/**
 * Strict discriminated union for probe-level verification checks
 */
export type ProbeResult<T = unknown> =
  | {
      probeCode: string;
      category: ProbeCategory;
      status: "PRESENT";
      value: T;
      findingCode?: null;
      error?: null;
      reason?: null;
      source: string;
      checkedAt: string;
      isApplicable: true;
    }
  | {
      probeCode: string;
      category: ProbeCategory;
      status: "VERIFIED_ABSENT";
      value: null;
      findingCode?: string;
      error?: null;
      reason?: null;
      source: string;
      checkedAt: string;
      isApplicable: true;
    }
  | {
      probeCode: string;
      category: ProbeCategory;
      status: "AUDIT_FAILED";
      value: null;
      error: string;
      findingCode?: null;
      reason?: null;
      source: string;
      checkedAt: string;
      isApplicable: true;
    }
  | {
      probeCode: string;
      category: ProbeCategory;
      status: "NOT_ASSESSED";
      value: null;
      reason: string;
      findingCode?: null;
      error?: null;
      source: string;
      checkedAt: string;
      isApplicable: boolean;
    };

// ─── Exact Technical Probe Registry (14 Probes) ──────────────────────────────

export const TECHNICAL_PROBES = [
  // Performance (4)
  "probe_psi_mobile",
  "probe_lcp",
  "probe_cls",
  "probe_inp",
  // Technical SEO (6)
  "probe_title",
  "probe_meta_description",
  "probe_h1",
  "probe_robots",
  "probe_canonical",
  "probe_broken_links",
  // Website Experience (4)
  "probe_tel_link",
  "probe_mailto_link",
  "probe_contact_form",
  "probe_cta",
] as const;

export type TechnicalProbeCode = typeof TECHNICAL_PROBES[number];

// ─── Helper Constructors ─────────────────────────────────────────────────────

export function present<T>(value: T, source = "system", checkedAt = new Date().toISOString()): FieldResult<T> {
  return { status: "PRESENT", value, source, checkedAt };
}

export function verifiedAbsent(source = "system", checkedAt = new Date().toISOString()): FieldResult<never> {
  return { status: "VERIFIED_ABSENT", value: null, source, checkedAt };
}

export function auditFailed(error: string, source = "system", checkedAt = new Date().toISOString()): FieldResult<never> {
  return { status: "AUDIT_FAILED", value: null, error, source, checkedAt };
}

export function notAssessed(reason: string, source = "system", checkedAt = new Date().toISOString()): FieldResult<never> {
  return { status: "NOT_ASSESSED", value: null, reason, source, checkedAt };
}

export function evaluateField<T>(
  extractor: () => T | null | undefined,
  options?: { source?: string; checkedAt?: string }
): FieldResult<T> {
  const source = options?.source ?? "system";
  const checkedAt = options?.checkedAt ?? new Date().toISOString();
  try {
    const raw = extractor();
    if (raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")) {
      return { status: "VERIFIED_ABSENT", value: null, source, checkedAt };
    }
    return { status: "PRESENT", value: raw, source, checkedAt };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { status: "AUDIT_FAILED", value: null, error, source, checkedAt };
  }
}

// ─── Business Enrichment Profile ─────────────────────────────────────────────

export interface BusinessEvidenceProfile {
  phone: FieldResult<string>;
  email: FieldResult<string>;
  websiteUrl: FieldResult<string>;
  address: FieldResult<string>;
  category: FieldResult<string>;
  rating: FieldResult<number>;
  reviewCount: FieldResult<number>;
}

/**
 * Extracts legacy field state without false verified absence.
 */
export function extractLegacyFieldState<T>(
  fieldValue: T | null | undefined,
  fieldName: string,
  providerRaw: unknown,
  defaultSource = "legacy_database_field"
): FieldResult<T> {
  const now = new Date().toISOString();

  // 1. If valid value exists: PRESENT
  if (fieldValue !== null && fieldValue !== undefined && (typeof fieldValue !== "string" || fieldValue.trim() !== "")) {
    return {
      status: "PRESENT",
      value: fieldValue,
      source: defaultSource,
      checkedAt: now,
    };
  }

  // 2. If fieldValue is null, inspect providerRaw for reliable provenance:
  if (!providerRaw || typeof providerRaw !== "object") {
    return {
      status: "NOT_ASSESSED",
      value: null,
      reason: `Legacy record: ${fieldName} is null and providerRaw is missing`,
      source: "unknown",
      checkedAt: now,
    };
  }

  const raw = providerRaw as Record<string, unknown>;

  // Check for explicit provider errors on this field
  const errorKey = `${fieldName}_error`;
  if (errorKey in raw && typeof raw[errorKey] === "string") {
    return {
      status: "AUDIT_FAILED",
      value: null,
      error: String(raw[errorKey]),
      source: "provider_error",
      checkedAt: now,
    };
  }

  // 3. Provider-specific semantics:
  if (fieldName === "phone") {
    if ("title" in raw && ("phone" in raw || "formatted_phone_number" in raw)) {
      return { status: "VERIFIED_ABSENT", value: null, source: "google_places_raw", checkedAt: now };
    }
  }

  if (fieldName === "email") {
    // Maps providers don't crawl website emails by default unless secondary deep crawl ran
    if (!("emails" in raw || "email" in raw)) {
      return {
        status: "NOT_ASSESSED",
        value: null,
        reason: "Provider did not execute email extraction",
        source: "google_places_raw",
        checkedAt: now,
      };
    }
    return { status: "VERIFIED_ABSENT", value: null, source: "provider_email_crawl", checkedAt: now };
  }

  if (fieldName === "reviewCount") {
    if ("reviewsCount" in raw && (raw["reviewsCount"] === 0 || raw["reviewsCount"] === null)) {
      return { status: "VERIFIED_ABSENT", value: null, source: "google_places_raw", checkedAt: now };
    }
  }

  if (fieldName === "rating") {
    if ("totalScore" in raw || "rating" in raw) {
      return { status: "VERIFIED_ABSENT", value: null, source: "google_places_raw", checkedAt: now };
    }
  }

  // Fallback for unconfirmed nulls:
  return {
    status: "NOT_ASSESSED",
    value: null,
    reason: `Legacy field ${fieldName} was not verified by provider`,
    source: "google_places_raw",
    checkedAt: now,
  };
}

/**
 * Extracts a typed BusinessEvidenceProfile from Business database row.
 */
export function extractBusinessEvidence(business: {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  category?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  websiteUrl?: string | null;
  provider?: string | null;
  providerRaw?: unknown;
  enrichmentState?: unknown;
}): BusinessEvidenceProfile {
  // If stored enrichmentState exists and is valid, use it:
  if (business.enrichmentState && typeof business.enrichmentState === "object") {
    const es = business.enrichmentState as { fields?: Record<string, unknown> };
    if (es.fields && typeof es.fields === "object") {
      const f = es.fields;
      return {
        phone: (f["phone"] as FieldResult<string>) ?? extractLegacyFieldState(business.phone, "phone", business.providerRaw),
        email: (f["email"] as FieldResult<string>) ?? extractLegacyFieldState(business.email, "email", business.providerRaw),
        websiteUrl: (f["websiteUrl"] as FieldResult<string>) ?? extractLegacyFieldState(business.websiteUrl, "websiteUrl", business.providerRaw),
        address: (f["address"] as FieldResult<string>) ?? extractLegacyFieldState(business.address, "address", business.providerRaw),
        category: (f["category"] as FieldResult<string>) ?? extractLegacyFieldState(business.category, "category", business.providerRaw),
        rating: (f["rating"] as FieldResult<number>) ?? extractLegacyFieldState(business.rating, "rating", business.providerRaw),
        reviewCount: (f["reviewCount"] as FieldResult<number>) ?? extractLegacyFieldState(business.reviewCount, "reviewCount", business.providerRaw),
      };
    }
  }

  // Otherwise, safely extract from legacy fields with providerRaw inspection:
  return {
    phone: extractLegacyFieldState(business.phone, "phone", business.providerRaw, business.provider ?? "discovery"),
    email: extractLegacyFieldState(business.email, "email", business.providerRaw, business.provider ?? "discovery"),
    websiteUrl: extractLegacyFieldState(business.websiteUrl, "websiteUrl", business.providerRaw, business.provider ?? "discovery"),
    address: extractLegacyFieldState(business.address, "address", business.providerRaw, business.provider ?? "discovery"),
    category: extractLegacyFieldState(business.category, "category", business.providerRaw, business.provider ?? "discovery"),
    rating: extractLegacyFieldState(business.rating, "rating", business.providerRaw, business.provider ?? "discovery"),
    reviewCount: extractLegacyFieldState(business.reviewCount, "reviewCount", business.providerRaw, business.provider ?? "discovery"),
  };
}

// ─── Freshness Resolution ────────────────────────────────────────────────────

export type EvidenceFreshness = "FRESH" | "STALE" | "DEGRADED" | "UNAUDITED";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Resolves freshness strictly per module according to unambiguous precedence:
 * 1. No successful audit exists -> UNAUDITED
 * 2. Latest attempt failed, with historical successful evidence -> DEGRADED
 * 3. Last successful evidence is older than freshness threshold -> STALE
 * 4. Latest attempt succeeded and evidence is recent -> FRESH
 */
export function resolveFreshness(
  lastSuccessfulAudit: { observedAt?: Date | string | null } | null | undefined,
  latestAttempt: { status: string; observedAt?: Date | string } | null | undefined,
  now = new Date()
): EvidenceFreshness {
  // 1. No successful audit exists or observedAt is missing
  if (!lastSuccessfulAudit || !lastSuccessfulAudit.observedAt) {
    return "UNAUDITED";
  }

  // 2. Latest attempt failed, with historical successful evidence
  if (latestAttempt && ["FAILED", "AUDIT_FAILED", "BLOCKED", "UNREACHABLE", "SKIPPED_BY_ROBOTS"].includes(latestAttempt.status)) {
    return "DEGRADED";
  }

  // 3. Last successful evidence is older than 7 days
  const observedTime = new Date(lastSuccessfulAudit.observedAt).getTime();
  if (now.getTime() - observedTime > SEVEN_DAYS_MS) {
    return "STALE";
  }

  // 4. Latest attempt succeeded and is recent
  return "FRESH";
}

/**
 * Builds initial typed enrichmentState JSON to be saved on Business creation or update.
 */
export function buildInitialEnrichmentState(input: {
  phone?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  address?: string | null;
  category?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  source?: string;
  providerRaw?: unknown;
}): { fields: BusinessEvidenceProfile; updatedAt: string } {
  const source = input.source ?? "discovery";
  const now = new Date().toISOString();
  return {
    fields: {
      phone: input.phone
        ? present(input.phone, source, now)
        : extractLegacyFieldState<string>(null, "phone", input.providerRaw, source),
      email: input.email
        ? present(input.email, source, now)
        : extractLegacyFieldState<string>(null, "email", input.providerRaw, source),
      websiteUrl: input.websiteUrl
        ? present(input.websiteUrl, source, now)
        : extractLegacyFieldState<string>(null, "websiteUrl", input.providerRaw, source),
      address: input.address
        ? present(input.address, source, now)
        : extractLegacyFieldState<string>(null, "address", input.providerRaw, source),
      category: input.category
        ? present(input.category, source, now)
        : extractLegacyFieldState<string>(null, "category", input.providerRaw, source),
      rating: input.rating != null
        ? present(input.rating, source, now)
        : extractLegacyFieldState<number>(null, "rating", input.providerRaw, source),
      reviewCount: input.reviewCount != null
        ? present(input.reviewCount, source, now)
        : extractLegacyFieldState<number>(null, "reviewCount", input.providerRaw, source),
    },
    updatedAt: now,
  };
}

