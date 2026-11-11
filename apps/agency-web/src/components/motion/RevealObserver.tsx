"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/** Observes every [data-reveal] element on the page and marks it shown once it enters view. */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!("IntersectionObserver" in window)) return

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const viewport = window.innerHeight
    for (const el of targets) {
      if (el.getBoundingClientRect().top < viewport * 0.9) el.dataset.shown = "true"
    }
    root.classList.add("rv-reveal-ready")

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.shown = "true"
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    for (const el of targets) if (el.dataset.shown !== "true") observer.observe(el)
    return () => observer.disconnect()
  }, [pathname])

  return null
}
