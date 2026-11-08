import Link from "next/link"
import type { Metadata } from "next"
import { agencyCaseStudiesListQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"
import { SiteChrome } from "@/components/site/SiteChrome"
import { PageIntro } from "@/components/site/PageIntro"
import { homeContent } from "@/content/home"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Work",
    description:
      "Outbound, lead intake and CRM systems Syntropic has built and runs for B2B teams.",
    path: localePath(locale as Locale, "/work"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const items =
    (await sanityFetch<{ title: string; client?: string; excerpt?: string; slug: string }[]>({
      query: agencyCaseStudiesListQuery,
    })) ?? []

  return (
    <SiteChrome locale={loc}>
      <main>
        <PageIntro description={homeContent.proof.note} title={homeContent.proof.title} />
        <div className="rv-container py-12">
          {items.length > 0 ? (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    className="group grid gap-2 py-8 md:grid-cols-12 md:gap-8"
                    href={localePath(loc, `/work/${item.slug}`)}
                  >
                    <div className="md:col-span-5">
                      <h2 className="rv-heading text-2xl transition-colors group-hover:text-brand">
                        {item.title}
                      </h2>
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
          ) : (
            <ul className="divide-y divide-line">
              {homeContent.proof.projects.map((project) => (
                <li className="grid gap-4 py-10 md:grid-cols-12 md:gap-8" key={project.id}>
                  <div className="md:col-span-4">
                    <h2 className="rv-heading text-3xl">{project.name}</h2>
                    <p className="mt-1 text-sm text-quiet">{project.path}</p>
                  </div>
                  <div className="md:col-span-8">
                    <p className="max-w-2xl text-lg leading-relaxed">{project.claim}</p>
                    <p className="mt-4 text-[15px] text-quiet">{project.flowDescription}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link className="rv-btn-primary mt-12" href={localePath(loc, "/contact")}>
            Book a 30-minute review
          </Link>
        </div>
      </main>
    </SiteChrome>
  )
}
