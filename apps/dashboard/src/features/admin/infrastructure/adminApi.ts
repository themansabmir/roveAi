import { axiosInstance } from "@/shared/api/axiosInstance"
import type { AdminOrganizationsResponse, AdminOverview } from "@/features/admin/domain/admin"

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const { data } = await axiosInstance.get<AdminOverview>("/api/admin/overview")
  return data
}

export async function fetchAdminOrganizations(page = 1): Promise<AdminOrganizationsResponse> {
  const { data } = await axiosInstance.get<AdminOrganizationsResponse>("/api/admin/organizations", {
    params: { page },
  })
  return data
}
