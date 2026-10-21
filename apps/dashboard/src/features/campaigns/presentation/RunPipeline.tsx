import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Badge } from "@rove/ui/components/badge"
import { cn } from "@rove/ui/lib/cn"
import type { CampaignDetail } from "@/features/campaigns/domain/campaign"
import { buildPipeline } from "@/features/campaigns/domain/campaign"

export function RunPipeline({ campaign }: { campaign: CampaignDetail }) {
  const stages = buildPipeline(campaign)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Pipeline</CardTitle>
            <CardDescription>
              Rove works in the background — leads appear in the queue as they clear qualification.
            </CardDescription>
          </div>
          <Badge variant="secondary">live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage) => {
          const pct = stage.total > 0 ? Math.round((stage.done / stage.total) * 100) : 0
          const notYet = stage.state === "pending" && stage.total === 0
          return (
            <div key={stage.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className={cn("font-medium", notYet && "text-muted-foreground")}>
                  {stage.label}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {notYet ? "not yet available" : `${stage.done}/${stage.total}`}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    stage.state === "done"
                      ? "bg-emerald-500"
                      : stage.state === "active"
                        ? "bg-primary"
                        : "bg-transparent",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
        <p className="pt-1 text-xs text-muted-foreground">
          Crawl, scoring, and AI briefs are part of the research pipeline and will populate here as
          those stages come online.
        </p>
      </CardContent>
    </Card>
  )
}
