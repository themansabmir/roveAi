import { describe, expect, it } from "vitest";
import { AiProviderRegistry } from "./provider-registry";
import { DeterministicAiProvider } from "./deterministic.provider";
import { GeminiProvider } from "./gemini.provider";
import { OpenAiProvider } from "./openai.provider";
import { BriefDataSchema } from "./ai.types";

describe("AI Plugin — Multi-Provider Architecture", () => {
  it("resolves to DeterministicAiProvider when no API keys are provided", () => {
    const registry = new AiProviderRegistry({
      GEMINI_API_KEY: undefined,
      OPENAI_API_KEY: undefined,
    } as any);

    const active = registry.resolveActive();
    expect(active.key).toBe("deterministic");
  });

  it("prioritizes Gemini when GEMINI_API_KEY is configured", () => {
    const registry = new AiProviderRegistry({
      GEMINI_API_KEY: "test-gemini-key",
      OPENAI_API_KEY: "test-openai-key",
    } as any);

    const active = registry.resolveActive();
    expect(active.key).toBe("gemini");
  });

  it("uses OpenAI when only OPENAI_API_KEY is configured", () => {
    const registry = new AiProviderRegistry({
      GEMINI_API_KEY: undefined,
      OPENAI_API_KEY: "test-openai-key",
    } as any);

    const active = registry.resolveActive();
    expect(active.key).toBe("openai");
  });

  it("produces valid structured briefs via DeterministicAiProvider", async () => {
    const provider = new DeterministicAiProvider();
    const result = await provider.generateBrief({
      businessName: "Downtown Dental",
      niche: "Dentists",
      serviceTarget: "Core Web Vitals Optimization",
      city: "Austin",
      rating: 4.9,
      reviewCount: 42,
      websiteUrl: "https://downtowndental.example.com",
      websiteClass: "OWNED_SITE",
      techStack: ["WordPress"],
      lighthouseScore: 35,
      lcpMs: 3800,
      cls: 0.12,
      findingMessages: ["SLOW_LCP: LCP is slow", "HIGH_CLS: Layout shift is high"],
      opportunityScore: 92,
    });

    expect(result.modelName).toBe("deterministic-evidence-synth");
    expect(result.brief.headlineOpportunity).toContain("Downtown Dental");
    expect(result.brief.coldEmailDraft).toContain("Downtown Dental");

    const validated = BriefDataSchema.safeParse(result.brief);
    expect(validated.success).toBe(true);
  });
});
