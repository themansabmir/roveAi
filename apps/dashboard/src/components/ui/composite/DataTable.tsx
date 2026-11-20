import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Checkbox } from "../base/Checkbox"
import { Pagination } from "./Pagination"
import { TableRowSkeleton } from "./Skeleton"
import { cn } from "@rove/ui/lib/cn"

export interface Column<T> {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  sortable?: boolean
  align?: "left" | "center" | "right"
  width?: string
}

export interface DataTableProps<T extends { id: string | number }> {
  data: T[]
  columns: Column<T>[]
  selectable?: boolean
  selectedIds?: (string | number)[]
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  sortKey?: string
  sortDirection?: "asc" | "desc"
  onSort?: (key: string) => void
  isLoading?: boolean
  emptyMessage?: React.ReactNode
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems?: number
    pageSize?: number
  }
  className?: string
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sortKey,
  sortDirection,
  onSort,
  isLoading = false,
  emptyMessage = "No records found",
  pagination,
  className,
}: DataTableProps<T>) {
  // Master checkbox logic
  const isAllSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id))
  const isSomeSelected = data.some((item) => selectedIds.includes(item.id)) && !isAllSelected

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      const allIds = Array.from(new Set([...selectedIds, ...data.map((item) => item.id)]))
      onSelectionChange(allIds)
    } else {
      const pageIds = new Set(data.map((item) => item.id))
      onSelectionChange(selectedIds.filter((id) => !pageIds.has(id)))
    }
  }

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter((item) => item !== id))
    }
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Header */}
            <thead className="bg-[#FAFAF8] border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
              <tr>
                {selectable && (
                  <th className="w-10 px-3.5 py-2.5">
                    <Checkbox
                      checked={isSomeSelected ? "indeterminate" : isAllSelected}
                      onCheckedChange={handleSelectAll}
                      ariaLabel="Select all rows"
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const isSorted = sortKey === col.key
                  const canSort = col.sortable && onSort

                  return (
                    <th
                      key={col.key}
                      style={{ width: col.width }}
                      onClick={() => canSort && onSort(col.key)}
                      className={cn(
                        "px-3.5 py-2.5 whitespace-nowrap",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        canSort && "cursor-pointer hover:text-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          col.align === "right" && "justify-end",
                          col.align === "center" && "justify-center",
                        )}
                      >
                        <span>{col.header}</span>
                        {canSort && (
                          <span className="text-muted-foreground">
                            {isSorted ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="size-3 text-foreground" />
                              ) : (
                                <ArrowDown className="size-3 text-foreground" />
                              )
                            ) : (
                              <ArrowUpDown className="size-3 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border text-[13px] text-foreground">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton
                    key={`skeleton-${i}`}
                    columns={columns.length + (selectable ? 1 : 0)}
                  />
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => {
                  const isSelected = selectedIds.includes(row.id)

                  return (
                    <tr
                      key={String(row.id)}
                      className={cn(
                        "transition-colors group",
                        isSelected
                          ? "bg-secondary/70 border-l-2 border-l-primary"
                          : "hover:bg-secondary/50",
                      )}
                    >
                      {selectable && (
                        <td className="w-10 px-3.5 py-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                            ariaLabel={`Select row ${row.id}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-3.5 py-3",
                            col.align === "right" && "text-right tabular-nums",
                            col.align === "center" && "text-center",
                          )}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
        />
      )}
    </div>
  )
}
