import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { commitments, integrations, revenueStages, services, tools } from "@/content/revops"
import { caseStudies } from "@/content/work"
import { localePath } from "@/lib/i18n"
import { HomeAccordion } from "@/components/home/HomeAccordion"
import { CommitmentsBand, NextStep, SectionLabel } from "@/components/blocks/Blocks"
import { TeamTabs } from "@/components/blocks/TeamTabs"
import { CaseCard } from "@/components/work/CaseCard"
import { ServiceRun } from "@/components/services/ServiceRun"

type Service = (typeof services.items)[number]

const SECTIONS = 8

function Check() {
  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 shrink-0 text-brand"
      fill="none"
      viewBox="0 0 20 20"
    >
      <circle cx="10" cy="10" fill="currentColor" fillOpacity="0.12" r="9" />
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

export function ServicePage({ service, locale }: { service: Service; locale: Locale }) {
  const covered: readonly string[] = service.stages
  const studies = caseStudies.filter((study) => study.serviceId === service.id)
  const others = services.items.filter((item) => item.id !== service.id)
  const flow = integrations.flows.find((f) => f.serviceId === service.id)

  return (
    <main>
      {/* Intro */}
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--rv-line-c)/0.55)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="rv-container relative grid gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-end">
          <div className="rv-intro lg:col-span-7">
            <Link
              className="text-sm font-medium text-quiet hover:text-ink"
              href={localePath(locale, "/services")}
            >
              <span aria-hidden="true">←</span> All services
            </Link>
            <h1 className="rv-display mt-5 text-[clamp(2.75rem,6.5vw,5.25rem)]">{service.name}</h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-quiet">{service.promise}</p>
            <div className="mt-9">
              <Link
                className="rv-btn-primary min-h-14 px-8 text-base"
                href={localePath(locale, "/contact")}
              >
                Book a 30-minute review
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5" style={{ animation: "rv-fade-up 800ms 200ms both" }}>
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_70px_-40px_rgb(11_19_36/0.35)]">
              <p className="text-sm font-semibold">Where it sits on your revenue line</p>
              <ol className="mt-5 space-y-2">
                {revenueStages.map((stage) => {
                  const on = covered.includes(stage.id)
                  return (
                    <li
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        on ? "bg-brand-tint font-semibold text-brand-deep" : "text-quiet/70"
                      }`}
                      key={stage.id}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${on ? "bg-brand" : "bg-line"}`}
                      />
                      {stage.name}
                      {on && <span className="ml-auto text-xs font-medium">Covered</span>}
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      </header>

      {/* Commitment strip */}
      <div className="border-b border-line bg-surface">
        <ul className="rv-container grid gap-x-8 gap-y-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => (
            <li className="flex items-start gap-3" key={item.title}>
              <Check />
              <span className="text-sm">
                <span className="block font-semibold">{item.title}</span>
                <span className="block text-quiet">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Who it's for */}
      <section className="py-24 lg:py-32">
        <div className="rv-container">
          <SectionLabel index={1} total={SECTIONS}>
            Who it&apos;s for
          </SectionLabel>
          <h2 className="rv-heading mt-5 max-w-3xl text-4xl sm:text-5xl" data-reveal>
            Built for teams starting from one of three places.
          </h2>
          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {service.startingPoints.map((point, index) => (
              <li
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)]"
                data-reveal
                key={point.title}
                style={{ ["--rv-i" as string]: index }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <p className="text-sm font-semibold text-brand">Starting point {index + 1}</p>
                <h3 className="rv-heading mt-4 text-2xl">{point.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-quiet">{point.detail}</p>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-6 lg:grid-cols-12">
            <h3 className="rv-heading text-3xl sm:text-4xl lg:col-span-6" data-reveal>
              One system. Every team sees the difference.
            </h3>
            <p className="text-lg leading-relaxed text-quiet lg:col-span-6 lg:pt-1" data-reveal>
              Pick a team to see what changes for them.
            </p>
          </div>
          <div className="mt-10" data-reveal>
            <TeamTabs items={service.teams} />
          </div>
        </div>
      </section>

      {/* Why it stalls */}
      <section className="bg-ink py-24 text-white lg:py-32">
        <div className="rv-container">
          <SectionLabel index={2} total={SECTIONS} tone="dark">
            Why it stalls
          </SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-12">
            <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
              {service.problem.title}
            </h2>
            <p className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:pt-2" data-reveal>
              {service.impact}
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            <article
              className="rounded-2xl border border-ink-line bg-ink-2 p-7"
              data-reveal
              style={{ ["--rv-i" as string]: 0 }}
            >
              <p className="font-mono text-xs text-ink-muted">01</p>
              <h3 className="rv-heading mt-4 text-2xl">What&apos;s broken</h3>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
                {service.problem.points.map((point) => (
                  <li className="flex gap-3" key={point}>
                    <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-ink-muted" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
            {(
              [
                ["How it feels day to day", service.stalls.feels],
                ["Why it's wrong", service.stalls.wrong],
              ] as const
            ).map(([title, text], index) => (
              <article
                className="rounded-2xl border border-ink-line bg-ink-2 p-7"
                data-reveal
                key={title}
                style={{ ["--rv-i" as string]: index + 1 }}
              >
                <p className="font-mono text-xs text-ink-muted">0{index + 2}</p>
                <h3 className="rv-heading mt-4 text-2xl">{title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{text}</p>
              </article>
            ))}
          </div>
          <div
            className="mt-4 grid gap-4 rounded-2xl border border-dashed border-ink-muted/40 bg-white/[0.04] p-7 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8"
            data-reveal
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16">
                <path
                  d="m4 4 8 8m0-8-8 8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
              The usual fix
            </p>
            <p className="text-lg leading-relaxed">
              <strong className="font-semibold">{service.stalls.villain.name}</strong>{" "}
              <span className="text-ink-muted">{service.stalls.villain.detail}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 lg:py-32">
        <div className="rv-container">
          <SectionLabel index={3} total={SECTIONS}>
            How we build it
          </SectionLabel>
          <h2 className="rv-heading mt-5 max-w-2xl text-4xl sm:text-5xl" data-reveal>
            Four steps, built in your accounts.
          </h2>
          <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {service.approach.map((step, index) => (
              <li
                className="group relative rounded-2xl border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)]"
                data-reveal
                key={step.name}
                style={{ ["--rv-i" as string]: index }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-tint font-mono text-sm text-brand-deep">
                  {index + 1}
                </span>
                <h3 className="rv-heading mt-6 text-xl">{step.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-quiet">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-y border-line bg-surface py-24 lg:py-28">
        <div className="rv-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="rv-heading text-4xl sm:text-5xl" data-reveal>
              What you keep
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-quiet" data-reveal>
              Everything is built in your own accounts and documented, so it keeps working after we
              hand over.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            <div data-reveal>
              <h3 className="text-sm font-semibold">Deliverables</h3>
              <ul className="mt-5 space-y-3.5">
                {service.builds.map((build) => (
                  <li className="flex gap-3 text-[15px] leading-snug" key={build}>
                    <Check />
                    {build}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8" data-reveal>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden="true" className="h-2 w-2 rotate-45 rounded-[1px] bg-gate" />
                  Where you decide
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-quiet">{service.decide}</p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
                  After handover
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-quiet">{service.keeps}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceRun
        label={
          <SectionLabel index={4} total={SECTIONS} tone="dark">
            See it run
          </SectionLabel>
        }
        run={service.run}
        serviceId={service.id}
      />

      {/* Tools */}
      <section className="py-24 lg:py-28">
        <div className="rv-container">
          <SectionLabel index={5} total={SECTIONS}>
            The tools behind it
          </SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-12">
            <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-6" data-reveal>
              Wired into the tools you already use.
            </h2>
            {flow && (
              <p className="text-lg leading-relaxed text-quiet lg:col-span-6 lg:pt-2" data-reveal>
                {flow.caption}
              </p>
            )}
          </div>
          {flow && (
            <div className="mt-12 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
              {(
                [
                  ["Comes in from", flow.inputs, false],
                  ["Built by Rivet, owned by you", flow.engine, true],
                  ["Lands in", flow.outputs, false],
                ] as const
              ).map(([label, nodes, engine], column) => (
                <div className="contents" key={label}>
                  {column > 0 && (
                    <div
                      aria-hidden="true"
                      className="flex items-center justify-center py-1 md:py-0"
                    >
                      <span className="relative block h-8 w-px overflow-hidden bg-line md:h-px md:w-10">
                        <span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-brand to-transparent"
                          style={{ animation: `rv-sweep 2.2s linear ${column * 0.5}s infinite` }}
                        />
                      </span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-5 ${
                      engine ? "bg-ink text-white" : "border border-line bg-surface"
                    }`}
                    data-reveal
                    style={{ ["--rv-i" as string]: column }}
                  >
                    <p
                      className={`text-xs font-semibold ${engine ? "text-brand-bright" : "text-quiet"}`}
                    >
                      {label}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {nodes.map((node) => (
                        <li
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                            engine ? "bg-ink-2" : "bg-paper"
                          }`}
                          key={`${node.tool}-${node.role}`}
                        >
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                              engine ? "bg-white text-ink" : "bg-ink text-white"
                            }`}
                          >
                            {tools[node.tool].mono}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">
                              {tools[node.tool].name}
                            </span>
                            <span
                              className={`block truncate text-xs ${engine ? "text-ink-muted" : "text-quiet"}`}
                            >
                              {node.role}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-line bg-surface">
        <CommitmentsBand
          label={
            <SectionLabel index={6} total={SECTIONS}>
              What we promise in writing
            </SectionLabel>
          }
        />
      </div>

      {/* Before and after */}
      <section className="py-24 lg:py-32">
        <div className="rv-container">
          <SectionLabel index={7} total={SECTIONS}>
            What changes
          </SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-12">
            <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
              What it costs to leave it, and what you run on instead.
            </h2>
            <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
              The left side is what we see most often when nobody owns this part of the revenue
              line. The right side is what we hand over.
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-ink p-7 text-white sm:p-10" data-reveal>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
                <span aria-hidden="true" className="h-px w-6 bg-ink-muted" />
                If nothing changes
              </p>
              <ul className="mt-6 divide-y divide-ink-line">
                {service.atStake.map((item) => (
                  <li className="group grid grid-cols-[1.75rem_1fr] gap-3 py-4" key={item.title}>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid h-6 w-6 place-items-center rounded-full border border-ink-line text-ink-muted transition-transform duration-500 ease-out group-hover:rotate-90"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16">
                        <path
                          d="m4 4 8 8m0-8-8 8"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="relative overflow-hidden rounded-3xl bg-brand-deep p-7 text-white sm:p-10"
              data-reveal
              style={{ ["--rv-i" as string]: 1 }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-bright/25 blur-[90px]"
              />
              <p className="relative flex items-center gap-2 text-sm font-semibold text-brand-bright">
                <span aria-hidden="true" className="h-px w-6 bg-brand-bright" />
                After handover
              </p>
              <ul className="relative mt-6 divide-y divide-white/10">
                {service.outcomes.map((item) => (
                  <li className="group grid grid-cols-[1.75rem_1fr] gap-3 py-4" key={item.title}>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-brand-bright text-ink transition-transform duration-500 ease-out group-hover:scale-110"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 16 16">
                        <path
                          d="m3.5 8.2 2.8 2.8 6.2-6.4"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/75">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-line bg-surface py-24 lg:py-28">
        <div className="rv-container">
          <SectionLabel index={8} total={SECTIONS}>
            Case studies
          </SectionLabel>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h2 className="rv-heading max-w-2xl text-4xl sm:text-5xl" data-reveal>
              {studies.length > 0 ? "Built and running." : "Ask us about similar builds."}
            </h2>
            <Link className="rv-link text-sm" href={localePath(locale, "/case-studies")}>
              See all case studies
            </Link>
          </div>
          {studies.length > 0 ? (
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {studies.map((study, index) => (
                <div data-reveal key={study.slug} style={{ ["--rv-i" as string]: index }}>
                  <CaseCard
                    className="h-full"
                    featured={index === 0}
                    locale={locale}
                    study={study}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-quiet" data-reveal>
              We haven&apos;t published a case study for this system yet. On the review we&apos;ll
              walk you through the parts we&apos;ve built for other teams.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-28">
        <div className="rv-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="rv-heading text-4xl sm:text-5xl" data-reveal>
                Questions about {service.name.replace(/^\w/, (c) => c.toLowerCase())}
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-quiet" data-reveal>
                Can&apos;t find yours? Bring it to the review.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal>
            <HomeAccordion
              className="border-y border-line"
              defaultOpenId="q0"
              idPrefix={`faq-${service.id}`}
              items={service.faq.map((item, index) => ({
                id: `q${index}`,
                title: item.question,
                content: <p>{item.answer}</p>,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="pb-24">
        <div className="rv-container">
          <h2 className="text-sm font-semibold text-quiet">The rest of the revenue line</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {others.map((item) => (
              <li key={item.id}>
                <Link
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand/40"
                  href={localePath(locale, `/services/${item.slug}`)}
                >
                  <span className="rv-heading text-2xl group-hover:text-brand">{item.name}</span>
                  <span className="mt-2 text-[15px] leading-relaxed text-quiet">
                    {item.promise}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextStep
        description="In 30 minutes we map where this part of your revenue line breaks and tell you honestly whether we're the right fit."
        locale={locale}
        title="Get a written map before anyone touches a record."
      />
    </main>
  )
}
