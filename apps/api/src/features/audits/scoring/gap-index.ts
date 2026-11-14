import { GapIndexResult, ScoringFactor } from "./score-types";

export interface GapIndexInput {
  websiteClass?: string | null;
  audits: Array<{
    module: string;
    status: string;
    score?: number | null;
    metrics?: unknown;
    findings?: Array<{ code: string; severity?: string; message?: string }>;
  }>;
  maxPagesConfigured?: number;
}

export function calculateGapIndex(input: GapIndexInput): GapIndexResult {
  const wClass = input.websiteClass ?? "OWNED_SITE";

  // ─── 1. Presence Gap Separation for Non-Owned Websites ──────────────────────
  if (wClass !== "OWNED_SITE") {
    let presenceGap = 50;
    let label = "Non-owned web presence";

    if (wClass === "MISSING") {
      presenceGap = 90;
      label = "No website found (MISSING)";
    } else if (wClass === "SOCIAL") {
      presenceGap = 65;
      label = "Social profile only (no owned website)";
    } else if (wClass === "DIRECTORY") {
      presenceGap = 55;
      label = "Directory listing only";
    }

    return {
      score: presenceGap,
      availability: "COMPLETE",
      coverage: 1.0,
      presenceGap,
      technicalGap: null,
      technicalCoverage: 0.0, // Reported honestly: technical probes were not performed
      presenceCoverage: 1.0,
      factors: [
        {
          code: `PRESENCE_${wClass}`,
          label,
          impact: presenceGap,
        },
      ],
      missingProbes: [],
    };
  }

  // ─── 2. Technical Deficiency Scoring on OWNED_SITE ──────────────────────────
  const factors: ScoringFactor[] = [];
  const missingProbes: string[] = [];

  const completedAudits = new Map(
    input.audits
      .filter((a) => a.status === "COMPLETED")
      .map((a) => [a.module, a])
  );

  const perfAudit = completedAudits.get("PERFORMANCE");
  const seoAudit = completedAudits.get("TECHNICAL_SEO");
  const expAudit = completedAudits.get("WEBSITE_EXPERIENCE");

  // Track assessed probes
  let assessedProbeCount = 0;
  const isMultiPageCrawl = (input.maxPagesConfigured ?? 8) > 1;
  const applicableProbeCount = isMultiPageCrawl ? 14 : 13; // probe_contact_page excluded if single-page

  // ─── Performance Module ─────────────────────────────────────────────────────
  let perfPenalty = 0;
  if (perfAudit) {
    assessedProbeCount += 4; // probe_psi_mobile, probe_lcp, probe_cls, probe_inp

    if (typeof perfAudit.score === "number") {
      if (perfAudit.score < 40) {
        perfPenalty += 30;
        factors.push({ code: "CRITICAL_MOBILE_SPEED", label: `Lighthouse score is critical (${perfAudit.score}/100)`, impact: 30 });
      } else if (perfAudit.score < 65) {
        perfPenalty += 18;
        factors.push({ code: "POOR_MOBILE_SPEED", label: `Lighthouse score is poor (${perfAudit.score}/100)`, impact: 18 });
      } else if (perfAudit.score < 85) {
        perfPenalty += 8;
        factors.push({ code: "SUBOPTIMAL_MOBILE_SPEED", label: `Lighthouse score needs optimization (${perfAudit.score}/100)`, impact: 8 });
      }
    }

    // Core Web Vitals (Category Cap: 15)
    let cwvPenalty = 0;
    const codes = new Set((perfAudit.findings ?? []).map((f) => f.code));
    if (codes.has("SLOW_LCP")) cwvPenalty += 8;
    if (codes.has("HIGH_CLS")) cwvPenalty += 5;
    if (codes.has("SLOW_INP")) cwvPenalty += 5;

    const cappedCwv = Math.min(15, cwvPenalty);
    if (cappedCwv > 0) {
      perfPenalty += cappedCwv;
      factors.push({ code: "CORE_WEB_VITALS_FAILURE", label: "Core Web Vitals bottlenecks (LCP/CLS/INP)", impact: cappedCwv });
    }
  } else {
    missingProbes.push("probe_psi_mobile", "probe_lcp", "probe_cls", "probe_inp");
  }

  // ─── Technical SEO Module ───────────────────────────────────────────────────
  let seoPenalty = 0;
  if (seoAudit) {
    assessedProbeCount += 6; // probe_title, probe_meta_description, probe_h1, probe_robots, probe_canonical, probe_broken_links
    const codes = new Set((seoAudit.findings ?? []).map((f) => f.code));

    // Title & Meta (Category Cap: 12)
    let titleMeta = 0;
    if (codes.has("MISSING_TITLE")) titleMeta += 8;
    if (codes.has("MISSING_META_DESCRIPTION")) titleMeta += 5;
    const cappedTitleMeta = Math.min(12, titleMeta);
    if (cappedTitleMeta > 0) {
      seoPenalty += cappedTitleMeta;
      factors.push({ code: "SEO_META_DEVIATION", label: "Missing or malformed title/meta tags", impact: cappedTitleMeta });
    }

    // Headings (Category Cap: 6)
    let headingPenalty = 0;
    if (codes.has("MISSING_H1")) headingPenalty += 4;
    if (codes.has("MULTIPLE_H1")) headingPenalty += 2;
    const cappedHeadings = Math.min(6, headingPenalty);
    if (cappedHeadings > 0) {
      seoPenalty += cappedHeadings;
      factors.push({ code: "SEO_HEADING_STRUCTURE", label: "H1 heading hierarchy defects", impact: cappedHeadings });
    }

    // Indexing & Crawl (Category Cap: 20)
    let indexPenalty = 0;
    if (codes.has("ROBOTS_NOINDEX")) indexPenalty += 15;
    if (codes.has("BROKEN_INTERNAL_LINK")) indexPenalty += 5;
    if (codes.has("MISSING_CANONICAL")) indexPenalty += 3;
    const cappedIndexing = Math.min(20, indexPenalty);
    if (cappedIndexing > 0) {
      seoPenalty += cappedIndexing;
      factors.push({ code: "SEO_INDEXING_CRAWL_ISSUES", label: "Search indexing or canonical link defects", impact: cappedIndexing });
    }
  } else {
    missingProbes.push("probe_title", "probe_meta_description", "probe_h1", "probe_robots", "probe_canonical", "probe_broken_links");
  }

  // ─── Website Experience Module ──────────────────────────────────────────────
  let expPenalty = 0;
  if (expAudit) {
    assessedProbeCount += isMultiPageCrawl ? 4 : 3;
    const codes = new Set((expAudit.findings ?? []).map((f) => f.code));

    // Contact Channels (Category Cap: 8)
    let contactPenalty = 0;
    if (codes.has("NO_TEL_LINK")) contactPenalty += 6;
    if (codes.has("NO_MAILTO")) contactPenalty += 2;
    const cappedContact = Math.min(8, contactPenalty);
    if (cappedContact > 0) {
      expPenalty += cappedContact;
      factors.push({ code: "EXP_NO_CLICK_TO_CALL", label: "Missing click-to-call or direct contact channels", impact: cappedContact });
    }

    // Lead Capture & Conversion (Category Cap: 12)
    let capturePenalty = 0;
    if (codes.has("NO_CONTACT_FORM")) capturePenalty += 6;
    if (codes.has("NO_CLEAR_CTA")) capturePenalty += 6;
    if (isMultiPageCrawl && codes.has("NO_CONTACT_PAGE")) capturePenalty += 4;
    const cappedCapture = Math.min(12, capturePenalty);
    if (cappedCapture > 0) {
      expPenalty += cappedCapture;
      factors.push({ code: "EXP_MISSING_LEAD_CAPTURE", label: "No online booking, contact form, or clear CTA", impact: cappedCapture });
    }
  } else {
    missingProbes.push("probe_tel_link", "probe_mailto_link", "probe_contact_form", "probe_cta");
  }

  // ─── Coverage & Availability Calculation ────────────────────────────────────
  const technicalCoverage = Number((assessedProbeCount / applicableProbeCount).toFixed(2));

  // If no technical modules completed successfully:
  if (completedAudits.size === 0) {
    return {
      score: null,
      availability: "UNAVAILABLE",
      coverage: 0.0,
      presenceGap: 0,
      technicalGap: null,
      technicalCoverage: 0.0,
      presenceCoverage: 0.0,
      factors: [],
      missingProbes,
    };
  }

  const technicalGap = Math.min(100, perfPenalty + seoPenalty + expPenalty);
  const availability = completedAudits.size === 3 ? "COMPLETE" : "PARTIAL";

  return {
    score: technicalGap,
    availability,
    coverage: technicalCoverage,
    presenceGap: 0,
    technicalGap,
    technicalCoverage,
    presenceCoverage: 1.0,
    factors,
    missingProbes,
  };
}
