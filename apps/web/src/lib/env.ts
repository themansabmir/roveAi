import { defaultLocale, roveDatasets } from "@rove/cms/constants"

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (url) return url.replace(/\/$/, "")
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3001"
}

export function getSanityProjectId(): string {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? ""
}

export function getSanityDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? roveDatasets.development
}

export function isSanityConfigured(): boolean {
  return getSanityProjectId().length > 0
}

export { defaultLocale }
