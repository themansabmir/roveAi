import type { ReactNode } from "react"
import type { Locale } from "@rove/cms/constants"
import { SiteFooter } from "@/components/site/SiteFooter"
import { SiteHeader } from "@/components/site/SiteHeader"

export function SiteChrome({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <>
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter locale={locale} />
    </>
  )
}
