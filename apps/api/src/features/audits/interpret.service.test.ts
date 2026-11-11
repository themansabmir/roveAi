import { describe, expect, it } from "vitest";
import { InterpretService, BriefDataSchema } from "./interpret.service";
import { InterpretRepository } from "./interpret.repository";
import { DeterministicAiProvider } from "@plugins/ai/deterministic.provider";
import { IAiService } from "@plugins/ai/ai.plugin";

describe("InterpretService — Deterministic Scoring & Decoupled AI Plugin", () => {
  const deterministicAi: IAiService = {
    name: "MockAiPlugin",
    initialize: async () => {},
    shutdown: async () => {},
    generateOpportunityBrief: async (ctx) => new DeterministicAiProvider().generateBrief(ctx),
    listProviders: () => [{ key: "deterministic", configured: true }],
    getActiveProviderKey: () => "deterministic",
  };

  const service = new InterpretService(new InterpretRepository({} as any), deterministicAi);

  it("calculates high opportunity score for a business missing a website", () => {
    const score = service.computeOpportunityScore(
      {
        qualificationStatus: "QUALIFIED",
        auditStatus: "COMPLETED",
        business: {
          websiteClass: "MISSING",
          rating: 4.8,
          reviewCount: 35,
        },
        audits: [],
      },
      null
    );

    expect(score).toBe(88);
  });

  it("calculates high opportunity score for a slow site with critical SEO & performance flaws", () => {
    const score = service.computeOpportunityScore(
      {
        qualificationStatus: "QUALIFIED",
        auditStatus: "COMPLETED",
        business: {
          websiteClass: "OWNED_SITE",
          rating: 4.9,
          reviewCount: 80,
        },
        audits: [
          {
            module: "PERFORMANCE",
            score: 38, // <45: +25
            findings: [
              { code: "SLOW_LCP", severity: "HIGH" }, // +10
              { code: "HIGH_CLS", severity: "MEDIUM" }, // +6
            ],
          },
          {
            module: "TECHNICAL_SEO",
            score: 50,
            findings: [
              { code: "MISSING_TITLE", severity: "HIGH" }, // +10
              { code: "MISSING_META_DESCRIPTION", severity: "MEDIUM" }, // +8
            ],
          },
          {
            module: "WEBSITE_EXPERIENCE",
            score: 60,
            findings: [
              { code: "MISSING_ONLINE_BOOKING", severity: "HIGH" }, // +12
            ],
          },
        ],
      },
      {
        techStack: ["WordPress"],
        pages: [],
      }
    );

    // Baseline 40 + 25 (perf < 45) + 10 (LCP) + 6 (CLS) + 10 (title) + 8 (meta) + 12 (booking) + 8 (reviews >= 50) = 119 => clamped to 99
    expect(score).toBe(99);
  });

  it("calculates low opportunity score for a fast, well-optimized site", () => {
    const score = service.computeOpportunityScore(
      {
        qualificationStatus: "QUALIFIED",
        auditStatus: "COMPLETED",
        business: {
          websiteClass: "OWNED_SITE",
          rating: 4.2,
          reviewCount: 15,
        },
        audits: [
          {
            module: "PERFORMANCE",
            score: 95,
            findings: [],
          },
          {
            module: "TECHNICAL_SEO",
            score: 95,
            findings: [],
          },
          {
            module: "WEBSITE_EXPERIENCE",
            score: 95,
            findings: [],
          },
        ],
      },
      {
        techStack: ["Next.js"],
        pages: [{ extracted: { forms: [{ action: "/submit" }] } }],
      }
    );

    // Baseline 40 + no flaws
    expect(score).toBe(40);
  });

  it("delegates brief generation to IAiService and produces valid brief schema", async () => {
    const lead = {
      campaign: {
        niche: "Dentists",
        serviceType: "Mobile Speed Optimization",
        city: "Austin",
        region: "TX",
      },
      business: {
        name: "Austin Smile Studio",
        city: "Austin",
        rating: 4.8,
        reviewCount: 65,
        websiteUrl: "https://austinsmile.example.com",
        websiteClass: "OWNED_SITE",
      },
      audits: [
        {
          module: "PERFORMANCE",
          score: 41,
          metrics: { lcp_ms: 4200, cls: 0.15 },
          findings: [
            { code: "SLOW_LCP", severity: "HIGH", message: "LCP is slow (4.2s)" },
            { code: "HIGH_CLS", severity: "MEDIUM", message: "CLS is high (0.15)" },
          ],
        },
        {
          module: "TECHNICAL_SEO",
          score: 60,
          metrics: {},
          findings: [{ code: "MISSING_META_DESCRIPTION", severity: "MEDIUM", message: "Missing meta description" }],
        },
      ],
    };

    const snapshot = {
      title: "Austin Smile Studio",
      techStack: ["WordPress", "Elementor"],
      pages: [],
    };

    const context = service.buildEvidenceContext(lead as any, snapshot, 85);
    const { brief, modelName } = await deterministicAi.generateOpportunityBrief(context);

    expect(modelName).toBe("deterministic-evidence-synth");
    expect(brief.headlineOpportunity).toContain("Austin Smile Studio");
    expect(brief.suggestedService).toContain("Mobile Speed");
    expect(brief.coldEmailDraft).toContain("Austin Smile Studio");
    expect(brief.coldEmailDraft).toContain("4.2s");
    expect(brief.callScriptDraft).toContain("Austin Smile Studio");

    // Zod validation should succeed without error
    const validated = BriefDataSchema.safeParse(brief);
    expect(validated.success).toBe(true);
  });

  it("includes 3D scoreBreakdown in AI evidence context", () => {
    const lead = {
      campaign: {
        niche: "Dentists",
        serviceType: "Mobile Speed Optimization",
      },
      business: {
        name: "Austin Smile Studio",
        rating: 4.8,
        reviewCount: 65,
        websiteUrl: "https://austinsmile.example.com",
        websiteClass: "OWNED_SITE",
      },
      audits: [],
    };

    const mockScoreBreakdown: any = {
      gapIndex: 75,
      agencyFitScore: 85,
      commercialViability: 90,
      priorityRank: 81,
      evalState: "COMPLETE",
      evidenceFreshness: "FRESH",
      disclaimer: "Gap Index reflects technical deficiencies and potential service need. It is NOT a predictive probability of purchase.",
    };

    const context = service.buildEvidenceContext(lead as any, null, 81, mockScoreBreakdown);
    expect(context.scoreBreakdown).toBeDefined();
    expect(context.scoreBreakdown?.gapIndex).toBe(75);
    expect(context.scoreBreakdown?.agencyFitScore).toBe(85);
    expect(context.scoreBreakdown?.commercialViability).toBe(90);
    expect(context.scoreBreakdown?.priorityRank).toBe(81);
    expect(context.scoreBreakdown?.disclaimer).toContain("Gap Index reflects technical deficiencies");
  });
});
