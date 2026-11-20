import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export type NoteTag = "Observed" | "AI suggestion"

export interface NoteItemProps extends React.HTMLAttributes<HTMLDivElement> {
  tag: NoteTag
  content: string
  date?: string
  author?: string
}

export function NoteItem({ tag, content, date, author, className, ...props }: NoteItemProps) {
  const isAi = tag === "AI suggestion"

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-3.5 space-y-2 text-xs transition-colors",
        isAi && "border-primary/20 bg-primary/5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
            isAi
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {isAi && <Sparkles className="size-2.5 shrink-0" aria-hidden="true" />}
          <span>{tag}</span>
        </span>

        {(date || author) && (
          <span className="text-[11px] text-muted-foreground">
            {author && `${author} · `}
            {date}
          </span>
        )}
      </div>

      <p className="text-foreground leading-relaxed">{content}</p>
    </div>
  )
}
