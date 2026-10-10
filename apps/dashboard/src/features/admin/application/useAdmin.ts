import { useQuery } from "@tanstack/react-query"
import { fetchAdminOrganizations, fetchAdminOverview } from "@/features/admin/infrastructure/adminApi"

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: fetchAdminOverview,
  })
}

export function useAdminOrganizations(page = 1) {
  return useQuery({
    queryKey: ["admin", "organizations", page],
    queryFn: () => fetchAdminOrganizations(page),
    placeholderData: (previous) => previous,
  })
}
