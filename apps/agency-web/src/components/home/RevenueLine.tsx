"use client"

import { useEffect, useState, type MouseEvent } from "react"
import { revenueStages } from "@/content/revops"

const W = 480
const H = 220
const points = [178, 160, 138, 112, 74, 46].map((y, i) => ({ x: 40 + i * 80, y }))

const segments = points.slice(1).map((p, i) => {
  const a = points[i]!
  return `M${a.x} ${a.y} C${a.x + 40} ${a.y} ${p.x - 40} ${p.y} ${p.x} ${p.y}`
})
const curve = `M${points[0]!.x} ${points[0]!.y}${segments.map((s) => s.slice(s.indexOf("C") - 1)).join("")}`
const area = `${curve} L${points[points.length - 1]!.x} ${H} L${points[0]!.x} ${H} Z`

const STEP_MS = 1600

export function RevenueLine() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % revenueStages.length)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [paused])

  const scrub = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const index = Math.min(
      revenueStages.length - 1,
      Math.max(0, Math.floor(ratio * revenueStages.length)),
    )
    setPaused(true)
    setActive(index)
  }

  const stage = revenueStages[active] ?? revenueStages[0]!

  return (
    <figure
      aria-label="How work moves from marketing to retention, and where a person approves it"
      className="relative overflow-hidden rounded-2xl border border-ink-line bg-ink text-white shadow-[0_50px_100px_-50px_rgb(11_19_36/0.7)]"
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-brand/30 blur-[100px]"
      />

      <figcaption className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-6 pt-5 text-xs text-ink-muted">
        <span className="flex items-center gap-2 font-medium text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
          </span>
          Your revenue line
        </span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-gate" />
            You approve
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-bright" />
            Automated
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-white" />
            Your team
          </span>
        </span>
      </figcaption>

      <div
        className="relative cursor-crosshair px-3 pt-4 sm:px-4"
        onMouseLeave={() => setPaused(false)}
        onMouseMove={scrub}
      >
        <svg
          aria-hidden="true"
          className="block h-auto w-full"
          fill="none"
          viewBox={`0 0 ${W} ${H}`}
        >
          <defs>
            <linearGradient id="rv-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--rv-brand-bright)" stopOpacity="0.22" />
              <stop offset="1" stopColor="var(--rv-brand-bright)" stopOpacity="0" />
            </linearGradient>
            <filter height="200%" id="rv-glow" width="200%" x="-50%" y="-50%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {[60, 110, 160].map((y) => (
            <line
              key={y}
              stroke="var(--rv-ink-line)"
              strokeDasharray="2 6"
              x1="0"
              x2={W}
              y1={y}
              y2={y}
            />
          ))}

          <path d={area} fill="url(#rv-area)" />
          <path d={curve} stroke="var(--rv-ink-line)" strokeWidth="2" />

          {segments.map((d, i) => (
            <path
              d={d}
              key={d}
              pathLength={1}
              stroke="var(--rv-brand-bright)"
              strokeDasharray="1 1"
              strokeDashoffset={i < active ? 0 : 1}
              strokeLinecap="round"
              strokeWidth="2.5"
              style={{
                transition: `stroke-dashoffset ${i < active ? 420 : 200}ms cubic-bezier(0.22,1,0.36,1)`,
              }}
            />
          ))}

          {points.map((p, i) => {
            const isActive = i === active
            const reached = i <= active
            const gate = revenueStages[i]?.gate
            const team = revenueStages[i]?.team
            const markerOpacity = reached ? 1 : 0.45
            return (
              <g key={p.x}>
                {gate ? (
                  <rect
                    fill="var(--rv-gate)"
                    height="7"
                    opacity={markerOpacity}
                    rx="1"
                    transform={`rotate(45 ${p.x} ${p.y - 18})`}
                    width="7"
                    x={p.x - 3.5}
                    y={p.y - 21.5}
                  />
                ) : team ? (
                  <circle
                    cx={p.x}
                    cy={p.y - 18}
                    opacity={markerOpacity}
                    r="3.5"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                ) : (
                  <circle
                    cx={p.x}
                    cy={p.y - 18}
                    fill="var(--rv-brand-bright)"
                    opacity={markerOpacity}
                    r="3.5"
                  />
                )}
                {isActive && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    fill="var(--rv-brand-bright)"
                    filter="url(#rv-glow)"
                    r="9"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  fill={reached ? "var(--rv-brand-bright)" : "var(--rv-ink)"}
                  r={isActive ? 6 : 4.5}
                  stroke={reached ? "var(--rv-brand-bright)" : "var(--rv-ink-muted)"}
                  strokeWidth="1.5"
                  style={{ transition: "r 300ms ease, fill 300ms ease" }}
                />
              </g>
            )
          })}
        </svg>

        <div className="grid grid-cols-6" role="group" aria-label="Stages">
          {revenueStages.map((s, i) => (
            <button
              aria-pressed={i === active}
              className={`rounded-md py-2 text-center text-[10px] font-medium tracking-tight transition-colors sm:text-[11px] ${
                i === active ? "text-white" : "text-ink-muted hover:text-white"
              }`}
              key={s.id}
              onClick={() => setActive(i)}
              type="button"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-3 border-t border-ink-line px-6 py-5" aria-live="polite">
        <div
          className="min-h-[7.5rem]"
          key={stage.id}
          style={{ animation: "rv-fade-up 280ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <p className="font-mono text-[11px] text-ink-muted">
            {String(active + 1).padStart(2, "0")} / {String(revenueStages.length).padStart(2, "0")}
          </p>
          <p className="rv-heading mt-1.5 text-2xl">{stage.name}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{stage.work}</p>
          {stage.gate ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-gate">
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-gate" />
              {stage.gate}
            </p>
          ) : stage.team ? (
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-white">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
              Owned by your team
            </p>
          ) : (
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-brand-bright">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-bright" />
              Runs automatically
            </p>
          )}
        </div>
      </div>
    </figure>
  )
}
