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
  defaultOpenId = null,
}: {
  idPrefix: string
  items: HomeAccordionItem[]
  className?: string
  defaultOpenId?: string | null
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId)

  return (
    <div className={className}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const buttonId = `${idPrefix}-${item.id}-button`
        const panelId = `${idPrefix}-${item.id}-panel`

        return (
          <div className="border-b border-line last:border-b-0" key={item.id}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-5 py-5 text-left text-[17px] font-semibold text-ink transition-colors hover:text-brand"
                id={buttonId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                type="button"
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-brand"
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span
                    className={`absolute h-3 w-px bg-current transition-transform duration-300 ease-out ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
              id={panelId}
              inert={!isOpen}
              role="region"
            >
              <div className="overflow-hidden">
                <div className="max-w-[65ch] pb-6 text-[15px] leading-relaxed text-quiet">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
