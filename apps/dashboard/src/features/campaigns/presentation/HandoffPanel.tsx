import { Download, Link2, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Badge } from "@rove/ui/components/badge"
import { Button } from "@rove/ui/components/button"

const OPTIONS = [
  {
    key: "crm",
    icon: Share2,
    title: "Push to CRM",
    body: "Sync approved leads to HubSpot, Pipedrive, or Salesforce as deals with the brief attached.",
    action: "Connect CRM",
  },
  {
    key: "share",
    icon: Link2,
    title: "Share a brief",
    body: "Send a logged-out, no-index link so the agency can show the client the evidence.",
    action: "Copy link",
  },
  {
    key: "csv",
    icon: Download,
    title: "Export CSV",
    body: "Download the queue with scores, signals, and statuses for any other tool.",
    action: "Download",
  },
] as const

export function HandoffPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Review & hand off</CardTitle>
            <CardDescription>
              Rove hands research to your sales workflow — it never sends cold outreach itself.
            </CardDescription>
          </div>
          <Badge variant="outline">coming soon</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const Icon = option.icon
          return (
            <div key={option.key} className="flex flex-col gap-3 rounded-lg border p-4">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{option.title}</p>
                <p className="text-xs text-muted-foreground">{option.body}</p>
              </div>
              <Button variant="secondary" size="sm" disabled className="mt-auto">
                {option.action}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
