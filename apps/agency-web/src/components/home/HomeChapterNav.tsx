"use client"

import { useEffect, useState } from "react"
import { homeContent } from "@/content/home"
import styles from "./HomeChapterNav.module.css"

export function HomeChapterNav() {
  const [activeId, setActiveId] = useState(homeContent.chapters[0]?.id ?? "")

  useEffect(() => {
    const sections = homeContent.chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="Homepage chapters" className={styles.nav}>
      <ol className={styles.list}>
        {homeContent.chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              aria-current={activeId === chapter.id ? "location" : undefined}
              className={styles.link}
              href={`#${chapter.id}`}
            >
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <span>{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
