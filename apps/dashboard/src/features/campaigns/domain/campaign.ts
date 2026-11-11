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

export interface AuditFindingView {
  id: string
  code: string
  severity: string
  source: string
  confidence: number
  message: string
  evidence?: Record<string, unknown> | null
}

export interface TechnicalAuditView {
  id: string
  module: string
  status: string
  score: number | null
  metrics?: Record<string, unknown> | null
  toolName?: string | null
  deviceProfile?: string | null
  observedAt: string
  findings: AuditFindingView[]
}

export interface BriefView {
  id: string
  status: string
  aiStatus: string
  headlineOpportunity: string | null
  suggestedService: string | null
  confidence: string
  valueProposition: string | null
  outreachAngle: string | null
  coldEmailDraft: string | null
  callScriptDraft: string | null
  content?: {
    keyFindings?: string[]
    metricsSummary?: Record<string, unknown>
  } | null
  modelName?: string | null
}

export type ProspectStatus =
  | "NEW"
  | "RESEARCHED"
  | "QUALIFIED"
  | "CONTACTED"
  | "DISMISSED"

export interface TagItem {
  id: string
  name: string
}

export interface NextActionItem {
  label: string
  tone: "primary" | "warning" | "neutral" | "success" | "danger"
}

export interface ScoreBreakdownView {
  gapIndex: number | null
  agencyFitScore: number | null
  commercialViability: number | null
  priorityRank: number | null
  evalState?: "COMPLETE" | "PARTIAL" | "UNAVAILABLE"
  evidenceFreshness?: "FRESH" | "STALE" | "DEGRADED" | "UNAUDITED"
  disclaimer?: string
}

export interface CampaignLead {
  id: string
  qualificationStatus: string
  auditStatus: string
  aiStatus?: string
  prospectStatus?: ProspectStatus
  opportunityScore?: number | null
  scoreBreakdown?: ScoreBreakdownView | null
  notes?: string | null
  savedAt?: string | null
  archivedAt?: string | null
  tags?: TagItem[]
  nextAction?: NextActionItem
  business: {
    id: string
    name: string
    city: string | null
    rating: number | null
    reviewCount: number | null
    websiteUrl: string | null
    websiteClass: string
  }
  audits?: TechnicalAuditView[]
  brief?: BriefView | null
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

export function prospectStatusLabel(status?: string | null): string {
  switch (status) {
    case "NEW":
      return "New"
    case "RESEARCHED":
      return "Researched"
    case "QUALIFIED":
      return "Qualified"
    case "CONTACTED":
      return "Contacted"
    case "DISMISSED":
      return "Dismissed"
    default:
      return status ? status.replace(/_/g, " ").toLowerCase() : "New"
  }
}

export function prospectStatusTone(status?: string | null): LeadTone {
  switch (status) {
    case "QUALIFIED":
      return "success"
    case "RESEARCHED":
      return "info"
    case "CONTACTED":
      return "warning"
    case "DISMISSED":
      return "neutral"
    case "NEW":
    default:
      return "neutral"
  }
}

export function computeNextAction(lead: {
  archivedAt?: string | null
  prospectStatus?: ProspectStatus | string | null
  opportunityScore?: number | null
  auditStatus?: string
  aiStatus?: string
  brief?: { id?: string; aiStatus?: string } | null
}): NextActionItem {
  if (lead.archivedAt != null) {
    return { label: "Archived", tone: "neutral" }
  }

  const status = lead.prospectStatus ?? "NEW"
  switch (status) {
    case "DISMISSED":
      return { label: "Dismissed", tone: "neutral" }
    case "CONTACTED":
      return { label: "Follow up", tone: "primary" }
    case "QUALIFIED": {
      const briefAiStatus = lead.brief?.aiStatus ?? lead.aiStatus
      if (briefAiStatus === "COMPLETED") return { label: "Review evidence", tone: "success" }
      if (briefAiStatus === "PENDING") return { label: "Brief generating", tone: "neutral" }
      return { label: "Generate brief", tone: "warning" }
    }
    case "RESEARCHED":
      if ((lead.opportunityScore ?? 0) >= 75) {
        return { label: "Qualify prospect", tone: "success" }
      }
      return { label: "Check service fit", tone: "warning" }
    case "NEW":
    default: {
      switch (lead.auditStatus) {
        case "SKIPPED_NO_WEBSITE":
          return { label: "Pitch web design", tone: "primary" }
        case "UNREACHABLE":
        case "BLOCKED":
        case "LOW_TEXT":
        case "SKIPPED_BY_ROBOTS":
          return { label: "Manual review", tone: "warning" }
        case "FAILED":
          return { label: "Retry audit", tone: "danger" }
        case "COMPLETED":
          return { label: "Review findings", tone: "primary" }
        case "PENDING":
        case "SKIPPED_BUDGET":
        case "SKIPPED_NOT_OWNED_SITE":
        default:
          return { label: "Run research", tone: "neutral" }
      }
    }
  }
}

/** A short, human headline describing why a lead might be an opportunity. */
export function primarySignal(lead: CampaignLead): string {
  if (lead.qualificationStatus === "EXCLUDED_EXISTING_CLIENT") return "Existing client — excluded"
  if (lead.brief?.headlineOpportunity) return lead.brief.headlineOpportunity
  const perf = lead.audits?.find((a) => a.module === "PERFORMANCE")
  if (perf?.score != null && perf.score < 50) return `Slow mobile site (${perf.score}/100)`
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
 * Opportunity indicator (0–100). Returns the real database opportunityScore
 * when available, or falls back to the heuristic indicator.
 */
export function heuristicScore(lead: CampaignLead): number | null {
  if (lead.qualificationStatus === "EXCLUDED_EXISTING_CLIENT") return null
  if (lead.opportunityScore != null) return lead.opportunityScore
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
