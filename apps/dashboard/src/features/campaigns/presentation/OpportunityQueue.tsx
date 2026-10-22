import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@rove/ui/components/table"
import type { CampaignLead } from "@/features/campaigns/domain/campaign"
import {
  heuristicScore,
  primarySignal,
  scoreTone,
  websiteClassLabel,
} from "@/features/campaigns/domain/campaign"
import { ToneBadge } from "@/features/campaigns/presentation/ToneBadge"
import { LeadBriefDrawer } from "@/features/campaigns/presentation/LeadBriefDrawer"

type Filter = "all" | "ready" | "low"

export function OpportunityQueue({ leads }: { leads: CampaignLead[] }) {
  const [filter, setFilter] = useState<Filter>("all")
  const [activeLead, setActiveLead] = useState<CampaignLead | null>(null)
  const [open, setOpen] = useState(false)

  const scored = useMemo(
    () =>
      leads
        .map((lead) => ({ lead, score: heuristicScore(lead) }))
        .sort((a, b) => (b.score ?? -1) - (a.score ?? -1)),
    [leads],
  )

  const counts = useMemo(() => {
    const high = scored.filter((item) => (item.score ?? 0) >= 75).length
    const low = scored.filter((item) => item.score != null && item.score < 55).length
    return { all: scored.length, high, low }
  }, [scored])

  const visible = scored.filter((item) => {
    if (filter === "ready") return (item.score ?? 0) >= 75
    if (filter === "low") return item.score != null && item.score < 55
    return true
  })

  const openLead = (lead: CampaignLead) => {
    setActiveLead(lead)
    setOpen(true)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
          All ({counts.all})
        </FilterPill>
        <FilterPill active={filter === "ready"} onClick={() => setFilter("ready")}>
          High opportunity ({counts.high})
        </FilterPill>
        <FilterPill active={filter === "low"} onClick={() => setFilter("low")}>
          Low score ({counts.low})
        </FilterPill>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Web presence</TableHead>
              <TableHead>Primary signal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(({ lead, score }) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer"
                onClick={() => openLead(lead)}
              >
                <TableCell className="font-medium">{lead.business.name}</TableCell>
                <TableCell className="text-right">
                  <ToneBadge tone={scoreTone(score)}>{score == null ? "—" : score}</ToneBadge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {websiteClassLabel(lead.business.websiteClass)}
                </TableCell>
                <TableCell className="text-muted-foreground">{primarySignal(lead)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Sorted by opportunity. Score is a heuristic from web presence and reviews until evidence-based
        audits come online. Click a row to open the brief.
      </p>

      <LeadBriefDrawer lead={activeLead} open={open} onOpenChange={setOpen} />
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  )
}
