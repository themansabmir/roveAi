import * as React from "react"
import { Button } from "../base/Button"
import { cn } from "@rove/ui/lib/cn"

export interface SuggestionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  reason: string
  meta: string
  onStartSearch?: () => void
  onEditFilters?: () => void
  startSearchLabel?: string
  editFiltersLabel?: string
}

export function SuggestionCard({
  title,
  reason,
  meta,
  onStartSearch,
  onEditFilters,
  startSearchLabel = "Start search",
  editFiltersLabel = "Edit filters",
  className,
  ...props
}: SuggestionCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs h-full text-foreground transition-colors",
        className,
      )}
      {...props}
    >
      <div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
        <p className="mt-4 mb-6 text-xs text-muted-foreground">{meta}</p>
      </div>

      <div className="flex flex-col gap-2.5 mt-auto">
        <Button variant="primary" size="md" onClick={onStartSearch} className="w-full">
          {startSearchLabel}
        </Button>
        {onEditFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditFilters}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {editFiltersLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
