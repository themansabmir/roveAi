import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@rove/ui/components/button"
import { roveSiteSettingsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata, type SeoFields } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import { JsonLd } from "@/components/seo/JsonLd"
import { organizationJsonLd, softwareApplicationJsonLd, webSiteJsonLd } from "@/lib/seo/rove-jsonld"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"
import type { CmsSection } from "@rove/cms/types"

const FALLBACK = {
  siteName: "Rove",
  title: "Rove — Automated opportunity engine for local businesses",
  description:
    "Rove turns business prospects into researched, sales-ready opportunity briefs with evidence-based audits and AI reasoning.",
  hero: {
    eyebrow: "Opportunity engine for agencies",
    heading: "Researched, sales-ready briefs for every local business you target.",
    subheading:
      "Rove collects evidence once, scores opportunities deterministically, and lets AI turn the findings into a credible sales conversation — not just 500 business names.",
  },
  features: [
    {
      title: "Lead discovery",
      description:
        "Pull business prospects with profile, category, reviews, and Google Business Profile data.",
    },
    {
      title: "Evidence-based audits",
      description:
        "Run modular audits for technical SEO, performance, local visibility, and conversion paths.",
    },
    {
      title: "AI opportunity briefs",
      description:
        "Turn normalized evidence into ranked pain points, value propositions, and personalized outreach.",
    },
  ],
}

type SiteSettings = {
  siteName?: string
  defaultSeo?: SeoFields
  organization?: { legalName?: string; url?: string }
  homeHero?: CmsSection & { _type: "heroBlock" }
  homeFeatures?: CmsSection & { _type: "featureGridBlock" }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = isSanityConfigured()
    ? await sanityFetch<SiteSettings>({ query: roveSiteSettingsQuery })
    : null

  return mapSeoToMetadata(settings?.defaultSeo, {
    siteUrl: getSiteUrl(),
    title: settings?.defaultSeo?.title ?? FALLBACK.title,
    description: settings?.defaultSeo?.description ?? FALLBACK.description,
    path: localePath(locale as Locale, "/"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const settings = isSanityConfigured()
    ? await sanityFetch<SiteSettings>({ query: roveSiteSettingsQuery })
    : null

  const siteName = settings?.siteName ?? FALLBACK.siteName
  const hero = settings?.homeHero
  const features = settings?.homeFeatures

  const hasCmsHome = hero?.heading || features?.items?.length

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-20">
      <JsonLd
        data={[
          organizationJsonLd({ siteName, organization: settings?.organization }),
          webSiteJsonLd(siteName),
          softwareApplicationJsonLd(),
        ]}
      />

      {hasCmsHome ? (
        <SectionRenderer
          sections={[hero, features].filter(Boolean) as CmsSection[]}
        />
      ) : (
        <>
          <section className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {FALLBACK.hero.eyebrow}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{FALLBACK.hero.heading}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{FALLBACK.hero.subheading}</p>
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:5173"}>
                  Open dashboard
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">Learn more</Link>
              </Button>
            </div>
          </section>
          <section id="features" className="grid gap-6 sm:grid-cols-3">
            {FALLBACK.features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-card p-6">
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </section>
        </>
      )}

      <nav className="flex gap-4 text-sm">
        <Link href={localePath(locale as Locale, "/solutions")} className="text-primary underline-offset-4 hover:underline">
          Solutions
        </Link>
        <Link href={localePath(locale as Locale, "/blog")} className="text-primary underline-offset-4 hover:underline">
          Blog
        </Link>
      </nav>
    </main>
  )
}
