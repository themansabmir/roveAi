"use client"

import { useId, useRef, useState, type KeyboardEvent } from "react"

/** What each team gets from one system; switches panel on click or arrow keys. */
export function TeamTabs({ items }: { items: readonly { team: string; detail: string }[] }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()
  const current = items[active]

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (active + step + items.length) % items.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div
        aria-label="Teams"
        className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0"
        onKeyDown={onKeyDown}
        role="tablist"
      >
        {items.map((item, index) => {
          const selected = index === active
          return (
            <button
              aria-controls={`${id}-panel`}
              aria-selected={selected}
              className={`group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl border px-5 py-4 text-left text-[15px] font-semibold transition-colors duration-300 ${
                selected
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-surface text-ink hover:border-brand/40"
              }`}
              id={`${id}-tab-${index}`}
              key={item.team}
              onClick={() => setActive(index)}
              ref={(el) => {
                tabs.current[index] = el
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full transition-colors ${selected ? "bg-brand-bright" : "bg-line group-hover:bg-brand"}`}
              />
              {item.team}
            </button>
          )
        })}
      </div>
      {current && (
        <div
          aria-labelledby={`${id}-tab-${active}`}
          className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white sm:p-10 lg:col-span-8"
          id={`${id}-panel`}
          role="tabpanel"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/40 blur-[90px]"
          />
          <div className="relative" key={active} style={{ animation: "rv-fade-up 500ms both" }}>
            <p className="text-sm font-semibold text-brand-bright">
              For {current.team.toLowerCase()}
            </p>
            <p className="rv-heading mt-5 max-w-2xl text-3xl leading-[1.15] sm:text-4xl">
              {current.detail}
            </p>
          </div>
          <div aria-hidden="true" className="relative mt-10 flex gap-1.5">
            {items.map((item, index) => (
              <span
                className={`h-1 rounded-full transition-all duration-500 ${index === active ? "w-10 bg-brand-bright" : "w-4 bg-ink-line"}`}
                key={item.team}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
