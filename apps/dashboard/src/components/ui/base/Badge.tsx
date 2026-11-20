import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export type StatusBadgeType = "completed" | "in-progress" | "failed" | "cancelled"

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusBadgeType
  label?: string
  showDot?: boolean
}

const statusConfig: Record<
  StatusBadgeType,
  { defaultLabel: string; bgClass: string; dotClass: string }
> = {
  completed: {
    defaultLabel: "Completed",
    bgClass: "bg-secondary text-secondary-foreground border-transparent",
    dotClass: "bg-[#61626B]",
  },
  "in-progress": {
    defaultLabel: "In progress",
    bgClass: "bg-primary/10 text-primary border-primary/20",
    dotClass: "bg-primary animate-pulse",
  },
  failed: {
    defaultLabel: "Failed",
    bgClass: "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
  },
  cancelled: {
    defaultLabel: "Cancelled",
    bgClass: "bg-muted text-muted-foreground border-transparent",
    dotClass: "bg-muted-foreground",
  },
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.completed
  const displayLabel = label || config.defaultLabel

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        config.bgClass,
        className,
      )}
      {...props}
    >
      {showDot && (
        <span className={cn("size-1.5 rounded-full", config.dotClass)} aria-hidden="true" />
      )}
      <span>{displayLabel}</span>
    </span>
  )
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline"
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-secondary text-secondary-foreground border-transparent",
    secondary: "bg-primary text-primary-foreground border-transparent",
    outline: "bg-card text-foreground border-border",
  }[variant]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
