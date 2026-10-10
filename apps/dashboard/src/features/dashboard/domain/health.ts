import { z } from "zod"

export const healthSchema = z.object({
  status: z.string(),
  service: z.string(),
  uptimeSec: z.number(),
  timestamp: z.string(),
})

export type HealthStatus = z.infer<typeof healthSchema>
