import { defineField, defineType } from "sanity"

export const agencyPage = defineType({
  name: "agencyPage",
  title: "Page",
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
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "heroBlock" }, { type: "featureGridBlock" }, { type: "faqBlock" }, { type: "richTextBlock" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
})
