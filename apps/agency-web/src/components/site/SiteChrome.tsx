import type { ReactNode } from "react"
import type { Locale } from "@rove/cms/constants"
import { RevealObserver } from "@/components/motion/RevealObserver"
import { SiteFooter } from "@/components/site/SiteFooter"
import { SiteHeader } from "@/components/site/SiteHeader"

export function SiteChrome({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <>
      <a
        className="sr-only z-[60] rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader locale={locale} />
      <div className="min-h-[70vh] pt-16" id="main">
        {children}
      </div>
      <SiteFooter locale={locale} />
      <RevealObserver />
    </>
  )
}
