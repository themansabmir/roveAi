export type CampaignStatus =
  | "DRAFT"
  | "QUEUED"
  | "DISCOVERING"
  | "PROCESSING"
  | "COMPLETED"
  | "PARTIALLY_COMPLETED"
  | "PAUSED"
  | "FAILED"
  | "CANCELLED"

export type WebsiteFilter = "owned" | "missing" | "either"

export interface CampaignSummary {
  id: string
  niche: string
  serviceType: string
  city: string
  region: string
  country: string
  maxLeads: number
  status: CampaignStatus
  leadCount: number
  createdAt: string
}

export interface CampaignLead {
  id: string
  qualificationStatus: string
  auditStatus: string
  business: {
    id: string
    name: string
    city: string | null
    rating: number | null
    reviewCount: number | null
    websiteUrl: string | null
    websiteClass: string
  }
}

export interface CampaignDetail extends CampaignSummary {
  minRating: number | null
  minReviewCount: number | null
  websiteFilter: WebsiteFilter
  exclusionDomains: string[]
  job: { id: string; status: string; attemptCount: number } | null
  leads: CampaignLead[]
}

export interface CreateCampaignInput {
  niche: string
  serviceType: string
  city: string
  region: string
  country: string
  maxLeads: number
  minRating?: number
  minReviewCount?: number
  websiteFilter?: WebsiteFilter
  exclusionDomains?: string[]
}

export function isActiveRun(status: CampaignStatus): boolean {
  return status === "QUEUED" || status === "DISCOVERING" || status === "PROCESSING"
}
