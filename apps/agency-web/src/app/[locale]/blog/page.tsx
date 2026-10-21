import Link from "next/link"
import type { Metadata } from "next"
import { agencyBlogPostsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Blog",
    path: localePath(locale as Locale, "/blog"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const posts =
    (await sanityFetch<{ title: string; excerpt?: string; slug: string }[]>({
      query: agencyBlogPostsQuery,
      params: { start: 0, end: 24 },
    })) ?? []

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <ul className="mt-10 space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={localePath(loc, `/blog/${post.slug}`)} className="text-xl font-medium text-primary hover:underline">
              {post.title}
            </Link>
            {post.excerpt ? <p className="mt-2 text-muted-foreground">{post.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
