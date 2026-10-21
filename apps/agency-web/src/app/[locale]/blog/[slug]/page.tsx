import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { agencyBlogPostBySlugQuery, agencyBlogPostSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { PortableTextBlock } from "@/components/sanity/PortableTextBlock"
import type { Locale } from "@rove/cms/constants"

type Doc = {
  title: string
  excerpt?: string
  slug: string
  body?: unknown[]
  seo?: Parameters<typeof mapSeoToMetadata>[0]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: agencyBlogPostSlugsQuery })) ?? []
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = await sanityFetch<Doc>({ query: agencyBlogPostBySlugQuery, params: { slug } })
  if (!doc) return { title: "Post" }
  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    description: doc.excerpt,
    path: localePath(locale as Locale, `/blog/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const doc = await sanityFetch<Doc>({ query: agencyBlogPostBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <h1 className="text-3xl font-semibold">{doc.title}</h1>
        <div className="mt-8">
          <PortableTextBlock value={doc.body} />
        </div>
      </article>
    </main>
  )
}
