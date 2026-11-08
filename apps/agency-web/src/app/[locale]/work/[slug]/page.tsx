import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { agencyCaseStudyBySlugQuery, agencyCaseStudySlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { PortableTextBlock } from "@/components/sanity/PortableTextBlock"
import type { Locale } from "@rove/cms/constants"
import { SiteChrome } from "@/components/site/SiteChrome"
import { PageIntro } from "@/components/site/PageIntro"

type Doc = {
  title: string
  client?: string
  excerpt?: string
  slug: string
  body?: unknown[]
  seo?: Parameters<typeof mapSeoToMetadata>[0]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: agencyCaseStudySlugsQuery })) ?? []
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = await sanityFetch<Doc>({ query: agencyCaseStudyBySlugQuery, params: { slug } })
  if (!doc) return { title: "Case study" }
  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    description: doc.excerpt,
    path: localePath(locale as Locale, `/work/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const doc = await sanityFetch<Doc>({ query: agencyCaseStudyBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <SiteChrome locale={locale as Locale}>
      <main>
        <article>
          <PageIntro
            crumb={{ label: "Work", href: localePath(locale as Locale, "/work") }}
            description={doc.excerpt}
            title={doc.title}
          >
            {doc.client ? <p className="mt-6 text-sm text-quiet">Client: {doc.client}</p> : null}
          </PageIntro>
          <div className="rv-container py-16">
            <div className="rv-prose">
              <PortableTextBlock value={doc.body} />
            </div>
          </div>
          <div className="rv-container pb-24">
            <Link className="rv-btn-primary" href={localePath(locale as Locale, "/contact")}>
              Book a 30-minute review
            </Link>
          </div>
        </article>
      </main>
    </SiteChrome>
  )
}
