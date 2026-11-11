import { AiEvidenceContext } from "./ai.types";

export function buildOpportunityPrompt(ctx: AiEvidenceContext): string {
  const degradedNotice = ctx.scoreBreakdown?.evidenceFreshness === "DEGRADED"
    ? "\nCRITICAL EVIDENCE NOTE: Target site was temporarily inaccessible during the latest scan attempt. Verified findings from previous successful audits are cited above. Do NOT state or imply that the business website is permanently offline or broken."
    : "";

  return `
Analyze the technical audit findings, Google Maps profile, and website signals for the following business:
${JSON.stringify(ctx, null, 2)}
${degradedNotice}

Produce a sales-ready Opportunity Brief for an agency offering ${ctx.serviceTarget || "Digital Marketing & Web Services"}.
IMPORTANT:
- Use only verified findings. Do not treat null or unassessed attributes as negative business flaws.
- The opportunity score represents internal consultative queue priority, not customer purchase probability.

Return a JSON object with EXACTLY the following structure:
{
  "headlineOpportunity": "Concise 1-sentence sales pitch headline identifying their biggest technical vulnerability and conversion leak",
  "suggestedService": "Specific service solution offering (e.g. 'Core Web Vitals Speed Optimization & Mobile Conversion Upgrade')",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "valueProposition": "2-3 sentences explaining the tangible revenue impact of fixing these technical issues for their local market",
  "outreachAngle": "Strategic angle for consultative cold outreach without sounding like spam",
  "coldEmailDraft": "A high-converting, personalized 3-paragraph cold email referencing their real metrics (LCP, mobile speed, reviews) with a gentle CTA",
  "callScriptDraft": "A concise bullet-point phone opening script for an account executive, highlighting real findings respectfully",
  "keyFindings": ["Finding 1 with metric", "Finding 2 with metric", "Finding 3 with metric"]
}
`.trim();
}
