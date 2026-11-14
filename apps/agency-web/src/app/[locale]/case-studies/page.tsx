import Link from "next/link"
import type { Metadata } from "next"
import { agencyCaseStudiesListQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/agency-jsonld"
import { CtaPanel } from "@/components/site/CtaPanel"
import { CaseCard, serviceFor } from "@/components/work/CaseCard"
import { caseStudies, measures } from "@/content/work"

type CmsStudy = { title: string; client?: string; excerpt?: string; slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "RevOps case studies",
    description:
      "Outbound, lead intake and CRM systems ElqoraLabs has built and runs for B2B teams, including the one we run on ourselves.",
    path: localePath(locale as Locale, "/case-studies"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const ownSlugs = new Set(caseStudies.map((study) => study.slug))
  const cms = ((await sanityFetch<CmsStudy[]>({ query: agencyCaseStudiesListQuery })) ?? []).filter(
    (item) => !ownSlugs.has(item.slug),
  )
  const [featured, second, third] = caseStudies

  return (
    <SiteChrome locale={loc}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: localePath(loc, "/") },
          { name: "Case studies", path: localePath(loc, "/case-studies") },
        ])}
      />
      <main>
        <header className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--rv-line-c)/0.55)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />
          <div className="rv-container rv-intro relative grid gap-8 pb-14 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-end">
            <h1 className="rv-display text-[clamp(2.75rem,6.5vw,5.25rem)] lg:col-span-8">
              Built and running, not described.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-quiet lg:col-span-4">
              Systems we&apos;ve built for B2B teams, and the one we run on ourselves.
            </p>
          </div>
        </header>

        <section className="pb-24">
          <div className="rv-container grid gap-4 lg:grid-cols-12">
            {featured && (
              <div className="lg:col-span-7 lg:row-span-2" data-reveal>
                <CaseCard className="h-full min-h-[30rem]" featured locale={loc} study={featured} />
              </div>
            )}
            {[second, third].map(
              (study, index) =>
                study && (
                  <div
                    className="lg:col-span-5"
                    data-reveal
                    key={study.slug}
                    style={{ ["--rv-i" as string]: index + 1 }}
                  >
                    <CaseCard className="h-full" locale={loc} study={study} />
                  </div>
                ),
            )}
          </div>
        </section>

        <section className="bg-ink py-24 text-white lg:py-28">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                What we measure on every build.
              </h2>
              <p
                className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:pt-2"
                data-reveal
              >
                Every system reports against the same numbers in a weekly report from a named
                operator. Results appear on this page once they&apos;re measured.
              </p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {measures.map((group, index) => {
                const service = serviceFor(group.serviceId)
                if (!service) return null
                return (
                  <Link
                    className="group flex flex-col rounded-3xl border border-ink-line bg-ink-2 p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-bright/40"
                    data-reveal
                    href={localePath(loc, `/services/${service.slug}`)}
                    key={group.serviceId}
                    style={{ ["--rv-i" as string]: index }}
                  >
                    <span className="font-mono text-sm text-brand-bright">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="rv-heading mt-4 text-2xl group-hover:text-brand-bright">
                      {service.name}
                    </h3>
                    <ul className="mt-6 space-y-2.5">
                      {group.metrics.map((metric) => (
                        <li
                          className="flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm"
                          key={metric}
                        >
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-brand-bright"
                          />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {cms.length > 0 && (
          <section className="py-24">
            <div className="rv-container">
              <h2 className="rv-heading text-3xl" data-reveal>
                More case studies
              </h2>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {cms.map((item) => (
                  <li key={item.slug}>
                    <Link
                      className="group grid gap-2 py-8 md:grid-cols-12 md:gap-8"
                      href={localePath(loc, `/case-studies/${item.slug}`)}
                    >
                      <div className="md:col-span-5">
                        <h3 className="rv-heading text-2xl transition-colors group-hover:text-brand">
                          {item.title}
                        </h3>
                        {item.client ? (
                          <p className="mt-1 text-sm text-quiet">{item.client}</p>
                        ) : null}
                      </div>
                      {item.excerpt ? (
                        <p className="text-quiet md:col-span-7">{item.excerpt}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <CtaPanel
          description="We'll map where your revenue line breaks and which system we'd build for you first."
          locale={loc}
          title="Your system could be next."
        />
      </main>
    </SiteChrome>
  )
}
