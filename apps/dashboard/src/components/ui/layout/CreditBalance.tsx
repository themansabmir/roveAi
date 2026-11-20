import * as React from "react"
import { Link } from "react-router-dom"
import { CreditCard } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface CreditBalanceProps extends React.HTMLAttributes<HTMLDivElement> {
  credits: number
  onClick?: () => void
  href?: string
}

export function CreditBalance({ credits, onClick, href, className, ...props }: CreditBalanceProps) {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs transition-colors select-none",
        (onClick || href) && "cursor-pointer hover:bg-secondary",
        className,
      )}
      {...props}
    >
      <CreditCard className="size-3.5 text-primary shrink-0" aria-hidden="true" />
      <span className="font-semibold text-foreground tabular-nums">{credits.toLocaleString()}</span>
      <span className="text-muted-foreground">credits</span>
    </div>
  )

  if (href) {
    return (
      <Link to={href} className="inline-flex">
        {content}
      </Link>
    )
  }

  return content
}
