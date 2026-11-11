import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { homeContent } from "@/content/home"
import {
  caseStudyServices,
  commitments,
  comparison,
  hero,
  integrations,
  problem,
} from "@/content/revops"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { ServiceStack } from "@/components/home/ServiceStack"
import { HomeAccordion } from "@/components/home/HomeAccordion"
import { ProcessStory } from "@/components/home/ProcessStory"
import { RevenueLine } from "@/components/home/RevenueLine"
import { BrandMarquee } from "@/components/home/BrandMarquee"
import { ProblemShowcase } from "@/components/home/ProblemShowcase"
import { StackFlow } from "@/components/home/StackFlow"
import { PurposeBand } from "@/components/blocks/PurposeBand"

export type HomePost = { title: string; excerpt?: string; slug: string }

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 sm:pt-16 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--rv-line-c)/0.55)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div className="rv-container relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="rv-intro lg:col-span-7">
          <p className="rv-kicker">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
            {hero.audience}
          </p>
          <h1 className="rv-display mt-6 max-w-[13ch] text-[clamp(2.9rem,7.4vw,6rem)]">
            {hero.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-quiet sm:text-xl">
            {hero.description}
          </p>
          <div className="mt-9">
            <Link
              className="rv-btn-primary min-h-14 px-8 text-base"
              href={localePath(locale, "/contact")}
            >
              {hero.primaryAction}
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5" style={{ animation: "rv-fade-up 900ms 200ms both" }}>
          <RevenueLine />
        </div>
      </div>
    </section>
  )
}

function Commitments() {
  return (
    <section aria-label="Clients and commitments" className="border-y border-line bg-surface">
      <div className="rv-container flex flex-col gap-4 pt-10 sm:flex-row sm:items-center sm:gap-10">
        <p className="shrink-0 text-sm text-quiet">Systems built for</p>
        <div className="min-w-0 flex-1">
          <BrandMarquee />
        </div>
      </div>
      <div className="rv-container">
        <ul className="mt-8 grid gap-px overflow-hidden border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item, index) => (
            <li
              className="py-8 sm:pr-8 lg:border-l lg:border-line lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              data-reveal
              key={item.title}
              style={{ ["--rv-i" as string]: index }}
            >
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm leading-snug text-quiet">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32" id="the-problem">
      <div className="rv-container">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
            {problem.title}
          </h2>
          <p className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:pt-2" data-reveal>
            {problem.description}
          </p>
        </div>

        <div className="mt-16" data-reveal>
          <ProblemShowcase />
        </div>
      </div>
    </section>
  )
}

