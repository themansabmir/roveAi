import { services } from "@/content/revops"
import { caseStudies } from "@/content/work"

/** Static marketing routes, used for the sitemap and to keep CMS slugs from colliding. */
export const staticSitePaths = [
  "/services",
  ...services.items.map((item) => `/services/${item.slug}`),
  "/how-it-works",
  "/about",
  "/contact",
  "/policy",
  "/case-studies",
  ...caseStudies.map((study) => `/case-studies/${study.slug}`),
] as const

/** Old URLs that permanently redirect to their replacements. */
export const legacySiteRedirects: Record<string, string> = {
  "what-we-build": "/services",
  "data-flow": "/services",
  "system-breakdown": "/services",
  faq: "/how-it-works",
  "why-us": "/about",
  "build-system": "/contact",
  "cta-page": "/contact",
  "system-selection": "/contact",
  "case-study": "/case-studies",
  "case-study-maybe": "/case-studies",
  work: "/case-studies",
  "rivet-outbound": "/case-studies/elqoralabs-outbound",
  "insight-resource": "/blog",
}

export const reservedSiteSlugs = new Set<string>([
  "how-it-works",
  "about",
  "contact",
  "policy",
  ...Object.keys(legacySiteRedirects),
])

export function getLegacySiteRedirect(slug: string) {
  return legacySiteRedirects[slug]
}

export function getCanonicalSitePath(path: string) {
  return legacySiteRedirects[path.replace(/^\/|\/$/g, "")] ?? path
}
