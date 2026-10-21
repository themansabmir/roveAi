import { defineField, defineType } from "sanity"

export const roveAuthor = defineType({
  name: "roveAuthor",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
})
