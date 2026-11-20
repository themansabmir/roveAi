import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  leftSlot?: React.ReactNode
  centerSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export function TopBar({ leftSlot, centerSlot, rightSlot, className, ...props }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-14 w-full items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 text-xs text-foreground",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">{leftSlot}</div>

      {centerSlot && (
        <div className="flex items-center justify-center min-w-0 flex-1 max-w-md mx-4">
          {centerSlot}
        </div>
      )}

      <div className="flex items-center gap-3 shrink-0 ml-auto">{rightSlot}</div>
    </header>
  )
}
