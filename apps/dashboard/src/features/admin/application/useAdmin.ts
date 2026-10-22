import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fetchAdminOrganizations,
  fetchAdminOverview,
  fetchProviders,
  setDefaultProvider,
} from "@/features/admin/infrastructure/adminApi"
import type { DiscoveryProviderKey } from "@/features/admin/domain/admin"

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

export function useProviders() {
  return useQuery({
    queryKey: ["admin", "providers"],
    queryFn: fetchProviders,
  })
}

export function useSetDefaultProvider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (provider: DiscoveryProviderKey) => setDefaultProvider(provider),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "providers"], data)
    },
  })
}
