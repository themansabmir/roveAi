"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { problem } from "@/content/revops"

type Mode = "before" | "after"

// Node centres as % of the diagram box.
const scattered = [
  { x: 18, y: 22 },
  { x: 76, y: 16 },
  { x: 84, y: 66 },
  { x: 26, y: 80 },
  { x: 56, y: 44 },
]
const orbit = [
  { x: 50, y: 13 },
  { x: 83, y: 39 },
  { x: 71, y: 81 },
  { x: 29, y: 81 },
  { x: 17, y: 39 },
]
const brokenLinks: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 2],
]

const AUTO_MS = 4200

export function ProblemShowcase() {
  const [mode, setMode] = useState<Mode>("before")
  const [focus, setFocus] = useState<number | null>(null)
  const [userControlled, setUserControlled] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || userControlled || focus !== null) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setMode("after")
      return
    }
    const id = window.setTimeout(
      () => setMode((m) => (m === "before" ? "after" : "before")),
      mode === "before" ? 1400 : AUTO_MS,
    )
    return () => window.clearTimeout(id)
  }, [inView, userControlled, focus, mode])

  const after = mode === "after"
  const positions = after ? orbit : scattered

  const choose = (next: Mode) => {
    setUserControlled(true)
    setMode(next)
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-ink-line bg-ink-2/60"
      ref={rootRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-brand/40 blur-[120px] transition-opacity duration-1000"
        style={{ opacity: after ? 1 : 0.15 }}
      />

      <div className="relative grid lg:grid-cols-12">
        {/* Diagram */}
        <div className="border-b border-ink-line p-4 sm:p-8 lg:col-span-7 lg:border-b-0 lg:border-r">
          <div
            aria-hidden="true"
            className="relative mx-auto aspect-[4/3] w-full max-w-xl [container-type:size]"
          >
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <g className="transition-opacity duration-500" style={{ opacity: after ? 0 : 1 }}>
                {brokenLinks.map(([a, b]) => (
                  <line
                    key={`${a}-${b}`}
                    stroke="var(--rv-ink-muted)"
                    strokeDasharray="3 7"
                    strokeOpacity="0.35"
                    strokeWidth="1.25"
                    vectorEffect="non-scaling-stroke"
                    x1={scattered[a]!.x}
                    x2={scattered[b]!.x}
                    y1={scattered[a]!.y}
                    y2={scattered[b]!.y}
                  />
                ))}
              </g>
              <g
                className="transition-opacity duration-700"
                style={{ opacity: after ? 1 : 0, transitionDelay: after ? "450ms" : "0ms" }}
              >
                {orbit.map((p, i) => (
                  <line
                    key={i}
                    stroke="var(--rv-brand-bright)"
                    strokeDasharray="4 4"
                    strokeOpacity={focus === null || focus === i ? 0.8 : 0.2}
                    strokeWidth="1.5"
                    style={{ animation: "rv-dash 1.4s linear infinite" }}
                    vectorEffect="non-scaling-stroke"
                    x1="50"
                    x2={p.x}
                    y1="50"
                    y2={p.y}
                  />
                ))}
              </g>
            </svg>

            {/* Hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="relative transition-[opacity,transform] duration-700 ease-out"
                style={{
                  opacity: after ? 1 : 0,
                  transform: after ? "scale(1)" : "scale(0.6)",
                  transitionDelay: after ? "300ms" : "0ms",
                }}
              >
                <span
                  className="absolute inset-0 rounded-2xl border border-brand-bright/50"
                  style={{ animation: after ? "rv-pulse-ring 2.4s ease-out infinite" : "none" }}
                />
                <span className="relative flex items-center gap-2 rounded-2xl border border-brand-bright/40 bg-ink px-4 py-3 text-sm font-semibold text-white shadow-[0_0_40px_-6px_rgb(75_224_164/0.6)]">
                  <span className="h-2 w-2 rounded-full bg-brand-bright" />
                  Syntropic
                </span>
              </div>
            </div>

            {/* Tool nodes */}
            {problem.areas.map((area, i) => {
              const p = positions[i]!
              const highlighted = focus === i
              const style: CSSProperties = {
                transform: `translate(calc(${p.x}cqw - 50%), calc(${p.y}cqh - 50%))`,
                transitionDelay: `${i * 60}ms`,
              }
              return (
                <div
                  className="absolute left-0 top-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  key={area}
                  style={style}
                >
                  <div
                    style={{
                      animation: after ? "none" : `rv-drift ${3 + i * 0.4}s ease-in-out infinite`,
                    }}
                  >
                    <span
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-500 sm:text-sm ${
                        after
                          ? "border-brand-bright/40 bg-ink text-white"
                          : "border-ink-line bg-ink/80 text-ink-muted"
                      } ${highlighted ? "shadow-[0_0_0_4px_rgb(75_224_164/0.18)]" : ""}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                          after ? "bg-brand-bright" : "bg-ink-muted/50"
                        }`}
                      />
                      {area}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Narrative */}
        <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <div
            aria-label="Compare"
            className="relative grid grid-cols-2 rounded-full border border-ink-line bg-ink p-1 text-xs font-medium sm:text-sm"
            role="group"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: after ? "translateX(100%)" : "translateX(0)" }}
            />
            {(["before", "after"] as const).map((value) => (
              <button
                aria-pressed={mode === value}
                className={`relative z-10 whitespace-nowrap rounded-full px-3 py-2 transition-colors duration-300 sm:px-4 ${
                  mode === value ? "text-ink" : "text-ink-muted hover:text-white"
                }`}
                key={value}
                onClick={() => choose(value)}
                type="button"
              >
                {value === "before" ? "Without a system" : "With Syntropic"}
              </button>
            ))}
          </div>

          <ul aria-live="polite" className="mt-8 flex-1 divide-y divide-ink-line">
            {problem.areas.map((area, i) => (
              <li
                className="group grid cursor-default grid-cols-[1.25rem_1fr] gap-4 py-4 first:pt-0 last:pb-0"
                key={area}
                onMouseEnter={() => setFocus(i)}
                onMouseLeave={() => setFocus(null)}
              >
                <span className="relative mt-0.5 grid h-5 w-5 place-items-center">
                  <svg
                    aria-hidden="true"
                    className="absolute h-5 w-5 text-ink-muted transition-[opacity,transform] duration-500"
                    fill="none"
                    style={{
                      opacity: after ? 0 : 0.7,
                      transform: after ? "scale(0.5) rotate(-90deg)" : "none",
                      transitionDelay: `${i * 70}ms`,
                    }}
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeDasharray="3 3" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="absolute h-5 w-5 text-brand-bright transition-[opacity,transform] duration-500"
                    fill="none"
                    style={{
                      opacity: after ? 1 : 0,
                      transform: after ? "none" : "scale(0.5)",
                      transitionDelay: `${i * 70}ms`,
                    }}
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" fill="currentColor" fillOpacity="0.15" r="9" />
                    <path
                      d="m6.5 10.2 2.3 2.3 4.7-4.9"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-medium text-ink-muted transition-colors group-hover:text-brand-bright">
                    {area}
                  </p>
                  <div className="mt-1 grid text-[15px] leading-snug">
                    {(["before", "after"] as const).map((variant) => {
                      const visible = mode === variant
                      return (
                        <span
                          aria-hidden={!visible}
                          className={`[grid-area:1/1] transition-[opacity,transform,filter] duration-500 ease-out ${
                            variant === "after" ? "text-white" : "text-ink-muted"
                          }`}
                          key={variant}
                          style={{
                            opacity: visible ? 1 : 0,
                            transform: visible
                              ? "none"
                              : `translateY(${variant === "after" ? 8 : -8}px)`,
                            filter: visible ? "none" : "blur(4px)",
                            transitionDelay: `${i * 70}ms`,
                          }}
                        >
                          {problem[variant][i]}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
