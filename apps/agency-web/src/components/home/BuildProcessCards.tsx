import { homeContent } from "@/content/home"
import styles from "./BuildProcessCards.module.css"

export function BuildProcessCards() {
  const { buildProcess } = homeContent

  return (
    <div className={styles.wrap}>
      <ol aria-label={buildProcess.title} className={styles.cards}>
        {buildProcess.steps.map((step, index) => (
          <li className={styles.card} key={step.id}>
            <div className={styles.cardTop}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className={styles.icon}>
                {step.id === "signals" && (
                  <svg fill="none" viewBox="0 0 24 24">
                    <circle cx="6" cy="7" r="2" />
                    <circle cx="18" cy="6" r="2" />
                    <circle cx="17" cy="18" r="2" />
                    <path d="m8 7 8-1M7.5 9l8 7" />
                  </svg>
                )}
                {step.id === "outbound" && (
                  <svg fill="none" viewBox="0 0 24 24">
                    <path d="M4 12h13m-5-5 5 5-5 5" />
                    <circle cx="5" cy="6" r="1" />
                    <circle cx="5" cy="18" r="1" />
                  </svg>
                )}
                {step.id === "crm" && (
                  <svg fill="none" viewBox="0 0 24 24">
                    <rect height="14" rx="2" width="17" x="3.5" y="5" />
                    <path d="M7 9h10M7 12h5m-5 3h7" />
                    <circle cx="17" cy="15" r="1" />
                  </svg>
                )}
              </span>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className={styles.title}>{step.name}</h3>
            <p className={styles.description}>{step.description}</p>
            <div className={styles.detail}>
              <span className={styles.aiLabel}>{buildProcess.aiLabel}</span>
              <p>{step.aiWork}</p>
            </div>
            <div className={styles.detail}>
              <span className={styles.peopleLabel}>{buildProcess.peopleLabel}</span>
              <p>{step.checkpoint}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.startingPoint}>{buildProcess.startingPoint}</p>
    </div>
  )
}
