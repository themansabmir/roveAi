import { AiBriefResult, AiEvidenceContext, BriefData, IAiProvider } from "./ai.types";

export class DeterministicAiProvider implements IAiProvider {
  public readonly key = "deterministic";
  public readonly configured = true;

  async generateBrief(ctx: AiEvidenceContext): Promise<AiBriefResult> {
    const brief = this.synthesize(ctx);
    return {
      brief,
      modelName: "deterministic-evidence-synth",
    };
  }

  private synthesize(ctx: AiEvidenceContext): BriefData {
    const lcpSec = ctx.lcpMs ? (ctx.lcpMs / 1000).toFixed(1) : null;
    const cms = ctx.techStack.length > 0 ? ctx.techStack[0] : "custom";
    const findingsSummary: string[] = [];

    let headline = `Mobile performance bottlenecks and conversion friction impacting local client acquisition`;
    let suggestedService = ctx.serviceTarget || "Technical Performance & Conversion Optimization";

    if (ctx.websiteClass === "MISSING") {
      headline = `Complete lack of owned web presence despite active Google Maps demand`;
      suggestedService = "Turnkey High-Converting Local Business Website";
      findingsSummary.push("No owned website detected on Google profile");
      findingsSummary.push(`Competitor businesses in ${ctx.city} capture direct organic leads`);
    } else {
      if (ctx.lighthouseScore != null && ctx.lighthouseScore < 60) {
        findingsSummary.push(`Mobile Lighthouse Performance Score is critically low (${ctx.lighthouseScore}/100)`);
      }
      if (lcpSec && Number(lcpSec) > 2.5) {
        findingsSummary.push(`Largest Contentful Paint is ${lcpSec}s (Google recommends under 2.5s)`);
      }
      if (ctx.cls && ctx.cls > 0.1) {
        findingsSummary.push(`Cumulative Layout Shift of ${ctx.cls} causes visual page jumpiness on mobile`);
      }
      if (ctx.findingMessages.some((m) => m.includes("MISSING_META") || m.includes("MISSING_TITLE"))) {
        findingsSummary.push("Missing core SEO title and meta descriptions on homepage");
      }
      if (findingsSummary.length === 0) {
        findingsSummary.push("Baseline site detected with key opportunities for conversion and booking automation");
      }

      if (lcpSec && Number(lcpSec) > 2.5) {
        headline = `Sluggish mobile loading (${lcpSec}s LCP on ${cms}) creating high bounce rates for ${ctx.businessName}`;
        suggestedService = "Mobile Speed & Core Web Vitals Optimization";
      } else if (ctx.lighthouseScore != null && ctx.lighthouseScore < 60) {
        headline = `Sub-optimal mobile score (${ctx.lighthouseScore}/100) dragging down Google local visibility for ${ctx.businessName}`;
        suggestedService = "Full Local SEO & Technical Site Modernization";
      }
    }

    const valueProp = `With ${ctx.reviewCount ?? "several"} positive reviews and a ${ctx.rating ?? "strong"}★ rating, ${ctx.businessName} has strong customer trust. Addressing these technical friction points directly converts more existing search traffic into booked consultations without increasing ad spend.`;

    const outreachAngle = `Lead with consultative, objective data from their Google Lighthouse and mobile crawl rather than generic sales pitches. Position the audit as a courtesy benchmark of top ${ctx.niche} businesses in ${ctx.city}.`;

    const coldEmailDraft = `Subject: Quick observation regarding ${ctx.businessName}'s mobile site

Hi ${ctx.businessName} Team,

I came across your Google profile while reviewing top-rated ${ctx.niche} businesses in ${ctx.city}. Your ${ctx.rating ?? 4.8}★ reputation clearly shows clients appreciate your work.

While benchmarking local sites on Google's mobile diagnostic tool, I noticed a couple of technical friction points on your site${lcpSec ? `—specifically, pages take about ${lcpSec}s to load on smartphones` : ""}. In local search, even a 1-second improvement often reduces mobile bounce rates by 20%+.

We recently helped another local practice in the area solve this without rebuilding their site. Would you be open to a 5-minute chat this Thursday at 2 PM to see the full audit findings?

Best regards,
[Your Name]
[Your Agency]`;

    const callScriptDraft = `• Opening: "Hi, this is [Name] calling from [Agency]. I was looking at your ${ctx.businessName} listing in ${ctx.city}—congratulations on the great reviews."
• Transition: "The reason for my call is we ran a complimentary technical diagnostic on your website this week comparing top ${ctx.niche} businesses in the area."
• Evidence Hook: "We noticed your mobile site currently takes around ${lcpSec || "4"} seconds to load, which causes a lot of mobile visitors to back out before calling."
• Soft Close: "I put together a 1-page visual breakdown of what's slowing it down. Can I send that over to your direct email so you and the owner can take a look?"`;

    return {
      headlineOpportunity: headline.slice(0, 300),
      suggestedService: suggestedService.slice(0, 200),
      confidence: ctx.lighthouseScore != null ? "HIGH" : "MEDIUM",
      valueProposition: valueProp,
      outreachAngle,
      coldEmailDraft,
      callScriptDraft,
      keyFindings: findingsSummary,
    };
  }
}
