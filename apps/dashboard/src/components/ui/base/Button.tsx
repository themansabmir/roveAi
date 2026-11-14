import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-none border-transparent",
      secondary:
        "bg-card text-foreground border border-border hover:bg-secondary active:bg-secondary/80 shadow-none",
      ghost:
        "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary active:bg-secondary/80 border-transparent",
      link: "bg-transparent text-primary underline-offset-4 hover:underline border-transparent p-0 h-auto",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 border-transparent shadow-none",
    }[variant]

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-9 px-4 text-sm rounded-lg gap-2",
      lg: "h-10 px-5 text-sm rounded-lg gap-2.5",
      icon: "h-9 w-9 p-0 rounded-lg shrink-0",
    }[size]

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  },
)

Button.displayName = "Button"
