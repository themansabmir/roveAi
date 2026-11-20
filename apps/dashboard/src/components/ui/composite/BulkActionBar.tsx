import * as React from "react"
import { X } from "lucide-react"
import { Button } from "../base/Button"
import { cn } from "@rove/ui/lib/cn"

export interface BulkAction {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary" | "destructive"
  icon?: React.ReactNode
  disabled?: boolean
}

export interface BulkActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedCount: number
  onClear: () => void
  actions: BulkAction[]
  entityName?: string
}

export function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  entityName = "items",
  className,
  ...props
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null

  return (
    <div
      role="region"
      aria-label="Bulk actions toolbar"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5",
        "rounded-xl border border-border bg-card px-4 py-2.5 shadow-lg",
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-200",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 pr-3 border-r border-border text-xs">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="font-medium text-foreground">
          {selectedCount} {entityName} selected
        </span>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="ml-1 flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((act, idx) => (
          <Button
            key={`bulk-act-${idx}`}
            variant={act.variant || "secondary"}
            size="sm"
            onClick={act.onClick}
            disabled={act.disabled}
            leftIcon={act.icon}
          >
            {act.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
