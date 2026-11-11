import { axiosInstance } from "@/shared/api/axiosInstance"
import type {
  CampaignDetail,
  CampaignLead,
  CampaignSummary,
  CreateCampaignInput,
  ProspectStatus,
  TagItem,
} from "@/features/campaigns/domain/campaign"

function campaignsPath(organizationId: string): string {
  return `/api/organizations/${organizationId}/campaigns`
}

function tagsPath(organizationId: string): string {
  return `/api/organizations/${organizationId}/tags`
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

// ---------------------------------------------------------------------------
// Prospect Workspace APIs
// ---------------------------------------------------------------------------

export interface UpdateLeadPayload {
  prospectStatus?: ProspectStatus
  notes?: string
  saved?: boolean
  archived?: boolean
  tagIds?: string[]
}

export async function updateLead(
  organizationId: string,
  campaignId: string,
  leadId: string,
  payload: UpdateLeadPayload,
): Promise<CampaignLead> {
  const response = await axiosInstance.patch<CampaignLead>(
    `${campaignsPath(organizationId)}/${campaignId}/leads/${leadId}`,
    payload,
  )
  return response.data
}

export interface BulkLeadsPayload {
  leadIds: string[]
  action: "UPDATE_STATUS" | "ADD_TAGS" | "REMOVE_TAGS" | "SAVE" | "UNSAVE" | "ARCHIVE" | "UNARCHIVE"
  prospectStatus?: ProspectStatus
  tagIds?: string[]
}

export async function bulkUpdateLeads(
  organizationId: string,
  campaignId: string,
  payload: BulkLeadsPayload,
): Promise<{ updatedCount: number }> {
  const response = await axiosInstance.post<{ updatedCount: number }>(
    `${campaignsPath(organizationId)}/${campaignId}/leads/bulk`,
    payload,
  )
  return response.data
}

export async function listTags(organizationId: string): Promise<TagItem[]> {
  const response = await axiosInstance.get<TagItem[]>(tagsPath(organizationId))
  return response.data
}

export async function createTag(organizationId: string, name: string): Promise<TagItem> {
  const response = await axiosInstance.post<TagItem>(tagsPath(organizationId), { name })
  return response.data
}

export async function deleteTag(organizationId: string, tagId: string): Promise<void> {
  await axiosInstance.delete(`${tagsPath(organizationId)}/${tagId}`)
}

export async function downloadCampaignCsv(organizationId: string, campaignId: string, leadIds?: string[]): Promise<void> {
  const query = leadIds?.length ? `?leadIds=${encodeURIComponent(leadIds.join(","))}` : ""
  const response = await axiosInstance.get(`${campaignsPath(organizationId)}/${campaignId}/export${query}`, {
    responseType: "blob",
  })
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `prospects-${campaignId}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
