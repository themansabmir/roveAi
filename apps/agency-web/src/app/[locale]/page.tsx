import Link from "next/link"
import type { Metadata } from "next"
import { agencySiteSettingsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { JsonLd } from "@/components/seo/JsonLd"
import { professionalServiceJsonLd } from "@/lib/seo/agency-jsonld"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

type Settings = {
  siteName?: string
  defaultSeo?: Parameters<typeof mapSeoToMetadata>[0]
  business?: Parameters<typeof professionalServiceJsonLd>[0]["business"]
  homeHero?: CmsSection
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const settings = isSanityConfigured()
    ? await sanityFetch<Settings>({ query: agencySiteSettingsQuery })
    : null
  return mapSeoToMetadata(settings?.defaultSeo, {
    siteUrl: getSiteUrl(),
    title: settings?.siteName ?? "Agency",
    description: settings?.business?.description ?? "Digital marketing agency",
    path: localePath(locale as Locale, "/"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function AgencyHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const settings = isSanityConfigured()
    ? await sanityFetch<Settings>({ query: agencySiteSettingsQuery })
    : null

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-20">
      <JsonLd data={professionalServiceJsonLd({ siteName: settings?.siteName, business: settings?.business })} />
      {settings?.homeHero ? (
        <SectionRenderer sections={[settings.homeHero]} />
      ) : (
        <section>
          <h1 className="text-4xl font-semibold">{settings?.siteName ?? "Your agency"}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {settings?.business?.description ?? "Services, case studies, and insights — powered by Sanity."}
          </p>
        </section>
      )}
      <nav className="flex gap-4 text-sm">
        <Link href={localePath(loc, "/services")} className="text-primary hover:underline">
          Services
        </Link>
        <Link href={localePath(loc, "/work")} className="text-primary hover:underline">
          Work
        </Link>
        <Link href={localePath(loc, "/blog")} className="text-primary hover:underline">
          Blog
        </Link>
      </nav>
    </main>
  )
}
