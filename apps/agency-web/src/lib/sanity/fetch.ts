import { sanityTag, getSanityClient } from "@/lib/sanity/client"
import { isSanityConfigured } from "@/lib/env"
import { draftMode } from "next/headers"
import type { QueryParams } from "next-sanity"

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 3600,
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
}): Promise<T | null> {
  if (!isSanityConfigured()) return null
  const { isEnabled } = await draftMode()
  const client = getSanityClient(isEnabled)

  try {
    return await client.fetch<T>(query, params, {
      next: {
        tags: [sanityTag],
        revalidate: isEnabled ? 0 : revalidate,
      },
    })
  } catch {
    return null
  }
}
