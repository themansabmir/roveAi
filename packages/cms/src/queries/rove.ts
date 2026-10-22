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

export const roveSiteSettingsQuery = groq`
  *[_type == "roveSiteSettings"][0] {
    siteName,
    defaultSeo { title, description, canonicalPath, noIndex, ogImage },
    organization,
    homeHero,
    homeFeatures
  }
`

export const rovePageBySlugQuery = groq`
  *[_type == "rovePage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    ${seoFields},
    sections
  }
`

export const rovePageSlugsQuery = groq`
  *[_type == "rovePage" && defined(slug.current) && !(seo.noIndex == true)] {
    "slug": slug.current
  }
`

export const roveSolutionBySlugQuery = groq`
  *[_type == "roveSolution" && slug.current == $slug][0] {
    title,
    summary,
    "slug": slug.current,
    ${seoFields},
    sections,
    relatedSolutions[]-> {
      title,
      summary,
      "slug": slug.current
    }
  }
`

export const roveSolutionSlugsQuery = groq`
  *[_type == "roveSolution" && defined(slug.current) && !(seo.noIndex == true)] {
    "slug": slug.current
  }
`

export const roveSolutionsListQuery = groq`
  *[_type == "roveSolution" && defined(slug.current) && !(seo.noIndex == true)] | order(title asc) {
    title,
    summary,
    "slug": slug.current
  }
`

export const roveBlogPostsQuery = groq`
  *[_type == "roveBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)]
    | order(publishedAt desc) [$start...$end] {
    title,
    excerpt,
    "slug": slug.current,
    publishedAt,
    mainImage
  }
`

export const roveBlogPostsCountQuery = groq`
  count(*[_type == "roveBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)])
`

export const roveBlogPostBySlugQuery = groq`
  *[_type == "roveBlogPost" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0] {
    title,
    excerpt,
    "slug": slug.current,
    publishedAt,
    body,
    mainImage,
    ${seoFields},
    author->{ name, role, image },
    categories[]->{ title, "slug": slug.current },
    relatedSolutions[]-> { title, "slug": slug.current }
  }
`

export const roveBlogPostSlugsQuery = groq`
  *[_type == "roveBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)] {
    "slug": slug.current,
    publishedAt
  }
`

export const roveSitemapEntriesQuery = groq`
  {
    "pages": *[_type == "rovePage" && defined(slug.current) && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt
    },
    "solutions": *[_type == "roveSolution" && defined(slug.current) && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt
    },
    "posts": *[_type == "roveBlogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(seo.noIndex == true)] {
      "slug": slug.current,
      _updatedAt,
      publishedAt
    }
  }
`
