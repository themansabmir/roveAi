import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"

const links = [
  { label: "Services", path: "/what-we-build" },
  { label: "How it works", path: "/how-it-works" },
  { label: "About", path: "/about" },
]

export function SiteHeader({
  locale,
  faqHref,
  showFaq = true,
  ctaLabel = "Get started",
}: {
  locale: Locale
  faqHref?: string
  showFaq?: boolean
  ctaLabel?: string
}) {
  const resolvedFaqHref = faqHref ?? localePath(locale, "/how-it-works#faq-section")

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-[#FAFAFD]/95 text-slate-900 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link className="flex shrink-0 items-center gap-2.5" href={localePath(locale, "/")}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-display text-sm font-bold text-white">
            S
          </span>
          <span className="font-display text-base font-bold tracking-tight">Syntropic</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm md:flex">
          {links.map(({ label, path }) => (
            <Link
              className="font-medium text-slate-600 transition-colors hover:text-slate-950"
              href={localePath(locale, path)}
              key={path}
            >
              {label}
            </Link>
          ))}
          {showFaq && (
            <Link
              className="font-medium text-slate-600 transition-colors hover:text-slate-950"
              href={resolvedFaqHref}
            >
              FAQ
            </Link>
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            className="inline-flex items-center rounded-full bg-[var(--site-burnt-orange)] px-4 py-2 text-sm font-semibold text-[var(--site-ink)] transition-colors hover:bg-[var(--site-burnt-orange)]"
            href={localePath(locale, "/contact")}
          >
            {ctaLabel}
          </Link>
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-12 flex min-w-48 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg"
            >
              {links.map(({ label, path }) => (
                <Link
                  className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
                  href={localePath(locale, path)}
                  key={path}
                >
                  {label}
                </Link>
              ))}
              {showFaq && (
                <Link
                  className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
                  href={resolvedFaqHref}
                >
                  FAQ
                </Link>
              )}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
