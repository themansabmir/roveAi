import { AiEvidenceContext } from "./ai.types";

export function buildOpportunityPrompt(ctx: AiEvidenceContext): string {
  const degradedNotice = ctx.scoreBreakdown?.evidenceFreshness === "DEGRADED"
    ? "\nCRITICAL EVIDENCE NOTE: Target site was temporarily inaccessible during the latest scan attempt. Verified findings from previous successful audits are cited above. Do NOT state or imply that the business website is permanently offline or broken."
    : "";

  const isTechnicallyClean = (ctx.scoreBreakdown?.gapIndex ?? 50) < 15;
  const cleanSiteGuidance = isTechnicallyClean
    ? "\nNOTE ON CLEAN TECHNICAL SIGNALS: This business demonstrates strong technical performance with minimal or no critical vulnerabilities. Focus the brief on conversion expansion, paid acquisition scaling, or reputation enhancement. Do NOT invent or exaggerate non-existent technical flaws."
    : "";

  return `
Analyze the technical audit findings, Google Maps profile, and website signals for the following business:
${JSON.stringify(ctx, null, 2)}
${degradedNotice}
${cleanSiteGuidance}

Produce a sales-ready Opportunity Brief for an agency offering ${ctx.serviceTarget || "Digital Marketing & Web Services"}.

HARD CONSTRAINTS & PROHIBITED CLAIMS:
1. DO NOT claim or guess search engine ranking positions (e.g. "You rank on page 3 of Google") unless ranking data is explicitly provided in the evidence payload.
2. DO NOT claim security compromise, malware, data breaches, or legal non-compliance without explicit verified audit findings.
3. DO NOT promise guaranteed percentage revenue, traffic, or conversion increases (e.g. "We guarantee 40% more revenue"). Frame potential impact consultatively.
4. DO NOT fabricate competitor names or comparative metrics not present in the evidence.
5. Use only verified findings. Do not treat null or unassessed attributes as negative business flaws.
6. The opportunity score represents internal consultative queue priority, not customer purchase probability.

Return a JSON object with EXACTLY the following structure:
{
  "headlineOpportunity": "Concise 1-sentence sales pitch headline identifying their biggest opportunity or conversion upgrade",
  "suggestedService": "Specific service solution offering (e.g. 'Core Web Vitals Speed Optimization & Mobile Conversion Upgrade')",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "valueProposition": "2-3 sentences explaining the tangible revenue impact of addressing these opportunities for their local market",
  "outreachAngle": "Strategic angle for consultative cold outreach without sounding like spam",
  "coldEmailDraft": "A high-converting, personalized 3-paragraph cold email referencing their real metrics (LCP, mobile speed, reviews) with a gentle CTA",
  "callScriptDraft": "A concise bullet-point phone opening script for an account executive, highlighting real findings respectfully",
  "keyFindings": ["Finding 1 with metric", "Finding 2 with metric", "Finding 3 with metric"]
}
`.trim();
}
