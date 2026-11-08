import type { GeminiPageSlug } from "@/content/geminiPages"

export const publicSitePages = [
  {
    slug: "what-we-build",
    pageSlug: "what-we-build",
    title: "Services",
    description: "Outbound and pipeline operations for US IT services firms and MSPs.",
  },
  {
    slug: "how-it-works",
    pageSlug: "faq",
    title: "How It Works",
    description: "How engagements, human review, and ongoing operations work.",
  },
  {
    slug: "about",
    pageSlug: "why-us",
    title: "About",
    description: "The operating principles behind the agency.",
  },
  {
    slug: "contact",
    pageSlug: "build-system",
    title: "Get Started",
    description: "Start a conversation about your pipeline and CRM.",
  },
  {
    slug: "policy",
    pageSlug: "policy",
    title: "Policies and Outbound Standards",
    description: "Data handling and outbound delivery standards.",
  },
] as const satisfies readonly {
  slug: string
  pageSlug: GeminiPageSlug
  title: string
  description: string
}[]

export const legacySiteRouteAliases = {
  "data-flow": "what-we-build",
  faq: "how-it-works",
  "why-us": "about",
  "build-system": "contact",
  "cta-page": "contact",
  "system-selection": "contact",
  "case-study": "what-we-build",
  "case-study-maybe": "what-we-build",
  "system-breakdown": "what-we-build",
  "insight-resource": "what-we-build",
} as const satisfies Record<string, (typeof publicSitePages)[number]["slug"]>

export function getPublicSitePage(slug: string) {
  return publicSitePages.find((page) => page.slug === slug)
}

export function getLegacySiteRoute(slug: string) {
  return legacySiteRouteAliases[slug as keyof typeof legacySiteRouteAliases]
}

export function getCanonicalSitePath(path: string) {
  const alias =
    legacySiteRouteAliases[path.replace(/^\/|\/$/g, "") as keyof typeof legacySiteRouteAliases]
  return alias ? `/${alias}` : path
}
