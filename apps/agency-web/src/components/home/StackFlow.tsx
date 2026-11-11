"use client"

import { useEffect, useRef, useState } from "react"
import { integrations, services, tools, type FlowNode } from "@/content/revops"
import { brand } from "@/content/brand"

const VB_W = 1000
const VB_H = 440
const MID = VB_H / 2
const COL = { in: 130, out: 870 }
const NODE_HALF_W = 105
const ENGINE = { left: 370, right: 630 }
const AUTO_MS = 5500

const rowY = (index: number, count: number) => MID + (index - (count - 1) / 2) * 112

function ToolTile({ node, tone = "default" }: { node: FlowNode; tone?: "default" | "engine" }) {
  const tool = tools[node.tool]
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 backdrop-blur-sm ${
        tone === "engine" ? "border-brand-bright/30 bg-ink" : "border-ink-line bg-ink-2/80"
      }`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[13px] font-bold text-ink">
        {tool.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="h-5 w-5 object-contain" src={tool.logo} />
        ) : (
          tool.mono
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-white">{tool.name}</span>
        <span className="block truncate text-xs text-ink-muted">{node.role}</span>
      </span>
    </div>
  )
}

export function StackFlow({ only }: { only?: string } = {}) {
  const lockedIndex = only ? integrations.flows.findIndex((f) => f.serviceId === only) : -1
  const locked = lockedIndex >= 0
  const [active, setActive] = useState(locked ? lockedIndex : 0)
  const [userControlled, setUserControlled] = useState(locked)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || userControlled || reduced) return
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % integrations.flows.length),
      AUTO_MS,
    )
    return () => window.clearTimeout(id)
  }, [inView, userControlled, reduced, active])

  const flow = integrations.flows[active] ?? integrations.flows[0]!
  const serviceName = (id: string) => services.items.find((s) => s.id === id)?.name ?? id

  const inPaths = flow.inputs.map((_, i) => {
    const y = rowY(i, flow.inputs.length)
    const x0 = COL.in + NODE_HALF_W
    return `M${x0} ${y} C${x0 + 70} ${y} ${ENGINE.left - 70} ${MID} ${ENGINE.left} ${MID}`
  })
  const outPaths = flow.outputs.map((_, i) => {
    const y = rowY(i, flow.outputs.length)
    const x1 = COL.out - NODE_HALF_W
    return `M${ENGINE.right} ${MID} C${ENGINE.right + 70} ${MID} ${x1 - 70} ${y} ${x1} ${y}`
  })
  const paths = [...inPaths, ...outPaths]

  return (
    <div ref={rootRef}>
      <div
        aria-label="Systems"
        className={locked ? "hidden" : "flex flex-wrap gap-2"}
        role="tablist"
      >
        {integrations.flows.map((f, i) => {
          const selected = i === active
          return (
            <button
              aria-selected={selected}
              className={`relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                selected
                  ? "border-brand-bright/50 bg-brand-bright/10 text-white"
                  : "border-ink-line text-ink-muted hover:border-ink-muted hover:text-white"
              }`}
              key={f.serviceId}
              onClick={() => {
                setUserControlled(true)
                setActive(i)
              }}
              role="tab"
              type="button"
            >
              {serviceName(f.serviceId)}
              {selected && !userControlled && !reduced && inView && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-bright"
                  key={active}
                  style={{ animation: `rv-progress ${AUTO_MS}ms linear both` }}
                />
              )}
            </button>
          )
        })}
      </div>

      <p
        className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
        key={`caption-${active}`}
        role="tabpanel"
        style={{ animation: "rv-fade-up 400ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {flow.caption}
      </p>

      {/* Desktop graph */}
      <div
        className="relative mt-10 hidden aspect-[1000/440] w-full md:block"
        key={`graph-${active}`}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          fill="none"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
        >
          {paths.map((d, i) => (
            <g key={d}>
              <path d={d} stroke="var(--rv-ink-line)" strokeWidth="1.5" />
              <path
                d={d}
                pathLength={1}
                stroke="var(--rv-brand-bright)"
                strokeDasharray="1 1"
                strokeOpacity="0.7"
                strokeWidth="1.5"
                style={{
                  animation: `rv-draw 700ms cubic-bezier(0.22,1,0.36,1) ${i < inPaths.length ? 150 : 550}ms both`,
                }}
              />
              {!reduced && (
                <circle fill="var(--rv-brand-bright)" r="4">
                  <animateMotion
                    begin={`${(i < inPaths.length ? 0.9 : 1.6) + i * 0.25}s`}
                    dur="2.2s"
                    path={d}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          ))}
        </svg>

        {(
          [
            ["in", flow.inputs, COL.in],
            ["out", flow.outputs, COL.out],
          ] as const
        ).map(([side, nodes, x]) =>
          nodes.map((node, i) => (
            <div
              className="absolute w-[21%] -translate-x-1/2 -translate-y-1/2"
              key={`${side}-${node.tool}-${i}`}
              style={{
                left: `${(x / VB_W) * 100}%`,
                top: `${(rowY(i, nodes.length) / VB_H) * 100}%`,
              }}
            >
              <div
                style={{
                  animation: `rv-fade-up 500ms cubic-bezier(0.22,1,0.36,1) ${
                    (side === "in" ? 0 : 600) + i * 80
                  }ms both`,
                }}
              >
                <ToolTile node={node} />
              </div>
            </div>
          )),
        )}

        <div
          className="absolute top-1/2 w-[26%] -translate-y-1/2"
          style={{ left: `${(ENGINE.left / VB_W) * 100}%` }}
        >
          <div
            className="relative rounded-2xl border border-brand-bright/30 bg-ink-2 p-3 shadow-[0_0_60px_-15px_rgb(75_224_164/0.45)]"
            style={{ animation: "rv-fade-up 500ms cubic-bezier(0.22,1,0.36,1) 300ms both" }}
          >
            <p className="flex items-center gap-2 px-1 pb-2.5 text-xs font-medium text-brand-bright">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
              </span>
              Built by {brand.name}, owned by you
            </p>
            <div className="space-y-2">
              {flow.engine.map((node) => (
                <ToolTile key={node.tool} node={node} tone="engine" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="mt-8 space-y-3 md:hidden" key={`mobile-${active}`}>
        {[flow.inputs, flow.engine, flow.outputs].map((group, g) => (
          <div key={g}>
            {g > 0 && (
              <div
                aria-hidden="true"
                className="relative mx-auto mb-3 h-8 w-px overflow-hidden bg-ink-line"
              >
                <span className="absolute inset-x-0 top-0 h-3 animate-[rv-drop_1.4s_linear_infinite] bg-brand-bright" />
              </div>
            )}
            <div
              className={`grid gap-2 ${group.length > 1 ? "grid-cols-2" : ""} ${
                g === 1 ? "rounded-2xl border border-brand-bright/30 bg-ink-2 p-2" : ""
              }`}
              style={{ animation: `rv-fade-up 450ms ease-out ${g * 120}ms both` }}
            >
              {group.map((node) => (
                <ToolTile key={node.tool} node={node} tone={g === 1 ? "engine" : "default"} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
