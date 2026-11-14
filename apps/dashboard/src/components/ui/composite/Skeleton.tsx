import * as React from "react"
import { cn } from "@rove/ui/lib/cn"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text"
}

export function Skeleton({ className, variant = "rectangle", ...props }: SkeletonProps) {
  const variantStyles = {
    rectangle: "rounded-md",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  }[variant]

  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse bg-secondary/80", variantStyles, className)}
      {...props}
    />
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-3.5 py-3">
          <Skeleton variant="text" className={idx === 0 ? "w-36" : "w-20"} />
        </td>
      ))}
    </tr>
  )
}
