import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { revenueStages, services } from "@/content/revops"
import type { CaseStudy } from "@/content/work"

export const serviceFor = (id: string) => services.items.find((item) => item.id === id)

export function StatusPill({
  status,
  tone,
}: {
  status: CaseStudy["status"]
  tone: "dark" | "light"
}) {
  const live = status === "live"
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        tone === "dark" ? "bg-white/10 text-white" : "bg-paper text-ink"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${live ? "bg-brand-bright" : "bg-gate"}`}
        />
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${live ? "bg-brand-bright" : "bg-gate"}`}
        />
      </span>
      {live ? "Live" : "Live, measuring"}
    </span>
  )
}

export function CaseCard({
  study,
  locale,
  featured = false,
  className = "",
}: {
  study: CaseStudy
  locale: Locale
  featured?: boolean
  className?: string
}) {
  const service = serviceFor(study.serviceId)
  const tone = featured ? "dark" : "light"
  return (
    <Link
      className={`group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 sm:p-9 ${
        featured
          ? "border-ink-line bg-ink text-white hover:shadow-[0_40px_80px_-40px_rgb(11_19_36/0.7)]"
          : "border-line bg-surface hover:border-brand/30 hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)]"
      } ${className}`}
      href={localePath(locale, `/case-studies/${study.slug}`)}
    >
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/40 blur-[110px] transition-opacity duration-700 group-hover:opacity-80"
        />
      )}
      <div className="relative flex flex-wrap items-center gap-2">
        <StatusPill status={study.status} tone={tone} />
        {service && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              featured ? "bg-brand-bright/10 text-brand-bright" : "bg-brand-tint text-brand-deep"
            }`}
          >
            {service.name}
          </span>
        )}
      </div>
      <h3
        className={`relative mt-8 ${featured ? "rv-display text-5xl sm:text-6xl" : "rv-heading text-3xl"}`}
      >
        {study.client}
      </h3>
      <p
        className={`relative mt-4 max-w-xl leading-relaxed ${
          featured ? "text-lg text-ink-muted" : "text-[15px] text-quiet"
        }`}
      >
        {study.headline}
      </p>
      {featured && (
        <ol className="relative mt-10 grid gap-3 sm:grid-cols-2">
          {study.built.map((step, index) => (
            <li
              className={`rounded-2xl border p-4 transition-colors duration-300 ${
                index === study.built.length - 1
                  ? "border-brand-bright/40 bg-brand-bright/10"
                  : "border-ink-line bg-ink-2/80 group-hover:border-ink-muted/40"
              }`}
              key={step.name}
            >
              <span className="font-mono text-xs text-brand-bright">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block font-semibold">{step.name}</span>
              <span className="mt-1 block text-sm leading-snug text-ink-muted">{step.detail}</span>
            </li>
          ))}
        </ol>
      )}
      <ol
        className={`relative mt-auto flex-wrap items-center gap-x-2 gap-y-2 pt-10 ${featured ? "hidden" : "flex"}`}
      >
        {study.built.map((step, index) => (
          <li className="flex items-center gap-2" key={step.name}>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                index === study.built.length - 1
                  ? featured
                    ? "bg-brand-bright text-ink"
                    : "bg-ink text-white"
                  : featured
                    ? "border border-ink-line text-ink-muted"
                    : "border border-line bg-paper text-quiet"
              }`}
            >
              {step.name}
            </span>
            {index < study.built.length - 1 && (
              <span
                aria-hidden="true"
                className={`relative block h-px w-4 overflow-hidden ${featured ? "bg-ink-line" : "bg-line"}`}
              >
                <span
                  className="absolute inset-y-0 left-0 w-1/2 bg-brand-bright"
                  style={{ animation: `rv-sweep 2s linear ${index * 0.4}s infinite` }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
      <span
        className={`relative inline-flex items-center gap-2 text-sm font-semibold ${
          featured ? "mt-auto pt-10 text-white" : "mt-8 text-brand"
        }`}
      >
        Read the case study
        <svg
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path
            d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      </span>
    </Link>
  )
}

export const stageNames = (ids: readonly string[]) =>
  revenueStages.filter((stage) => ids.includes(stage.id)).map((stage) => stage.name)
