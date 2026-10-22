import type { MetadataRoute } from "next"
import { defaultLocale, ROVE_RESERVED_SEGMENTS } from "@rove/cms/constants"
import { roveSitemapEntriesQuery } from "@rove/cms/queries"
import { getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { getSanityClient } from "@/lib/sanity/client"

const reserved = new Set<string>(ROVE_RESERVED_SEGMENTS)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const loc = defaultLocale
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}${localePath(loc, "/")}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}${localePath(loc, "/solutions")}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}${localePath(loc, "/blog")}`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ]

  if (!isSanityConfigured()) return staticRoutes

  const client = getSanityClient()
  const entries = await client.fetch<{
    pages: { slug: string; _updatedAt: string }[]
    solutions: { slug: string; _updatedAt: string }[]
    posts: { slug: string; _updatedAt: string; publishedAt?: string }[]
  }>(roveSitemapEntriesQuery)

  const pages =
    entries?.pages
      ?.filter((p) => !reserved.has(p.slug))
      .map((p) => ({
        url: `${siteUrl}${localePath(loc, `/${p.slug}`)}`,
        lastModified: new Date(p._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })) ?? []

  const solutions =
    entries?.solutions?.map((s) => ({
      url: `${siteUrl}${localePath(loc, `/solutions/${s.slug}`)}`,
      lastModified: new Date(s._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })) ?? []

  const posts =
    entries?.posts?.map((p) => ({
      url: `${siteUrl}${localePath(loc, `/blog/${p.slug}`)}`,
      lastModified: new Date(p.publishedAt ?? p._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? []

  return [...staticRoutes, ...solutions, ...posts, ...pages]
}
