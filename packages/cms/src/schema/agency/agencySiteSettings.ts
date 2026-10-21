import { defineField, defineType } from "sanity"

export const agencySiteSettings = defineType({
  name: "agencySiteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo" }),
    defineField({
      name: "business",
      title: "Business",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Display name", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "telephone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({
          name: "address",
          title: "Address",
          type: "object",
          fields: [
            defineField({ name: "street", type: "string", title: "Street" }),
            defineField({ name: "city", type: "string", title: "City" }),
            defineField({ name: "region", type: "string", title: "Region" }),
            defineField({ name: "postalCode", type: "string", title: "Postal code" }),
            defineField({ name: "country", type: "string", title: "Country" }),
          ],
        }),
        defineField({ name: "logo", title: "Logo", type: "image" }),
      ],
    }),
    defineField({ name: "homeHero", title: "Homepage hero", type: "heroBlock" }),
  ],
  preview: {
    prepare: () => ({ title: "Agency site settings" }),
  },
})
