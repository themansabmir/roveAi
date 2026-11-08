import { homeContent } from "@/content/home"
import styles from "./PipelineUpgradeSection.module.css"

export function PipelineUpgradeSection() {
  const { pipelineUpgrade } = homeContent
  const accent = "nobody has time to do."
  const accentIndex = pipelineUpgrade.title.indexOf(accent)

  return (
    <section aria-labelledby="pipeline-upgrade-title" className={styles.section} id="the-problem">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>{pipelineUpgrade.eyebrow}</p>
        <h2 className={styles.title} id="pipeline-upgrade-title">
          {accentIndex < 0 ? (
            pipelineUpgrade.title
          ) : (
            <>
              {pipelineUpgrade.title.slice(0, accentIndex)}
              <span>{accent}</span>
              {pipelineUpgrade.title.slice(accentIndex + accent.length)}
            </>
          )}
        </h2>
        <p className={styles.intro}>{pipelineUpgrade.description}</p>
      </header>

      <div className={styles.issueGrid}>
        {pipelineUpgrade.issues.map((issue, index) => (
          <article className={styles.issueCard} key={issue.id}>
            <span className={styles.issueIndex}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{issue.title}</h3>
              <p>{issue.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
