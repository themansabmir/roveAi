import type { StructureResolver } from "sanity/structure"

export const roveStructure: StructureResolver = (S) =>
  S.list()
    .title("Rove marketing")
    .items([
      S.listItem()
        .title("Site settings")
        .child(S.document().schemaType("roveSiteSettings").documentId("roveSiteSettings")),
      S.divider(),
      S.documentTypeListItem("roveSolution").title("Solutions"),
      S.documentTypeListItem("roveBlogPost").title("Blog posts"),
      S.documentTypeListItem("roveAuthor").title("Authors"),
      S.documentTypeListItem("roveCategory").title("Categories"),
      S.documentTypeListItem("rovePage").title("Pages"),
    ])
