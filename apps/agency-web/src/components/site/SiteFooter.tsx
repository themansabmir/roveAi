import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { footerNav, primaryCta } from "@/components/site/nav"
import { Wordmark } from "@/components/site/Wordmark"

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-ink text-ink-muted">
      <div className="rv-container grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="space-y-5 lg:col-span-5">
          <Wordmark locale={locale} tone="light" />
          <p className="max-w-sm text-sm leading-relaxed">
            Outbound systems, CRM automation and revenue operations for B2B teams that sell through
            a sales team.
          </p>
          <Link className="rv-btn-on-dark" href={localePath(locale, primaryCta.path)}>
            {primaryCta.label}
          </Link>
        </div>
        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      className="transition-colors hover:text-white"
                      href={localePath(locale, link.path)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-ink-line">
        <div className="rv-container flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Syntropic</p>
        </div>
      </div>
    </footer>
  )
}
