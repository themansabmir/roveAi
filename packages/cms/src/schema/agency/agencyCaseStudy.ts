import { defineField, defineType } from "sanity"

export const agencyCaseStudy = defineType({
  name: "agencyCaseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
    defineField({ name: "mainImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "agencyService" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "mainImage" },
  },
})
