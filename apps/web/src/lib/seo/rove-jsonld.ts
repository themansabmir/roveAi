import { getSiteUrl } from "@/lib/env"

export function organizationJsonLd(settings: {
  siteName?: string
  organization?: { legalName?: string; url?: string }
}) {
  const siteUrl = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.organization?.legalName ?? settings.siteName ?? "Rove",
    url: settings.organization?.url ?? siteUrl,
  }
}

export function webSiteJsonLd(siteName: string) {
  const siteUrl = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  }
}

export function softwareApplicationJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rove",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const siteUrl = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

export function blogPostingJsonLd(post: {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  author?: { name?: string } | null
}) {
  const siteUrl = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: "Rove" },
    mainEntityOfPage: `${siteUrl}/en/blog/${post.slug}`,
  }
}
