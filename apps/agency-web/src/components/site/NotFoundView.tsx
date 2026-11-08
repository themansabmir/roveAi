import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { primaryNav } from "@/components/site/nav"

export function NotFoundView({ locale }: { locale: Locale }) {
  return (
    <main className="rv-container py-24 sm:py-32">
      <p className="font-mono text-sm text-quiet">404</p>
      <h1 className="rv-display mt-4 max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)]">
        This page isn&apos;t on the revenue line.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-quiet">
        The link may be out of date, or the page has moved. Try one of these instead.
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        <li>
          <Link className="rv-btn-primary" href={localePath(locale, "/")}>
            Go to the homepage
          </Link>
        </li>
        {primaryNav.map((link) => (
          <li key={link.path}>
            <Link className="rv-btn-secondary" href={localePath(locale, link.path)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
