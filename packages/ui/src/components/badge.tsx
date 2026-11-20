import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

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

function StatusBadge({
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

export { Badge, badgeVariants, StatusBadge }
