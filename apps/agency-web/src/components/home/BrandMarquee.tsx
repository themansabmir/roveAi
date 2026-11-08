import { homeContent } from "@/content/home"

type Brand = { id: string; name: string; logo?: string }

const MIN_ITEMS = 8

export function BrandMarquee() {
  const brands: readonly Brand[] = homeContent.clientMarquee.brands
  if (brands.length === 0) return null

  // Repeat short lists so one run is always wider than the viewport.
  const run = Array.from(
    { length: Math.max(1, Math.ceil(MIN_ITEMS / brands.length)) },
    () => brands,
  ).flat()

  return (
    <div className="rv-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <ul className="sr-only">
        {brands.map((brand) => (
          <li key={brand.id}>{brand.name}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="rv-marquee-track flex w-max"
        style={{ ["--rv-marquee-duration" as string]: `${run.length * 4}s` }}
      >
        {[0, 1].map((copy) => (
          <ul className="flex shrink-0 items-center" key={copy}>
            {run.map((brand, index) => (
              <li
                className="group flex h-16 items-center px-8 sm:px-12"
                key={`${copy}-${brand.id}-${index}`}
              >
                {brand.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="h-7 w-auto opacity-60 grayscale transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    src={brand.logo}
                  />
                ) : (
                  <span className="rv-heading whitespace-nowrap text-2xl text-ink/45 transition-colors duration-300 group-hover:text-ink sm:text-[1.75rem]">
                    {brand.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
