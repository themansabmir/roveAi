import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { defaultLocale } from "@rove/cms/constants"
import { sanityTag } from "@/lib/sanity/client"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@rove/cms/constants"

type WebhookBody = { _type?: string; slug?: { current?: string } }

function pathsForDocument(body: WebhookBody): string[] {
  const loc = defaultLocale as Locale
  const slug = body.slug?.current
  const paths = [
    localePath(loc, "/"),
    localePath(loc, "/services"),
    localePath(loc, "/work"),
    localePath(loc, "/blog"),
  ]
  if (!slug) return paths
  switch (body._type) {
    case "agencyService":
      paths.push(localePath(loc, `/services/${slug}`))
      break
    case "agencyCaseStudy":
      paths.push(localePath(loc, `/work/${slug}`))
      break
    case "agencyBlogPost":
      paths.push(localePath(loc, `/blog/${slug}`))
      break
    case "agencyPage":
      paths.push(localePath(loc, `/${slug}`))
      break
    default:
      break
  }
  return paths
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }
  let body: WebhookBody = {}
  try {
    body = (await request.json()) as WebhookBody
  } catch {
    revalidateTag(sanityTag)
    return NextResponse.json({ revalidated: true, mode: "tag" })
  }
  revalidateTag(sanityTag)
  for (const path of pathsForDocument(body)) revalidatePath(path)
  return NextResponse.json({ revalidated: true, paths: pathsForDocument(body) })
}
