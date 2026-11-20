import * as React from "react"
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export type ToastType = "info" | "success" | "warning" | "error"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ToastType
  title: string
  description?: string
  onClose?: () => void
}

const toastTypeConfig: Record<
  ToastType,
  { icon: typeof Info; iconClass: string; borderClass: string }
> = {
  info: {
    icon: Info,
    iconClass: "text-primary",
    borderClass: "border-primary/20",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    borderClass: "border-emerald-500/20",
  },
  warning: {
    icon: AlertCircle,
    iconClass: "text-amber-600",
    borderClass: "border-amber-500/20",
  },
  error: {
    icon: XCircle,
    iconClass: "text-destructive",
    borderClass: "border-destructive/20",
  },
}

export function Toast({
  type = "info",
  title,
  description,
  onClose,
  className,
  ...props
}: ToastProps) {
  const config = toastTypeConfig[type]
  const Icon = config.icon

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border bg-card p-3.5 shadow-sm text-xs",
        config.borderClass,
        className,
      )}
      {...props}
    >
      <Icon className={cn("size-4 shrink-0 mt-0.5", config.iconClass)} aria-hidden="true" />

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-semibold text-foreground tracking-tight leading-tight">{title}</p>
        {description && <p className="text-muted-foreground leading-normal">{description}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="shrink-0 -mr-1 -mt-1 p-1 text-muted-foreground transition-colors hover:text-foreground rounded"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
