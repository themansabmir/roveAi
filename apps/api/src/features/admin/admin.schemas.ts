import { z } from "zod";

export const listOrganizationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
});

export type ListOrganizationsQuery = z.infer<typeof listOrganizationsQuerySchema>;
