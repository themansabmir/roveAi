import Link from "next/link"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { agencyServicesListQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"
import { SiteChrome } from "@/components/site/SiteChrome"
import { PageIntro } from "@/components/site/PageIntro"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Service details",
    description:
      "Detailed scopes for Syntropic's outbound, CRM and revenue operations services.",
    path: localePath(locale as Locale, "/services"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const services =
    (await sanityFetch<{ title: string; summary?: string; slug: string }[]>({
      query: agencyServicesListQuery,
    })) ?? []

  // The service overview lives at /what-we-build; this index only exists for CMS service detail pages.
  if (services.length === 0) redirect(localePath(loc, "/what-we-build"))

  return (
    <SiteChrome locale={loc}>
      <main>
        <PageIntro
          crumb={{ label: "Services overview", href: localePath(loc, "/what-we-build") }}
          description="Detailed scopes for each part of the revenue system."
          title="Service details"
        />
        <ul className="rv-container divide-y divide-line py-10">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                className="group grid gap-2 py-8 md:grid-cols-12 md:gap-8"
                href={localePath(loc, `/services/${s.slug}`)}
              >
                <h2 className="rv-heading text-2xl transition-colors group-hover:text-brand md:col-span-5">
                  {s.title}
                </h2>
                {s.summary ? (
                  <p className="text-quiet md:col-span-7">{s.summary}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </SiteChrome>
  )
}
