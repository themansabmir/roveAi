import type { StructureResolver } from "sanity/structure"

export const agencyStructure: StructureResolver = (S) =>
  S.list()
    .title("Agency marketing")
    .items([
      S.listItem()
        .title("Site settings")
        .child(S.document().schemaType("agencySiteSettings").documentId("agencySiteSettings")),
      S.divider(),
      S.documentTypeListItem("agencyService").title("Services"),
      S.documentTypeListItem("agencyCaseStudy").title("Case studies"),
      S.documentTypeListItem("agencyBlogPost").title("Blog posts"),
      S.documentTypeListItem("agencyPage").title("Pages"),
    ])
