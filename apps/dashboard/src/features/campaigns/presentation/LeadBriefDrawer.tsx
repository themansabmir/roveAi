import { useState } from "react"
import { Check, Copy, ExternalLink, Gauge, Sparkles, AlertTriangle, Layers, Globe } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@rove/ui/components/sheet"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@rove/ui/components/card"
import { Badge } from "@rove/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rove/ui/components/tabs"
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
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)

  const score = lead ? (lead.opportunityScore ?? heuristicScore(lead)) : null
  const perfAudit = lead?.audits?.find((a) => a.module === "PERFORMANCE")
  const perfMetrics = (perfAudit?.metrics as Record<string, any>) ?? null
  const lcpSec = perfMetrics?.lcp_ms ? (perfMetrics.lcp_ms / 1000).toFixed(1) : null
  const clsVal = perfMetrics?.cls != null ? Number(perfMetrics.cls).toFixed(2) : null
  const techStack = (lead?.brief?.content?.metricsSummary?.techStack as string[]) ?? []

  const allFindings = (lead?.audits ?? []).flatMap((a) =>
    a.findings.map((f) => ({ ...f, moduleName: a.module }))
  )

  const copyToClipboard = async (text: string, type: "email" | "script") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "email") {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      } else {
        setCopiedScript(true)
        setTimeout(() => setCopiedScript(false), 2000)
      }
    } catch {
      // fallback
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        {lead ? (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-4 pr-6">
                <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle>{lead.business.name}</SheetTitle>
                    {lead.brief && (
                      <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                        <Sparkles className="size-3" /> Brief Ready
                      </Badge>
                    )}
                  </div>
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
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {lead.opportunityScore != null ? "commercial opportunity" : "opportunity (heuristic)"}
                  </p>
                </div>
              </div>
            </SheetHeader>

            <Tabs defaultValue="brief" className="mt-6 w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="brief" className="gap-1.5">
                  <Sparkles className="size-3.5" /> Opportunity Brief
                </TabsTrigger>
                <TabsTrigger value="findings" className="gap-1.5">
                  <Gauge className="size-3.5" /> Audit Findings
                </TabsTrigger>
              </TabsList>

              {/* ─── TAB 1: OPPORTUNITY BRIEF ─────────────────────────── */}
              <TabsContent value="brief" className="mt-4 space-y-4">
                {lead.brief ? (
                  <>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="font-semibold text-xs">
                            {lead.brief.suggestedService || "Recommended Service"}
                          </Badge>
                          <Badge
                            variant={
                              lead.brief.confidence === "HIGH"
                                ? "default"
                                : "outline"
                            }
                            className="text-[11px]"
                          >
                            {lead.brief.confidence} Confidence
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-semibold leading-snug mt-2">
                          {lead.brief.headlineOpportunity}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {lead.brief.valueProposition && (
                          <div className="rounded-md bg-muted/50 p-3">
                            <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                              Value Proposition
                            </span>
                            <p className="text-foreground leading-relaxed">
                              {lead.brief.valueProposition}
                            </p>
                          </div>
                        )}
                        {lead.brief.outreachAngle && (
                          <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                            <span className="font-semibold text-xs uppercase tracking-wider text-primary block mb-1">
                              Strategic Outreach Angle
                            </span>
                            <p className="text-foreground leading-relaxed text-xs">
                              {lead.brief.outreachAngle}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {lead.brief.coldEmailDraft && (
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle className="text-sm font-semibold">Cold Email Draft</CardTitle>
                            <CardDescription className="text-xs">
                              Tailored to their real audit metrics and Google reviews
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => copyToClipboard(lead.brief?.coldEmailDraft || "", "email")}
                          >
                            {copiedEmail ? (
                              <>
                                <Check className="size-3.5 text-green-500" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" /> Copy Email
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-sans text-xs leading-relaxed text-foreground border">
                            {lead.brief.coldEmailDraft}
                          </pre>
                        </CardContent>
                      </Card>
                    )}

                    {lead.brief.callScriptDraft && (
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle className="text-sm font-semibold">Phone Outreach Script</CardTitle>
                            <CardDescription className="text-xs">
                              Consultative opening for SDRs and Account Executives
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => copyToClipboard(lead.brief?.callScriptDraft || "", "script")}
                          >
                            {copiedScript ? (
                              <>
                                <Check className="size-3.5 text-green-500" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" /> Copy Script
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-sans text-xs leading-relaxed text-foreground border">
                            {lead.brief.callScriptDraft}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">AI Brief in Progress</CardTitle>
                        <Badge variant="outline">
                          {lead.auditStatus === "COMPLETED" ? "Reasoning queued" : "Auditing site"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {lead.auditStatus === "COMPLETED"
                          ? "The technical audits for this lead have completed. The Interpret Worker is currently synthesizing the structured sales opportunity brief."
                          : "Audit modules (Google PageSpeed and website crawl) are running. Once finished, the AI opportunity brief with cold email draft and phone script will appear here."}
                      </p>
                      <div className="rounded-md border p-3 text-xs space-y-1.5 bg-muted/20">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Audit Status:</span>
                          <span className="font-medium">{auditStatusLabel(lead.auditStatus)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">AI Reasoning Status:</span>
                          <span className="font-medium">{lead.aiStatus || "PENDING"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* ─── TAB 2: AUDIT FINDINGS ────────────────────────────── */}
              <TabsContent value="findings" className="mt-4 space-y-4">
                {/* 1. Core Web Vitals & Performance Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="size-4 text-primary" />
                        <CardTitle className="text-sm">Mobile Performance (Google PageSpeed)</CardTitle>
                      </div>
                      {perfAudit?.score != null && (
                        <ToneBadge
                          tone={
                            perfAudit.score >= 90
                              ? "success"
                              : perfAudit.score >= 50
                              ? "warning"
                              : "danger"
                          }
                        >
                          {perfAudit.score}/100
                        </ToneBadge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {perfAudit ? (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-md bg-muted/40 p-2.5 border">
                          <div className="text-lg font-bold">
                            {perfAudit.score != null ? perfAudit.score : "—"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">Lighthouse</div>
                        </div>
                        <div className="rounded-md bg-muted/40 p-2.5 border">
                          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {lcpSec ? `${lcpSec}s` : "—"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">LCP (Mobile)</div>
                        </div>
                        <div className="rounded-md bg-muted/40 p-2.5 border">
                          <div className="text-lg font-bold">
                            {clsVal != null ? clsVal : "—"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">CLS</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {lead.business.websiteUrl
                          ? "Performance audit pending or in queue."
                          : "No website available for mobile performance audit."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* 2. Detected Tech Stack & CMS */}
                {techStack.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="size-4 text-primary" />
                        <CardTitle className="text-sm">Detected Technologies</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 3. Findings List */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Technical Issues & Opportunities</CardTitle>
                    <CardDescription className="text-xs">
                      Observable evidence collected during crawl and mobile audits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {allFindings.length > 0 ? (
                      allFindings.map((finding, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-md border p-2.5 text-xs bg-card"
                        >
                          <AlertTriangle
                            className={[
                              "size-4 shrink-0 mt-0.5",
                              finding.severity === "HIGH"
                                ? "text-destructive"
                                : finding.severity === "MEDIUM"
                                ? "text-amber-500"
                                : "text-blue-500",
                            ].join(" ")}
                          />
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {finding.code.replace(/_/g, " ")}
                              </span>
                              <Badge variant="outline" className="text-[10px] uppercase">
                                {finding.severity}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{finding.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground py-2">
                        {lead.auditStatus === "COMPLETED"
                          ? "No technical severity findings triggered."
                          : "Audits are still processing or pending."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* 4. Business & Web Presence Overview */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-primary" />
                      <CardTitle className="text-sm">Business Identity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <EvidenceRow label="Primary Signal" value={primarySignal(lead)} emphasize />
                    <EvidenceRow label="Web Presence" value={websiteClassLabel(lead.business.websiteClass)} />
                    <EvidenceRow label="Qualification" value={qualificationLabel(lead.qualificationStatus)} />
                    <EvidenceRow label="Audit Status" value={auditStatusLabel(lead.auditStatus)} />
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
                          className="inline-flex items-center gap-1 font-medium hover:underline text-primary"
                        >
                          Visit <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="font-medium text-muted-foreground">None</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button variant="secondary" disabled title="Available once CRM export lands">
                Approve &amp; Hand Off
              </Button>
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
