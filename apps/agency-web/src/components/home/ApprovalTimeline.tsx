"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { homeContent } from "@/content/home"
import styles from "./ApprovalTimeline.module.css"

export function ApprovalTimeline() {
  const { gates } = homeContent.control
  const listRef = useRef<HTMLOListElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)

        if (visible[0]) {
          const index = Array.from(list.children).indexOf(visible[0].target)
          if (index >= 0) setActiveIndex(index)
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0.1 },
    )

    Array.from(list.children).forEach((gate) => observer.observe(gate))
    return () => observer.disconnect()
  }, [])

  const progress = gates.length > 1 ? Math.max(activeIndex, 0) / (gates.length - 1) : 0

  return (
    <ol
      aria-label="Approval steps"
      className={styles.timeline}
      ref={listRef}
      style={{ "--progress": progress } as CSSProperties & { "--progress": number }}
    >
      {gates.map((gate, index) => (
        <li className={styles.gate} data-active={index <= activeIndex} key={gate.name}>
          <span aria-hidden="true" className={styles.marker}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={styles.copy}>
            <h3>{gate.name}</h3>
            <p>{gate.approval}</p>
            <span>{gate.repeats}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
