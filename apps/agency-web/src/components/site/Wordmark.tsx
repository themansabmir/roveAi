import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { brand } from "@/content/brand"
import { localePath } from "@/lib/i18n"

/** Two offset plates fastened by one rivet: separate tools, joined into one system. */
export function LogoMark({
  className = "h-7 w-7",
  tone = "dark",
}: {
  className?: string
  tone?: "dark" | "light"
}) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
      <rect className="fill-current" height="10" rx="5" width="22" x="2" y="6" />
      <rect className="fill-current" height="10" rx="5" width="22" x="8" y="16" />
      <circle cx="16" cy="16" fill={tone === "light" ? "var(--rv-ink)" : "var(--rv-paper)"} r="6" />
      <circle
        className="origin-center transition-transform duration-300 ease-out [transform-box:fill-box] group-hover:scale-110"
        cx="16"
        cy="16"
        fill={tone === "light" ? "var(--rv-brand-bright)" : "var(--rv-brand)"}
        r="4"
      />
    </svg>
  )
}

export function Wordmark({ locale, tone = "dark" }: { locale: Locale; tone?: "dark" | "light" }) {
  return (
    <Link
      aria-label={`${brand.name} home`}
      className={`group flex shrink-0 items-center gap-2 ${tone === "light" ? "text-white" : "text-ink"}`}
      href={localePath(locale, "/")}
    >
      <LogoMark className="h-7 w-7" tone={tone} />
      <span className="rv-heading text-[1.25rem] font-semibold tracking-[-0.035em]">
        {brand.name}
      </span>
    </Link>
  )
}
