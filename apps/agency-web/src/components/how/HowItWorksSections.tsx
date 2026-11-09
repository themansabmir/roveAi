"use client"

import { useEffect, useRef, useState } from "react"
import { homeContent } from "@/content/home"

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      {
        threshold,
      },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

/** Advances an index on a timer while visible, until the visitor takes over. */
function useAutoStep(count: number, inView: boolean, ms: number) {
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  useEffect(() => {
    if (!inView || manual) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % count), ms)
    return () => window.clearTimeout(id)
  }, [active, count, inView, manual, ms])
  const choose = (index: number) => {
    setManual(true)
    setActive(index)
  }
  return { active, choose, manual }
}

export type Phase = { when: string; name: string; detail: string; output: string }

// Diagnose, Scope, Build, Run, Hand over.
const PHASE_ICONS = [
  "M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm4.5-1.5L17 17",
  "M5 3h7l3 3v11H5V3Zm7 0v3h3M8 10h4M8 13h4",
  "M3 11h6v6H3v-6Zm8 0h6v6h-6v-6ZM7 3h6v6H7V3Z",
  "M16 10a6 6 0 0 1-10.5 4M4 10a6 6 0 0 1 10.5-4M14.5 3v3h-3M5.5 17v-3h3",
  "M7 12a3 3 0 1 1 2.8-4H17v2.5h-2V12h-2v-2H9.8A3 3 0 0 1 7 12Z",
]

