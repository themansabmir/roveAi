import { axiosInstance } from "@/shared/api/axiosInstance"
import { healthSchema, type HealthStatus } from "@/features/dashboard/domain/health"

export async function fetchHealth(): Promise<HealthStatus> {
  const response = await axiosInstance.get("/healthz")
  return healthSchema.parse(response.data)
}
