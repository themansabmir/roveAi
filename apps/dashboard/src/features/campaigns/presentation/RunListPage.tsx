import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Skeleton } from "@rove/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@rove/ui/components/table"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useCampaignList } from "@/features/campaigns/application/useCampaigns"
import { statusLabel, statusTone } from "@/features/campaigns/domain/campaign"
import { NewRunWizard } from "@/features/campaigns/presentation/NewRunWizard"
import { ToneBadge } from "@/features/campaigns/presentation/ToneBadge"

export function RunListPage({ organizationId }: { organizationId: string }) {
  const campaigns = useCampaignList(organizationId)
  const [wizardOpen, setWizardOpen] = useState(false)

  const hasRuns = campaigns.data && campaigns.data.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Research runs</h2>
        <Button size="sm" onClick={() => setWizardOpen(true)}>
          <Plus className="size-4" />
          New research run
        </Button>
      </div>

      {campaigns.isPending ? <Skeleton className="h-40 w-full" /> : null}
      {campaigns.isError ? (
        <p className="text-sm text-destructive">{getErrorMessage(campaigns.error)}</p>
      ) : null}

      {campaigns.data && !hasRuns ? (
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Start your first research run</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              Pick a niche and a city. Rove discovers local businesses, checks their web presence,
              and surfaces the ones that most need what you sell.
            </p>
            <Button onClick={() => setWizardOpen(true)}>
              <Plus className="size-4" />
              New research run
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {hasRuns ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Leads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.data!.map((campaign) => (
                <TableRow key={campaign.id} className="cursor-pointer">
                  <TableCell>
                    <Link className="font-medium hover:underline" to={`/campaigns/${campaign.id}`}>
                      {campaign.niche}
                    </Link>
                    <p className="text-xs text-muted-foreground">{campaign.serviceType}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {campaign.city}, {campaign.region}
                  </TableCell>
                  <TableCell>
                    <ToneBadge tone={statusTone(campaign.status)}>
                      {statusLabel(campaign.status)}
                    </ToneBadge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {campaign.leadCount}/{campaign.maxLeads}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <NewRunWizard organizationId={organizationId} open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  )
}
