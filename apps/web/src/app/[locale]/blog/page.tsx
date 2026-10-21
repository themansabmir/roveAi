import Link from "next/link"
import type { Metadata } from "next"
import { roveBlogPostsCountQuery, roveBlogPostsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/rove-jsonld"
import type { Locale } from "@rove/cms/constants"

const PAGE_SIZE = 12

type BlogListItem = {
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { page } = await searchParams
  const pageNum = Math.max(1, Number(page) || 1)
  const count = (await sanityFetch<number>({ query: roveBlogPostsCountQuery })) ?? 0
  const noIndex = count === 0 || pageNum > 1

  const meta = mapSeoToMetadata(
    noIndex ? { noIndex: true } : null,
    {
      siteUrl: getSiteUrl(),
      title: pageNum > 1 ? `Blog — Page ${pageNum}` : "Blog",
      description: "Product updates, guides, and go-to-market playbooks for local opportunity research.",
      path: localePath(locale as Locale, pageNum > 1 ? `/blog?page=${pageNum}` : "/blog"),
      sanityProjectId: getSanityProjectId(),
      sanityDataset: getSanityDataset(),
    },
  )
  return meta
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const { page } = await searchParams
  const loc = locale as Locale
  const pageNum = Math.max(1, Number(page) || 1)
  const start = (pageNum - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const posts =
    (await sanityFetch<BlogListItem[]>({
      query: roveBlogPostsQuery,
      params: { start, end },
    })) ?? []
  const total = (await sanityFetch<number>({ query: roveBlogPostsCountQuery })) ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: localePath(loc, "/") },
          { name: "Blog", path: localePath(loc, "/blog") },
        ])}
      />
      <h1 className="text-3xl font-semibold">Blog</h1>
      <ul className="mt-10 space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={localePath(loc, `/blog/${post.slug}`)} className="text-xl font-medium text-primary hover:underline">
              {post.title}
            </Link>
            {post.excerpt ? <p className="mt-2 text-muted-foreground">{post.excerpt}</p> : null}
            {post.publishedAt ? (
              <time className="mt-1 block text-xs text-muted-foreground" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
          </li>
        ))}
      </ul>
      {posts.length === 0 ? <p className="mt-8 text-sm text-muted-foreground">No posts yet.</p> : null}
      {totalPages > 1 ? (
        <nav className="mt-12 flex gap-4 text-sm">
          {pageNum > 1 ? (
            <Link href={localePath(loc, `/blog?page=${pageNum - 1}`)} className="text-primary hover:underline">
              Previous
            </Link>
          ) : null}
          {pageNum < totalPages ? (
            <Link href={localePath(loc, `/blog?page=${pageNum + 1}`)} className="text-primary hover:underline">
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  )
}
