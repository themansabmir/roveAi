import Link from "next/link"
import type { Metadata } from "next"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { ServiceFinder, ServicesMap } from "@/components/services/ServicesOverview"
import { NextStep } from "@/components/blocks/Blocks"
import { HireInstead } from "@/components/blocks/TrustSections"
import { services } from "@/content/revops"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Services",
    description:
      "Pipeline generation, sales and CRM systems, and revenue operations for B2B teams. Built once in your accounts, yours to keep.",
    path: localePath(locale as Locale, "/services"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale

  return (
    <SiteChrome locale={loc}>
      <main>
        <header className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--rv-line-c)/0.55)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />
          <div className="rv-container relative pb-20 pt-14 sm:pt-20">
            <div className="rv-intro grid gap-8 lg:grid-cols-12 lg:items-end">
              <h1 className="rv-display text-[clamp(2.75rem,6.5vw,5.25rem)] lg:col-span-8">
                Three systems. One revenue line.
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-quiet lg:col-span-4">
                Each covers part of the journey from first touch to repeat revenue. Start with one,
                connect the rest when you&apos;re ready.
              </p>
            </div>
            <div className="mt-14" style={{ animation: "rv-fade-up 800ms 200ms both" }}>
              <ServicesMap locale={loc} />
            </div>
          </div>
        </header>

        <section className="border-t border-line">
          {services.items.map((item, index) => (
            <article
              className="border-b border-line py-20 lg:py-24"
              data-reveal
              id={item.id}
              key={item.id}
            >
              <div className="rv-container grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <span className="rv-display text-7xl text-brand/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="rv-heading mt-4 text-4xl sm:text-5xl">{item.name}</h2>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-quiet">{item.promise}</p>
                  <Link
                    className="rv-btn-primary mt-8"
                    href={localePath(loc, `/services/${item.slug}`)}
                  >
                    Explore {item.name}
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                  <div className="rounded-2xl bg-ink p-6 text-white sm:col-span-2">
                    <p className="text-xs font-semibold text-ink-muted">The problem it solves</p>
                    <p className="rv-heading mt-3 text-2xl">{item.problem.title}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface p-6">
                    <p className="text-xs font-semibold text-quiet">What we build</p>
                    <ul className="mt-3 space-y-2 text-[15px]">
                      {item.builds.slice(0, 3).map((build) => (
                        <li className="flex gap-2.5" key={build}>
                          <span
                            aria-hidden="true"
                            className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                          />
                          {build}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col rounded-2xl border border-brand/25 bg-brand-tint p-6">
                    <p className="text-xs font-semibold text-brand-deep">After handover</p>
                    <p className="mt-3 text-[15px] leading-relaxed">{item.keeps}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="bg-ink py-24 text-white lg:py-28">
          <div className="rv-container">
            <h2 className="rv-heading max-w-2xl text-4xl sm:text-5xl" data-reveal>
              Not sure where to start?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted" data-reveal>
              Most teams feel one problem first. Pick yours and we&apos;ll point you to the system
              that fixes it.
            </p>
            <div className="mt-12" data-reveal>
              <ServiceFinder locale={loc} />
            </div>
          </div>
        </section>

        <HireInstead locale={loc} />

        <NextStep
          description="We'll map your revenue line on a call and tell you which system to build first, or whether you need one at all."
          locale={loc}
          title="Find your starting point in 30 minutes."
        />
      </main>
    </SiteChrome>
  )
}
