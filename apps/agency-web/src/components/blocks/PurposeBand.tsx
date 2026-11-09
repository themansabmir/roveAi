import { about } from "@/content/about"

/** Full-bleed green marquee carrying the purpose line. */
export function PurposeBand() {
  const run = Array.from({ length: 4 }, () => about.purpose)
  return (
    <section
      aria-label="Our purpose"
      className="rv-marquee overflow-hidden bg-brand py-10 text-white sm:py-14"
    >
      <p className="sr-only">{about.purpose}</p>
      <div
        aria-hidden="true"
        className="rv-marquee-track flex w-max"
        style={{ ["--rv-marquee-duration" as string]: "36s" }}
      >
        {[0, 1].map((copy) => (
          <div className="flex shrink-0" key={copy}>
            {run.map((line, index) => (
              <span
                className="rv-display flex items-center whitespace-nowrap pr-12 text-5xl sm:text-7xl"
                key={index}
              >
                {line}
                <span className="ml-12 inline-block h-5 w-5 rounded-full bg-brand-bright sm:h-7 sm:w-7" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
