import { defineField, defineType } from "sanity"

export const roveSiteSettings = defineType({
  name: "roveSiteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "object",
      fields: [
        defineField({ name: "legalName", title: "Legal name", type: "string" }),
        defineField({ name: "url", title: "Website URL", type: "url" }),
        defineField({ name: "logo", title: "Logo", type: "image" }),
      ],
    }),
    defineField({
      name: "homeHero",
      title: "Homepage hero",
      type: "heroBlock",
    }),
    defineField({
      name: "homeFeatures",
      title: "Homepage features",
      type: "featureGridBlock",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Rove site settings" }),
  },
})
