import { defineCliConfig } from "sanity/cli"

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""

export default defineCliConfig({
  api: {
    projectId,
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
})
