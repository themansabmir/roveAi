import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export interface AuraAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  isWorking?: boolean
}

export function AuraAvatar({
  size = "md",
  isWorking = false,
  className,
  ...props
}: AuraAvatarProps) {
  const sizeStyles = {
    sm: "size-6 text-xs",
    md: "size-8 text-sm",
    lg: "size-10 text-base",
  }[size]

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      {...props}
    >
      {isWorking && (
        <span
          className="absolute inset-0 rounded-full bg-primary/30 animate-ping"
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center select-none shadow-xs",
          sizeStyles,
        )}
      >
        A
      </div>
    </div>
  )
}
