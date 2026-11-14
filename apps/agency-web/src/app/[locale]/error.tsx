"use client"

import { useEffect } from "react"
import Link from "next/link"
import { defaultLocale } from "@rove/cms/constants"
import { SiteChrome } from "@/components/site/SiteChrome"
import { localePath } from "@/lib/i18n"

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <SiteChrome locale={defaultLocale}>
      <main className="rv-container py-24 sm:py-32">
        <h1 className="rv-display max-w-[16ch] text-[clamp(2.5rem,6vw,4.5rem)]">
          This page didn&apos;t load.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-quiet">
          Something failed on our side. Try again, or go back to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button className="rv-btn-primary" onClick={reset} type="button">
            Try again
          </button>
          <Link className="rv-btn-secondary" href={localePath(defaultLocale, "/")}>
            Go to the homepage
          </Link>
        </div>
      </main>
    </SiteChrome>
  )
}
