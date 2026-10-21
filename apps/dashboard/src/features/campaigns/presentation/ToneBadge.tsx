import { Badge } from "@rove/ui/components/badge"
import type { LeadTone } from "@/features/campaigns/domain/campaign"

const TONE_TO_VARIANT: Record<LeadTone, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "secondary",
  neutral: "outline",
}

export function ToneBadge({ tone, children }: { tone: LeadTone; children: React.ReactNode }) {
  return <Badge variant={TONE_TO_VARIANT[tone]}>{children}</Badge>
}