function PhaseIcon({ index, className = "h-5 w-5" }: { index: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d={PHASE_ICONS[index] ?? PHASE_ICONS[0]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export function PhaseRail({ phases }: { phases: Phase[] }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const { active, choose, manual } = useAutoStep(phases.length, inView, 3800)

  return (
    <div ref={ref}>
      {/* Desktop: expanding panels */}
      <div className="hidden lg:block">
        <div className="relative mb-6 flex items-center">
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-brand-tint">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand to-brand-bright transition-[width] duration-700 ease-out"
              style={{ width: `${((active + 1) / phases.length) * 100}%` }}
            />
          </div>
          <span className="ml-4 font-mono text-sm text-quiet">
            {String(active + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}
          </span>
        </div>
        <div className="flex h-[26rem] gap-3" role="tablist" aria-label="Engagement phases">
          {phases.map((phase, index) => {
            const isActive = index === active
            const done = index < active
            return (
              <button
                aria-selected={isActive}
                className={`group relative flex min-w-0 basis-0 flex-col overflow-hidden rounded-3xl border p-7 text-left transition-[flex-grow,background-color,border-color,color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive
                    ? "grow-[3.2] border-ink bg-ink text-white shadow-[0_40px_80px_-40px_rgb(11_122_90/0.55)]"
                    : done
                      ? "grow border-brand/25 bg-brand-tint hover:-translate-y-1 hover:border-brand/50"
                      : "grow border-brand/15 bg-gradient-to-b from-surface to-brand-tint/60 hover:-translate-y-1 hover:border-brand/40"
                }`}
                key={phase.name}
                onClick={() => choose(index)}
                onMouseEnter={() => choose(index)}
                role="tab"
                type="button"
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand/45 blur-[90px]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="rv-display pointer-events-none absolute -bottom-6 -right-1 text-[7.5rem] leading-none text-brand/10 transition-colors duration-500 group-hover:text-brand/20"
                  >
                    {index + 1}
                  </span>
                )}

                <span className="relative flex items-center justify-between">
                  <span
                    className={`relative grid h-11 w-11 place-items-center rounded-2xl transition-colors duration-500 ${
                      isActive
                        ? "bg-brand-bright text-ink"
                        : done
                          ? "bg-brand text-white"
                          : "border border-brand/20 bg-surface text-brand"
                    }`}
                  >
                    <PhaseIcon index={index} />
                    {done && (
                      <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-ink text-brand-bright">
                        <svg
                          aria-hidden="true"
                          className="h-2.5 w-2.5"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="m2.5 6.2 2.2 2.2 4.8-4.9"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                        </svg>
                      </span>
                    )}
                  </span>
                  {isActive && !manual && inView && (
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-ink-line">
                      <span
                        className="block h-full origin-left bg-brand-bright"
                        key={active}
                        style={{ animation: "rv-progress 3800ms linear both" }}
                      />
                    </span>
                  )}
                </span>

                <span className="relative mt-auto">
                  <span
                    className={`block text-xs font-semibold ${isActive ? "text-brand-bright" : "text-brand-deep"}`}
                  >
                    {phase.when}
                  </span>
                  <span className="rv-heading mt-2 flex items-center gap-2 whitespace-nowrap text-2xl">
                    {phase.name}
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-md pt-4 text-[15px] leading-relaxed text-ink-muted">
                        {phase.detail}
                      </span>
                      <span className="mt-6 flex max-w-md items-start gap-3 rounded-2xl border border-brand-bright/20 bg-brand-bright/10 p-4 text-sm">
                        <span
                          aria-hidden="true"
                          className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-bright"
                        />
                        <span>
                          <span className="font-semibold text-brand-bright">You get: </span>
                          <span className="text-white/85">{phase.output}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile and tablet: vertical timeline */}
      <ol className="relative space-y-4 lg:hidden">
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[1.375rem] top-4 w-px bg-gradient-to-b from-brand/40 via-brand to-brand/40"
        />
        {phases.map((phase, index) => (
          <li className="relative grid grid-cols-[2.75rem_1fr] gap-4" key={phase.name}>
            <span className="relative z-10 grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white">
              <PhaseIcon index={index} />
            </span>
            <div className="rounded-2xl border border-brand/15 bg-gradient-to-b from-surface to-brand-tint/50 p-5">
              <p className="text-xs font-semibold text-brand">{phase.when}</p>
              <h3 className="rv-heading mt-1.5 text-xl">{phase.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-quiet">{phase.detail}</p>
              <p className="mt-4 rounded-xl bg-paper p-3 text-sm">
                <span className="font-semibold">You get: </span>
                <span className="text-quiet">{phase.output}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function GateLog() {
  const { gates } = homeContent.control
  const { ref, inView } = useInView<HTMLDivElement>()
  const { active, choose } = useAutoStep(gates.length, inView, 3200)

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center" ref={ref}>
      <div className="space-y-2 lg:col-span-5" role="tablist" aria-label="Approval gates">
        {gates.map((gate, index) => {
          const isActive = index === active
          return (
            <button
              aria-selected={isActive}
              className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-[background-color,border-color] duration-300 ${
                isActive ? "border-gate/50 bg-gate/10" : "border-ink-line hover:border-ink-muted"
              }`}
              key={gate.name}
              onClick={() => choose(index)}
              onMouseEnter={() => choose(index)}
              role="tab"
              type="button"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                  isActive ? "border-gate bg-gate" : "border-ink-line"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rotate-45 rounded-[2px] ${isActive ? "bg-ink" : "bg-gate"}`}
                />
              </span>
              <span>
                <span className="block text-xs font-semibold text-gate">Gate {index + 1}</span>
                <span className="mt-0.5 block font-semibold">{gate.name}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="lg:col-span-7">
        <div className="overflow-hidden rounded-3xl border border-ink-line bg-ink-2 shadow-[0_40px_90px_-40px_rgb(240_169_46/0.35)]">
          <div className="flex items-center justify-between border-b border-ink-line px-6 py-4">
            <span className="text-sm font-semibold">Approval log</span>
            <span className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gate/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gate" />
              </span>
              Your campaign
            </span>
          </div>
          <ol className="divide-y divide-ink-line">
            {gates.map((gate, index) => {
              const cleared = index < active
              const isActive = index === active
              return (
                <li className="px-6 py-4" key={gate.name}>
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                        cleared
                          ? "bg-gate text-ink"
                          : isActive
                            ? "border border-gate text-gate"
                            : "border border-ink-line text-ink-muted"
                      }`}
                    >
                      {cleared ? (
                        <svg
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="m3.5 8.2 2.8 2.8 6.2-6.3"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      ) : (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-gate" : "bg-ink-muted/50"}`}
                        />
                      )}
                    </span>
                    <span
                      className={`flex-1 text-[15px] ${isActive || cleared ? "text-white" : "text-ink-muted"}`}
                    >
                      {gate.name}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {cleared ? "Approved" : isActive ? "In review" : "Waiting"}
                    </span>
                  </div>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pl-11 pt-3 text-sm leading-relaxed text-ink-muted">
                        {gate.approval}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

const handoverItems = [
  {
    title: "Documentation",
    detail: "Every workflow, rule and integration written down in plain language.",
    icon: "M5 3h7l4 4v10H5V3Zm7 0v4h4M8 10h5M8 13h5",
  },
  {
    title: "A walkthrough",
    detail: "We show your team how to adjust targeting, templates and reports.",
    icon: "M3 5h14v9H3V5Zm5 12h4M10 14v3M9 8l3 1.5L9 11V8Z",
  },
  {
    title: "Everything in your name",
    detail: "Domains, inboxes, CRM records and copy stay in your accounts.",
    icon: "M7 11a3 3 0 1 1 2.8-4H17v2.5h-2V11h-2V9H9.8A3 3 0 0 1 7 11Z",
  },
  {
    title: "30 days of overlap",
    detail: "We stay alongside your team while they take over day-to-day running.",
    icon: "M4 5h12v11H4V5Zm0 3h12M7 3v3m6-3v3m-6 6h2",
  },
]

export function HandoverKit() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)

  return (
    <div className="overflow-hidden rounded-3xl bg-ink text-white" ref={ref}>
      <div className="border-b border-ink-line p-6 sm:p-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Who runs the system</span>
          <span className="text-ink-muted">30-day handover</span>
        </div>
        <div className="mt-5 flex h-11 overflow-hidden rounded-xl text-xs font-semibold">
          <div
            className="flex items-center overflow-hidden whitespace-nowrap bg-brand-bright px-3 text-ink transition-[width] duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ width: inView ? "14%" : "90%" }}
          >
            Rivet
          </div>
          <div className="flex flex-1 items-center justify-end whitespace-nowrap bg-white px-3 text-ink">
            Your team
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>Day 1</span>
          <span>Day 30</span>
        </div>
      </div>
      <ul className="grid sm:grid-cols-2">
        {handoverItems.map((item, index) => (
          <li
            className={`flex gap-4 p-6 transition-[opacity,transform] duration-700 ease-out sm:p-8 ${
              index % 2 === 0 ? "sm:border-r sm:border-ink-line" : ""
            } ${index < 2 ? "border-b border-ink-line" : index === 2 ? "border-b border-ink-line sm:border-b-0" : ""} ${
              inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            key={item.title}
            style={{ transitionDelay: `${400 + index * 120}ms` }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-bright/10 text-brand-bright">
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                <path
                  d={item.icon}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span>
              <span className="block font-semibold">{item.title}</span>
              <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-muted">
                {item.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
