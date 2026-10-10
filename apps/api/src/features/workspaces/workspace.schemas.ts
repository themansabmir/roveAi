import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Agency name is required").max(255),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
