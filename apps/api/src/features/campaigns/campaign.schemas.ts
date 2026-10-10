import { z } from "zod";

export const createCampaignSchema = z.object({
  niche: z.string().trim().min(1).max(120),
  serviceType: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  maxLeads: z.number().int().min(1).max(100),
  minRating: z.number().min(0).max(5).optional(),
  minReviewCount: z.number().int().min(0).max(100_000).optional(),
  websiteFilter: z.enum(["owned", "missing", "either"]).optional(),
  exclusionDomains: z.array(z.string().trim().min(1).max(255)).max(50).optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
