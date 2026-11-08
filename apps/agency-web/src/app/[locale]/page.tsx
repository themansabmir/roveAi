import type { Metadata } from "next"
import { agencyBlogPostsQuery, agencySiteSettingsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { HomePage, type HomePost } from "@/components/home/HomePage"
import { JsonLd } from "@/components/seo/JsonLd"
import { professionalServiceJsonLd } from "@/lib/seo/agency-jsonld"
import { homeMetadata } from "@/content/home"
import { brand } from "@/content/brand"
import type { Locale } from "@rove/cms/constants"

type Settings = {
  business?: Parameters<typeof professionalServiceJsonLd>[0]["business"]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(undefined, {
    siteUrl: getSiteUrl(),
    title: homeMetadata.title,
    description: homeMetadata.description,
    path: localePath(locale as Locale, "/"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function AgencyHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [settings, posts] = isSanityConfigured()
    ? await Promise.all([
        sanityFetch<Settings>({ query: agencySiteSettingsQuery }),
        sanityFetch<HomePost[]>({ query: agencyBlogPostsQuery, params: { start: 0, end: 3 } }),
      ])
    : [null, null]

  return (
    <>
      <JsonLd
        data={professionalServiceJsonLd({
          siteName: brand.name,
          business: {
            ...settings?.business,
            name: brand.name,
            description: homeMetadata.description,
          },
        })}
      />
      <HomePage locale={locale as Locale} posts={posts ?? []} />
    </>
  )
}
