import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@rove/ui/lib/cn"

export interface ContactRowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  label: string
  value: string
  tag?: string
  href?: string
}

export function ContactRow({
  icon,
  label,
  value,
  tag = "Listed on website",
  href,
  className,
  ...props
}: ContactRowProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border bg-card text-xs transition-colors hover:bg-secondary/40",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-muted-foreground">{label}</span>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors truncate"
            >
              {value}
            </a>
          ) : (
            <span className="font-medium text-foreground truncate">{value}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {tag && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground select-none">
            {tag}
          </span>
        )}

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}
