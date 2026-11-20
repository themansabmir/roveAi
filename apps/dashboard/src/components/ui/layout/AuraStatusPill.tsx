import * as React from "react"
import { ChevronDown, Pause, Play, Sparkles } from "lucide-react"
import { Button } from "../base/Button"
import { cn } from "@rove/ui/lib/cn"

export interface AuraStatusPillProps {
  status: "ready" | "working"
  activeTaskName?: string
  progress?: { current: number; total: number }
  onPause?: () => void
  onResume?: () => void
  onViewDetails?: () => void
  className?: string
}

export function AuraStatusPill({
  status,
  activeTaskName = "Enriching local leads",
  progress,
  onPause,
  onResume,
  onViewDetails,
  className,
}: AuraStatusPillProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isWorking = status === "working"

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const percentage =
    progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : undefined

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors shadow-xs select-none",
          "hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        )}
      >
        <span className="relative flex size-2 items-center justify-center">
          {isWorking ? (
            <>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </>
          ) : (
            <span className="size-1.5 rounded-full bg-primary" />
          )}
        </span>

        <span>{isWorking ? "Aura working…" : "Aura ready"}</span>

        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expanded status card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Aura activity details"
          className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-lg animate-in fade-in-0 zoom-in-95 text-xs text-foreground"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
                A
              </div>
              <span className="font-semibold">
                {isWorking ? "Active Workflow" : "Assistant Idle"}
              </span>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                isWorking
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {isWorking ? "Running" : "Standby"}
            </span>
          </div>

          <div className="py-3 space-y-2">
            <p className="font-medium text-foreground">{activeTaskName}</p>
            {progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Progress</span>
                  <span className="tabular-nums">
                    {progress.current} of {progress.total} items ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            {isWorking ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPause}
                leftIcon={<Pause className="size-3" />}
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResume}
                leftIcon={<Play className="size-3" />}
              >
                Start
              </Button>
            )}
            <Button
              variant="link"
              size="sm"
              onClick={onViewDetails}
              rightIcon={<Sparkles className="size-3" />}
            >
              Task Details
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
