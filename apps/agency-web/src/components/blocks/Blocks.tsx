import Link from "next/link"
import type { ReactNode } from "react"
import type { Locale } from "@rove/cms/constants"
import { notReadyLinks, startSteps, teamRoles, writtenCommitments } from "@/content/revops"
import { localePath } from "@/lib/i18n"

type Tone = "light" | "dark" | "green"

const pad = (n: number) => String(n).padStart(2, "0")

/** Section position marker, e.g. "03 / 08 Why teams pick us". */
export function SectionLabel({
  index,
  total,
  children,
  tone = "light",
}: {
  index: number
  total: number
  children: ReactNode
  tone?: Tone
}) {
  const styles = {
    light: "text-quiet [--rv-pill:rgb(var(--rv-line-c))]",
    dark: "text-ink-muted [--rv-pill:rgb(var(--rv-ink-line-c))]",
    green: "text-white/75 [--rv-pill:rgb(255_255_255/0.25)]",
  }[tone]
  return (
    <p className={`flex items-center gap-3 text-sm font-medium ${styles}`} data-reveal>
      <span className="rounded-full border border-[color:var(--rv-pill)] px-2.5 py-0.5 font-mono text-xs tabular-nums">
        {pad(index)} / {pad(total)}
      </span>
      {children}
    </p>
  )
}

