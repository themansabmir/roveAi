"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState, type FocusEvent } from "react"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { primaryCta, primaryNav } from "@/components/site/nav"
import { Wordmark } from "@/components/site/Wordmark"
import { revenueStages, services } from "@/content/revops"

const stageRange = (stages: readonly string[]) => {
  const names = revenueStages.filter((s) => stages.includes(s.id)).map((s) => s.name)
  return names.length > 1 ? `${names[0]} → ${names[names.length - 1]}` : (names[0] ?? "")
}

function ServicesMenu({ locale, active }: { locale: Locale; active: boolean }) {
  const pathname = usePathname()
  const menuId = useId()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  return (
    <div className="relative" onBlur={onBlur} onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        className={`relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          active || open ? "text-ink" : "text-quiet hover:text-ink"
        }`}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Services
        <svg
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 12 12"
        >
          <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        </svg>
        <span
          aria-hidden="true"
          className={`absolute inset-x-3 -bottom-px h-px origin-left bg-brand transition-transform duration-300 ease-out ${
            active ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full w-[min(46rem,92vw)] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200 ease-out ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
        id={menuId}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_70px_-30px_rgb(11_19_36/0.35)]">
          <ul className="grid gap-1 p-2 sm:grid-cols-3">
            {services.items.map((item, index) => (
              <li key={item.id}>
                <Link
                  className="group flex h-full flex-col rounded-xl p-4 transition-colors hover:bg-paper"
                  href={localePath(locale, `/services/${item.slug}`)}
                  onClick={() => setOpen(false)}
                >
                  <span className="font-mono text-xs text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rv-heading mt-2 text-lg group-hover:text-brand">
                    {item.name}
                  </span>
                  <span className="mt-1.5 text-[13px] leading-snug text-quiet">{item.promise}</span>
                  <span className="mt-auto pt-4 text-xs font-medium text-quiet">
                    {stageRange(item.stages)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper px-5 py-3 text-sm">
            <Link
              className="font-semibold text-ink hover:text-brand"
              href={localePath(locale, "/services")}
              onClick={() => setOpen(false)}
            >
              All services
            </Link>
            <Link
              className="text-quiet hover:text-ink"
              href={localePath(locale, "/contact")}
              onClick={() => setOpen(false)}
            >
              Not sure where to start? Book a review
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

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
              if (path === "/services") {
                return <ServicesMenu active={Boolean(active)} key={path} locale={locale} />
              }
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
        <nav
          aria-label="Mobile"
          className="rv-container flex h-full flex-col overflow-y-auto pb-8 pt-6"
        >
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
                {path === "/services" && (
                  <ul className="-mt-2 space-y-1 pb-4 pl-1">
                    {services.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          className="flex items-center gap-3 py-1.5 text-[17px] text-quiet hover:text-ink"
                          href={localePath(locale, `/services/${item.slug}`)}
                          onClick={() => setOpen(false)}
                        >
                          <span aria-hidden="true" className="h-px w-4 bg-line" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
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
