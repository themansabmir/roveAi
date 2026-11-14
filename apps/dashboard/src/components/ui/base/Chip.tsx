import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  removable?: boolean
  disabled?: boolean
  onRemove?: (event: React.MouseEvent) => void
  leftIcon?: React.ReactNode
}

export function Chip({
  className,
  selected = false,
  removable = false,
  disabled = false,
  onRemove,
  onClick,
  leftIcon,
  children,
  ...props
}: ChipProps) {
  const isClickable = Boolean(onClick) && !disabled

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onRemove?.(e)
    }
  }

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors select-none",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground hover:bg-secondary",
        isClickable &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          aria-label="Remove chip"
          className={cn(
            "ml-0.5 -mr-1 flex size-4 items-center justify-center rounded-full transition-colors",
            selected
              ? "text-background/80 hover:bg-background/20 hover:text-background"
              : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
          )}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
