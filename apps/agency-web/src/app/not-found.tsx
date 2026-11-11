import type { Metadata } from "next"
import { defaultLocale } from "@rove/cms/constants"
import { NotFoundView } from "@/components/site/NotFoundView"
import { SiteChrome } from "@/components/site/SiteChrome"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <SiteChrome locale={defaultLocale}>
      <NotFoundView locale={defaultLocale} />
    </SiteChrome>
  )
}
