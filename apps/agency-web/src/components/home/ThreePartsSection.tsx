import type { CSSProperties } from "react"
import { homeContent } from "@/content/home"
import styles from "./ThreePartsSection.module.css"

export function ThreePartsSection() {
  const { threeParts } = homeContent

  return (
    <section aria-labelledby="three-parts-title" className={styles.section} id="three-parts">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>{threeParts.eyebrow}</p>
        <h2 className={styles.title} id="three-parts-title">
          {threeParts.title}
        </h2>
        <p className={styles.description}>{threeParts.description}</p>
      </header>
      <ol className={styles.cards}>
        {threeParts.items.map((item, index) => (
          <li
            className={styles.card}
            key={item.id}
            style={{ "--card-index": index } as CSSProperties & { "--card-index": number }}
          >
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <div className={styles.cardContent}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.href}>
                {item.link} <span aria-hidden="true">→</span>
              </a>
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.note}>{threeParts.note}</p>
    </section>
  )
}
