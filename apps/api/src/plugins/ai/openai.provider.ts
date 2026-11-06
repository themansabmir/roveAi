import { logger } from "@core/logger";
import { AiBriefResult, AiEvidenceContext, AiProviderError, BriefDataSchema, IAiProvider } from "./ai.types";
import { buildOpportunityPrompt } from "./prompt";

export class OpenAiProvider implements IAiProvider {
  public readonly key = "openai";
  public readonly configured: boolean;

  constructor(
    private readonly apiKey?: string,
    private readonly model: string = "gpt-4o-mini",
    private readonly timeoutMs: number = 30_000
  ) {
    this.configured = Boolean(apiKey && apiKey.trim().length > 0);
  }

  async generateBrief(ctx: AiEvidenceContext): Promise<AiBriefResult> {
    if (!this.apiKey) {
      throw new AiProviderError("OPENAI_API_KEY is not configured", this.key);
    }

    const prompt = buildOpportunityPrompt(ctx);
    const url = "https://api.openai.com/v1/chat/completions";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an elite B2B technical sales strategist for digital agencies. Always output strictly valid JSON matching the required schema.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      logger.error({ status: res.status, errText }, "OpenAiProvider: API request failed");
      throw new AiProviderError(`OpenAI HTTP ${res.status}: ${errText.slice(0, 300)}`, this.key);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new AiProviderError("OpenAI returned empty message content", this.key);
    }

    try {
      const parsedJson = JSON.parse(text);
      const brief = BriefDataSchema.parse(parsedJson);

      return {
        brief,
        modelName: this.model,
        tokenUsage: {
          inputTokens: data?.usage?.prompt_tokens ?? 0,
          outputTokens: data?.usage?.completion_tokens ?? 0,
        },
      };
    } catch (err) {
      throw new AiProviderError(`Failed to parse OpenAI response as valid brief schema: ${err}`, this.key);
    }
  }
}
