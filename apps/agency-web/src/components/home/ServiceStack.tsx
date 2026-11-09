"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { revenueStages, services } from "@/content/revops"

const STICKY_TOP = 112
const STACK_OFFSET = 22

function StageRail({ covered }: { covered: readonly string[] }) {
  return (
    <ol aria-label="Stages covered" className="grid grid-cols-6 gap-1.5">
      {revenueStages.map((stage) => {
        const on = covered.includes(stage.id)
        return (
          <li key={stage.id}>
            <span
              className={`block h-1 rounded-full ${on ? "bg-brand" : "bg-line"}`}
              aria-hidden="true"
            />
            <span
              className={`mt-2 block truncate text-[11px] font-medium ${on ? "text-ink" : "text-quiet/60"}`}
            >
              {stage.name}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function ServiceStack({ locale }: { locale: Locale }) {
  const contactHref = localePath(locale, "/contact")
  const serviceHref = (slug: string) => localePath(locale, `/services/${slug}`)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const innerRefs = useRef<(HTMLDivElement | null)[]>([])
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([])
  const items = services.items

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0

    const update = () => {
      frame = 0
      const cards = cardRefs.current
      // How far each card has slid over the previous one (0..1).
      const arrival = cards.map((card, j) => {
        if (j === 0 || !card) return 1
        const prev = cards[j - 1]
        const height = prev?.offsetHeight || 1
        const top = card.getBoundingClientRect().top
        return Math.min(1, Math.max(0, 1 - (top - (STICKY_TOP + j * STACK_OFFSET)) / height))
      })

      const animate = desktop.matches && !reduced.matches
      innerRefs.current.forEach((inner, i) => {
        if (!inner) return
        const depth = animate ? arrival.slice(i + 1).reduce((sum, value) => sum + value, 0) : 0
        inner.style.transform = depth ? `scale(${1 - depth * 0.05})` : ""
        inner.style.setProperty("--rv-dim", String(Math.min(depth * 0.55, 0.7)))
      })

      let next = 0
      arrival.forEach((value, j) => {
        if (value >= 0.5) next = j
      })
      if (next !== activeRef.current) {
        activeRef.current = next
        setActive(next)
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  const goTo = (index: number) => {
    const marker = markerRefs.current[index]
    if (!marker) return
    const offset = window.matchMedia("(min-width: 1024px)").matches
      ? STICKY_TOP + index * STACK_OFFSET
      : 96
    window.scrollTo({
      top: marker.getBoundingClientRect().top + window.scrollY - offset + 2,
      behavior: "smooth",
    })
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Left: sticky intro and tabs */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h2 className="rv-heading text-4xl sm:text-5xl" id="services-heading">
            {services.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-quiet">{services.description}</p>

          <div
            aria-label="Services"
            className="relative mt-10 hidden border-l border-line lg:block"
            role="tablist"
            aria-orientation="vertical"
          >
            <span
              aria-hidden="true"
              className="absolute -left-px top-0 w-0.5 bg-brand transition-transform duration-500 ease-out"
              style={{
                height: `${100 / items.length}%`,
                transform: `translateY(${active * 100}%)`,
              }}
            />
            {items.map((item, index) => {
              const selected = index === active
              const first = revenueStages.find((s) => s.id === item.stages[0])?.name
              const last = revenueStages.find(
                (s) => s.id === item.stages[item.stages.length - 1],
              )?.name
              return (
                <button
                  aria-controls={`service-${item.id}`}
                  aria-selected={selected}
                  className="group block w-full py-3 pl-6 text-left"
                  key={item.id}
                  onClick={() => goTo(index)}
                  role="tab"
                  type="button"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      className={`font-mono text-xs transition-colors duration-300 ${selected ? "text-brand" : "text-quiet/60"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`rv-heading text-2xl transition-colors duration-300 ${
                        selected ? "text-ink" : "text-quiet/60 group-hover:text-ink"
                      }`}
                    >
                      {item.name}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block pl-[1.85rem] text-sm transition-colors duration-300 ${selected ? "text-quiet" : "text-quiet/50"}`}
                  >
                    {first} → {last}
                  </span>
                </button>
              )
            })}
          </div>

          <ul className="mt-8 space-y-2.5">
            {services.ownership.map((point) => (
              <li className="flex items-center gap-3 text-[15px]" key={point}>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-brand"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="10" fill="currentColor" fillOpacity="0.12" r="9" />
                  <path
                    d="m6.5 10.2 2.3 2.3 4.7-4.9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: stacked cards */}
      <div className="relative flex flex-col lg:col-span-7 lg:pb-16">
        {items.map((item, index) => (
          <div className="contents" key={item.id}>
            <span
              aria-hidden="true"
              className={`block h-0 ${index > 0 ? "mt-8 lg:mt-24" : ""}`}
              ref={(node) => {
                markerRefs.current[index] = node
              }}
            />
            <article
              aria-labelledby={`service-${item.id}-title`}
              className="lg:sticky"
              id={`service-${item.id}`}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              role="tabpanel"
              style={{ top: STICKY_TOP + index * STACK_OFFSET }}
            >
              <div
                className="relative origin-top overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-[0_30px_70px_-40px_rgb(11_19_36/0.35)] will-change-transform sm:p-10"
                ref={(node) => {
                  innerRefs.current[index] = node
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
                />
                <div className="relative flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-brand">
                    {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand-deep">
                    One-time build
                  </span>
                </div>

                <h3
                  className="rv-heading relative mt-6 text-3xl sm:text-4xl"
                  id={`service-${item.id}-title`}
                >
                  {item.name}
                </h3>
                <p className="relative mt-3 max-w-xl text-lg leading-relaxed text-quiet">
                  {item.promise}
                </p>

                <div className="relative mt-8">
                  <StageRail covered={item.stages} />
                </div>

                <div className="relative mt-8 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold">What we build</h4>
                    <ul className="mt-4 space-y-3">
                      {item.builds.map((build) => (
                        <li className="flex gap-3 text-[15px] leading-snug text-quiet" key={build}>
                          <span
                            aria-hidden="true"
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                          />
                          {build}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rotate-45 rounded-[1px] bg-gate"
                        />
                        Where you decide
                      </h4>
                      <p className="mt-3 text-[15px] leading-snug text-quiet">{item.decide}</p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
                        After handover
                      </h4>
                      <p className="mt-3 text-[15px] leading-snug text-quiet">{item.keeps}</p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link className="rv-btn-secondary" href={serviceHref(item.slug)}>
                    Explore this system
                  </Link>
                  <Link className="rv-link text-sm" href={contactHref}>
                    Discuss this system on a call
                  </Link>
                </div>

                {/* Dims the card as the next one stacks over it. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-paper"
                  style={{ opacity: "var(--rv-dim, 0)" }}
                />
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}
