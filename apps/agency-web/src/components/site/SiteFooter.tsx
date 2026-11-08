import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"

const links = [
  { label: "Services", path: "/what-we-build" },
  { label: "How it works", path: "/how-it-works" },
  { label: "About", path: "/about" },
  { label: "FAQ", path: "/how-it-works#faq-section" },
  { label: "Contact", path: "/contact" },
]

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-slate-800 bg-[#070A12] text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link className="flex items-center gap-2.5" href={localePath(locale, "/")}>
          <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 font-display text-xs font-bold text-white">
            S
          </span>
          <span className="font-display text-base font-bold text-white">Syntropic</span>
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map(({ label, path }) => (
            <Link
              className="transition-colors hover:text-white"
              href={localePath(locale, path)}
              key={path}
            >
              {label}
            </Link>
          ))}
          <Link className="transition-colors hover:text-white" href={localePath(locale, "/policy")}>
            Policies and outbound standards
          </Link>
        </nav>
      </div>
    </footer>
  )
}
