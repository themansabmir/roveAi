import { z } from "zod";

export const prospectStatusValues = ["NEW", "RESEARCHED", "QUALIFIED", "CONTACTED", "DISMISSED"] as const;

// ---- Single-lead update ----
export const updateLeadSchema = z.object({
  prospectStatus: z.enum(prospectStatusValues).optional(),
  notes: z.string().max(10_000).optional(),
  saved: z.boolean().optional(),
  archived: z.boolean().optional(),
  tagIds: z.array(z.string().cuid()).max(50).optional(),
});
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

// ---- Bulk operations ----
export const bulkActionValues = [
  "UPDATE_STATUS",
  "ADD_TAGS",
  "REMOVE_TAGS",
  "SAVE",
  "UNSAVE",
  "ARCHIVE",
  "UNARCHIVE",
] as const;

export const bulkLeadsSchema = z
  .object({
    leadIds: z.array(z.string().cuid()).min(1).max(200),
    action: z.enum(bulkActionValues),
    prospectStatus: z.enum(prospectStatusValues).optional(),
    tagIds: z.array(z.string().cuid()).max(50).optional(),
  })
  .refine(
    (d) => {
      if (d.action === "UPDATE_STATUS") return d.prospectStatus != null;
      if (d.action === "ADD_TAGS" || d.action === "REMOVE_TAGS") return (d.tagIds?.length ?? 0) > 0;
      return true;
    },
    { message: "Missing required field for the requested action" },
  );
export type BulkLeadsInput = z.infer<typeof bulkLeadsSchema>;

// ---- Tag creation ----
export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(60),
});
export type CreateTagInput = z.infer<typeof createTagSchema>;

// ---- Leads list query params ----
export const leadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  search: z.string().trim().max(200).optional(),
  prospectStatus: z.enum(prospectStatusValues).optional(),
  scoreMin: z.coerce.number().int().min(0).max(100).optional(),
  scoreMax: z.coerce.number().int().min(0).max(100).optional(),
  tagIds: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").filter(Boolean) : undefined)),
  archived: z.coerce.boolean().default(false),
  savedOnly: z.coerce.boolean().default(false),
});
export type LeadsQuery = z.infer<typeof leadsQuerySchema>;

