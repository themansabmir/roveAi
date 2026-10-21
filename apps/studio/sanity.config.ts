import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "@rove/cms/schema"
import { roveStructure } from "./structure/roveStructure"
import { agencyStructure } from "./structure/agencyStructure"
import { agencyDatasets, roveDatasets } from "@rove/cms/constants"

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""

export default defineConfig([
  {
    name: "rove",
    title: "Rove SaaS",
    projectId,
    dataset: process.env.SANITY_STUDIO_ROVE_DATASET ?? roveDatasets.development,
    basePath: "/rove",
    plugins: [structureTool({ structure: roveStructure }), visionTool()],
    schema: { types: schemaTypes },
  },
  {
    name: "agency",
    title: "Agency",
    projectId,
    dataset: process.env.SANITY_STUDIO_AGENCY_DATASET ?? agencyDatasets.development,
    basePath: "/agency",
    plugins: [structureTool({ structure: agencyStructure }), visionTool()],
    schema: { types: schemaTypes },
  },
])
