"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useState } from "react"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { primaryCta, primaryNav } from "@/components/site/nav"
import { Wordmark } from "@/components/site/Wordmark"

export function SiteHeader({
  locale,
  ctaLabel = primaryCta.label,
}: {
  locale: Locale
  /** Accepted for backwards compatibility with existing page modules. */
  faqHref?: string
  showFaq?: boolean
  ctaLabel?: string
}) {
  const pathname = usePathname()
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const isActive = (path: string) => {
    const href = localePath(locale, path)
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || open
            ? "border-b border-line bg-paper/90 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset] backdrop-blur-md"
            : "border-b border-transparent bg-paper/0"
        }`}
      >
        <div className="rv-container flex h-16 items-center justify-between gap-6">
          <Wordmark locale={locale} />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {primaryNav.map(({ label, path }) => {
              const active = isActive(path)
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-ink" : "text-quiet hover:text-ink"
                  }`}
                  href={localePath(locale, path)}
                  key={path}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px h-px origin-left bg-brand transition-transform duration-300 ease-out ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className="rv-btn-primary hidden min-h-10 px-4 sm:inline-flex"
              href={localePath(locale, primaryCta.path)}
            >
              {ctaLabel}
            </Link>
            <button
              aria-controls={panelId}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-11 w-11 place-items-center rounded-md border border-line bg-surface md:!hidden"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ease-out ${
                  open ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ease-out ${
                  open ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-paper transition-[opacity,visibility] duration-300 md:!hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id={panelId}
      >
        <nav aria-label="Mobile" className="rv-container flex h-full flex-col pb-8 pt-6">
          <ul className="divide-y divide-line border-y border-line">
            {primaryNav.map(({ label, path }, index) => (
              <li
                className={`transition-[opacity,transform] duration-500 ease-out ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                key={path}
                style={{ transitionDelay: open ? `${60 + index * 40}ms` : "0ms" }}
              >
                <Link
                  aria-current={isActive(path) ? "page" : undefined}
                  className="rv-heading flex items-center justify-between py-5 text-3xl"
                  href={localePath(locale, path)}
                  onClick={() => setOpen(false)}
                >
                  {label}
                  {isActive(path) && (
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="rv-btn-primary mt-auto w-full"
            href={localePath(locale, primaryCta.path)}
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </Link>
        </nav>
      </div>
    </>
  )
}
