import Link from "next/link"
import type { Metadata } from "next"
import { agencyServicesListQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Services",
    description: "Marketing and growth services.",
    path: localePath(locale as Locale, "/services"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const services =
    (await sanityFetch<{ title: string; summary?: string; slug: string }[]>({
      query: agencyServicesListQuery,
    })) ?? []

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Services</h1>
      <ul className="mt-10 space-y-6">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={localePath(loc, `/services/${s.slug}`)} className="text-lg font-medium text-primary hover:underline">
              {s.title}
            </Link>
            {s.summary ? <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
