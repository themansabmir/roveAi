import Link from "next/link"
import type { Metadata } from "next"
import { agencyCaseStudiesListQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Work",
    description: "Case studies and client outcomes.",
    path: localePath(locale as Locale, "/work"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const items =
    (await sanityFetch<
      { title: string; client?: string; excerpt?: string; slug: string }[]
    >({ query: agencyCaseStudiesListQuery })) ?? []

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Work</h1>
      <ul className="mt-10 space-y-8">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={localePath(loc, `/work/${item.slug}`)} className="text-xl font-medium text-primary hover:underline">
              {item.title}
            </Link>
            {item.client ? <p className="text-sm text-muted-foreground">{item.client}</p> : null}
            {item.excerpt ? <p className="mt-2 text-muted-foreground">{item.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
