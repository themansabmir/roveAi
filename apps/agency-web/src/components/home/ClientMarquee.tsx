import { homeContent } from "@/content/home"
import styles from "./ClientMarquee.module.css"

export function ClientMarquee() {
  const { clientMarquee } = homeContent

  return (
    <section aria-label={clientMarquee.ariaLabel} className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.intro}>{clientMarquee.label}</p>
        <div className={styles.viewport}>
          <ul className={styles.track}>
            {clientMarquee.brands.map((brand) => (
              <li className={styles.brand} key={brand.id}>
                {brand.name}
              </li>
            ))}
            {clientMarquee.brands.map((brand) => (
              <li aria-hidden="true" className={styles.brand} key={`${brand.id}-duplicate`}>
                {brand.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
