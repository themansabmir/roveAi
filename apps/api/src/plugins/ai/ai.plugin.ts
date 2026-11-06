import { IPlugin, IPluginRegistry } from "../../interfaces/plugin.interface";
import { loadConfig } from "@core/config";
import { logger } from "@core/logger";
import { AiBriefResult, AiEvidenceContext } from "./ai.types";
import { AiProviderInfo, AiProviderRegistry } from "./provider-registry";
import { DeterministicAiProvider } from "./deterministic.provider";

export const AI_PLUGIN = "AiPlugin";

export interface IAiService extends IPlugin {
  generateOpportunityBrief(context: AiEvidenceContext): Promise<AiBriefResult>;
  listProviders(): AiProviderInfo[];
  getActiveProviderKey(): string;
}

export class AiPlugin implements IAiService {
  public readonly name = AI_PLUGIN;
  private registry!: AiProviderRegistry;

  async initialize(_registry: IPluginRegistry): Promise<void> {
    const config = loadConfig();
    this.registry = new AiProviderRegistry(config);

    const configured = this.registry
      .describe()
      .filter((p) => p.configured)
      .map((p) => p.key)
      .join(", ");

    logger.info({ configured: configured || "deterministic" }, "AiPlugin initialized with available providers");
  }

  async generateOpportunityBrief(context: AiEvidenceContext): Promise<AiBriefResult> {
    const provider = this.registry.resolveActive();
    try {
      return await provider.generateBrief(context);
    } catch (err) {
      logger.warn(
        { err, provider: provider.key },
        "AiPlugin: primary AI provider failed, falling back to deterministic synthesis"
      );
      const fallback = new DeterministicAiProvider();
      return fallback.generateBrief(context);
    }
  }

  listProviders(): AiProviderInfo[] {
    return this.registry.describe();
  }

  getActiveProviderKey(): string {
    return this.registry.resolveActive().key;
  }

  async shutdown(): Promise<void> {}
}
