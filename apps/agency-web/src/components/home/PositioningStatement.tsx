"use client"

import { useEffect, useRef, useState } from "react"
import { homeContent } from "@/content/home"
import styles from "./PositioningStatement.module.css"

function InlineVisual({ id }: { id: "signals" | "review" }) {
  if (id === "signals") {
    return (
      <span aria-hidden="true" className={`${styles.visual} ${styles.signalVisual}`}>
        <svg fill="none" viewBox="0 0 24 24">
          <path
            d="M4.5 6.5h15m-15 5h10m-10 5h6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <circle cx="18" cy="16.5" r="2.5" fill="currentColor" />
        </svg>
      </span>
    )
  }

  return (
    <span aria-hidden="true" className={`${styles.visual} ${styles.reviewVisual}`}>
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M7 12.5 10.2 16l7-8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  )
}

export function PositioningStatement() {
  const statementRef = useRef<HTMLParagraphElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const { positioningStatement } = homeContent

  useEffect(() => {
    const statement = statementRef.current
    if (!statement) return

    setIsReady(true)

    let lastScrollY = window.scrollY
    const updateReveal = () => {
      const activationLine = window.innerHeight * 0.3
      const revealTargets = statement.querySelectorAll<HTMLElement>("[data-scroll-reveal]")
      const direction = window.scrollY >= lastScrollY ? "down" : "up"
      const lines = new Map<number, HTMLElement[]>()
      lastScrollY = window.scrollY

      for (const target of revealTargets) {
        const bounds = target.getBoundingClientRect()
        target.dataset.scrollActive = String(bounds.top <= activationLine && bounds.bottom > 0)
        const line = Math.round(bounds.top)
        const lineTargets = lines.get(line) ?? []
        lineTargets.push(target)
        lines.set(line, lineTargets)
      }

      for (const lineTargets of lines.values()) {
        lineTargets.forEach((target, index) => {
          const delayIndex = direction === "down" ? index : lineTargets.length - index - 1
          target.style.transitionDelay = `${delayIndex * 55}ms`
        })
      }
    }

    updateReveal()
    window.addEventListener("scroll", updateReveal, { passive: true })
    window.addEventListener("resize", updateReveal)

    return () => {
      window.removeEventListener("scroll", updateReveal)
      window.removeEventListener("resize", updateReveal)
    }
  }, [])

  return (
    <section
      aria-label={positioningStatement.ariaLabel}
      className={`${styles.section} ${isReady ? styles.ready : ""}`}
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span aria-hidden="true" className={styles.eyebrowDot} />
          {positioningStatement.eyebrow}
        </p>
        <p className={styles.statement} ref={statementRef}>
          {positioningStatement.segments.map((segment, segmentIndex) => {
            if (segment.type === "visual") {
              return (
                <span
                  className={styles.visualReveal}
                  data-scroll-reveal
                  key={`visual-${segment.id}`}
                >
                  <InlineVisual id={segment.id} />
                </span>
              )
            }

            return segment.value.split(/(\s+)/).map((part, partIndex) => {
              if (!part.trim()) return part
              return (
                <span
                  className={styles.word}
                  data-scroll-reveal
                  key={`${segmentIndex}-${partIndex}`}
                >
                  {part}
                </span>
              )
            })
          })}
        </p>
      </div>
    </section>
  )
}
