import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export interface ToggleProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  size?: "sm" | "md"
  className?: string
  ariaLabel?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      id,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      label,
      description,
      size = "md",
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : internalChecked

    const handleToggle = () => {
      if (disabled) return
      const next = !isChecked
      if (!isControlled) {
        setInternalChecked(next)
      }
      onCheckedChange?.(next)
    }

    const trackSizes = {
      sm: "h-4 w-7",
      md: "h-5 w-9",
    }[size]

    const thumbSizes = {
      sm: "size-3 translate-x-0.5 data-[state=checked]:translate-x-3.5",
      md: "size-4 translate-x-0.5 data-[state=checked]:translate-x-4",
    }[size]

    return (
      <div className={cn("inline-flex items-center gap-2.5", className)}>
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-label={ariaLabel || label}
          disabled={disabled}
          onClick={handleToggle}
          data-state={isChecked ? "checked" : "unchecked"}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isChecked ? "bg-primary" : "border border-border bg-secondary",
            disabled && "cursor-not-allowed opacity-50",
            trackSizes,
          )}
        >
          <span
            data-state={isChecked ? "checked" : "unchecked"}
            className={cn(
              "pointer-events-none block rounded-full bg-card shadow-xs transition-transform duration-200",
              thumbSizes,
            )}
          />
        </button>

        {label && (
          <label
            htmlFor={id}
            onClick={handleToggle}
            className={cn(
              "flex flex-col text-xs leading-4 select-none",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
          >
            <span className="font-medium text-foreground">{label}</span>
            {description && <span className="text-muted-foreground">{description}</span>}
          </label>
        )}
      </div>
    )
  },
)

Toggle.displayName = "Toggle"
