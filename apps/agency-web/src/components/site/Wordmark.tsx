import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { brand } from "@/content/brand"
import { localePath } from "@/lib/i18n"

/** One line threaded through three stages, ending in revenue. */
export function LogoMark({
  className = "h-7 w-7",
  tone = "dark",
}: {
  className?: string
  tone?: "dark" | "light"
}) {
  const line = tone === "light" ? "var(--rv-ink)" : "var(--rv-paper)"
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 28 28">
      <rect className="fill-current" height="28" rx="7" width="28" />
      <path
        d="M5 20.5c4 0 4.5-6.5 8.5-6.5s5-6.5 9.5-6.5"
        stroke={line}
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <circle cx="5" cy="20.5" fill={line} r="1.9" />
      <circle cx="13.5" cy="14" fill={line} r="1.9" />
      <circle
        className="origin-[23px_7.5px] transition-transform duration-300 ease-out group-hover:scale-125"
        cx="23"
        cy="7.5"
        fill="var(--rv-brand-bright)"
        r="2.7"
      />
    </svg>
  )
}

export function Wordmark({ locale, tone = "dark" }: { locale: Locale; tone?: "dark" | "light" }) {
  return (
    <Link
      aria-label={`${brand.name} home`}
      className={`group flex shrink-0 items-center gap-2.5 ${tone === "light" ? "text-white" : "text-ink"}`}
      href={localePath(locale, "/")}
    >
      <LogoMark tone={tone} />
      <span className="rv-heading text-[1.2rem] tracking-[-0.03em]">{brand.name}</span>
    </Link>
  )
}
