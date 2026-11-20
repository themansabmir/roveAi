import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current

          return (
            <li key={`breadcrumb-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium",
                    isLast ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <span aria-hidden="true">{separator}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
