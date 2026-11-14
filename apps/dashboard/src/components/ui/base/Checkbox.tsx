import * as React from "react"
import { Check, Minus } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface CheckboxProps {
  id?: string
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  className?: string
  ariaLabel?: string
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      id,
      checked = false,
      onCheckedChange,
      disabled = false,
      label,
      description,
      className,
      ariaLabel,
    },
    ref,
  ) => {
    const isChecked = checked === true
    const isIndeterminate = checked === "indeterminate"

    const handleClick = () => {
      if (!disabled) {
        onCheckedChange?.(!isChecked)
      }
    }

    return (
      <div className={cn("inline-flex items-start gap-2.5", className)}>
        <button
          ref={ref}
          id={id}
          type="button"
          role="checkbox"
          aria-checked={isIndeterminate ? "mixed" : isChecked}
          aria-label={ariaLabel || label}
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded border transition-colors select-none",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isChecked || isIndeterminate
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-foreground/40",
            disabled && "cursor-not-allowed opacity-50 bg-muted",
          )}
        >
          {isChecked && <Check className="size-3 stroke-[3]" aria-hidden="true" />}
          {isIndeterminate && <Minus className="size-3 stroke-[3]" aria-hidden="true" />}
        </button>

        {label && (
          <label
            htmlFor={id}
            onClick={handleClick}
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

Checkbox.displayName = "Checkbox"
