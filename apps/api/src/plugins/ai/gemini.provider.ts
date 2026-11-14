import { logger } from "@core/logger";
import { AiBriefResult, AiEvidenceContext, AiProviderError, BriefDataSchema, IAiProvider } from "./ai.types";
import { buildOpportunityPrompt } from "./prompt";

export class GeminiProvider implements IAiProvider {
  public readonly key = "gemini";
  public readonly configured: boolean;

  constructor(
    private readonly apiKey?: string,
    private readonly model: string = "gemini-2.0-flash",
    private readonly timeoutMs: number = 30_000
  ) {
    this.configured = Boolean(apiKey && apiKey.trim().length > 0);
  }

  async generateBrief(ctx: AiEvidenceContext): Promise<AiBriefResult> {
    if (!this.apiKey) {
      throw new AiProviderError("GEMINI_API_KEY is not configured", this.key);
    }

    const prompt = buildOpportunityPrompt(ctx);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      logger.error({ status: res.status, errText }, "GeminiProvider: API request failed");
      throw new AiProviderError(`Gemini HTTP ${res.status}: ${errText.slice(0, 300)}`, this.key);
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new AiProviderError("Gemini returned empty candidate content", this.key);
    }

    try {
      const parsedJson = JSON.parse(text);
      const brief = BriefDataSchema.parse(parsedJson);

      return {
        brief,
        modelName: this.model,
        tokenUsage: {
          inputTokens: data?.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: data?.usageMetadata?.candidatesTokenCount ?? 0,
        },
      };
    } catch (err) {
      throw new AiProviderError(`Failed to parse Gemini response as valid brief schema: ${err}`, this.key);
    }
  }
}
