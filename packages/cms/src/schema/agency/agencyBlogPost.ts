import { defineField, defineType } from "sanity"

export const agencyBlogPost = defineType({
  name: "agencyBlogPost",
  title: "Blog post",
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
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime", validation: (r) => r.required() }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "mainImage", title: "Cover image", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "mainImage" },
  },
})
