import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { agencyCaseStudyBySlugQuery, agencyCaseStudySlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { PortableTextBlock } from "@/components/sanity/PortableTextBlock"
import { SiteChrome } from "@/components/site/SiteChrome"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/agency-jsonld"
import { PageIntro } from "@/components/site/PageIntro"
import { CaseStudyView } from "@/components/work/CaseStudyView"
import { caseStudies } from "@/content/work"

type Doc = {
  title: string
  client?: string
  excerpt?: string
  slug: string
  body?: unknown[]
  seo?: Parameters<typeof mapSeoToMetadata>[0]
}

const findStudy = (slug: string) => caseStudies.find((study) => study.slug === slug)

export async function generateStaticParams() {
  const own = caseStudies.map(({ slug }) => ({ slug }))
  if (!isSanityConfigured()) return own
  const rows = (await sanityFetch<{ slug: string }[]>({ query: agencyCaseStudySlugsQuery })) ?? []
  return [...own, ...rows.filter(({ slug }) => !findStudy(slug)).map(({ slug }) => ({ slug }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const own = findStudy(slug)
  const doc = own
    ? null
    : await sanityFetch<Doc>({ query: agencyCaseStudyBySlugQuery, params: { slug } })
  if (!own && !doc) return { title: "Page not found", robots: { index: false, follow: true } }
  return mapSeoToMetadata(doc?.seo, {
    siteUrl: getSiteUrl(),
    title: own ? `${own.client} RevOps case study` : doc!.title,
    description: own?.summary ?? doc?.excerpt,
    path: localePath(locale as Locale, `/case-studies/${slug}`),
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
  const loc = locale as Locale
  const own = findStudy(slug)

  if (own) {
    return (
      <SiteChrome locale={loc}>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: localePath(loc, "/") },
            { name: "Case studies", path: localePath(loc, "/case-studies") },
            { name: own.client, path: localePath(loc, `/case-studies/${own.slug}`) },
          ])}
        />
        <CaseStudyView locale={loc} study={own} />
      </SiteChrome>
    )
  }

  const doc = await sanityFetch<Doc>({ query: agencyCaseStudyBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <SiteChrome locale={loc}>
      <main>
        <article>
          <PageIntro
            crumb={{ label: "Case studies", href: localePath(loc, "/case-studies") }}
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
            <Link className="rv-btn-primary" href={localePath(loc, "/contact")}>
              Book a 30-minute review
            </Link>
          </div>
        </article>
      </main>
    </SiteChrome>
  )
}
