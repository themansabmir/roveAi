import { useState } from "react"
import {
  Bookmark,
  ExternalLink,
  Archive,
  ArchiveRestore,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@rove/ui/components/table"
import type {
  CampaignLead,
  ProspectStatus,
  TagItem,
} from "@/features/campaigns/domain/campaign"
import {
  computeNextAction,
  heuristicScore,
  scoreTone,
  websiteClassLabel,
} from "@/features/campaigns/domain/campaign"
import { ToneBadge } from "@/features/campaigns/presentation/ToneBadge"
import { LeadBriefDrawer } from "@/features/campaigns/presentation/LeadBriefDrawer"

export function ProspectTable({
  leads,
  selectedLeadIds,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateStatus,
  onToggleSave,
  onToggleArchive,
  availableTags,
  onAddTagToLead,
  isPending,
}: {
  leads: CampaignLead[]
  selectedLeadIds: Set<string>
  onToggleSelect: (leadId: string) => void
  onToggleSelectAll: () => void
  onUpdateStatus: (leadId: string, status: ProspectStatus) => void
  onToggleSave: (leadId: string, currentSaved: boolean) => void
  onToggleArchive: (leadId: string, currentArchived: boolean) => void
  availableTags: TagItem[]
  onAddTagToLead: (leadId: string, tagId: string) => void
  isPending: boolean
}) {
  const [activeLead, setActiveLead] = useState<CampaignLead | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tagPickerLeadId, setTagPickerLeadId] = useState<string | null>(null)

  const allSelected = leads.length > 0 && selectedLeadIds.size === leads.length
  const isIndeterminate =
    selectedLeadIds.size > 0 && selectedLeadIds.size < leads.length

  const openDrawer = (lead: CampaignLead) => {
    setActiveLead(lead)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-10 px-3">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={onToggleSelectAll}
                  className="size-4 rounded border-input text-primary focus:ring-primary accent-primary"
                />
              </TableHead>
              <TableHead className="w-8 px-1"></TableHead>
              <TableHead className="min-w-[200px]">Business</TableHead>
              <TableHead className="w-24 text-center">Score</TableHead>
              <TableHead className="w-36">Status</TableHead>
              <TableHead className="min-w-[150px]">Next action</TableHead>
              <TableHead className="min-w-[150px]">Tags</TableHead>
              <TableHead className="w-12 text-right px-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                  No prospects match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => {
                const isSelected = selectedLeadIds.has(lead.id)
                const isSaved = Boolean(lead.savedAt)
                const isArchived = Boolean(lead.archivedAt)
                const score = lead.opportunityScore ?? heuristicScore(lead)
                const status = (lead.prospectStatus ?? "NEW") as ProspectStatus
                const nextAction = computeNextAction({
                  archivedAt: lead.archivedAt,
                  prospectStatus: status,
                  opportunityScore: lead.opportunityScore,
                  auditStatus: lead.auditStatus,
                  aiStatus: lead.aiStatus,
                  brief: lead.brief,
                })

                return (
                  <TableRow
                    key={lead.id}
                    className={[
                      "group transition-colors hover:bg-muted/40",
                      isSelected ? "bg-primary/5" : "",
                      isArchived ? "opacity-60 bg-muted/20" : "",
                    ].join(" ")}
                  >
                    {/* Checkbox */}
                    <TableCell className="w-10 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${lead.business.name}`}
                        checked={isSelected}
                        onChange={() => onToggleSelect(lead.id)}
                        className="size-4 rounded border-input text-primary focus:ring-primary accent-primary"
                      />
                    </TableCell>

                    {/* Bookmark / Star */}
                    <TableCell className="w-8 px-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        aria-label={isSaved ? "Unsave lead" : "Save lead"}
                        onClick={() => onToggleSave(lead.id, isSaved)}
                        className="p-1 text-muted-foreground hover:text-amber-500 transition-colors"
                      >
                        <Bookmark
                          className={[
                            "size-4 transition-transform active:scale-125",
                            isSaved ? "fill-amber-500 text-amber-500" : "hover:text-amber-500",
                          ].join(" ")}
                        />
                      </button>
                    </TableCell>

                    {/* Business Name, Location, Website */}
                    <TableCell
                      className="cursor-pointer font-medium"
                      onClick={() => openDrawer(lead)}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {lead.business.name}
                          </span>
                          {lead.brief && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                              <Sparkles className="size-2.5" />
                              Brief ready
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {lead.business.city && <span>{lead.business.city}</span>}
                          {lead.business.city && <span>·</span>}
                          {lead.business.websiteUrl ? (
                            <a
                              href={lead.business.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 hover:text-primary hover:underline"
                            >
                              <span>{websiteClassLabel(lead.business.websiteClass)}</span>
                              <ExternalLink className="size-3" />
                            </a>
                          ) : (
                            <span className="italic">{websiteClassLabel(lead.business.websiteClass)}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Score */}
                    <TableCell
                      className="text-center cursor-pointer"
                      onClick={() => openDrawer(lead)}
                    >
                      <div className="inline-flex flex-col items-center">
                        <ToneBadge tone={scoreTone(score)}>
                          {score == null ? "—" : score}
                        </ToneBadge>
                        {lead.opportunityScore != null ? (
                          <span className="text-[10px] text-muted-foreground font-normal">audited</span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 font-normal">est.</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Dropdown */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <select
                        disabled={isPending}
                        value={status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as ProspectStatus)}
                        className={[
                          "h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-sm transition-colors",
                          status === "QUALIFIED"
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold border-emerald-500/40"
                            : status === "CONTACTED"
                            ? "text-blue-600 dark:text-blue-400 font-semibold border-blue-500/40"
                            : status === "RESEARCHED"
                            ? "text-sky-600 dark:text-sky-400 font-semibold border-sky-500/40"
                            : status === "DISMISSED"
                            ? "text-muted-foreground line-through opacity-70"
                            : "text-foreground",
                        ].join(" ")}
                      >
                        <option value="NEW">New</option>
                        <option value="RESEARCHED">Researched</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="DISMISSED">Dismissed</option>
                      </select>
                    </TableCell>

                    {/* Next Action Chip */}
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => openDrawer(lead)}
                    >
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
                          nextAction.tone === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                            : nextAction.tone === "primary"
                            ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20"
                            : nextAction.tone === "warning"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                            : nextAction.tone === "danger"
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                            : "bg-muted text-muted-foreground border-border",
                        ].join(" ")}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {nextAction.label}
                      </span>
                    </TableCell>

                    {/* Tags */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap items-center gap-1">
                        {(lead.tags ?? []).map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                          >
                            {t.name}
                          </span>
                        ))}
                        {availableTags.length > 0 && (
                          <div className="relative inline-block">
                            {tagPickerLeadId === lead.id ? (
                              <select
                                autoFocus
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    onAddTagToLead(lead.id, e.target.value)
                                  }
                                  setTagPickerLeadId(null)
                                }}
                                onBlur={() => setTagPickerLeadId(null)}
                                className="h-6 rounded border border-input bg-background text-[11px] px-1 py-0 shadow-sm"
                              >
                                <option value="" disabled>
                                  Choose tag...
                                </option>
                                {availableTags
                                  .filter((at) => !(lead.tags ?? []).some((lt) => lt.id === at.id))
                                  .map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.name}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <button
                                type="button"
                                aria-label="Add tag to lead"
                                onClick={() => setTagPickerLeadId(lead.id)}
                                className="inline-flex size-5 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="size-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions: Archive / Unarchive & View Brief */}
                    <TableCell className="text-right px-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={isArchived ? "Unarchive lead" : "Archive lead"}
                          onClick={() => onToggleArchive(lead.id, isArchived)}
                          title={isArchived ? "Restore prospect" : "Archive prospect"}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isArchived ? (
                            <ArchiveRestore className="size-4" />
                          ) : (
                            <Archive className="size-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          aria-label="View brief drawer"
                          onClick={() => openDrawer(lead)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Sorted by commercial opportunity. Leads with completed audits reflect real Lighthouse performance and technical evidence. Click any row to open the full findings, AI outreach brief, and editable notes.
      </p>

      {/* Slide-out detail drawer */}
      <LeadBriefDrawer lead={activeLead} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}
