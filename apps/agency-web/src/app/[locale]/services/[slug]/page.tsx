import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { agencyServiceBySlugQuery, agencyServiceSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { serviceJsonLd } from "@/lib/seo/agency-jsonld"
import { JsonLd } from "@/components/seo/JsonLd"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { SiteChrome } from "@/components/site/SiteChrome"
import { PageIntro } from "@/components/site/PageIntro"
import { ServicePage } from "@/components/services/ServicePage"
import { services } from "@/content/revops"

type Doc = {
  title: string
  summary?: string
  slug: string
  seo?: Parameters<typeof mapSeoToMetadata>[0]
  sections?: CmsSection[]
}

const findService = (slug: string) => services.items.find((item) => item.slug === slug)

export async function generateStaticParams() {
  const own = services.items.map((item) => ({ slug: item.slug }))
  if (!isSanityConfigured()) return own
  const rows = (await sanityFetch<{ slug: string }[]>({ query: agencyServiceSlugsQuery })) ?? []
  return [...own, ...rows.filter(({ slug }) => !findService(slug)).map(({ slug }) => ({ slug }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const own = findService(slug)
  const doc = own
    ? null
    : await sanityFetch<Doc>({ query: agencyServiceBySlugQuery, params: { slug } })
  if (!own && !doc) return { title: "Page not found", robots: { index: false, follow: true } }
  return mapSeoToMetadata(doc?.seo, {
    siteUrl: getSiteUrl(),
    title: own?.name ?? doc!.title,
    description: own?.promise ?? doc?.summary,
    path: localePath(locale as Locale, `/services/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function ServiceRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const loc = locale as Locale
  const own = findService(slug)

  if (own) {
    return (
      <SiteChrome locale={loc}>
        <JsonLd
          data={[
            serviceJsonLd({ title: own.name, summary: own.promise, slug: own.slug }),
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: own.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]}
        />
        <ServicePage locale={loc} service={own} />
      </SiteChrome>
    )
  }

  const doc = await sanityFetch<Doc>({ query: agencyServiceBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <SiteChrome locale={loc}>
      <main>
        <JsonLd data={serviceJsonLd(doc)} />
        <PageIntro
          crumb={{ label: "Services", href: localePath(loc, "/services") }}
          description={doc.summary}
          title={doc.title}
        />
        <div className="rv-container py-16">
          <SectionRenderer sections={doc.sections} />
        </div>
      </main>
    </SiteChrome>
  )
}
