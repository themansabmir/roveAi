import { z } from "zod";

export const BriefDataSchema = z.object({
  headlineOpportunity: z.string().max(300),
  suggestedService: z.string().max(200),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]).default("HIGH"),
  valueProposition: z.string(),
  outreachAngle: z.string(),
  coldEmailDraft: z.string(),
  callScriptDraft: z.string(),
  keyFindings: z.array(z.string()).default([]),
});

export type BriefData = z.infer<typeof BriefDataSchema>;

export interface AiEvidenceContext {
  businessName: string;
  niche: string;
  serviceTarget: string;
  city: string;
  rating: number | null;
  reviewCount: number | null;
  websiteUrl: string | null;
  websiteClass: string;
  techStack: string[];
  lighthouseScore: number | null;
  lcpMs: number | null;
  cls: number | null;
  findingMessages: string[];
  opportunityScore: number;
  scoreBreakdown?: {
    gapIndex: number | null;
    agencyFitScore: number | null;
    commercialViability: number | null;
    priorityRank?: number | null;
    disclaimer?: string;
    evidenceFreshness?: string;
  };
}

export interface AiBriefResult {
  brief: BriefData;
  modelName: string;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface IAiProvider {
  readonly key: string;
  readonly configured: boolean;
  generateBrief(context: AiEvidenceContext): Promise<AiBriefResult>;
}

export class AiProviderError extends Error {
  constructor(message: string, public readonly provider: string) {
    super(`[${provider}] ${message}`);
    this.name = "AiProviderError";
  }
}
