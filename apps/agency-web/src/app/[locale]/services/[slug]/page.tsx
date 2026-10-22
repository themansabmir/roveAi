import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { agencyServiceBySlugQuery, agencyServiceSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { JsonLd } from "@/components/seo/JsonLd"
import { serviceJsonLd } from "@/lib/seo/agency-jsonld"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

type Doc = {
  title: string
  summary?: string
  slug: string
  seo?: Parameters<typeof mapSeoToMetadata>[0]
  sections?: CmsSection[]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: agencyServiceSlugsQuery })) ?? []
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = await sanityFetch<Doc>({ query: agencyServiceBySlugQuery, params: { slug } })
  if (!doc) return { title: "Service" }
  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    description: doc.summary,
    path: localePath(locale as Locale, `/services/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const doc = await sanityFetch<Doc>({ query: agencyServiceBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={serviceJsonLd(doc)} />
      <h1 className="text-3xl font-semibold">{doc.title}</h1>
      {doc.summary ? <p className="mt-3 text-muted-foreground">{doc.summary}</p> : null}
      <div className="mt-10">
        <SectionRenderer sections={doc.sections} />
      </div>
    </main>
  )
}
