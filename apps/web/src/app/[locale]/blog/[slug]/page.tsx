import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { roveBlogPostBySlugQuery, roveBlogPostSlugsQuery } from "@rove/cms/queries"
import { mapSeoToMetadata } from "@rove/cms/seo"
import { sanityFetch } from "@/lib/sanity/fetch"
import { getSanityDataset, getSanityProjectId, getSiteUrl, isSanityConfigured } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { PortableTextBlock } from "@/components/sanity/PortableTextBlock"
import { JsonLd } from "@/components/seo/JsonLd"
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/rove-jsonld"
import type { Locale } from "@rove/cms/constants"

type BlogPost = {
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
  body?: unknown[]
  seo?: Parameters<typeof mapSeoToMetadata>[0]
  author?: { name?: string; role?: string } | null
  relatedSolutions?: { title: string; slug: string }[]
}

export async function generateStaticParams() {
  if (!isSanityConfigured()) return []
  const rows = (await sanityFetch<{ slug: string }[]>({ query: roveBlogPostSlugsQuery })) ?? []
  return rows.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = await sanityFetch<BlogPost>({ query: roveBlogPostBySlugQuery, params: { slug } })
  if (!doc) return { title: "Post not found" }

  return mapSeoToMetadata(doc.seo, {
    siteUrl: getSiteUrl(),
    title: doc.title,
    description: doc.excerpt,
    path: localePath(locale as Locale, `/blog/${slug}`),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const loc = locale as Locale
  const doc = await sanityFetch<BlogPost>({ query: roveBlogPostBySlugQuery, params: { slug } })
  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: localePath(loc, "/") },
            { name: "Blog", path: localePath(loc, "/blog") },
            { name: doc.title, path: localePath(loc, `/blog/${slug}`) },
          ]),
          blogPostingJsonLd(doc),
        ]}
      />
      <article>
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">{doc.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {doc.publishedAt ? (
              <time dateTime={doc.publishedAt}>
                {new Date(doc.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            ) : null}
            {doc.author?.name ? <span>· {doc.author.name}</span> : null}
          </div>
          {doc.excerpt ? <p className="mt-4 text-lg text-muted-foreground">{doc.excerpt}</p> : null}
        </header>
        <PortableTextBlock value={doc.body} />
      </article>
      {doc.relatedSolutions && doc.relatedSolutions.length > 0 ? (
        <aside className="mt-12 border-t pt-8">
          <h2 className="font-semibold">Related solutions</h2>
          <ul className="mt-3 space-y-2">
            {doc.relatedSolutions.map((s) => (
              <li key={s.slug}>
                <Link href={localePath(loc, `/solutions/${s.slug}`)} className="text-primary hover:underline">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </main>
  )
}
