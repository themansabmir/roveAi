import Link from "next/link"
import type { Metadata } from "next"
import { roveSolutionsListQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/rove-jsonld"
import type { Locale } from "@rove/cms/constants"

type SolutionListItem = { title: string; summary?: string; slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Solutions",
    description: "How Rove helps agencies research and close local business opportunities.",
    path: localePath(locale as Locale, "/solutions"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function SolutionsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const solutions = (await sanityFetch<SolutionListItem[]>({ query: roveSolutionsListQuery })) ?? []

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: localePath(loc, "/") },
          { name: "Solutions", path: localePath(loc, "/solutions") },
        ])}
      />
      <h1 className="text-3xl font-semibold">Solutions</h1>
      <p className="mt-2 text-muted-foreground">
        Evidence-based workflows for agency prospecting and sales-ready briefs.
      </p>
      <ul className="mt-10 space-y-6">
        {solutions.map((item) => (
          <li key={item.slug}>
            <Link
              href={localePath(loc, `/solutions/${item.slug}`)}
              className="text-lg font-medium text-primary hover:underline"
            >
              {item.title}
            </Link>
            {item.summary ? <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p> : null}
          </li>
        ))}
      </ul>
      {solutions.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No solutions published yet.</p>
      ) : null}
    </main>
  )
}
