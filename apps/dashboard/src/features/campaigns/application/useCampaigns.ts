import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateCampaignInput } from "@/features/campaigns/domain/campaign"
import { isActiveRun } from "@/features/campaigns/domain/campaign"
import { cancelCampaign, createCampaign, getCampaign, listCampaigns, runCampaign } from "@/features/campaigns/infrastructure/campaignApi"

function listKey(organizationId: string) {
  return ["campaigns", organizationId] as const
}

function detailKey(organizationId: string, campaignId: string) {
  return ["campaign", organizationId, campaignId] as const
}

export function useCampaignList(organizationId: string) {
  return useQuery({
    queryKey: listKey(organizationId),
    queryFn: () => listCampaigns(organizationId),
  })
}

export function useCampaign(organizationId: string, campaignId: string) {
  return useQuery({
    queryKey: detailKey(organizationId, campaignId),
    queryFn: () => getCampaign(organizationId, campaignId),
    enabled: organizationId.length > 0 && campaignId.length > 0,
    refetchInterval: (query) => (query.state.data && isActiveRun(query.state.data.status) ? 2000 : false),
  })
}

export function useCreateCampaign(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCampaignInput) => createCampaign(organizationId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: listKey(organizationId) })
    },
  })
}

export function useRunCampaign(organizationId: string, campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => runCampaign(organizationId, campaignId),
    onSuccess: async (campaign) => {
      queryClient.setQueryData(detailKey(organizationId, campaignId), campaign)
      await queryClient.invalidateQueries({ queryKey: listKey(organizationId) })
    },
  })
}

export function useCancelCampaign(organizationId: string, campaignId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cancelCampaign(organizationId, campaignId),
    onSuccess: async (campaign) => {
      queryClient.setQueryData(detailKey(organizationId, campaignId), campaign)
      await queryClient.invalidateQueries({ queryKey: listKey(organizationId) })
    },
  })
}
