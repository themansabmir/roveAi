import Link from "next/link"
import type { Metadata } from "next"
import { agencyBlogPostsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { EmptyState, PageIntro } from "@/components/site/PageIntro"
import type { Locale } from "@rove/cms/constants"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Insights",
    description:
      "Practical notes on outbound, CRM hygiene and revenue operations for B2B sales teams.",
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
    <SiteChrome locale={loc}>
      <main>
        <PageIntro
          description="Practical notes on outbound, CRM hygiene and revenue operations for B2B sales teams."
          title="Insights"
        />
        <div className="rv-container py-12">
          {posts.length === 0 ? (
            <EmptyState
              action={{ label: "Book a 30-minute review", href: localePath(loc, "/contact") }}
              description="The first articles are being written. In the meantime, a review of your pipeline is the fastest way to get specific advice."
              title="No articles published yet"
            />
          ) : (
            <ul className="divide-y divide-line">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="group grid gap-2 py-8 md:grid-cols-12 md:gap-8"
                    href={localePath(loc, `/blog/${post.slug}`)}
                  >
                    <h2 className="rv-heading text-2xl transition-colors group-hover:text-brand md:col-span-6">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="text-quiet md:col-span-6">{post.excerpt}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </SiteChrome>
  )
}
