import { ExternalLink } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@rove/ui/components/sheet"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Badge } from "@rove/ui/components/badge"
import type { CampaignLead } from "@/features/campaigns/domain/campaign"
import {
  auditStatusLabel,
  heuristicScore,
  primarySignal,
  qualificationLabel,
  scoreTone,
  websiteClassLabel,
} from "@/features/campaigns/domain/campaign"
import { ToneBadge } from "@/features/campaigns/presentation/ToneBadge"

export function LeadBriefDrawer({
  lead,
  open,
  onOpenChange,
}: {
  lead: CampaignLead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const score = lead ? heuristicScore(lead) : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {lead ? (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-4 pr-6">
                <div>
                  <SheetTitle>{lead.business.name}</SheetTitle>
                  <SheetDescription>
                    {[
                      lead.business.city,
                      lead.business.rating != null ? `${lead.business.rating}★` : null,
                      lead.business.reviewCount != null ? `${lead.business.reviewCount} reviews` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </SheetDescription>
                </div>
                <div className="text-right">
                  <ToneBadge tone={scoreTone(score)}>
                    {score == null ? "—" : `${score} / 100`}
                  </ToneBadge>
                  <p className="mt-1 text-[11px] text-muted-foreground">opportunity (heuristic)</p>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Evidence (what we found)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <EvidenceRow label="Primary signal" value={primarySignal(lead)} emphasize />
                  <EvidenceRow label="Web presence" value={websiteClassLabel(lead.business.websiteClass)} />
                  <EvidenceRow label="Qualification" value={qualificationLabel(lead.qualificationStatus)} />
                  <EvidenceRow label="Audit" value={auditStatusLabel(lead.auditStatus)} />
                  <EvidenceRow
                    label="Rating"
                    value={lead.business.rating != null ? `${lead.business.rating}★` : "—"}
                  />
                  <EvidenceRow
                    label="Reviews"
                    value={lead.business.reviewCount != null ? String(lead.business.reviewCount) : "—"}
                  />
                  <div className="flex items-center justify-between gap-4 py-1 text-sm">
                    <span className="text-muted-foreground">Website</span>
                    {lead.business.websiteUrl ? (
                      <a
                        href={lead.business.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                      >
                        Visit <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="font-medium">None</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">AI recommendation</CardTitle>
                    <Badge variant="outline">coming soon</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Evidence-based audits and the AI opportunity brief (recommended service, value
                    proposition, and draft angle) are part of a later research stage and will appear
                    here once that pipeline runs. The signal above is a lightweight heuristic in the
                    meantime.
                  </p>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button variant="secondary" disabled title="Available once CRM export lands">
                  Approve &amp; hand off
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function EvidenceRow({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={emphasize ? "font-semibold" : "font-medium"}>{value}</span>
    </div>
  )
}
