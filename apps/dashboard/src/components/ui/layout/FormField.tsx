import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  htmlFor?: string
  required?: boolean
  description?: string
  error?: string
}

export function FormField({
  label,
  htmlFor,
  required = false,
  description,
  error,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full text-xs", className)} {...props}>
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="font-medium text-foreground select-none">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      </div>

      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}

      {children}

      {error && <p className="text-[11px] text-destructive leading-tight">{error}</p>}
    </div>
  )
}
