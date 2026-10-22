import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().email().max(255).transform((value) => value.trim().toLowerCase()),
  role: z.enum(["admin", "member"]).default("member"),
});

export const invitationTokenSchema = z.object({
  token: z.string().min(10).max(128),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
