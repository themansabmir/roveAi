import { notFound, permanentRedirect } from "next/navigation"
import type { Metadata } from "next"
import { AGENCY_RESERVED_SEGMENTS } from "@rove/cms/constants"
import { agencyPageBySlugQuery, agencyPageSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { SiteChrome } from "@/components/site/SiteChrome"
import { PageIntro } from "@/components/site/PageIntro"
import { getLegacySiteRedirect, reservedSiteSlugs } from "@/content/siteMap"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

const reserved = new Set<string>([...AGENCY_RESERVED_SEGMENTS, ...reservedSiteSlugs])

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
  if (reserved.has(slug)) return { title: "Page not found" }
  const doc = await sanityFetch<Doc>({ query: agencyPageBySlugQuery, params: { slug } })
  if (!doc) return { title: "Page not found", robots: { index: false, follow: true } }
  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    path: localePath(locale as Locale, `/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function AgencyCmsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const redirectTo = getLegacySiteRedirect(slug)
  if (redirectTo) permanentRedirect(localePath(locale as Locale, redirectTo))
  if (reserved.has(slug)) notFound()
  const doc = await sanityFetch<Doc>({ query: agencyPageBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <SiteChrome locale={locale as Locale}>
      <main>
        <PageIntro title={doc.title} />
        <div className="rv-container py-16">
          <SectionRenderer sections={doc.sections} />
        </div>
      </main>
    </SiteChrome>
  )
}
