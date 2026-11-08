import Image from "next/image"
import { homeContent } from "@/content/home"
import styles from "./RevenueSystemFlow.module.css"

export function RevenueSystemFlow() {
  const { revenueFlow } = homeContent

  return (
    <figure className={styles.figure}>
      <Image
        alt={revenueFlow.imageAlt}
        className={styles.illustration}
        height={420}
        sizes="(max-width: 760px) 100vw, 760px"
        src="/gemini-assets/revenue-engine-flow.svg"
        width={760}
      />
      <ol aria-label={revenueFlow.ariaLabel} className={styles.stages}>
        {revenueFlow.stages.map((stage) => (
          <li className={styles.stage} key={stage.id}>
            <span className={styles.label}>{stage.label}</span>
            <strong className={styles.title}>{stage.title}</strong>
            <p className={styles.description}>{stage.description}</p>
          </li>
        ))}
      </ol>
    </figure>
  )
}
