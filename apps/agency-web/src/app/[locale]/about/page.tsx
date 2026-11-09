import Link from "next/link"
import type { Metadata } from "next"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/agency-jsonld"
import { NextStep, TeamRoles } from "@/components/blocks/Blocks"
import { PurposeBand } from "@/components/blocks/PurposeBand"
import { about } from "@/content/about"
import { brand } from "@/content/brand"
import { homeContent } from "@/content/home"
import { engagementProcess, revenueStages, services, tools } from "@/content/revops"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "About Rivet, a RevOps agency for B2B teams",
    description:
      "Rivet builds revenue systems for B2B sales teams in their own accounts, then hands them over. What we believe, how we work and who does the work.",
    path: localePath(locale as Locale, "/about"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

/** The logo assembling itself: two plates slide together, then the rivet fastens them. */
function AssemblingMark() {
  return (
    <svg aria-hidden="true" className="h-full w-full" fill="none" viewBox="0 0 32 32">
      <rect
        fill="white"
        height="10"
        rx="5"
        style={{ animation: "rv-plate-l 900ms 200ms cubic-bezier(0.22,1,0.36,1) both" }}
        width="22"
        x="2"
        y="6"
      />
      <rect
        fill="rgb(var(--rv-brand-c))"
        height="10"
        rx="5"
        style={{ animation: "rv-plate-r 900ms 350ms cubic-bezier(0.22,1,0.36,1) both" }}
        width="22"
        x="8"
        y="16"
      />
      <g
        style={{
          animation: "rv-pop 600ms 1100ms cubic-bezier(0.22,1,0.36,1) both",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        <circle cx="16" cy="16" fill="var(--rv-ink)" r="6" />
        <circle cx="16" cy="16" fill="var(--rv-brand-bright)" r="4" />
      </g>
    </svg>
  )
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale
  const { fit } = homeContent
  const [lead, ...rest] = about.manifesto.paragraphs

  return (
    <SiteChrome locale={loc}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: localePath(loc, "/") },
            { name: "About", path: localePath(loc, "/about") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${brand.name}`,
            url: `${getSiteUrl()}${localePath(loc, "/about")}`,
            description: about.hero.description,
          },
        ]}
      />
      <main>
        {/* Hero */}
        <header className="relative overflow-hidden bg-ink text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--rv-ink-line-c)/0.6)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-[130px]"
          />
          <div className="rv-container relative grid gap-12 pb-24 pt-16 sm:pt-24 lg:grid-cols-12 lg:items-center lg:pb-32">
            <div className="rv-intro lg:col-span-8">
              <p className="text-sm font-medium text-brand-bright">About {brand.name}</p>
              <h1 className="rv-display mt-5 text-[clamp(2.75rem,6.5vw,5.5rem)]">
                {about.hero.title}
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-muted">
                {about.hero.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="rv-btn-on-dark min-h-14 px-8 text-base"
                  href={localePath(loc, "/contact")}
                >
                  Book a 30-minute review
                </Link>
                <Link
                  className="rv-btn-ghost-dark min-h-14 px-8 text-base"
                  href={localePath(loc, "/how-it-works")}
                >
                  See how we work
                </Link>
              </div>
            </div>
            <div className="mx-auto w-48 sm:w-64 lg:col-span-4 lg:w-full lg:max-w-sm">
              <AssemblingMark />
            </div>
          </div>
        </header>

        {/* Manifesto */}
        <section className="py-24 lg:py-36">
          <div className="rv-container grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:sticky lg:top-28" data-reveal>
                {about.manifesto.title}
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="rv-heading text-3xl leading-[1.15] sm:text-[2.75rem]" data-reveal>
                {lead}
              </p>
              <div className="mt-10 max-w-[62ch] space-y-6 text-lg leading-[1.75] text-quiet">
                {rest.map((paragraph, index) => (
                  <p
                    className={index === rest.length - 1 ? "font-semibold text-ink" : undefined}
                    data-reveal
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <p
                className="mt-12 font-[family-name:var(--font-home-editorial)] text-3xl italic text-brand-deep"
                data-reveal
              >
                {about.manifesto.signature}
              </p>
            </div>
          </div>
        </section>

        <PurposeBand />

        {/* Values */}
        <section className="py-24 lg:py-32">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                Five things we won&apos;t trade away.
              </h2>
              <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
                They shape every scope we write, and they&apos;re the reason some teams are better
                served by someone else.
              </p>
            </div>
            <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {about.values.map((value, index) => (
                <li
                  className={`group relative overflow-hidden rounded-3xl p-8 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 ${
                    index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                  } ${
                    index === 0
                      ? "bg-brand-deep text-white hover:shadow-[0_30px_60px_-30px_rgb(7_90_67/0.6)]"
                      : "border border-line bg-surface hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)]"
                  }`}
                  data-reveal
                  key={value.title}
                  style={{ ["--rv-i" as string]: index % 3 }}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -right-6 -top-6 h-24 w-24 rounded-full transition-transform duration-700 ease-out group-hover:scale-150 ${
                      index === 0 ? "bg-brand-bright/20" : "bg-brand-tint"
                    }`}
                  />
                  <h3 className="rv-heading relative text-2xl">{value.title}</h3>
                  <p
                    className={`relative mt-3 text-[15px] leading-relaxed ${index === 0 ? "text-white/80" : "text-quiet"}`}
                  >
                    {value.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team */}
        <section className="bg-ink py-24 text-white lg:py-32">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                Who runs the work.
              </h2>
              <p
                className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:pt-2"
                data-reveal
              >
                A senior operator supervises every engagement. Agents handle research, drafting,
                reply sorting and record updates. Every decision that reaches a buyer goes past a
                person first.
              </p>
            </div>
            <div className="mt-14">
              <TeamRoles tone="dark" />
            </div>
          </div>
        </section>

        {/* What we build */}
        <section className="py-24 lg:py-32">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                What we build.
              </h2>
              <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
                Three systems along one revenue line, from first touch to repeat revenue.
              </p>
            </div>
            <ol className="mt-12 border-t border-line">
              {services.items.map((item, index) => (
                <li data-reveal key={item.id} style={{ ["--rv-i" as string]: index }}>
                  <Link
                    className="group relative grid gap-4 overflow-hidden border-b border-line py-8 sm:grid-cols-12 sm:items-center"
                    href={localePath(loc, `/services/${item.slug}`)}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 origin-left scale-x-0 bg-brand-tint transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                    <span className="relative font-mono text-sm text-brand sm:col-span-1 sm:pl-4">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rv-heading relative text-3xl sm:col-span-4">{item.name}</span>
                    <span className="relative text-[15px] leading-relaxed text-quiet sm:col-span-4">
                      {item.promise}
                    </span>
                    <span className="relative flex flex-wrap items-center gap-2 sm:col-span-3 sm:flex-nowrap sm:justify-end sm:pr-4">
                      {item.stages.map((stageId) => (
                        <span
                          className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-quiet"
                          key={stageId}
                        >
                          {revenueStages.find((stage) => stage.id === stageId)?.name}
                        </span>
                      ))}
                      <span
                        aria-hidden="true"
                        className="ml-1 text-brand transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* How we work */}
        <section className="border-t border-line bg-surface py-24 lg:py-28">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                How we work, at a glance.
              </h2>
              <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
                Every step ends with something in writing.{" "}
                <Link className="rv-link" href={localePath(loc, "/how-it-works")}>
                  See the full process
                </Link>
              </p>
            </div>
            <div className="relative mt-14" data-reveal>
              <span
                aria-hidden="true"
                className="absolute left-5 right-0 top-5 hidden h-px bg-line md:block"
              >
                <span className="rv-grow absolute inset-0 bg-brand" />
              </span>
              <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
                {engagementProcess.steps.map((step, index) => (
                  <li key={step.name}>
                    <span className="grid h-10 w-10 place-items-center rounded-full border-4 border-surface bg-brand font-mono text-sm text-white">
                      {index + 1}
                    </span>
                    <h3 className="rv-heading mt-5 text-2xl">{step.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-quiet">
                      {step.description}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-brand-deep">{step.outcome}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="border-t border-line bg-surface py-24 lg:py-28">
          <div className="rv-container grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 className="rv-heading text-4xl sm:text-5xl" data-reveal>
                Tools we build on.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-quiet" data-reveal>
                We work in the tools you already pay for, and recommend the rest only when they earn
                their place. Every account stays in your name.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:col-span-7">
              {Object.values(tools).map((tool, index) => (
                <li
                  className="group flex flex-col items-start gap-4 rounded-xl border border-line bg-paper p-4 transition-[border-color,background-color] duration-300 hover:border-brand/40 hover:bg-brand-tint"
                  data-reveal
                  key={tool.name}
                  style={{ ["--rv-i" as string]: index % 5 }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-xs font-bold text-white transition-colors duration-300 group-hover:bg-brand">
                    {tool.mono}
                  </span>
                  <span className="text-sm font-semibold">{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Fit */}
        <section className="py-24 lg:py-32">
          <div className="rv-container grid gap-12 lg:grid-cols-12">
            <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-5" data-reveal>
              {fit.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              <div className="rounded-2xl border border-brand/25 bg-brand-tint p-7" data-reveal>
                <h3 className="text-sm font-semibold text-brand-deep">{fit.bestFitTitle}</h3>
                <ul className="mt-4 space-y-3 text-[15px]">
                  {fit.bestFit.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span
                        aria-hidden="true"
                        className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-7" data-reveal>
                <h3 className="text-sm font-semibold text-quiet">{fit.notFitTitle}</h3>
                <ul className="mt-4 space-y-3 text-[15px] text-quiet">
                  {fit.notFit.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span aria-hidden="true" className="mt-[11px] h-px w-2.5 shrink-0 bg-quiet" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  className="rv-link mt-6 inline-block text-sm"
                  href={localePath(loc, "/policy")}
                >
                  Read our outbound standards
                </Link>
              </div>
            </div>
          </div>
        </section>

        <NextStep
          description="A 30-minute review is the quickest way to see how we work, and whether we're the right fit."
          locale={loc}
          title="Work with a team that plans to hand it over."
        />
      </main>
    </SiteChrome>
  )
}