function Services({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="services-heading" className="py-24 lg:py-32" id="services">
      <div className="rv-container">
        <ServiceStack locale={locale} />
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="border-y border-line bg-surface py-24 lg:py-32" id="how-it-works">
      <div className="rv-container">
        <ProcessStory />
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32" id="stack">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(var(--rv-ink-line-c))_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="rv-container relative">
        <h2 className="rv-heading max-w-3xl text-4xl sm:text-5xl" data-reveal>
          {integrations.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted" data-reveal>
          {integrations.description}
        </p>
        <div className="mt-12" data-reveal>
          <StackFlow />
        </div>
      </div>
    </section>
  )
}

function FlowSteps({ steps, tone }: { steps: string[]; tone: "dark" | "light" }) {
  const dark = tone === "dark"
  return (
    <ol className="relative grid gap-3 sm:grid-flow-col sm:auto-cols-fr sm:gap-2">
      {steps.map((step, index) => {
        const last = index === steps.length - 1
        return (
          <li className="relative flex items-center gap-3 sm:block" key={step}>
            <div className="flex items-center sm:mb-3">
              <span
                className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] ${
                  last
                    ? "bg-brand-bright text-ink"
                    : dark
                      ? "border border-ink-line bg-ink text-ink-muted"
                      : "border border-line bg-surface text-quiet"
                }`}
              >
                {index + 1}
              </span>
              {!last && (
                <span
                  aria-hidden="true"
                  className={`relative ml-2 hidden h-px flex-1 overflow-hidden sm:block ${dark ? "bg-ink-line" : "bg-line"}`}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-brand-bright to-transparent"
                    style={{ animation: `rv-sweep 2.4s linear ${index * 0.6}s infinite` }}
                  />
                </span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${dark ? (last ? "text-white" : "text-ink-muted") : last ? "text-ink" : "text-quiet"}`}
            >
              {step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function ServiceTag({ id, tone }: { id: string; tone: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        tone === "dark" ? "bg-brand-bright/10 text-brand-bright" : "bg-brand-tint text-brand-deep"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-brand-bright" : "bg-brand"}`}
      />
      {caseStudyServices[id]}
    </span>
  )
}

const bentoCard =
  "group relative overflow-hidden rounded-3xl border p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 sm:p-9"

const caseSlugs: Record<string, string> = {
  roister: "roister",
  codeninjas: "codeninjas",
  syntropic: "elqoralabs-outbound",
  elqoralabs: "elqoralabs-outbound",
}

function CaseLink({ id, locale, tone }: { id: string; locale: Locale; tone: "dark" | "light" }) {
  const slug = caseSlugs[id]
  if (!slug) return null
  return (
    <Link
      className={`relative mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-2 underline-offset-4 transition-colors ${
        tone === "dark"
          ? "text-brand-bright decoration-brand-bright/30 hover:decoration-brand-bright"
          : "text-brand decoration-brand/30 hover:decoration-brand"
      }`}
      href={localePath(locale, `/case-studies/${slug}`)}
    >
      Read the case study
    </Link>
  )
}

function Proof({ locale }: { locale: Locale }) {
  const { proof } = homeContent
  const [roister, codeNinjas, own] = proof.projects
  return (
    <section className="bg-surface py-24 lg:py-32" id="proof">
      <div className="rv-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="rv-heading max-w-2xl text-4xl sm:text-5xl" data-reveal>
            {proof.title}
          </h2>
          <Link className="rv-link text-sm" href={localePath(locale, "/case-studies")}>
            See all case studies
          </Link>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          {roister && (
            <article
              className={`${bentoCard} border-ink-line bg-ink text-white hover:shadow-[0_40px_80px_-40px_rgb(11_19_36/0.7)] lg:col-span-4 lg:row-span-2`}
              data-reveal
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/40 blur-[100px] transition-opacity duration-700 group-hover:opacity-80"
              />
              <div className="relative flex h-full flex-col">
                <ServiceTag id={roister.id} tone="dark" />
                <h3 className="rv-display mt-8 text-5xl sm:text-6xl">{roister.name}</h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
                  {roister.claim}
                </p>
                <CaseLink id={roister.id} locale={locale} tone="dark" />
                <div className="mt-auto pt-12">
                  <FlowSteps steps={roister.steps} tone="dark" />
                </div>
              </div>
            </article>
          )}

          {codeNinjas && (
            <article
              className={`${bentoCard} border-line bg-paper hover:border-brand/30 hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)] lg:col-span-2 lg:row-span-2`}
              data-reveal
              style={{ ["--rv-i" as string]: 1 }}
            >
              <div className="flex h-full flex-col">
                <ServiceTag id={codeNinjas.id} tone="light" />
                <h3 className="rv-heading mt-8 text-4xl">{codeNinjas.name}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-quiet">{codeNinjas.claim}</p>
                <CaseLink id={codeNinjas.id} locale={locale} tone="light" />
                <ol className="relative mt-auto space-y-4 pt-10">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-[13px] top-[3.25rem] w-px bg-line"
                  />
                  {codeNinjas.steps.map((step, index) => {
                    const last = index === codeNinjas.steps.length - 1
                    return (
                      <li className="relative flex items-center gap-3" key={step}>
                        <span
                          className={`relative grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] ${
                            last
                              ? "bg-brand text-white"
                              : "border border-line bg-surface text-quiet"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className={`text-sm font-medium ${last ? "text-ink" : "text-quiet"}`}>
                          {step}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </article>
          )}

          {own && (
            <article
              className={`${bentoCard} border-line bg-surface hover:border-brand/30 hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)] lg:col-span-3`}
              data-reveal
              style={{ ["--rv-i" as string]: 2 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <ServiceTag id={own.id} tone="light" />
                <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-semibold text-quiet">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gate" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gate" />
                  </span>
                  Live, measuring
                </span>
              </div>
              <h3 className="rv-heading mt-6 text-3xl">{own.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-quiet">
                We run the same system on ourselves. Results go here once they&apos;re measured.
              </p>
              <CaseLink id={own.id} locale={locale} tone="light" />
              <div className="mt-8">
                <FlowSteps steps={own.steps} tone="light" />
              </div>
            </article>
          )}

          <article
            className={`${bentoCard} border-brand bg-brand text-white hover:shadow-[0_30px_60px_-30px_rgb(11_122_90/0.7)] lg:col-span-3`}
            data-reveal
            style={{ ["--rv-i" as string]: 3 }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-brand-bright/40 blur-3xl transition-transform duration-700 group-hover:scale-110"
            />
            <div className="relative flex h-full flex-col">
              <h3 className="rv-heading max-w-sm text-3xl sm:text-4xl">
                Your revenue line could be next.
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">
                A 30-minute review maps where your pipeline breaks and which system we&apos;d build
                first.
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Link
                  className="rv-btn bg-white text-ink hover:bg-paper"
                  href={localePath(locale, "/contact")}
                >
                  Book a 30-minute review
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export function Compare() {
  const [hire, agency, ours] = comparison.columns
  return (
    <section className="py-24 lg:py-32" id="compare">
      <div className="rv-container">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
            {comparison.title}
          </h2>
          <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
            {comparison.description}
          </p>
        </div>

        <div className="relative mt-14">
          {/* Highlight behind our column on wide screens. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc(25%+0.5rem)] rounded-3xl border border-brand/30 bg-surface shadow-[0_40px_80px_-40px_rgb(11_122_90/0.45)] md:block"
            data-reveal
          />
          <table className="relative w-full border-collapse text-left">
            <caption className="sr-only">{comparison.title}</caption>
            <thead className="hidden md:table-header-group">
              <tr>
                <th className="w-1/4 pb-6" scope="col">
                  <span className="sr-only">Compared on</span>
                </th>
                <th className="w-1/4 px-4 pb-6 text-sm font-semibold text-quiet" scope="col">
                  {hire}
                </th>
                <th className="w-1/4 px-4 pb-6 text-sm font-semibold text-quiet" scope="col">
                  {agency}
                </th>
                <th className="w-1/4 px-6 pb-6 pt-8" scope="col">
                  <span className="inline-flex items-center gap-2 rv-heading text-xl">
                    <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                    {ours}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, index) => (
                <tr
                  className="grid grid-cols-1 gap-3 border-t border-line py-6 md:table-row md:py-0"
                  data-reveal
                  key={row.label}
                  style={{ ["--rv-i" as string]: index }}
                >
                  <th className="text-[15px] font-semibold md:py-6 md:pr-4" scope="row">
                    {row.label}
                  </th>
                  {row.values.map((value, col) => {
                    const isOurs = col === row.values.length - 1
                    return (
                      <td
                        className={`text-[15px] leading-snug md:py-6 ${
                          isOurs
                            ? "block rounded-xl bg-brand-tint/60 p-3 font-medium text-ink md:table-cell md:rounded-none md:bg-transparent md:px-6"
                            : "text-quiet md:px-4"
                        }`}
                        key={value}
                      >
                        <span className="mb-1 block text-xs font-semibold text-quiet md:hidden">
                          {comparison.columns[col]}
                        </span>
                        {isOurs && (
                          <svg
                            aria-hidden="true"
                            className="mr-2 inline-block h-4 w-4 shrink-0 -translate-y-px text-brand"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <circle cx="10" cy="10" fill="currentColor" fillOpacity="0.15" r="9" />
                            <path
                              d="m6.5 10.2 2.3 2.3 4.7-4.9"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
                          </svg>
                        )}
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function Insights({ locale, posts }: { locale: Locale; posts: HomePost[] }) {
  if (posts.length === 0) return null
  return (
    <section className="border-t border-line py-24" id="insights">
      <div className="rv-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="rv-heading text-4xl" data-reveal>
            Notes from running revenue systems.
          </h2>
          <Link className="rv-link text-sm" href={localePath(locale, "/blog")}>
            All insights
          </Link>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line md:grid-cols-3">
          {posts.map((post) => (
            <li className="bg-surface" key={post.slug}>
              <Link
                className="group flex h-full flex-col p-6 transition-colors hover:bg-paper"
                href={localePath(locale, `/blog/${post.slug}`)}
              >
                <h3 className="text-xl font-semibold leading-snug group-hover:text-brand">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-quiet">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Faq({ locale }: { locale: Locale }) {
  const { faq } = homeContent
  return (
    <section className="border-t border-line bg-surface py-24 lg:py-32" id="faq">
      <div className="rv-container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="rv-heading text-4xl sm:text-5xl" data-reveal>
              {faq.title}
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-quiet" data-reveal>
              Can&apos;t find your answer? Ask us directly on a 30-minute call.
            </p>
            <Link className="rv-btn-primary mt-8" href={localePath(locale, "/contact")}>
              Book a 30-minute review
            </Link>
          </div>
        </div>
        <div className="lg:col-span-8" data-reveal>
          <HomeAccordion
            className="border-y border-line"
            defaultOpenId={faq.items[0]?.id ?? null}
            idPrefix="faq"
            items={faq.items.map((item) => ({
              id: item.id,
              title: item.question,
              content: <p>{item.answer}</p>,
            }))}
          />
        </div>
      </div>
    </section>
  )
}

export function FinalCta({ locale }: { locale: Locale }) {
  const { finalCta } = homeContent
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-36" id="start">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--rv-ink-line-c)/0.6)_1px,transparent_1px)] [background-size:calc(100%/12)_100%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-[40rem] rounded-full bg-brand/30 blur-[120px]"
      />
      <div className="rv-container relative">
        <h2 className="rv-display max-w-[16ch] text-[clamp(2.6rem,6vw,5rem)]" data-reveal>
          Start with a 30-minute review.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted" data-reveal>
          {finalCta.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-3" data-reveal>
          <Link className="rv-btn-on-dark px-6" href={localePath(locale, "/contact")}>
            {finalCta.buildAction}
          </Link>
          <Link className="rv-btn-ghost-dark px-6" href={localePath(locale, "/how-it-works")}>
            {finalCta.callAction}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HomePage({ locale, posts = [] }: { locale: Locale; posts?: HomePost[] }) {
  return (
    <SiteChrome locale={locale}>
      <main>
        <Hero locale={locale} />
        <Commitments />
        <Problem />
        <Services locale={locale} />
        <PurposeBand />
        <HowItWorks />
        <Stack />
        <Proof locale={locale} />
        <Compare />
        <Insights locale={locale} posts={posts} />
        <Faq locale={locale} />
        <FinalCta locale={locale} />
      </main>
    </SiteChrome>
  )
}
