import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { integrations, tools } from "@/content/revops"
import { caseStudies, measures, type CaseStudy } from "@/content/work"
import { CtaPanel } from "@/components/site/CtaPanel"
import { StatusPill, serviceFor, stageNames } from "@/components/work/CaseCard"

export function CaseStudyView({ study, locale }: { study: CaseStudy; locale: Locale }) {
  const service = serviceFor(study.serviceId)
  const flow = integrations.flows.find((f) => f.serviceId === study.serviceId)
  const stack = flow
    ? [...flow.inputs, ...flow.engine, ...flow.outputs]
        .map((node) => node.tool)
        .filter((tool, index, all) => all.indexOf(tool) === index)
    : []
  const tracked = measures.find((m) => m.serviceId === study.serviceId)?.metrics ?? []
  const index = caseStudies.findIndex((s) => s.slug === study.slug)
  const next = caseStudies[(index + 1) % caseStudies.length]

  return (
    <main>
      {/* Hero */}
      <header className="relative overflow-hidden bg-ink text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-brand/40 blur-[130px]"
        />
        <div className="rv-container relative grid gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-end">
          <div className="rv-intro lg:col-span-8">
            <Link
              className="text-sm font-medium text-ink-muted hover:text-white"
              href={localePath(locale, "/case-studies")}
            >
              <span aria-hidden="true">←</span> All case studies
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <StatusPill status={study.status} tone="dark" />
              {service && (
                <span className="rounded-full bg-brand-bright/10 px-3 py-1 text-xs font-semibold text-brand-bright">
                  {service.name}
                </span>
              )}
            </div>
            <h1 className="rv-display mt-6 text-[clamp(3rem,8vw,6.5rem)]">{study.client}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted">
              {study.headline}
            </p>
          </div>
          <dl
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line lg:col-span-4 lg:grid-cols-1"
            style={{ animation: "rv-fade-up 800ms 200ms both" }}
          >
            {[
              ["Client", study.client],
              ["System", service?.name ?? ""],
              ["Stages", service ? stageNames(service.stages).join(" → ") : ""],
              ["Status", study.status === "live" ? "Live" : "Live, measuring"],
            ].map(([label, value]) => (
              <div className="bg-ink-2 px-5 py-4" key={label}>
                <dt className="text-xs font-semibold text-ink-muted">{label}</dt>
                <dd className="mt-1 text-[15px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Brief */}
      <section className="py-24 lg:py-28">
        <div className="rv-container grid gap-10 lg:grid-cols-12">
          <h2 className="text-sm font-semibold text-brand lg:col-span-3" data-reveal>
            The brief
          </h2>
          <p className="rv-heading text-3xl leading-[1.2] sm:text-4xl lg:col-span-9" data-reveal>
            {study.brief}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
            <div className="rounded-2xl border border-line bg-surface p-6" data-reveal>
              <p className="flex items-center gap-2 text-sm font-semibold text-quiet">
                <span aria-hidden="true" className="h-px w-5 bg-gate" />
                Instead of
              </p>
              <p className="mt-3 text-lg leading-relaxed text-quiet line-through decoration-gate/60">
                {study.insteadOf}
              </p>
            </div>
            <div
              className="rounded-2xl bg-brand-deep p-6 text-white"
              data-reveal
              style={{ ["--rv-i" as string]: 1 }}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-bright">
                <span aria-hidden="true" className="h-px w-5 bg-brand-bright" />
                What runs now
              </p>
              <p className="mt-3 text-lg leading-relaxed">
                {study.built.map((step) => step.name).join(" → ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we built */}
      <section className="border-y border-line bg-surface py-24 lg:py-28">
        <div className="rv-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="rv-heading text-4xl sm:text-5xl" data-reveal>
                What we built
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-quiet" data-reveal>
                {study.summary}
              </p>
            </div>
          </div>
          <ol className="relative space-y-4 lg:col-span-8">
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-[1.375rem] top-8 w-px bg-gradient-to-b from-line via-brand/50 to-line"
            />
            {study.built.map((step, i) => {
              const last = i === study.built.length - 1
              return (
                <li
                  className="relative grid grid-cols-[2.75rem_1fr] items-start gap-5"
                  data-reveal
                  key={step.name}
                  style={{ ["--rv-i" as string]: i }}
                >
                  <span
                    className={`relative z-10 grid h-11 w-11 place-items-center rounded-full font-mono text-sm ${
                      last ? "bg-brand text-white" : "border border-line bg-surface text-quiet"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div
                    className={`rounded-2xl border p-6 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 ${
                      last
                        ? "border-brand/30 bg-brand-tint"
                        : "border-line bg-paper hover:border-brand/30"
                    }`}
                  >
                    <h3 className="rv-heading text-xl">{step.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-quiet">{step.detail}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Stack + result */}
      <section className="py-24 lg:py-28">
        <div className="rv-container grid gap-4 lg:grid-cols-12">
          <div className="rounded-3xl border border-line bg-surface p-8 lg:col-span-5" data-reveal>
            <h2 className="text-sm font-semibold text-quiet">Tools in the system</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {stack.map((tool) => (
                <li
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-paper py-2 pl-2 pr-4 text-sm font-medium"
                  key={tool}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-[11px] font-bold text-white">
                    {tools[tool].mono}
                  </span>
                  {tools[tool].name}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white lg:col-span-7"
            data-reveal
            style={{ ["--rv-i" as string]: 1 }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-brand/40 blur-3xl"
            />
            <h2 className="relative text-sm font-semibold text-brand-bright">Result</h2>
            <p className="rv-heading relative mt-4 text-3xl">{study.result}</p>
            {service && (
              <Link
                className="relative mt-6 inline-block text-sm font-semibold text-brand-bright underline decoration-brand-bright/30 decoration-2 underline-offset-4 hover:decoration-brand-bright"
                href={localePath(locale, `/services/${service.slug}`)}
              >
                How {service.name.replace(/^\w/, (c) => c.toLowerCase())} works
              </Link>
            )}
            {tracked.length > 0 && (
              <div className="relative mt-8 border-t border-ink-line pt-6">
                <p className="text-sm text-ink-muted">Tracked in the weekly report</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tracked.map((metric) => (
                    <li
                      className="rounded-full border border-ink-line px-3 py-1.5 text-sm"
                      key={metric}
                    >
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Next */}
      {next && next.slug !== study.slug && (
        <section className="border-t border-line">
          <Link
            className="group rv-container flex flex-wrap items-center justify-between gap-6 py-14"
            href={localePath(locale, `/case-studies/${next.slug}`)}
          >
            <span>
              <span className="block text-sm font-semibold text-quiet">Next case study</span>
              <span className="rv-heading mt-2 block text-4xl transition-colors group-hover:text-brand sm:text-5xl">
                {next.client}
              </span>
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-full border border-line transition-[background-color,border-color,transform] duration-300 group-hover:translate-x-1 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 16 16">
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
        </section>
      )}

      <CtaPanel
        description={
          service
            ? `${service.name} is one of three systems we build. We'll tell you on a call whether it's the right place to start.`
            : "We'll tell you on a call which system to build first."
        }
        locale={locale}
        title="Want a system like this?"
      />
    </main>
  )
}
