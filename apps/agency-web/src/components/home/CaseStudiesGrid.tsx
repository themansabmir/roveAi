import { homeContent } from "@/content/home"
import styles from "./ProofSection.module.css"

export function CaseStudiesGrid() {
  const { proof } = homeContent
  const accent = "not described."
  const accentIndex = proof.title.indexOf(accent)

  return (
    <section className={styles.section} id="proof">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>{proof.eyebrow}</p>
        <h2 className={styles.title}>
          {accentIndex < 0 ? (
            proof.title
          ) : (
            <>
              {proof.title.slice(0, accentIndex)}
              <span>{accent}</span>
              {proof.title.slice(accentIndex + accent.length)}
            </>
          )}
        </h2>
        {proof.description && <p className={styles.description}>{proof.description}</p>}
      </header>
      <div className={styles.grid}>
        {proof.projects.map((project, index) => (
          <article
            className={`${styles.projectCard} ${project.id === "syntropic" ? styles.ownProject : ""}`}
            key={project.id}
          >
            <div
              aria-label={`${project.name} case study image placeholder`}
              className={styles.imagePlaceholder}
              role="img"
            >
              <span aria-hidden="true" className={styles.placeholderOrb} />
              <span className={styles.placeholderLabel}>{proof.imagePlaceholder}</span>
              <span className={styles.placeholderIndex}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className={styles.projectContent}>
              <div className={styles.projectHeading}>
                <div>
                  <span className={styles.projectIndex}>
                    {proof.caseLabel} {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.projectName}>{project.name}</h3>
                </div>
                {project.id !== "syntropic" && (
                  <span className={styles.projectPath}>{project.path}</span>
                )}
              </div>
              <p className={styles.projectClaim}>{project.claim}</p>
              <div className={styles.projectFlow}>
                <p className={styles.flowTitle}>{proof.flowLabel}</p>
                <ol aria-label={project.flowTitle} className={styles.flowSteps}>
                  {project.steps.map((step, stepIndex) => (
                    <li className={styles.flowStep} key={step}>
                      <span className={styles.flowNode}>{step}</span>
                      {stepIndex < project.steps.length - 1 && (
                        <span aria-hidden="true" className={styles.flowArrow}>
                          →
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.proofNote}>{proof.note}</p>
    </section>
  )
}
