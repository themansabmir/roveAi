/** Shared CMS document shapes used by Next apps (refine with sanity typegen when project is linked). */

export type CmsSlugDoc = {
  slug: string
}

export type CmsSection =
  | { _type: "heroBlock"; eyebrow?: string; heading?: string; subheading?: string; primaryCta?: Cta; secondaryCta?: Cta }
  | { _type: "featureGridBlock"; heading?: string; items?: { title?: string; description?: string }[] }
  | { _type: "faqBlock"; heading?: string; items?: { question?: string; answer?: string }[] }
  | { _type: "richTextBlock"; body?: unknown[] }

export type Cta = {
  label?: string
  href?: string
  variant?: "primary" | "outline"
}
