import { axiosInstance } from "@/shared/api/axiosInstance"
import type { CampaignDetail, CampaignSummary, CreateCampaignInput } from "@/features/campaigns/domain/campaign"

function campaignsPath(organizationId: string): string {
  return `/api/organizations/${organizationId}/campaigns`
}

export async function listCampaigns(organizationId: string): Promise<CampaignSummary[]> {
  const response = await axiosInstance.get<CampaignSummary[]>(campaignsPath(organizationId))
  return response.data
}

export async function getCampaign(organizationId: string, campaignId: string): Promise<CampaignDetail> {
  const response = await axiosInstance.get<CampaignDetail>(`${campaignsPath(organizationId)}/${campaignId}`)
  return response.data
}

export async function createCampaign(organizationId: string, input: CreateCampaignInput): Promise<CampaignDetail> {
  const response = await axiosInstance.post<CampaignDetail>(campaignsPath(organizationId), input)
  return response.data
}

export async function runCampaign(organizationId: string, campaignId: string): Promise<CampaignDetail> {
  const response = await axiosInstance.post<CampaignDetail>(`${campaignsPath(organizationId)}/${campaignId}/run`)
  return response.data
}

export async function cancelCampaign(organizationId: string, campaignId: string): Promise<CampaignDetail> {
  const response = await axiosInstance.post<CampaignDetail>(`${campaignsPath(organizationId)}/${campaignId}/cancel`)
  return response.data
}
