import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, disabled, placeholder = "Search...", ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0)

    return (
      <div className="relative flex w-full items-center">
        <Search
          className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "flex h-9 w-full rounded-lg border border-border bg-card pl-9 pr-8 text-sm text-foreground transition-colors",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            aria-label="Clear search"
            className="absolute right-2.5 flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = "SearchInput"
