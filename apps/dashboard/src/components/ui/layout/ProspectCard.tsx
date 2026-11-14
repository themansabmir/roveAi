import * as React from "react"
import { MapPin, Star } from "lucide-react"
import { Checkbox } from "../base/Checkbox"
import { StatusBadge, type StatusBadgeType } from "../base/Badge"
import { Button } from "../base/Button"
import { cn } from "@rove/ui/lib/cn"

export interface ProspectCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: string | number
  name: string
  company: string
  location: string
  rating?: number
  reviewsCount?: number
  status?: StatusBadgeType
  creditsCost?: number
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  onInspect?: () => void
}

export function ProspectCard({
  id: cardId,
  name,
  company,
  location,
  rating,
  reviewsCount,
  status = "completed",
  creditsCost,
  checked = false,
  onCheckedChange,
  onInspect,
  className,
  ...props
}: ProspectCardProps) {
  return (
    <div
      id={String(cardId)}
      className={cn(
        "flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs text-xs text-foreground transition-colors",
        checked && "border-primary bg-secondary/30",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {onCheckedChange && (
            <div className="pt-0.5">
              <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm truncate leading-tight">
              {company}
            </h4>
            <p className="text-muted-foreground truncate mt-0.5">{name}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground text-[11px]">
        <div className="flex items-center gap-1">
          <MapPin className="size-3 text-muted-foreground shrink-0" />
          <span>{location}</span>
        </div>

        {rating !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="size-3 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            {reviewsCount !== undefined && <span>({reviewsCount})</span>}
          </div>
        )}

        {creditsCost !== undefined && (
          <span className="ml-auto tabular-nums font-medium text-foreground">{creditsCost} cr</span>
        )}
      </div>

      {onInspect && (
        <div className="mt-4 pt-3 border-t border-border flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onInspect}
            className="text-primary hover:text-primary"
          >
            Inspect Profile
          </Button>
        </div>
      )}
    </div>
  )
}
