import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { homeContent } from "@/content/home"
import { localePath } from "@/lib/i18n"

export function HomeFooter({ locale }: { locale: Locale }) {
  const mainLinks = [
    { label: "Services", path: "/what-we-build" },
    { label: "How it works", path: "/how-it-works" },
    { label: "About", path: "/about" },
    { label: "Work", path: "/work" },
  ]

  return (
    <footer className="w-full border-t border-slate-800 bg-[#070A12] pt-14 text-slate-400 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-slate-800/80 pb-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Link
              aria-label="Syntropic home"
              className="flex w-fit items-center gap-2.5"
              href={localePath(locale, "/")}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 font-display text-xs font-bold text-white">
                S
              </span>
              <span className="font-display text-lg font-bold text-white">Syntropic</span>
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-slate-500">
              {homeContent.footer.description}
            </p>
          </div>
          <nav
            aria-label="Main footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
          >
            {mainLinks.map((link) => (
              <Link
                className="font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                href={localePath(locale, link.path)}
                key={link.path}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-[var(--site-burnt-orange)] px-4 py-2.5 text-sm font-semibold text-[var(--site-ink)] transition-colors hover:border-blue-500 hover:bg-[var(--site-burnt-orange)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            href={localePath(locale, "/contact")}
          >
            {homeContent.labels.bookCall}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="flex flex-col gap-5 py-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed text-slate-500">{homeContent.footer.boundary}</p>
          <nav aria-label="Policy links" className="flex flex-wrap gap-x-5 gap-y-3">
            {homeContent.footer.links.map((link) => (
              <Link
                className="transition-colors hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                href={localePath(locale, link.path)}
                key={link.path}
              >
                {link.pending
                  ? `${link.label} (${homeContent.labels.pendingLegalReview})`
                  : link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