export function CheckIcon({ className = "h-5 w-5 text-brand" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`shrink-0 ${className}`} fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" fill="currentColor" fillOpacity="0.14" r="9" />
      <path
        d="m6.5 10.2 2.3 2.3 4.7-4.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

/** Six written commitments set as a signed scope document, with a facts strip underneath. */
export function CommitmentsBand({ label }: { label?: ReactNode }) {
  const { title, description, items, facts } = writtenCommitments
  return (
    <section className="py-24 lg:py-32">
      <div className="rv-container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            {label}
            <h2 className="rv-heading mt-5 text-4xl sm:text-5xl" data-reveal>
              {title}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-quiet" data-reveal>
              {description}
            </p>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <div className="group relative rounded-2xl border border-line bg-surface p-7 shadow-[0_40px_80px_-50px_rgb(11_19_36/0.45)] sm:p-10">
              <div
                aria-hidden="true"
                className="absolute -right-3 -top-5 grid h-24 w-24 rotate-[-12deg] place-items-center rounded-full border-2 border-dashed border-brand/60 bg-brand-tint text-center text-[11px] font-semibold leading-tight text-brand-deep transition-transform duration-500 ease-out group-hover:rotate-0 sm:h-28 sm:w-28 sm:text-xs"
              >
                Signed
                <br />
                before
                <br />
                kickoff
              </div>
              <p className="text-sm font-semibold text-quiet">Scope of work</p>
              <p className="rv-heading mt-1 text-2xl">Our commitments to you</p>
              <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {items.map((item) => (
                  <li className="flex gap-3 text-[15px] leading-snug" key={item}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-dashed border-line pt-6 text-xs text-quiet">
                <div>
                  <span className="block h-7 border-b border-ink/40" />
                  <span className="mt-2 block">Your signature</span>
                </div>
                <div>
                  <span className="block h-7 border-b border-ink/40 font-[family-name:var(--font-home-editorial)] text-xl italic text-ink">
                    ElqoraLabs
                  </span>
                  <span className="mt-2 block">For ElqoraLabs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-ink-line text-white sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, index) => (
            <div
              className="flex flex-col-reverse justify-end gap-3 bg-ink p-7"
              data-reveal
              key={fact.label}
              style={{ ["--rv-i" as string]: index }}
            >
              <dt className="text-sm leading-snug text-ink-muted">{fact.label}</dt>
              <dd className="rv-display text-5xl text-brand-bright">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

const ROLE_ICONS: Record<string, ReactNode> = {
  "Lead operator": <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  "Systems engineer": <path d="m8 9-3 3 3 3m8-6 3 3-3 3m-3-9-2 12" />,
  "Agent operator": (
    <path d="M5 8h14v10H5zM9 8V5h6v3m-6 5h.01M15 13h.01M10 16h4" strokeLinejoin="round" />
  ),
  You: <path d="m12 3 9 9-9 9-9-9z" strokeLinejoin="round" />,
}

/** The people on an engagement, with the client as the approver at the end of the line. */
export function TeamRoles({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark"
  return (
    <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <span
        aria-hidden="true"
        className={`absolute left-8 right-8 top-[3.25rem] hidden h-px overflow-hidden lg:block ${dark ? "bg-ink-line" : "bg-line"}`}
      >
        <span
          className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-brand-bright to-transparent"
          style={{ animation: "rv-sweep 3.2s linear infinite" }}
        />
      </span>
      {teamRoles.map((member, index) => (
        <li
          className={`group relative rounded-2xl p-6 transition-[transform,border-color] duration-500 ease-out hover:-translate-y-1 ${
            member.you
              ? "border border-gate/50 bg-gate-tint text-ink"
              : dark
                ? "border border-ink-line bg-ink-2"
                : "border border-line bg-surface hover:border-brand/40"
          }`}
          data-reveal
          key={member.role}
          style={{ ["--rv-i" as string]: index }}
        >
          <span
            aria-hidden="true"
            className={`relative grid h-14 w-14 place-items-center rounded-xl ${
              member.you ? "bg-gate text-ink" : dark ? "bg-brand text-white" : "bg-ink text-white"
            }`}
          >
            <svg
              className="h-6 w-6 transition-transform duration-500 ease-out group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
            >
              {ROLE_ICONS[member.role]}
            </svg>
          </span>
          <h3 className="rv-heading mt-6 text-xl">{member.role}</h3>
          <p
            className={`mt-2 text-[15px] leading-relaxed ${
              member.you ? "text-gate-text" : dark ? "text-ink-muted" : "text-quiet"
            }`}
          >
            {member.detail}
          </p>
        </li>
      ))}
    </ol>
  )
}

/** Three steps from first call to a running system. */
export function StartSteps() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {startSteps.map((step, index) => (
        <li
          className="relative rounded-2xl border border-line bg-surface p-7"
          data-reveal
          key={step.name}
          style={{ ["--rv-i" as string]: index }}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-mono text-sm text-white">
              {index + 1}
            </span>
            {index < startSteps.length - 1 && (
              <span aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-line">
                <span
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-brand to-transparent"
                  style={{ animation: `rv-sweep 2.4s linear ${index * 0.4}s infinite` }}
                />
              </span>
            )}
          </div>
          <h3 className="rv-heading mt-6 text-2xl">{step.name}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-quiet">{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}

/** Mid-page green call to action with a softer path for visitors not ready to book. */
export function NextStep({
  locale,
  title,
  description,
  label,
}: {
  locale: Locale
  title: string
  description: string
  label?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-brand-deep py-24 text-white lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:calc(100%/12)_100%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-bright/30 blur-[110px]"
      />
      <div className="rv-container relative grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          {label}
          <h2 className="rv-heading mt-5 text-4xl sm:text-5xl lg:text-6xl" data-reveal>
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80" data-reveal>
            {description}
          </p>
          <Link
            className="rv-btn mt-9 min-h-14 bg-white px-8 text-base text-brand-deep hover:bg-brand-tint"
            data-reveal
            href={localePath(locale, "/contact")}
          >
            Book a 30-minute review
          </Link>
        </div>
        <div
          className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm lg:col-span-5"
          data-reveal
        >
          <p className="text-sm font-semibold">Not ready to book?</p>
          <ul className="mt-4 divide-y divide-white/10">
            {notReadyLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="group flex items-center justify-between gap-4 py-3.5 text-[15px] text-white/85 transition-colors hover:text-white"
                  href={localePath(locale, item.href)}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="text-brand-bright transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
