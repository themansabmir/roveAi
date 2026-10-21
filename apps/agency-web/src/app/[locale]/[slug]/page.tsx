import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AGENCY_RESERVED_SEGMENTS } from "@rove/cms/constants"
import { agencyPageBySlugQuery, agencyPageSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

const reserved = new Set<string>(AGENCY_RESERVED_SEGMENTS)

type Doc = {
  title: string
  slug: string
  seo?: Parameters<typeof mapSeoToMetadata>[0]
  sections?: CmsSection[]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: agencyPageSlugsQuery })) ?? []
  return rows.filter(({ slug }) => !reserved.has(slug)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (reserved.has(slug)) return { title: "Not found" }
  const doc = await sanityFetch<Doc>({ query: agencyPageBySlugQuery, params: { slug } })
  if (!doc) return { title: "Page" }
  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    path: localePath(locale as Locale, `/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function AgencyCmsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  if (reserved.has(slug)) notFound()
  const doc = await sanityFetch<Doc>({ query: agencyPageBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{doc.title}</h1>
      <div className="mt-10">
        <SectionRenderer sections={doc.sections} />
      </div>
    </main>
  )
}
