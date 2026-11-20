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

function creditsPath(organizationId: string): string {
  return `/api/organizations/${organizationId}/billing/credits`
}

export interface CreditBalanceView {
  balance: number
  reserved: number
  available: number
  lifetimeGranted: number
}

export interface CreditPackView {
  id: string
  name: string
  credits: number
  priceCents: number
  currency: string
}

export interface CreditLedgerView {
  id: string
  kind: string
  amount: number
  balanceAfter: number
  reason: string
  reservationId: string | null
  createdAt: string
}

export async function getCreditBalance(organizationId: string): Promise<CreditBalanceView> {
  const response = await axiosInstance.get<CreditBalanceView>(creditsPath(organizationId))
  return response.data
}

export async function listCreditPacks(organizationId: string): Promise<CreditPackView[]> {
  const response = await axiosInstance.get<CreditPackView[]>(`${creditsPath(organizationId)}/packs`)
  return response.data
}

export async function refillCredits(
  organizationId: string,
  packId: string,
): Promise<{ balance: number; granted: number; packName: string }> {
  const response = await axiosInstance.post<{ balance: number; granted: number; packName: string }>(
    `${creditsPath(organizationId)}/refill`,
    { packId },
  )
  return response.data
}

export async function getCreditLedger(
  organizationId: string,
  limit = 50,
): Promise<CreditLedgerView[]> {
  const response = await axiosInstance.get<CreditLedgerView[]>(
    `${creditsPath(organizationId)}/ledger?limit=${limit}`,
  )
  return response.data
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

export interface SelectiveAuditPayload {
  leadIds: string[]
  tools?: ("CRAWL" | "PERFORMANCE")[]
  generateAiBrief?: boolean
  aiBriefLeadIds?: string[]
  topNBriefsCount?: number
  idempotencyKey?: string
}

export async function runSelectiveAudit(
  organizationId: string,
  campaignId: string,
  payload: SelectiveAuditPayload,
): Promise<{ batchId: string; scheduledLeads: number; queuedJobs: number; duplicate?: boolean; message?: string }> {
  const headers: Record<string, string> = {}
  if (payload.idempotencyKey) {
    headers["Idempotency-Key"] = payload.idempotencyKey
  }
  const response = await axiosInstance.post<{ batchId: string; scheduledLeads: number; queuedJobs: number; duplicate?: boolean; message?: string }>(
    `${campaignsPath(organizationId)}/${campaignId}/leads/audit`,
    payload,
    { headers },
  )
  return response.data
}

export interface GenerateBriefsPayload {
  leadIds: string[]
}

export async function generateAiBriefs(
  organizationId: string,
  campaignId: string,
  payload: GenerateBriefsPayload,
): Promise<{ queuedCount: number; message?: string; skipped?: Array<{ leadId: string; reason: string }> }> {
  const response = await axiosInstance.post<{ queuedCount: number; message?: string; skipped?: Array<{ leadId: string; reason: string }> }>(
    `${campaignsPath(organizationId)}/${campaignId}/leads/generate-briefs`,
    payload,
  )
  return response.data
}

export interface AuditBatchItem {
  id: string
  campaignId: string
  requestedByUserId: string | null
  leadCount: number
  toolsRequested: string[]
  generateAiBrief: boolean
  status: string
  createdAt: string
  completedAt: string | null
}

export async function listAuditBatches(
  organizationId: string,
  campaignId: string,
): Promise<AuditBatchItem[]> {
  const response = await axiosInstance.get<AuditBatchItem[]>(
    `${campaignsPath(organizationId)}/${campaignId}/audit-batches`
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

export interface LeadActivityLogItem {
  id: string
  action: string
  previousState: Record<string, unknown> | null
  newState: Record<string, unknown> | null
  createdAt: string
  userName: string | null
}

export async function getLeadActivity(
  organizationId: string,
  campaignId: string,
  leadId: string,
): Promise<LeadActivityLogItem[]> {
  const response = await axiosInstance.get<LeadActivityLogItem[]>(
    `${campaignsPath(organizationId)}/${campaignId}/leads/${leadId}/activity`
  )
  return response.data
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
