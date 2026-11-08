"use client"

import type { MouseEvent, ReactNode } from "react"

export function GeminiInteractionLayer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return

    const root = event.currentTarget
    const choice = event.target.closest<HTMLButtonElement>("[data-gemini-choice]")
    if (choice) {
      const group = choice.dataset.geminiChoice
      if (!group) return

      root
        .querySelectorAll<HTMLButtonElement>(`[data-gemini-choice="${group}"]`)
        .forEach((button) => {
          const selected = button === choice
          const classes = selected
            ? button.dataset.geminiActiveClass
            : button.dataset.geminiInactiveClass
          if (classes) button.className = classes
          button.setAttribute("aria-pressed", String(selected))

          if (button.dataset.geminiVariant === "classic" && group === "spec") {
            const dot = button.querySelector<HTMLElement>(".w-2\\.5, .w-2")
            if (dot) {
              dot.className = selected
                ? "w-2 h-2 rounded-full bg-blue-600"
                : "w-2 h-2 rounded-full bg-slate-400"
            }
          }

          if (button.dataset.geminiVariant === "classic" && group === "stage") {
            const header = button.querySelector<HTMLElement>("div:first-child")
            if (header) {
              header.className = selected
                ? "flex items-center justify-between font-mono text-[11px] text-blue-700 font-bold"
                : "flex items-center justify-between font-mono text-[11px] text-slate-500 font-semibold"
            }
          }
        })
      return
    }

    const trigger = event.target.closest<HTMLButtonElement>(".faq-trigger, .faq-btn")
    if (!trigger) return
    const content = trigger.nextElementSibling
    if (!content) return

    if (trigger.classList.contains("faq-btn")) {
      const isOpen = !content.classList.contains("hidden")
      root.querySelectorAll<HTMLButtonElement>(".faq-btn").forEach((button) => {
        button.setAttribute("aria-expanded", "false")
        button.nextElementSibling?.classList.add("hidden")
      })
      if (!isOpen) {
        content.classList.remove("hidden")
        trigger.setAttribute("aria-expanded", "true")
      }
      return
    }

    const isOpen = !content.classList.contains("hidden")
    content.classList.toggle("hidden", isOpen)
    trigger.setAttribute("aria-expanded", String(!isOpen))
    trigger.querySelector(".faq-icon svg")?.classList.toggle("rotate-45", !isOpen)
  }

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  )
}
