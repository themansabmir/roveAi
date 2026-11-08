import type { ComponentType } from "react"
import type { Locale } from "@rove/cms/constants"
import type { GeminiPageSlug } from "@/content/geminiPages"
import { Page as BuildSystemPage } from "./pages/build-system/Page"
import { Page as FaqPage } from "./pages/faq/Page"
import { Page as PolicyPage } from "./pages/policy/Page"
import { Page as WhatWeBuildPage } from "./pages/what-we-build/Page"
import { Page as WhyUsPage } from "./pages/why-us/Page"

const pages = {
  "build-system": BuildSystemPage,
  faq: FaqPage,
  policy: PolicyPage,
  "what-we-build": WhatWeBuildPage,
  "why-us": WhyUsPage,
} satisfies Record<GeminiPageSlug, ComponentType<{ locale: Locale }>>

export function GeminiSitePage({ slug, locale }: { slug: GeminiPageSlug; locale: Locale }) {
  const Page = pages[slug]
  return <Page locale={locale} />
}
