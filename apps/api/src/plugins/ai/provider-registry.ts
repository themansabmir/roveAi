import { AppConfig } from "@core/config";
import { logger } from "@core/logger";
import { IAiProvider } from "./ai.types";
import { GeminiProvider } from "./gemini.provider";
import { OpenAiProvider } from "./openai.provider";
import { DeterministicAiProvider } from "./deterministic.provider";

export interface AiProviderInfo {
  key: string;
  configured: boolean;
}

export class AiProviderRegistry {
  private readonly providers = new Map<string, IAiProvider>();

  constructor(config: AppConfig) {
    this.register(new GeminiProvider(config.GEMINI_API_KEY, config.LLM_MODEL || "gemini-2.0-flash"));
    this.register(new OpenAiProvider(config.OPENAI_API_KEY, config.LLM_MODEL || "gpt-4o-mini"));
    this.register(new DeterministicAiProvider());
  }

  register(provider: IAiProvider): void {
    this.providers.set(provider.key, provider);
  }

  get(key: string): IAiProvider | undefined {
    return this.providers.get(key);
  }

  /**
   * Resolves the best available AI provider:
   * 1. If Gemini is configured, use Gemini.
   * 2. If OpenAI is configured, use OpenAI.
   * 3. Otherwise, use Deterministic fallback engine.
   */
  resolveActive(): IAiProvider {
    const gemini = this.providers.get("gemini");
    if (gemini?.configured) return gemini;

    const openai = this.providers.get("openai");
    if (openai?.configured) return openai;

    const deterministic = this.providers.get("deterministic");
    if (deterministic) return deterministic;

    logger.warn("AiProviderRegistry: no providers configured, falling back to deterministic default");
    return new DeterministicAiProvider();
  }

  describe(): AiProviderInfo[] {
    return Array.from(this.providers.values()).map((p) => ({
      key: p.key,
      configured: p.configured,
    }));
  }
}
