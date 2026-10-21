import { defineField, defineType } from "sanity"

export const featureGridBlock = defineType({
  name: "featureGridBlock",
  title: "Feature grid",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Section heading", type: "string" }),
    defineField({
      name: "items",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
})
