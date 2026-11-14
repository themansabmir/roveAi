import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "flex h-9 w-full rounded-lg border bg-card px-3 text-sm text-foreground transition-colors",
            "border-border placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            error && "border-destructive focus:border-destructive",
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"
