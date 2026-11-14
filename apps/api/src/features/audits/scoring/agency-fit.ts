import { AgencyFitResult, ScoringFactor } from "./score-types";

export interface AgencyFitInput {
  campaignServiceType?: string | null;
  campaignNiche?: string | null;
  serviceOffers?: Array<{ name: string; codes: string[]; active: boolean }>;
  lead: {
    business: {
      category?: string | null;
      websiteClass?: string | null;
      rating?: number | null;
      reviewCount?: number | null;
    };
    audits?: Array<{
      module: string;
      status: string;
      score?: number | null;
      findings?: Array<{ code: string }>;
    }>;
  };
}

export function calculateAgencyFitScore(input: AgencyFitInput): AgencyFitResult {
  const factors: ScoringFactor[] = [];
  const missingProbes: string[] = [];

  // ─── 1. Hierarchy Check ─────────────────────────────────────────────────────
  const rawService = input.campaignServiceType?.trim() || "";
  const activeOffers = (input.serviceOffers ?? []).filter((o) => o.active);

  // If neither campaign serviceType nor organization ServiceOffers exist:
  if (!rawService && activeOffers.length === 0) {
    return {
      score: null,
      availability: "UNAVAILABLE",
      coverage: 0.0,
      primaryMatch: 0,
      secondaryUpsell: 0,
      nicheAlignment: 0,
      factors: [],
      missingProbes: ["No campaign serviceType or organization ServiceOffers configured"],
    };
  }

  // Determine active service codes
  const serviceCodes = new Set<string>();
  const serviceText = rawService.toLowerCase();

  if (/speed|performance|core web vitals|lighthouse|fast/i.test(serviceText)) {
    serviceCodes.add("PERFORMANCE");
  }
  if (/seo|search|google rank|metadata/i.test(serviceText)) {
    serviceCodes.add("TECHNICAL_SEO");
  }
  if (/\b(?:website|web\s*design|redesign|developer|landing)\b/i.test(serviceText)) {
    serviceCodes.add("WEBSITE");
  }
  if (/conversion|booking|funnel|leads|appointment/i.test(serviceText)) {
    serviceCodes.add("BOOKING_CONVERSION");
  }
  if (/review|reputation|reputation management|google review/i.test(serviceText)) {
    serviceCodes.add("REPUTATION");
  }
  if (/maps|local seo|gbp|google business/i.test(serviceText)) {
    serviceCodes.add("LOCAL_SEO");
  }

  // Include organization-level offer codes
  for (const offer of activeOffers) {
    for (const code of offer.codes) {
      serviceCodes.add(code);
    }
  }

  // Fallback: If text was provided but matched no specific code, default to WEBSITE
  if (serviceCodes.size === 0 && rawService) {
    serviceCodes.add("WEBSITE");
  }

  // Collect verified lead findings
  const completedAudits = (input.lead.audits ?? []).filter((a) => a.status === "COMPLETED");
  const perfAudit = completedAudits.find((a) => a.module === "PERFORMANCE");
  const findingCodes = new Set(completedAudits.flatMap((a) => (a.findings ?? []).map((f) => f.code)));
  const wClass = input.lead.business.websiteClass ?? "OWNED_SITE";

  // ─── 2. Component 1: Primary Need Alignment (0 to 60 pts) ───────────────────
  let primaryMatch = 0;

  if (serviceCodes.has("PERFORMANCE")) {
    const psiScore = perfAudit?.score;
    if (findingCodes.has("SLOW_LCP") || (typeof psiScore === "number" && psiScore < 50)) {
      primaryMatch = Math.max(primaryMatch, 60);
      factors.push({ code: "CRITICAL_SPEED_MATCH", label: "Agency speed service directly matches critical CWV/Lighthouse gap", impact: 60 });
    } else if (typeof psiScore === "number" && psiScore < 75) {
      primaryMatch = Math.max(primaryMatch, 35);
      factors.push({ code: "MODERATE_SPEED_MATCH", label: "Agency speed service matches moderate Lighthouse gap", impact: 35 });
    }
  }

  if (serviceCodes.has("WEBSITE")) {
    if (wClass !== "OWNED_SITE") {
      primaryMatch = Math.max(primaryMatch, 60);
      factors.push({ code: "MISSING_WEBSITE_REBUILD_MATCH", label: "Agency web design service directly matches missing/non-owned site", impact: 60 });
    } else if (typeof perfAudit?.score === "number" && perfAudit.score < 40) {
      primaryMatch = Math.max(primaryMatch, 60);
      factors.push({ code: "LEGACY_WEBSITE_OVERHAUL_MATCH", label: "Agency web design service matches critical performance/UX overhaul need", impact: 60 });
    }
  }

  if (serviceCodes.has("TECHNICAL_SEO")) {
    if (findingCodes.has("ROBOTS_NOINDEX") || findingCodes.has("MISSING_TITLE")) {
      primaryMatch = Math.max(primaryMatch, 60);
      factors.push({ code: "CRITICAL_SEO_MATCH", label: "Agency SEO service matches critical search visibility failure", impact: 60 });
    } else if (findingCodes.has("MISSING_META_DESCRIPTION") || findingCodes.has("MISSING_H1")) {
      primaryMatch = Math.max(primaryMatch, 35);
      factors.push({ code: "MODERATE_SEO_MATCH", label: "Agency SEO service matches on-page structure gaps", impact: 35 });
    }
  }

  if (serviceCodes.has("BOOKING_CONVERSION")) {
    if (findingCodes.has("NO_CONTACT_FORM") || findingCodes.has("NO_TEL_LINK") || findingCodes.has("NO_CLEAR_CTA")) {
      primaryMatch = Math.max(primaryMatch, 60);
      factors.push({ code: "CONVERSION_LEAK_MATCH", label: "Agency conversion service matches missing lead capture/CTA", impact: 60 });
    }
  }

  if (serviceCodes.has("REPUTATION")) {
    const rating = input.lead.business.rating;
    const reviews = input.lead.business.reviewCount;
    if (typeof rating === "number" && rating < 4.0 && (reviews ?? 0) >= 5) {
      primaryMatch = Math.max(primaryMatch, 60);
      factors.push({ code: "REPUTATION_MATCH", label: "Agency reputation service matches active business with low rating", impact: 60 });
    } else if (typeof reviews === "number" && reviews < 10) {
      primaryMatch = Math.max(primaryMatch, 35);
      factors.push({ code: "REVIEW_GENERATION_MATCH", label: "Agency review service matches low review count", impact: 35 });
    }
  }

  // ─── 3. Component 2: Secondary Upsell Potential (0 to 20 pts) ───────────────
  let secondaryUpsell = 0;
  if (primaryMatch > 0) {
    if (serviceCodes.size > 1) {
      secondaryUpsell = 20;
      factors.push({ code: "MULTI_SERVICE_UPSELL", label: "Agency offers multiple relevant service lines for upsell", impact: 20 });
    } else {
      secondaryUpsell = 10;
      factors.push({ code: "SINGLE_SERVICE_OFFERING", label: "Primary service match identified", impact: 10 });
    }
  } else if (wClass !== "OWNED_SITE") {
    // Lead with missing website naturally has high upsell potential for any digital agency
    secondaryUpsell = 15;
    factors.push({ code: "NEW_DIGITAL_PRESENCE_POTENTIAL", label: "Business lacking website presents cross-service potential", impact: 15 });
  }

  // ─── 4. Component 3: Target Niche Alignment (0 to 20 pts) ───────────────────
  let nicheAlignment = 10; // Baseline local business match
  if (input.campaignNiche && input.campaignNiche.trim().length > 0) {
    nicheAlignment = 20;
    factors.push({ code: "TARGET_NICHE_MATCH", label: `Lead matches campaign target niche: "${input.campaignNiche}"`, impact: 20 });
  }

  // ─── 5. Score Aggregation ───────────────────────────────────────────────────
  const score = Math.min(100, primaryMatch + secondaryUpsell + nicheAlignment);
  const availability = completedAudits.length > 0 || wClass !== "OWNED_SITE" ? "COMPLETE" : "PARTIAL";

  return {
    score,
    availability,
    coverage: availability === "COMPLETE" ? 1.0 : 0.6,
    primaryMatch,
    secondaryUpsell,
    nicheAlignment,
    factors,
    missingProbes,
  };
}
