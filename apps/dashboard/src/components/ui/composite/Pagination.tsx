import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../base/Button"
import { cn } from "@rove/ui/lib/cn"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  siblingCount?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  // Generate page numbers array with ellipses
  const pages = React.useMemo(() => {
    const range = (start: number, end: number) => {
      const length = end - start + 1
      return Array.from({ length }, (_, idx) => idx + start)
    }

    const totalPageNumbers = siblingCount * 2 + 5

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, "...", totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [firstPageIndex, "...", ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex]
    }

    return range(1, totalPages)
  }, [totalPages, siblingCount, currentPage])

  if (totalPages <= 1 && totalItems === undefined) {
    return null
  }

  const startItem =
    totalItems !== undefined && pageSize ? (currentPage - 1) * pageSize + 1 : undefined
  const endItem =
    totalItems !== undefined && pageSize ? Math.min(currentPage * pageSize, totalItems) : undefined

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn("flex flex-wrap items-center justify-between gap-4 py-2 text-xs", className)}
      {...props}
    >
      {/* Item range summary */}
      {totalItems !== undefined && (
        <span className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">{totalItems}</span> results
        </span>
      )}

      {/* Page controls */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="h-8 px-2.5"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex size-8 items-center justify-center text-muted-foreground select-none"
                >
                  …
                </span>
              )
            }

            const pageNumber = page as number
            const isCurrent = pageNumber === currentPage

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md text-xs font-medium transition-colors select-none",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  isCurrent
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="h-8 px-2.5"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
