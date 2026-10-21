import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  const slug = request.nextUrl.searchParams.get("slug")
  const type = request.nextUrl.searchParams.get("type")

  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  const locale = "en"
  let path = `/${locale}`

  if (type === "roveBlogPost" && slug) path = `/${locale}/blog/${slug}`
  else if (type === "roveSolution" && slug) path = `/${locale}/solutions/${slug}`
  else if (type === "rovePage" && slug) path = `/${locale}/${slug}`

  redirect(path)
}
