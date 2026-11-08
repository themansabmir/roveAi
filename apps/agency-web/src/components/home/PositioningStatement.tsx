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
        <span>DATA + CRM</span>
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
      <span>HUMAN REVIEW</span>
    </span>
  )
}

export function PositioningStatement() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { positioningStatement } = homeContent
  let wordIndex = 0

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    setIsReady(true)

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-label={positioningStatement.ariaLabel}
      className={`${styles.section} ${isReady ? styles.ready : ""} ${isVisible ? styles.visible : ""}`}
      ref={sectionRef}
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span aria-hidden="true" className={styles.eyebrowDot} />
          {positioningStatement.eyebrow}
        </p>
        <p className={styles.statement}>
          {positioningStatement.segments.map((segment, segmentIndex) => {
            if (segment.type === "visual") {
              const delay = `${wordIndex * 10}ms`
              wordIndex += 1
              return (
                <span
                  className={styles.visualReveal}
                  key={`visual-${segment.id}`}
                  style={{ transitionDelay: delay }}
                >
                  <InlineVisual id={segment.id} />
                </span>
              )
            }

            return segment.value.split(/(\s+)/).map((part, partIndex) => {
              if (!part.trim()) return part
              const delay = `${wordIndex * 10}ms`
              wordIndex += 1
              return (
                <span
                  className={`${styles.word} ${segment.tone === "accent" ? styles.accentWord : ""}`}
                  key={`${segmentIndex}-${partIndex}`}
                  style={{ transitionDelay: delay }}
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
