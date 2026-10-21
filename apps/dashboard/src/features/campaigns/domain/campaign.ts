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

// ---------------------------------------------------------------------------
// Presentation-layer derivations.
// NOTE: the evidence audits + AI opportunity score are later MVP phases and are
// not yet produced by the backend. The helpers below derive a *heuristic*
// readable signal from the data we DO have (website class, qualification/audit
// status, rating, reviews) so the queue is scannable today. They are clearly
// labelled "heuristic" in the UI and will be replaced by real scores later.
// ---------------------------------------------------------------------------

export type LeadTone = "success" | "warning" | "danger" | "info" | "neutral"

const WEBSITE_CLASS_LABELS: Record<string, string> = {
  OWNED_SITE: "Owns a website",
  SOCIAL_ONLY: "Social profile only",
  DIRECTORY_ONLY: "Directory listing only",
  MISSING: "No website found",
  UNKNOWN: "Website unknown",
}

export function websiteClassLabel(websiteClass: string): string {
  return WEBSITE_CLASS_LABELS[websiteClass] ?? websiteClass
}

export function qualificationLabel(status: string): string {
  switch (status) {
    case "NEW":
      return "New"
    case "QUALIFIED":
      return "Qualified"
    case "DISQUALIFIED":
      return "Disqualified"
    case "EXCLUDED_EXISTING_CLIENT":
      return "Existing client"
    default:
      return status.replace(/_/g, " ").toLowerCase()
  }
}

export function auditStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "Audit pending"
    case "RUNNING":
      return "Auditing"
    case "COMPLETED":
      return "Audited"
    case "FAILED":
      return "Audit failed"
    case "SKIPPED_NO_WEBSITE":
      return "No site to audit"
    case "SKIPPED_NOT_OWNED_SITE":
      return "Not an owned site"
    default:
      return status.replace(/_/g, " ").toLowerCase()
  }
}

/** A short, human headline describing why a lead might be an opportunity. */
export function primarySignal(lead: CampaignLead): string {
  if (lead.qualificationStatus === "EXCLUDED_EXISTING_CLIENT") return "Existing client — excluded"
  switch (lead.business.websiteClass) {
    case "MISSING":
      return "No website — high need"
    case "SOCIAL_ONLY":
      return "Social-only presence"
    case "DIRECTORY_ONLY":
      return "Only in directories"
    case "OWNED_SITE":
      if (lead.auditStatus === "COMPLETED") return "Site audited — see findings"
      if (lead.auditStatus === "FAILED") return "Site unreachable"
      return "Owned site — audit pending"
    default:
      return "Needs review"
  }
}

/**
 * Heuristic opportunity indicator (0–100) from available fields. This is a
 * placeholder for the real evidence-based score. Higher = more likely to need
 * the agency's service. Returns null when the lead is excluded.
 */
export function heuristicScore(lead: CampaignLead): number | null {
  if (lead.qualificationStatus === "EXCLUDED_EXISTING_CLIENT") return null
  if (lead.auditStatus === "FAILED") return 0

  let score = 40
  switch (lead.business.websiteClass) {
    case "MISSING":
      score += 45
      break
    case "SOCIAL_ONLY":
      score += 35
      break
    case "DIRECTORY_ONLY":
      score += 30
      break
    case "OWNED_SITE":
      score += 10
      break
    default:
      break
  }
  // A well-reviewed business with a weak web presence is a stronger prospect.
  const reviews = lead.business.reviewCount ?? 0
  if (reviews >= 50) score += 10
  else if (reviews >= 10) score += 5

  return Math.max(0, Math.min(100, score))
}

export function scoreTone(score: number | null): LeadTone {
  if (score == null) return "neutral"
  if (score >= 75) return "success"
  if (score >= 55) return "info"
  if (score > 0) return "warning"
  return "danger"
}

// --- Pipeline (step 2: "research in progress") ------------------------------

export interface PipelineStage {
  key: string
  label: string
  done: number
  total: number
  state: "done" | "active" | "pending"
}

export interface CampaignCounts {
  maxLeads: number
  leadCount: number
  status: CampaignStatus
}

/**
 * Builds a readable pipeline from real counts. We only truly know discovery
 * progress (leadCount vs maxLeads) today; downstream stages (crawl/score/brief)
 * are shown as pending/not-yet-available so we never fake progress.
 */
export function buildPipeline(c: CampaignCounts): PipelineStage[] {
  const discovered = c.leadCount
  const discovering = c.status === "QUEUED" || c.status === "DISCOVERING"
  const terminalDone =
    c.status === "COMPLETED" || c.status === "PARTIALLY_COMPLETED"

  const discoverState: PipelineStage["state"] = terminalDone
    ? "done"
    : discovering
      ? "active"
      : discovered > 0
        ? "done"
        : "pending"

  return [
    {
      key: "discover",
      label: "Discover businesses",
      done: discovered,
      total: c.maxLeads,
      state: discoverState,
    },
    {
      key: "qualify",
      label: "Normalize & qualify",
      done: discovered,
      total: c.maxLeads,
      state: discovered > 0 ? (terminalDone ? "done" : "active") : "pending",
    },
    { key: "crawl", label: "Crawl owned sites", done: 0, total: 0, state: "pending" },
    { key: "score", label: "Score opportunities", done: 0, total: 0, state: "pending" },
    { key: "brief", label: "AI briefs (top leads)", done: 0, total: 0, state: "pending" },
  ]
}

export function statusLabel(status: CampaignStatus): string {
  switch (status) {
    case "DRAFT":
      return "Draft"
    case "QUEUED":
      return "Queued"
    case "DISCOVERING":
      return "Discovering"
    case "PROCESSING":
      return "Processing"
    case "COMPLETED":
      return "Completed"
    case "PARTIALLY_COMPLETED":
      return "Partially completed"
    case "PAUSED":
      return "Paused"
    case "FAILED":
      return "Failed"
    case "CANCELLED":
      return "Cancelled"
    default:
      return status
  }
}

export function statusTone(status: CampaignStatus): LeadTone {
  switch (status) {
    case "COMPLETED":
      return "success"
    case "PARTIALLY_COMPLETED":
      return "info"
    case "QUEUED":
    case "DISCOVERING":
    case "PROCESSING":
      return "info"
    case "PAUSED":
      return "warning"
    case "FAILED":
      return "danger"
    default:
      return "neutral"
  }
}
