import groq from "groq"

const seoFields = groq`
  seo {
    title,
    description,
    canonicalPath,
    noIndex,
    ogImage
  }
`

export const agencySiteSettingsQuery = groq`
  *[_type == "agencySiteSettings"][0] {
    siteName,
    defaultSeo { title, description, canonicalPath, noIndex, ogImage },
    business,
    homeHero
  }
`

export const agencyPageBySlugQuery = groq`
  *[_type == "agencyPage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    ${seoFields},
    sections
  }
`

export const agencyPageSlugsQuery = groq`
  *[_type == "agencyPage" && defined(slug.current) && !(seo.noIndex == true)] {
    "slug": slug.current
  }
`

export const agencyServiceBySlugQuery = groq`
  *[_type == "agencyService" && slug.current == $slug][0] {
    title,
    summary,
    "slug": slug.current,
    indexable,
    ${seoFields},
    sections
  }
`

export const agencyServiceSlugsQuery = groq`
  *[_type == "agencyService" && defined(slug.current) && indexable != false && !(seo.noIndex == true)] {
    "slug": slug.current
  }
`

export const agencyServicesListQuery = groq`
  *[_type == "agencyService" && defined(slug.current) && indexable != false && !(seo.noIndex == true)] | order(title asc) {
    title,
    summary,
    "slug": slug.current
  }
`

export const agencyCaseStudyBySlugQuery = groq`
  *[_type == "agencyCaseStudy" && slug.current == $slug][0] {
    title,
    client,
    excerpt,
    "slug": slug.current,
    publishedAt,
    body,
    mainImage,
    ${seoFields},
    relatedServices[]-> { title, "slug": slug.current }
  }
`

export const agencyCaseStudySlugsQuery = groq`
  *[_type == "agencyCaseStudy" && defined(slug.current) && !(seo.noIndex == true)] {
    "slug": slug.current,
    publishedAt
  }
`

export const agencyCaseStudiesListQuery = groq`
  *[_type == "agencyCaseStudy" && defined(slug.current) && !(seo.noIndex == true)] | order(publishedAt desc) {
    title,
    client,
    excerpt,
    "slug": slug.current,
    publishedAt,
    mainImage
  }
`

export const agencyBlogPostsQuery = groq`
  *[_type == "agencyBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)]
    | order(publishedAt desc) [$start...$end] {
    title,
    excerpt,
    "slug": slug.current,
    publishedAt,
    mainImage
  }
`

export const agencyBlogPostBySlugQuery = groq`
  *[_type == "agencyBlogPost" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
    title,
    excerpt,
    "slug": slug.current,
    publishedAt,
    body,
    mainImage,
    ${seoFields}
  }
`

export const agencyBlogPostSlugsQuery = groq`
  *[_type == "agencyBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)] {
    "slug": slug.current,
    publishedAt
  }
`

export const agencySitemapEntriesQuery = groq`
  {
    "pages": *[_type == "agencyPage" && defined(slug.current) && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt
    },
    "services": *[_type == "agencyService" && defined(slug.current) && indexable != false && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt
    },
    "caseStudies": *[_type == "agencyCaseStudy" && defined(slug.current) && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt,
      publishedAt
    },
    "posts": *[_type == "agencyBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt,
      publishedAt
    }
  }
`
