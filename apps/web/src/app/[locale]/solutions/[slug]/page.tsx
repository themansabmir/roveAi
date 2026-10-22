import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { roveSolutionBySlugQuery, roveSolutionSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/rove-jsonld"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

type SolutionDoc = {
  title: string
  summary?: string
  slug: string
  seo?: Parameters<typeof mapSeoToMetadata>[0]
  sections?: CmsSection[]
  relatedSolutions?: { title: string; slug: string }[]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: roveSolutionSlugsQuery })) ?? []
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = await sanityFetch<SolutionDoc>({ query: roveSolutionBySlugQuery, params: { slug } })
  if (!doc) return { title: "Solution not found" }

  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    description: doc.summary,
    path: localePath(locale as Locale, `/solutions/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const loc = locale as Locale
  const doc = await sanityFetch<SolutionDoc>({ query: roveSolutionBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: localePath(loc, "/") },
          { name: "Solutions", path: localePath(loc, "/solutions") },
          { name: doc.title, path: localePath(loc, `/solutions/${slug}`) },
        ])}
      />
      <header>
        <h1 className="text-3xl font-semibold">{doc.title}</h1>
        {doc.summary ? <p className="mt-3 text-lg text-muted-foreground">{doc.summary}</p> : null}
      </header>
      <SectionRenderer sections={doc.sections} />
      {doc.relatedSolutions && doc.relatedSolutions.length > 0 ? (
        <aside>
          <h2 className="text-lg font-semibold">Related solutions</h2>
          <ul className="mt-3 space-y-2">
            {doc.relatedSolutions.map((related) => (
              <li key={related.slug}>
                <Link href={localePath(loc, `/solutions/${related.slug}`)} className="text-primary hover:underline">
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </main>
  )
}
