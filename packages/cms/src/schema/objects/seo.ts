import { defineField, defineType } from "sanity"

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      validation: (rule) => rule.max(70).warning("Keep under ~60 characters for SERPs"),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep under ~155 characters"),
    }),
    defineField({
      name: "canonicalPath",
      title: "Canonical path override",
      description: "Optional path only, e.g. /en/about. Defaults to the page URL.",
      type: "string",
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
})
