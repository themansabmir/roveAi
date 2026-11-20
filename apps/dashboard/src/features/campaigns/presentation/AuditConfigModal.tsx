import { useState } from "react"
import { Play, Sparkles, Globe, Gauge, Info, Coins, AlertCircle, PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rove/ui/components/dialog"
import { Button } from "@rove/ui/components/button"
import { useAuth } from "@/features/auth/application/useAuth"
import {
  useCreditBalance,
  useCreditPacks,
  useRefillCredits,
} from "@/features/campaigns/application/useCampaigns"

interface AuditConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLeadCount: number
  onConfirm: (options: {
    tools: ("CRAWL" | "PERFORMANCE")[]
    generateAiBrief: boolean
    topNCount?: number
  }) => void
  isPending: boolean
}

type AiBriefOption = "none" | "all" | "top_n"

export function AuditConfigModal({
  open,
  onOpenChange,
  selectedLeadCount,
  onConfirm,
  isPending,
}: AuditConfigModalProps) {
  const { me } = useAuth()
  const organizationId = me?.organization?.id ?? ""
  const balanceQuery = useCreditBalance(organizationId)
  const packsQuery = useCreditPacks(organizationId)
  const refillMutation = useRefillCredits(organizationId)

  const [crawlEnabled, setCrawlEnabled] = useState(true)
  const [psiEnabled, setPsiEnabled] = useState(true)
  const [briefOption, setBriefOption] = useState<AiBriefOption>("none")
  const [topNCount, setTopNCount] = useState(() => Math.min(5, Math.max(1, selectedLeadCount)))

  const availableBalance = balanceQuery.data?.available ?? 0

  // Senior Architecture: 1 Research Unit = 1 complete research report per prospect
  const totalCost = selectedLeadCount * 1
  const isInsufficient = totalCost > availableBalance

  const handleRun = () => {
    const tools: ("CRAWL" | "PERFORMANCE")[] = []
    if (crawlEnabled) tools.push("CRAWL")
    if (psiEnabled) tools.push("PERFORMANCE")

    onConfirm({
      tools,
      generateAiBrief: briefOption !== "none",
      topNCount: briefOption === "top_n" ? Math.min(topNCount, selectedLeadCount) : undefined,
    })
  }

  const atLeastOneSelected = crawlEnabled || psiEnabled || briefOption !== "none"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Play className="size-5 text-primary" />
            Configure Selective Prospect Audit
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Execute technical diagnostic audits and optional AI synthesis on {selectedLeadCount} shortlisted prospect{selectedLeadCount === 1 ? "" : "s"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Audit Tools Section */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Technical Audit Tools
            </span>

            <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={crawlEnabled}
                onChange={(e) => setCrawlEnabled(e.target.checked)}
                className="mt-1 size-4 rounded border-input text-primary accent-primary"
              />
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Globe className="size-4 text-sky-500" />
                    Website Deep Crawl & Tech Stack
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">Included in report</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Indexes metadata, contact info, social links, schema, and detects CMS/tech stack.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={psiEnabled}
                onChange={(e) => setPsiEnabled(e.target.checked)}
                className="mt-1 size-4 rounded border-input text-primary accent-primary"
              />
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="size-4 text-emerald-500" />
                    Google PageSpeed & Core Web Vitals
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">Included in report</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Captures mobile & desktop performance scores, LCP, CLS, FID, and SEO audit bottlenecks.
                </p>
              </div>
            </label>
          </div>

          {/* AI Brief Synthesis Section */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Opportunity Briefs
            </span>

            <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="aiBrief"
                  checked={briefOption === "none"}
                  onChange={() => setBriefOption("none")}
                  className="size-4 text-primary accent-primary"
                />
                <span>Audit only (No AI briefs generated right now)</span>
                <span className="ml-auto text-muted-foreground font-normal">0 RU</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="aiBrief"
                  checked={briefOption === "all"}
                  onChange={() => setBriefOption("all")}
                  className="size-4 text-primary accent-primary"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  Generate AI Briefs for all {selectedLeadCount} prospects
                </span>
                <span className="ml-auto text-primary font-semibold">
                  {selectedLeadCount * 5} RU
                </span>
              </label>

              {selectedLeadCount > 1 && (
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="aiBrief"
                      checked={briefOption === "top_n"}
                      onChange={() => setBriefOption("top_n")}
                      className="size-4 text-primary accent-primary"
                    />
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-primary" />
                      Generate AI Briefs for top
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedLeadCount}
                    value={topNCount}
                    disabled={briefOption !== "top_n"}
                    onChange={(e) =>
                      setTopNCount(
                        Math.max(1, Math.min(selectedLeadCount, Number(e.target.value) || 1))
                      )
                    }
                    className="w-16 h-7 rounded border border-input bg-background px-2 text-xs font-semibold text-center"
                  />
                  <span>highest-priority leads</span>
                  <span className="ml-auto text-primary font-semibold">
                    {Math.min(topNCount, selectedLeadCount) * 5} RU
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Research Unit Spend Estimate & Real Balance */}
          <div className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Coins className="size-3.5 text-amber-500" />
                Report Allocation (1 RU × {selectedLeadCount} prospect{selectedLeadCount === 1 ? "" : "s"}):
              </span>
              <span className="font-medium text-foreground">{totalCost} RU</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t text-sm font-semibold">
              <span className="flex items-center gap-1.5">
                <Info className="size-4 text-muted-foreground" />
                Total Reserved:
              </span>
              <span className="text-primary font-bold">{totalCost} Research Unit{totalCost === 1 ? "" : "s"}</span>
            </div>

            {/* Current Balance Bar */}
            <div className="flex items-center justify-between pt-1 text-xs border-t text-muted-foreground">
              <span>Your Available Balance:</span>
              <span className={`font-semibold ${isInsufficient ? "text-destructive" : "text-foreground"}`}>
                {availableBalance} RU
              </span>
            </div>

            {/* Insufficient balance warning & Quick Refill Button */}
            {isInsufficient && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-destructive font-medium">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>
                    Insufficient balance. You need {totalCost - availableBalance} more Research Units to run this audit.
                  </span>
                </div>
                {packsQuery.data && packsQuery.data.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-muted-foreground font-medium">Refill options:</span>
                    {packsQuery.data.slice(0, 2).map((pack) => (
                      <Button
                        key={pack.id}
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={refillMutation.isPending}
                        onClick={() => refillMutation.mutate(pack.id)}
                        className="h-7 text-xs gap-1 font-semibold"
                      >
                        <PlusCircle className="size-3" />
                        {pack.name} (+{pack.credits} RU)
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleRun}
            disabled={!atLeastOneSelected || isPending || selectedLeadCount === 0 || isInsufficient}
            className="gap-1.5 font-semibold"
          >
            <Play className="size-3.5 fill-current" />
            {isPending ? "Queuing Audits..." : isInsufficient ? "Insufficient Credits" : `Run Audit (${totalCost} RU)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
