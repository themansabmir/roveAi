import type { MetadataRoute } from "next"
import { AGENCY_RESERVED_SEGMENTS, defaultLocale } from "@rove/cms/constants"
import { agencySitemapEntriesQuery } from "@rove/cms/queries"
import { getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { getSanityClient } from "@/lib/sanity/client"

const reserved = new Set<string>(AGENCY_RESERVED_SEGMENTS)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const loc = defaultLocale
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}${localePath(loc, "/")}`, lastModified: now },
    { url: `${siteUrl}${localePath(loc, "/services")}`, lastModified: now },
    { url: `${siteUrl}${localePath(loc, "/work")}`, lastModified: now },
    { url: `${siteUrl}${localePath(loc, "/blog")}`, lastModified: now },
  ]

  if (!isSanityConfigured()) return staticRoutes

  const entries = await getSanityClient().fetch<{
    pages: { slug: string; _updatedAt: string }[]
    services: { slug: string; _updatedAt: string }[]
    caseStudies: { slug: string; _updatedAt: string }[]
    posts: { slug: string; _updatedAt: string }[]
  }>(agencySitemapEntriesQuery)

  return [
    ...staticRoutes,
    ...(entries?.services?.map((s) => ({
      url: `${siteUrl}${localePath(loc, `/services/${s.slug}`)}`,
      lastModified: new Date(s._updatedAt),
    })) ?? []),
    ...(entries?.caseStudies?.map((c) => ({
      url: `${siteUrl}${localePath(loc, `/work/${c.slug}`)}`,
      lastModified: new Date(c._updatedAt),
    })) ?? []),
    ...(entries?.posts?.map((p) => ({
      url: `${siteUrl}${localePath(loc, `/blog/${p.slug}`)}`,
      lastModified: new Date(p._updatedAt),
    })) ?? []),
    ...(entries?.pages
      ?.filter((p) => !reserved.has(p.slug))
      .map((p) => ({
        url: `${siteUrl}${localePath(loc, `/${p.slug}`)}`,
        lastModified: new Date(p._updatedAt),
      })) ?? []),
  ]
}
