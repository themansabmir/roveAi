import { Link, useParams } from "react-router-dom"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAuth } from "@/features/auth/application/useAuth"
import { useCampaign, useCancelCampaign, useRunCampaign } from "@/features/campaigns/application/useCampaigns"
import { isActiveRun } from "@/features/campaigns/domain/campaign"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"

export function CampaignDetailPage() {
  const { campaignId } = useParams()
  const { me, isLoading } = useAuth()
  const organizationId = me?.organization?.id
  const campaign = useCampaign(organizationId ?? "", campaignId ?? "")
  const run = useRunCampaign(organizationId ?? "", campaignId ?? "")
  const cancel = useCancelCampaign(organizationId ?? "", campaignId ?? "")

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading campaign…</p>
  }

  if (!organizationId || !campaignId) {
    return <p className="text-sm text-muted-foreground">Choose a workspace first.</p>
  }

  const data = campaign.data
  const pending = run.isPending || cancel.isPending
  const actionError = run.error ?? cancel.error

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link className="text-xs text-muted-foreground hover:underline" to="/">
          Campaigns
        </Link>
        {campaign.isPending ? <p className="mt-3 text-sm text-muted-foreground">Loading campaign…</p> : null}
        {campaign.isError ? <p className="mt-3 text-sm text-destructive">{getErrorMessage(campaign.error)}</p> : null}
        {data ? (
          <>
            <h1 className="mt-2 text-lg font-semibold tracking-tight">{data.niche}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.serviceType} · {data.city}, {data.region}, {data.country}
            </p>
          </>
        ) : null}
      </div>

      {data ? (
        <Card>
          <CardHeader>
            <CardTitle>{data.status}</CardTitle>
            <CardDescription>
              {data.leadCount} of {data.maxLeads} leads
              {data.job ? ` · job ${data.job.status}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {data.status === "PAUSED" ? (
              <Button size="sm" disabled={pending} onClick={() => void run.mutate()}>
                {run.isPending ? "Retrying…" : "Retry"}
              </Button>
            ) : null}
            {!isActiveRun(data.status) && data.status !== "PAUSED" ? (
              <Button size="sm" disabled={pending} onClick={() => void run.mutate()}>
                {run.isPending ? "Starting…" : "Run"}
              </Button>
            ) : null}
            {isActiveRun(data.status) || data.status === "PAUSED" ? (
              <Button size="sm" variant="outline" disabled={pending} onClick={() => void cancel.mutate()}>
                {cancel.isPending ? "Cancelling…" : "Cancel"}
              </Button>
            ) : null}
            {actionError ? <p className="w-full text-sm text-destructive">{getErrorMessage(actionError)}</p> : null}
          </CardContent>
        </Card>
      ) : null}

      {data && data.leads.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No leads yet</CardTitle>
            <CardDescription>Run the campaign to discover businesses on Maps.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {data && data.leads.length > 0 ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Business</th>
                <th className="px-3 py-2 font-medium">Website</th>
                <th className="px-3 py-2 font-medium">Qualification</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => (
                <tr key={lead.id} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <p className="font-medium">{lead.business.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.business.city ?? data.city}
                      {lead.business.rating != null ? ` · ${lead.business.rating}` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-2">{lead.business.websiteClass}</td>
                  <td className="px-3 py-2">{lead.qualificationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
