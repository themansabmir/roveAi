import type { Metadata } from "next"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

export type SeoFields = {
  title?: string | null
  description?: string | null
  canonicalPath?: string | null
  noIndex?: boolean | null
  ogImage?: SanityImageSource | null
}

export type MapSeoOptions = {
  siteUrl: string
  /** Fallback when seo.title is empty */
  title: string
  /** Fallback when seo.description is empty */
  description?: string
  /** Path for this page, e.g. /en/blog/my-post */
  path: string
  sanityProjectId?: string
  sanityDataset?: string
}

function buildImageUrl(
  source: SanityImageSource | null | undefined,
  projectId: string | undefined,
  dataset: string | undefined,
): string | undefined {
  if (!source || !projectId || !dataset) return undefined
  const builder = imageUrlBuilder({ projectId, dataset })
  return builder.image(source).width(1200).height(630).fit("crop").url()
}

export function mapSeoToMetadata(seo: SeoFields | null | undefined, options: MapSeoOptions): Metadata {
  const title = seo?.title?.trim() || options.title
  const description = seo?.description?.trim() || options.description
  const canonicalPath = seo?.canonicalPath?.trim() || options.path
  const canonical = new URL(canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`, options.siteUrl)
    .href

  const ogImage =
    buildImageUrl(seo?.ogImage, options.sanityProjectId, options.sanityDataset) ??
    new URL("/opengraph-image", options.siteUrl).href

  const robots =
    seo?.noIndex === true
      ? { index: false as const, follow: true as const }
      : { index: true as const, follow: true as const }

  return {
    title,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical,
      siteName: title,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: [ogImage],
    },
  }
}
