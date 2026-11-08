import Link from "next/link"
import type { ReactNode } from "react"

export function PageIntro({
  title,
  description,
  crumb,
  children,
}: {
  title: string
  description?: string
  crumb?: { label: string; href: string }
  children?: ReactNode
}) {
  return (
    <header className="border-b border-line">
      <div className="rv-container rv-intro pb-14 pt-14 sm:pt-20">
        {crumb && (
          <Link className="text-sm font-medium text-quiet hover:text-ink" href={crumb.href}>
            <span aria-hidden="true">←</span> {crumb.label}
          </Link>
        )}
        <h1 className="rv-display mt-5 max-w-[18ch] text-[clamp(2.5rem,6vw,4.75rem)]">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-quiet sm:text-xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: { label: string; href: string }
}) {
  return (
    <div className="rounded-[14px] border border-dashed border-line bg-surface p-8 sm:p-12">
      <h2 className="rv-heading text-2xl">{title}</h2>
      <p className="mt-3 max-w-lg text-quiet">{description}</p>
      <Link className="rv-btn-primary mt-6" href={action.href}>
        {action.label}
      </Link>
    </div>
  )
}
