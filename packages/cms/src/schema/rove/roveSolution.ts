import { defineField, defineType } from "sanity"

export const roveSolution = defineType({
  name: "roveSolution",
  title: "Solution",
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
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "heroBlock" }, { type: "featureGridBlock" }, { type: "faqBlock" }, { type: "richTextBlock" }],
    }),
    defineField({
      name: "relatedSolutions",
      title: "Related solutions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "roveSolution" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
})
