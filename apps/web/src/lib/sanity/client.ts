import { createClient } from "next-sanity"
import { getSanityDataset, getSanityProjectId } from "@/lib/env"

export const sanityTag = "sanity"

export function getSanityClient(preview = false) {
  const token = process.env.SANITY_API_READ_TOKEN
  return createClient({
    projectId: getSanityProjectId(),
    dataset: getSanityDataset(),
    apiVersion: "2025-01-01",
    useCdn: !preview,
    perspective: preview ? "previewDrafts" : "published",
    stega: preview ? { enabled: true, studioUrl: "/studio" } : false,
    token: preview ? token : undefined,
  })
}
