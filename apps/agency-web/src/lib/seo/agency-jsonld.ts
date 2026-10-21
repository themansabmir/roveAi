import { getSiteUrl } from "@/lib/env"

export function professionalServiceJsonLd(settings: {
  siteName?: string
  business?: {
    name?: string
    description?: string
    telephone?: string
    email?: string
    address?: {
      street?: string
      city?: string
      region?: string
      postalCode?: string
      country?: string
    }
  }
}) {
  const siteUrl = getSiteUrl()
  const b = settings.business
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: b?.name ?? settings.siteName ?? "Agency",
    description: b?.description,
    url: siteUrl,
    telephone: b?.telephone,
    email: b?.email,
    address: b?.address?.city
      ? {
          "@type": "PostalAddress",
          streetAddress: b.address.street,
          addressLocality: b.address.city,
          addressRegion: b.address.region,
          postalCode: b.address.postalCode,
          addressCountry: b.address.country,
        }
      : undefined,
  }
}

export function serviceJsonLd(service: { title: string; summary?: string; slug: string }) {
  const siteUrl = getSiteUrl()
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url: `${siteUrl}/en/services/${service.slug}`,
    provider: { "@type": "ProfessionalService", url: siteUrl },
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
