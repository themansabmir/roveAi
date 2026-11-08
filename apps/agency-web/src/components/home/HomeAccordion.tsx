"use client"

import { useState, type ReactNode } from "react"

export type HomeAccordionItem = {
  id: string
  title: string
  content: ReactNode
}

export function HomeAccordion({
  idPrefix,
  items,
  className = "",
}: {
  idPrefix: string
  items: HomeAccordionItem[]
  className?: string
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className={className}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const buttonId = `${idPrefix}-${item.id}-button`
        const panelId = `${idPrefix}-${item.id}-panel`

        return (
          <div className="border-b border-slate-200 last:border-b-0" key={item.id}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-5 py-5 text-left font-display text-base font-bold text-slate-900 outline-none transition-colors hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                id={buttonId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                type="button"
              >
                <span>{item.title}</span>
                <span aria-hidden="true" className="shrink-0 font-mono text-lg text-blue-600">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              aria-labelledby={buttonId}
              className="pb-5 text-sm leading-relaxed text-slate-600"
              hidden={!isOpen}
              id={panelId}
              role="region"
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
