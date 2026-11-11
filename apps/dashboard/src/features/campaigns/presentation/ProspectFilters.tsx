import { Search, X, Bookmark, Archive } from "lucide-react"
import { Input } from "@rove/ui/components/input"
import { Button } from "@rove/ui/components/button"
import type { TagItem } from "@/features/campaigns/domain/campaign"

export type ViewTab = "all" | "qualified" | "researched" | "contacted" | "saved" | "archived"
export type ScoreFilter = "all" | "high" | "medium" | "low"

export interface ProspectFiltersState {
  search: string
  viewTab: ViewTab
  scoreFilter: ScoreFilter
  selectedTagId: string | null
}

export function ProspectFilters({
  state,
  onChange,
  counts,
  availableTags,
}: {
  state: ProspectFiltersState
  onChange: (patch: Partial<ProspectFiltersState>) => void
  counts: {
    all: number
    qualified: number
    researched: number
    contacted: number
    saved: number
    archived: number
  }
  availableTags: TagItem[]
}) {
  const isFiltered =
    Boolean(state.search) ||
    state.viewTab !== "all" ||
    state.scoreFilter !== "all" ||
    state.selectedTagId != null

  return (
    <div className="space-y-3">
      {/* View Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <FilterTab
          active={state.viewTab === "all"}
          onClick={() => onChange({ viewTab: "all" })}
        >
          All ({counts.all})
        </FilterTab>
        <FilterTab
          active={state.viewTab === "qualified"}
          onClick={() => onChange({ viewTab: "qualified" })}
        >
          Qualified ({counts.qualified})
        </FilterTab>
        <FilterTab
          active={state.viewTab === "researched"}
          onClick={() => onChange({ viewTab: "researched" })}
        >
          Researched ({counts.researched})
        </FilterTab>
        <FilterTab
          active={state.viewTab === "contacted"}
          onClick={() => onChange({ viewTab: "contacted" })}
        >
          Contacted ({counts.contacted})
        </FilterTab>
        <FilterTab
          active={state.viewTab === "saved"}
          onClick={() => onChange({ viewTab: "saved" })}
          icon={<Bookmark className="size-3.5" />}
        >
          Saved ({counts.saved})
        </FilterTab>
        <FilterTab
          active={state.viewTab === "archived"}
          onClick={() => onChange({ viewTab: "archived" })}
          icon={<Archive className="size-3.5" />}
        >
          Archived ({counts.archived})
        </FilterTab>
      </div>

      {/* Search & Granular Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={state.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search business, city, or website..."
            className="pl-9 text-sm"
          />
        </div>

        {/* Score Tier Filter */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Score:</span>
          <select
            value={state.scoreFilter}
            onChange={(e) => onChange({ scoreFilter: e.target.value as ScoreFilter })}
            className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All scores</option>
            <option value="high">High (75+)</option>
            <option value="medium">Medium (55–74)</option>
            <option value="low">Low (&lt;55)</option>
          </select>
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Tag:</span>
            <select
              value={state.selectedTagId ?? ""}
              onChange={(e) => onChange({ selectedTagId: e.target.value || null })}
              className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                search: "",
                viewTab: "all",
                scoreFilter: "all",
                selectedTagId: null,
              })
            }
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 size-3.5" />
            Reset filters
          </Button>
        )}
      </div>
    </div>
  )
}

function FilterTab({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border border-primary bg-primary text-primary-foreground shadow-sm"
          : "border border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  )
}

