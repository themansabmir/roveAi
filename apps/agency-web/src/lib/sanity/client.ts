import { createClient } from "next-sanity"
import { getSanityDataset, getSanityProjectId } from "@/lib/env"

export const sanityTag = "sanity-agency"

export function getSanityClient(preview = false) {
  return createClient({
    projectId: getSanityProjectId(),
    dataset: getSanityDataset(),
    apiVersion: "2025-01-01",
    useCdn: !preview,
    perspective: preview ? "previewDrafts" : "published",
    token: preview ? process.env.SANITY_API_READ_TOKEN : undefined,
  })
}
