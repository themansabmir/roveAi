import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"

/** Closing call-to-action for inner pages; the homepage keeps its own full-bleed version. */
export function CtaPanel({
  locale,
  title,
  description,
}: {
  locale: Locale
  title: string
  description: string
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="rv-container">
        <div
          className="relative grid gap-10 overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:p-16"
          data-reveal
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 right-0 h-48 w-[34rem] max-w-full text-brand/15"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 540 190"
          >
            <path
              d="M0 170 C90 170 110 140 180 132 S300 120 330 86 S450 40 540 20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <path
              d="M0 170 C90 170 110 140 180 132 S300 120 330 86 S450 40 540 20 V190 H0 Z"
              fill="currentColor"
              opacity="0.35"
            />
          </svg>
          <div className="relative lg:col-span-7">
            <h2 className="rv-heading text-4xl sm:text-5xl">{title}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-quiet">{description}</p>
          </div>
          <div className="relative flex lg:col-span-5 lg:justify-end">
            <Link
              className="rv-btn-primary min-h-14 px-8 text-base"
              href={localePath(locale, "/contact")}
            >
              Book a 30-minute review
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
