import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAuth } from "@/features/auth/application/useAuth"
import {
  useBulkUpdateLeads,
  useCampaign,
  useCancelCampaign,
  useDownloadCsv,
  useRunCampaign,
  useTags,
  useUpdateLead,
} from "@/features/campaigns/application/useCampaigns"
import {
  heuristicScore,
  isActiveRun,
  statusLabel,
  statusTone,
  type ProspectStatus,
} from "@/features/campaigns/domain/campaign"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Skeleton } from "@rove/ui/components/skeleton"
import { ToneBadge } from "@/features/campaigns/presentation/ToneBadge"
import { RunPipeline } from "@/features/campaigns/presentation/RunPipeline"
import { HandoffPanel } from "@/features/campaigns/presentation/HandoffPanel"
import {
  ProspectFilters,
  type ProspectFiltersState,
} from "@/features/campaigns/presentation/ProspectFilters"
import { ProspectTable } from "@/features/campaigns/presentation/ProspectTable"
import { BulkActionBar } from "@/features/campaigns/presentation/BulkActionBar"

export function CampaignDetailPage() {
  const { campaignId } = useParams()
  const { me, isLoading } = useAuth()
  const organizationId = me?.organization?.id
  const campaign = useCampaign(organizationId ?? "", campaignId ?? "")
  const run = useRunCampaign(organizationId ?? "", campaignId ?? "")
  const cancel = useCancelCampaign(organizationId ?? "", campaignId ?? "")

  const updateLeadMutation = useUpdateLead(organizationId ?? "", campaignId ?? "")
  const bulkUpdateMutation = useBulkUpdateLeads(organizationId ?? "", campaignId ?? "")
  const downloadCsvMutation = useDownloadCsv(organizationId ?? "", campaignId ?? "")
  const tagsQuery = useTags(organizationId ?? "")
  const availableTags = tagsQuery.data ?? []

  // Filter state
  const [filterState, setFilterState] = useState<ProspectFiltersState>({
    search: "",
    viewTab: "all",
    scoreFilter: "all",
    selectedTagId: null,
  })

  // Selection state for bulk operations
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set())

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  if (!organizationId || !campaignId) {
    return <p className="text-sm text-muted-foreground">Choose a workspace first.</p>
  }

  const data = campaign.data
  const pending = run.isPending || cancel.isPending
  const actionError = run.error ?? cancel.error
  const active = data ? isActiveRun(data.status) : false
  const hasLeads = Boolean(data && data.leads.length > 0)
  const allLeads = data?.leads ?? []

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: allLeads.filter((l) => !l.archivedAt).length,
      qualified: allLeads.filter((l) => (l.prospectStatus ?? "NEW") === "QUALIFIED" && !l.archivedAt).length,
      researched: allLeads.filter((l) => (l.prospectStatus ?? "NEW") === "RESEARCHED" && !l.archivedAt).length,
      contacted: allLeads.filter((l) => (l.prospectStatus ?? "NEW") === "CONTACTED" && !l.archivedAt).length,
      saved: allLeads.filter((l) => Boolean(l.savedAt) && !l.archivedAt).length,
      archived: allLeads.filter((l) => Boolean(l.archivedAt)).length,
    }
  }, [allLeads])

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const isArchived = Boolean(lead.archivedAt)
      const status = lead.prospectStatus ?? "NEW"
      const score = lead.opportunityScore ?? heuristicScore(lead) ?? 0

      // View Tab filter
      if (filterState.viewTab === "archived") {
        if (!isArchived) return false
      } else {
        if (isArchived) return false
        if (filterState.viewTab === "qualified" && status !== "QUALIFIED") return false
        if (filterState.viewTab === "researched" && status !== "RESEARCHED") return false
        if (filterState.viewTab === "contacted" && status !== "CONTACTED") return false
        if (filterState.viewTab === "saved" && !lead.savedAt) return false
      }

      // Score filter
      if (filterState.scoreFilter === "high" && score < 75) return false
      if (filterState.scoreFilter === "medium" && (score < 55 || score >= 75)) return false
      if (filterState.scoreFilter === "low" && score >= 55) return false

      // Tag filter
      if (filterState.selectedTagId) {
        const hasTag = (lead.tags ?? []).some((t) => t.id === filterState.selectedTagId)
        if (!hasTag) return false
      }

      // Search filter (name, city, domain)
      if (filterState.search.trim()) {
        const q = filterState.search.toLowerCase().trim()
        const matchName = lead.business.name.toLowerCase().includes(q)
        const matchCity = lead.business.city?.toLowerCase().includes(q) ?? false
        const matchWeb = lead.business.websiteUrl?.toLowerCase().includes(q) ?? false
        if (!matchName && !matchCity && !matchWeb) return false
      }

      return true
    })
  }, [allLeads, filterState])

  // Bulk actions handlers
  const toggleSelect = (leadId: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev)
      if (next.has(leadId)) next.delete(leadId)
      else next.add(leadId)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set())
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)))
    }
  }

  const handleBulkStatus = (newStatus: ProspectStatus) => {
    bulkUpdateMutation.mutate(
      {
        leadIds: Array.from(selectedLeadIds),
        action: "UPDATE_STATUS",
        prospectStatus: newStatus,
      },
      { onSuccess: () => setSelectedLeadIds(new Set()) }
    )
  }

  const handleBulkSave = (save: boolean) => {
    bulkUpdateMutation.mutate(
      {
        leadIds: Array.from(selectedLeadIds),
        action: save ? "SAVE" : "UNSAVE",
      },
      { onSuccess: () => setSelectedLeadIds(new Set()) }
    )
  }

  const handleBulkArchive = (archive: boolean) => {
    bulkUpdateMutation.mutate(
      {
        leadIds: Array.from(selectedLeadIds),
        action: archive ? "ARCHIVE" : "UNARCHIVE",
      },
      { onSuccess: () => setSelectedLeadIds(new Set()) }
    )
  }

  const handleBulkAddTag = (tagId: string) => {
    bulkUpdateMutation.mutate(
      {
        leadIds: Array.from(selectedLeadIds),
        action: "ADD_TAGS",
        tagIds: [tagId],
      },
      { onSuccess: () => setSelectedLeadIds(new Set()) }
    )
  }

  const handleBulkExport = () => {
    downloadCsvMutation.mutate(Array.from(selectedLeadIds))
  }

  // Single lead actions
  const handleSingleStatus = (leadId: string, newStatus: ProspectStatus) => {
    updateLeadMutation.mutate({
      leadId,
      payload: { prospectStatus: newStatus },
    })
  }

  const handleSingleSave = (leadId: string, currentSaved: boolean) => {
    updateLeadMutation.mutate({
      leadId,
      payload: { saved: !currentSaved },
    })
  }

  const handleSingleArchive = (leadId: string, currentArchived: boolean) => {
    updateLeadMutation.mutate({
      leadId,
      payload: { archived: !currentArchived },
    })
  }

  const handleSingleAddTag = (leadId: string, tagId: string) => {
    const targetLead = allLeads.find((l) => l.id === leadId)
    const currentTagIds = (targetLead?.tags ?? []).map((t) => t.id)
    if (!currentTagIds.includes(tagId)) {
      updateLeadMutation.mutate({
        leadId,
        payload: { tagIds: [...currentTagIds, tagId] },
      })
    }
  }

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        to="/"
      >
        <ArrowLeft className="size-4" />
        Research runs
      </Link>

      {campaign.isPending ? <Skeleton className="h-48 w-full" /> : null}
      {campaign.isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(campaign.error)}</p>
      ) : null}

      {data ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">{data.niche}</h1>
                <ToneBadge tone={statusTone(data.status)}>{statusLabel(data.status)}</ToneBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.serviceType} · {data.city}, {data.region}, {data.country} ·{" "}
                <span className="tabular-nums">
                  {data.leadCount}/{data.maxLeads} leads
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasLeads && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={downloadCsvMutation.isPending}
                  onClick={() => downloadCsvMutation.mutate(undefined)}
                  className="gap-1.5"
                >
                  <Download className="size-3.5" />
                  {downloadCsvMutation.isPending ? "Exporting..." : "Export all CSV"}
                </Button>
              )}
              {data.status === "PAUSED" ? (
                <Button size="sm" disabled={pending} onClick={() => void run.mutate()}>
                  {run.isPending ? "Retrying…" : "Retry"}
                </Button>
              ) : null}
              {!active && data.status !== "PAUSED" ? (
                <Button size="sm" disabled={pending} onClick={() => void run.mutate()}>
                  {run.isPending ? "Starting…" : hasLeads ? "Run again" : "Run"}
                </Button>
              ) : null}
              {active || data.status === "PAUSED" ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => void cancel.mutate()}
                >
                  {cancel.isPending ? "Cancelling…" : "Cancel"}
                </Button>
              ) : null}
            </div>
          </div>

          {actionError ? (
            <p className="text-sm text-destructive">{getErrorMessage(actionError)}</p>
          ) : null}

          {/* Live pipeline — show while running or before any leads exist. */}
          {active || !hasLeads ? <RunPipeline campaign={data} /> : null}

          {/* Prospect Management Workspace */}
          {hasLeads ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    Prospect Management Workspace
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Triage opportunities, track outreach stages, attach context notes, and export qualified leads.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <ProspectFilters
                state={filterState}
                onChange={(patch) => setFilterState((prev) => ({ ...prev, ...patch }))}
                counts={counts}
                availableTags={availableTags}
              />

              {/* Table */}
              <ProspectTable
                leads={filteredLeads}
                selectedLeadIds={selectedLeadIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onUpdateStatus={handleSingleStatus}
                onToggleSave={handleSingleSave}
                onToggleArchive={handleSingleArchive}
                availableTags={availableTags}
                onAddTagToLead={handleSingleAddTag}
                isPending={updateLeadMutation.isPending}
              />

              {/* Floating Bulk Action Bar */}
              <BulkActionBar
                selectedCount={selectedLeadIds.size}
                onClear={() => setSelectedLeadIds(new Set())}
                onUpdateStatus={handleBulkStatus}
                onToggleSave={handleBulkSave}
                onToggleArchive={handleBulkArchive}
                onAddTag={handleBulkAddTag}
                onExportSelected={handleBulkExport}
                availableTags={availableTags}
                isPending={bulkUpdateMutation.isPending}
              />
            </section>
          ) : !active ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">No leads yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Run this research to discover local businesses and build the opportunity queue.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {/* Handoff Panel */}
          {hasLeads ? <HandoffPanel /> : null}
        </>
      ) : null}
    </div>
  )
}
