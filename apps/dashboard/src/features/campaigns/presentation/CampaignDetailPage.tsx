import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAuth } from "@/features/auth/application/useAuth"
import { useCampaign, useCancelCampaign, useRunCampaign } from "@/features/campaigns/application/useCampaigns"
import { isActiveRun, statusLabel, statusTone } from "@/features/campaigns/domain/campaign"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Skeleton } from "@rove/ui/components/skeleton"
import { ToneBadge } from "@/features/campaigns/presentation/ToneBadge"
import { RunPipeline } from "@/features/campaigns/presentation/RunPipeline"
import { OpportunityQueue } from "@/features/campaigns/presentation/OpportunityQueue"
import { HandoffPanel } from "@/features/campaigns/presentation/HandoffPanel"

export function CampaignDetailPage() {
  const { campaignId } = useParams()
  const { me, isLoading } = useAuth()
  const organizationId = me?.organization?.id
  const campaign = useCampaign(organizationId ?? "", campaignId ?? "")
  const run = useRunCampaign(organizationId ?? "", campaignId ?? "")
  const cancel = useCancelCampaign(organizationId ?? "", campaignId ?? "")

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

          {/* Step 2: live pipeline — show while running or before any leads exist. */}
          {active || !hasLeads ? <RunPipeline campaign={data} /> : null}

          {/* Step 3 + 4: opportunity queue with per-lead brief drawer. */}
          {hasLeads ? (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Opportunity queue</h2>
              <OpportunityQueue leads={data.leads} />
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

          {/* Step 5: hand off. */}
          {hasLeads ? <HandoffPanel /> : null}
        </>
      ) : null}
    </div>
  )
}
