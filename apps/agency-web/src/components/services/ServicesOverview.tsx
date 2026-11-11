"use client"

import Link from "next/link"
import { useState } from "react"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { revenueStages, services } from "@/content/revops"

const stageIndex = (id: string) => revenueStages.findIndex((stage) => stage.id === id)

/** Gantt-style map: the six stages across the top, each service as a bar spanning its stages. */
export function ServicesMap({ locale }: { locale: Locale }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const highlighted = services.items.find((item) => item.id === hovered)
  const lit = new Set<string>(highlighted?.stages ?? [])

  return (
    <div className="rounded-3xl border border-line bg-surface p-4 shadow-[0_30px_70px_-45px_rgb(11_19_36/0.35)] sm:p-8">
      <ol className="hidden grid-cols-6 gap-2 md:grid">
        {revenueStages.map((stage, index) => (
          <li
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-300 ${
              lit.has(stage.id) ? "bg-ink text-white" : "bg-paper text-quiet"
            }`}
            key={stage.id}
          >
            <span className="block font-mono text-[11px] opacity-60">
              {String(index + 1).padStart(2, "0")}
            </span>
            {stage.name}
          </li>
        ))}
      </ol>

      <ul className="space-y-3 md:mt-4 md:grid md:grid-cols-6 md:gap-2 md:space-y-0">
        {services.items.map((item) => {
          const start = stageIndex(item.stages[0]!)
          const end = stageIndex(item.stages[item.stages.length - 1]!)
          const dimmed = hovered !== null && hovered !== item.id
          return (
            <li
              className="md:col-[var(--from)/var(--to)]"
              key={item.id}
              style={{ ["--from" as string]: start + 1, ["--to" as string]: end + 2 }}
            >
              <Link
                className={`group relative flex h-full items-center justify-between gap-4 overflow-hidden rounded-xl border px-5 py-4 transition-[opacity,border-color,background-color,transform] duration-300 ${
                  dimmed ? "opacity-40" : "opacity-100"
                } ${
                  hovered === item.id
                    ? "border-brand bg-brand text-white"
                    : "border-brand/25 bg-brand-tint text-ink hover:-translate-y-0.5"
                }`}
                href={localePath(locale, `/services/${item.slug}`)}
                onBlur={() => setHovered(null)}
                onFocus={() => setHovered(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span>
                  <span className="rv-heading block text-lg">{item.name}</span>
                  <span
                    className={`mt-0.5 block text-xs font-medium md:hidden ${
                      hovered === item.id ? "text-white/80" : "text-quiet"
                    }`}
                  >
                    {item.stages
                      .map((id) => revenueStages.find((s) => s.id === id)?.name)
                      .join(" \u2192 ")}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Symptom picker that points a visitor to the right system. */
export function ServiceFinder({ locale }: { locale: Locale }) {
  const symptoms = services.items.flatMap((item) =>
    item.problem.points.map((point) => ({ point, serviceId: item.id })),
  )
  const [picked, setPicked] = useState<string | null>(null)
  const match = services.items.find(
    (item) => item.id === symptoms.find((s) => s.point === picked)?.serviceId,
  )

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <p className="text-sm font-semibold text-ink-muted">
          Pick the one that sounds most familiar
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {symptoms.map(({ point }) => {
            const selected = picked === point
            return (
              <li key={point}>
                <button
                  aria-pressed={selected}
                  className={`rounded-full border px-4 py-2.5 text-left text-sm transition-[background-color,border-color,color] duration-200 ${
                    selected
                      ? "border-brand-bright bg-brand-bright text-ink"
                      : "border-ink-line text-white hover:border-ink-muted"
                  }`}
                  onClick={() => setPicked(selected ? null : point)}
                  type="button"
                >
                  {point}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div aria-live="polite" className="lg:col-span-6">
        {match ? (
          <div
            className="rounded-3xl border border-brand-bright/30 bg-ink-2 p-8 shadow-[0_0_80px_-30px_rgb(75_224_164/0.5)]"
            key={match.id}
            style={{ animation: "rv-fade-up 400ms cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <p className="text-sm font-semibold text-brand-bright">Start here</p>
            <h3 className="rv-heading mt-3 text-3xl">{match.name}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{match.impact}</p>
            <Link
              className="rv-btn-on-dark mt-8"
              href={localePath(locale, `/services/${match.slug}`)}
            >
              Explore {match.name}
            </Link>
          </div>
        ) : (
          <div className="grid h-full min-h-[16rem] place-items-center rounded-3xl border border-dashed border-ink-line p-8 text-center text-ink-muted">
            Your recommended starting point appears here.
          </div>
        )}
      </div>
    </div>
  )
}
