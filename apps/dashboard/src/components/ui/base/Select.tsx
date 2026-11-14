import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export function Select({
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
  ariaLabel = "Select option",
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : internalValue

  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.value === currentValue)

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setInternalValue(val)
    }
    onChange?.(val)
    setIsOpen(false)
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-colors",
          "focus:outline-none focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !selectedOption && "text-muted-foreground",
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card p-1 shadow-xs"
        >
          {options.map((option) => {
            const isSelected = option.value === currentValue
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (!option.disabled) {
                    handleSelect(option.value)
                  }
                }}
                className={cn(
                  "relative flex cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  option.disabled
                    ? "cursor-not-allowed opacity-50"
                    : isSelected
                      ? "bg-secondary font-medium text-foreground"
                      : "text-foreground hover:bg-secondary/70",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="size-4 text-primary" aria-hidden="true" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
