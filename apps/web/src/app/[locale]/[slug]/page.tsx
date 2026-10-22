import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ROVE_RESERVED_SEGMENTS } from "@rove/cms/constants"
import { rovePageBySlugQuery, rovePageSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/rove-jsonld"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

const reserved = new Set<string>(ROVE_RESERVED_SEGMENTS)

type PageDoc = {
  title: string
  slug: string
  seo?: Parameters<typeof mapSeoToMetadata>[0]
  sections?: CmsSection[]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: rovePageSlugsQuery })) ?? []
  return rows.filter(({ slug }) => !reserved.has(slug)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (reserved.has(slug)) return { title: "Not found" }

  const doc = await sanityFetch<PageDoc>({ query: rovePageBySlugQuery, params: { slug } })
  if (!doc) return { title: "Page not found" }

  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    path: localePath(locale as Locale, `/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (reserved.has(slug)) notFound()

  const loc = locale as Locale
  const doc = await sanityFetch<PageDoc>({ query: rovePageBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: localePath(loc, "/") },
          { name: doc.title, path: localePath(loc, `/${slug}`) },
        ])}
      />
      <h1 className="text-3xl font-semibold">{doc.title}</h1>
      <div className="mt-10">
        <SectionRenderer sections={doc.sections} />
      </div>
    </main>
  )
}
