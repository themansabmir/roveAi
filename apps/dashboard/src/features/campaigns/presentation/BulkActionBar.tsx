import { useState } from "react"
import { CheckSquare, Download, Bookmark, Archive, X } from "lucide-react"
import { Button } from "@rove/ui/components/button"
import type { ProspectStatus, TagItem } from "@/features/campaigns/domain/campaign"

export function BulkActionBar({
  selectedCount,
  onClear,
  onUpdateStatus,
  onToggleSave,
  onToggleArchive,
  onAddTag,
  onExportSelected,
  availableTags,
  isPending,
}: {
  selectedCount: number
  onClear: () => void
  onUpdateStatus: (status: ProspectStatus) => void
  onToggleSave: (save: boolean) => void
  onToggleArchive: (archive: boolean) => void
  onAddTag: (tagId: string) => void
  onExportSelected: () => void
  availableTags: TagItem[]
  isPending: boolean
}) {
  const [selectedTag, setSelectedTag] = useState("")

  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-xl border border-border bg-card/95 px-5 py-3 shadow-2xl backdrop-blur-md transition-all">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2 border-r pr-3">
          <CheckSquare className="size-4 text-primary" />
          <span className="font-semibold tabular-nums">{selectedCount}</span>
          <span className="text-muted-foreground text-xs">selected</span>
        </div>

        {/* Change Status Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            disabled={isPending}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onUpdateStatus(e.target.value as ProspectStatus)
                e.target.value = ""
              }
            }}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium shadow-sm hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="" disabled>
              Set status...
            </option>
            <option value="NEW">New</option>
            <option value="RESEARCHED">Researched</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONTACTED">Contacted</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>

        {/* Apply Tag */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-1">
            <select
              disabled={isPending}
              value={selectedTag}
              onChange={(e) => {
                if (e.target.value) {
                  onAddTag(e.target.value)
                  setSelectedTag("")
                }
              }}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium shadow-sm hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="" disabled>
                Add tag...
              </option>
              {availableTags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Toggles */}
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => onToggleSave(true)}
          className="h-8 gap-1 px-2.5 text-xs"
        >
          <Bookmark className="size-3.5 text-amber-500" />
          Save
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => onToggleArchive(true)}
          className="h-8 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Archive className="size-3.5" />
          Archive
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={onExportSelected}
          className="h-8 gap-1 px-2.5 text-xs font-medium text-primary hover:text-primary"
        >
          <Download className="size-3.5" />
          Export CSV
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
