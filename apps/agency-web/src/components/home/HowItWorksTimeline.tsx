"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { homeContent } from "@/content/home"
import styles from "./HowItWorksTimeline.module.css"

export function HowItWorksTimeline() {
  const steps = homeContent.process.steps
  const [activeIndex, setActiveIndex] = useState(-1)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.left - right.boundingClientRect.left)

        if (visible[0]) {
          const index = Array.from(list.children).indexOf(visible[0].target)
          if (index >= 0) setActiveIndex(index)
        }
      },
      { rootMargin: "0px -35% 0px -35%", threshold: 0.1 },
    )

    Array.from(list.children).forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [])

  const progress = steps.length > 1 ? Math.max(activeIndex, 0) / (steps.length - 1) : 0

  return (
    <ol
      aria-label={homeContent.process.title}
      className={styles.steps}
      ref={listRef}
      style={{ "--progress": progress } as CSSProperties & { "--progress": number }}
    >
      {steps.map((step, index) => (
        <li className={styles.step} data-active={index <= activeIndex} key={step.name}>
          <span aria-hidden="true" className={styles.marker}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{step.name}</h3>
          <p>{step.description}</p>
          <p className={styles.outcome}>{step.outcome}</p>
        </li>
      ))}
    </ol>
  )
}
