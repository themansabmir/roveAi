import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { homeContent } from "@/content/home"
import { localePath } from "@/lib/i18n"
import { HomeAccordion } from "@/components/home/HomeAccordion"
import { ApprovalTimeline } from "@/components/home/ApprovalTimeline"
import { CaseStudiesGrid } from "@/components/home/CaseStudiesGrid"
import { ClientMarquee } from "@/components/home/ClientMarquee"
import { HowItWorksTimeline } from "@/components/home/HowItWorksTimeline"
import { PipelineUpgradeSection } from "@/components/home/PipelineUpgradeSection"
import { RevenueSystemFlow } from "@/components/home/RevenueSystemFlow"
import fitStyles from "./WhoItsForSection.module.css"

const sectionClass = "mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
const sectionHeadingClass =
  "font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"

function SectionHeading({
  eyebrow,
  title,
  description,
  accent,
  centered = false,
  dark = false,
}: {
  eyebrow: string
  title: string
  description?: string
  accent?: string
  centered?: boolean
  dark?: boolean
}) {
  const accentIndex = accent ? title.indexOf(accent) : -1
  const heading =
    accent && accentIndex >= 0 ? (
      <>
        {title.slice(0, accentIndex)}
        <span
          className={`font-editorial-italic font-normal italic ${dark ? "text-blue-300" : "text-blue-600"}`}
        >
          {accent}
        </span>
        {title.slice(accentIndex + accent.length)}
      </>
    ) : (
      title
    )

  return (
    <div className={`mb-12 space-y-3 ${centered ? "mx-auto max-w-3xl text-center" : ""}`}>
      <p
        className={`inline-flex rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${
          dark
            ? "border-slate-700 bg-slate-900/80 text-slate-300"
            : "border-slate-200 bg-slate-100 text-slate-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`${sectionHeadingClass} ${dark ? "text-white" : ""} leading-tight`}>
        {heading}
      </h2>
      {description && (
        <p
          className={`max-w-3xl text-sm leading-relaxed sm:text-base ${dark ? "text-slate-300" : "text-slate-600"}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export function HeroSection({ locale }: { locale: Locale }) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-3.5 py-1 font-mono text-xs font-medium tracking-wide text-blue-700 shadow-sm">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600"
          />
          {homeContent.hero.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {homeContent.hero.title.replace(homeContent.hero.accent, "")}
          <span className="text-blue-600">{homeContent.hero.accent}</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {homeContent.hero.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--site-burnt-orange)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--site-ink)] shadow-sm transition-all duration-200 hover:bg-[var(--site-burnt-orange)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            href={localePath(locale, "/contact")}
          >
            <span>{homeContent.hero.primaryAction}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <a
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold tracking-wide text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            href="#how-it-works"
          >
            {homeContent.hero.secondaryAction}
            <span aria-hidden="true" className="text-slate-400">
              →
            </span>
          </a>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">{homeContent.hero.note}</p>
      </div>
      <RevenueSystemFlow />
    </section>
  )
}

export function ClientMarqueeSection() {
  return <ClientMarquee />
}

export function BuildProcessSection() {
  const { process } = homeContent

  return (
    <section className={`${sectionClass} border-t border-slate-200/70`} id="how-it-works">
      <SectionHeading
        centered
        description={process.description}
        eyebrow={process.eyebrow}
        title={process.title}
      />
      <HowItWorksTimeline />
    </section>
  )
}

export function WhoItsForSection() {
  const { startingPoints, fit } = homeContent

  return (
    <section className={`${sectionClass} ${fitStyles.section}`} id="who-its-for">
      <SectionHeading centered eyebrow={startingPoints.eyebrow} title={startingPoints.title} />
      <div className="grid gap-3 md:grid-cols-3">
        {startingPoints.items.map((item, index) => (
          <article className={`${fitStyles.startingCard} rounded-xl border p-5`} key={item.id}>
            <p className="font-mono text-xs font-semibold text-blue-700">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-display text-base font-bold leading-snug text-slate-950">
              “{item.text}”
            </h3>
          </article>
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className={`${fitStyles.fitCard} ${fitStyles.bestFit} rounded-xl border p-5`}>
          <h3 className="font-display font-bold text-slate-950">{fit.bestFitTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            {fit.bestFit.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className={`${fitStyles.fitCard} ${fitStyles.notFit} rounded-xl border p-5`}>
          <h3 className="font-display font-bold text-slate-950">{fit.notFitTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            {fit.notFit.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function ProofSection() {
  return <CaseStudiesGrid />
}

export function PipelineUpgrade() {
  return <PipelineUpgradeSection />
}

function StackCard({ agent }: { agent: (typeof homeContent.agents.items)[number] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-700">{agent.job}</p>
      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          [homeContent.labels.input, agent.input],
          [homeContent.labels.output, agent.output],
          [homeContent.labels.humanCheckpoint, agent.checkpoint],
        ].map(([label, value]) => (
          <div className="rounded-lg border border-slate-200/70 bg-slate-50 p-4" key={label}>
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </dt>
            <dd className="mt-2 text-xs leading-relaxed text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function AgentsSection() {
  const { agents } = homeContent
  const items = agents.items.map((agent) => ({
    id: agent.id,
    title: agent.name,
    content: <StackCard agent={agent} />,
  }))

  return (
    <section className={`${sectionClass} border-t border-slate-200/70`} id="agents">
      <SectionHeading
        accent="human checkpoint."
        centered
        description={agents.description}
        eyebrow={agents.eyebrow}
        title={agents.title}
      />
      <HomeAccordion
        className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white px-5 shadow-sm sm:px-8"
        idPrefix="agent"
        items={items}
      />
    </section>
  )
}

function ApprovalGateFlow() {
  return <ApprovalTimeline />
}

export function ControlSection() {
  const { control } = homeContent

  return (
    <section
      className="w-full border-y border-slate-200/70 bg-white px-4 py-24 sm:px-6 lg:px-8"
      id="control"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          accent="campaign gates."
          centered
          description={control.description}
          eyebrow={control.eyebrow}
          title={control.title}
        />
        <ApprovalGateFlow />
        <div className="mt-20">
          <SectionHeading centered eyebrow={control.eyebrow} title={control.ownershipTitle} />
          <div className="grid gap-5 md:grid-cols-3">
            {control.ownership.map((tier) => (
              <article
                className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#FAFAFD] p-6 shadow-sm transition-shadow hover:shadow-lg"
                key={tier.name}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"
                />
                <h3 className="font-display text-lg font-bold text-slate-950">{tier.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {tier.items.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span aria-hidden="true" className="text-blue-600">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-600">
                  {tier.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EngagementSection() {
  const { process } = homeContent

  return (
    <section className={sectionClass} id="engagement">
      <SectionHeading
        accent="run and hand over."
        centered
        eyebrow={process.eyebrow}
        title={process.title}
      />
      <HowItWorksTimeline />
    </section>
  )
}

export function ToolsSection() {
  const { tools } = homeContent

  return (
    <section
      className="w-full border-y border-slate-200/70 bg-white px-4 py-20 sm:px-6 lg:px-8"
      id="tools"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          accent="already use."
          centered
          description={tools.description}
          eyebrow={tools.eyebrow}
          title={tools.title}
        />
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {tools.groups.map((group) => (
            <div className="border-b border-slate-200 py-3" key={group.name}>
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {group.name}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.tools.map((tool) => (
                  <li
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-800"
                    key={tool}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
              {group.note && <p className="mt-3 text-xs text-slate-500">{group.note}</p>}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-mono text-xs leading-relaxed text-slate-500">
          {tools.note}
        </p>
      </div>
    </section>
  )
}

function ComparisonTable() {
  const { comparison } = homeContent

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-[#070A12] text-white">
          <tr>
            <th className="w-40 p-4 font-mono text-xs font-semibold uppercase tracking-wide text-slate-400">
              {comparison.rowHeading}
            </th>
            <th className="p-4 font-display font-bold text-slate-200">{comparison.leftHeading}</th>
            <th className="bg-blue-600/10 p-4 font-display font-bold text-blue-200">
              {comparison.rightHeading}
            </th>
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr className="border-t border-slate-200 align-top" key={row.name}>
              <th className="p-4 font-display font-bold text-slate-900">{row.name}</th>
              <td className="p-4 leading-relaxed text-slate-600">{row.manual}</td>
              <td className="bg-blue-50/40 p-4 leading-relaxed text-slate-700">{row.engine}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ComparisonSection() {
  const { comparison } = homeContent

  return (
    <section className={sectionClass} id="comparison">
      <SectionHeading
        accent="operating model"
        centered
        description={comparison.description}
        eyebrow={comparison.eyebrow}
        title={comparison.title}
      />
      <ComparisonTable />
      <p className="mt-4 text-center text-xs text-slate-500">{comparison.note}</p>
    </section>
  )
}

export function PricingSection({ locale }: { locale: Locale }) {
  const { pricing } = homeContent
  const offers = [...pricing.offers].sort((left, right) => {
    if (left.id === "outbound") return -1
    if (right.id === "outbound") return 1
    return 0
  })
  const scopeItems = pricing.offers.map((offer) => ({
    id: offer.id,
    title: offer.name,
    content: <p>{offer.scope}</p>,
  }))

  return (
    <section
      className="w-full border-y border-slate-200/70 bg-white px-4 py-24 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          accent="starting price"
          centered
          description={pricing.description}
          eyebrow={pricing.eyebrow}
          title={pricing.title}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                offer.id === "outbound"
                  ? "border-blue-300 bg-white shadow-lg shadow-blue-950/5"
                  : "border-slate-200 bg-[#FAFAFD] shadow-sm"
              }`}
              key={offer.id}
            >
              {offer.id === "outbound" && (
                <span className="absolute right-4 top-4 rounded bg-blue-50 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                  {homeContent.labels.defaultEntry}
                </span>
              )}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 ${
                  offer.id === "outbound" ? "bg-blue-600" : "bg-slate-300"
                }`}
              />
              <h3 className="font-display text-lg font-bold text-slate-950">{offer.name}</h3>
              <p className="mt-5 font-display text-4xl font-extrabold tracking-tight text-slate-950">
                {offer.price}
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">{offer.summary}</p>
              <Link
                className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                href={localePath(locale, "/contact")}
              >
                {homeContent.labels.discussPath}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
        <HomeAccordion
          className="mx-auto mt-7 max-w-5xl rounded-2xl border border-slate-200 bg-white px-5 shadow-sm sm:px-8"
          idPrefix="offer-scope"
          items={scopeItems}
        />
        <p className="mt-5 text-center text-sm font-semibold text-slate-700">
          {pricing.notOffered}
        </p>
        <p className="mt-8 text-center font-display text-base font-semibold text-slate-800">
          {pricing.boundary}
        </p>
      </div>
    </section>
  )
}

export function FitSection() {
  const { fit } = homeContent
  const groups = [
    { title: fit.bestFitTitle, items: fit.bestFit },
    { title: fit.notFitTitle, items: fit.notFit },
  ]

  return (
    <section className={sectionClass} id="fit">
      <SectionHeading accent="closer" centered eyebrow={fit.eyebrow} title={fit.title} />
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map(({ title, items }) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
            key={title}
          >
            <h3 className="font-display text-xl font-bold text-slate-950">{title}</h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
              {items.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span aria-hidden="true" className="text-blue-600">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-center font-mono text-xs text-slate-700">
        {fit.boundary}
      </p>
    </section>
  )
}

export function FaqSection() {
  const { faq } = homeContent

  return (
    <section
      className="w-full border-y border-slate-200/70 bg-white px-4 py-24 sm:px-6 lg:px-8"
      id="faq"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading accent="decide." centered eyebrow={faq.eyebrow} title={faq.title} />
        <HomeAccordion
          className="rounded-2xl border border-slate-200 bg-[#FAFAFD] px-5 shadow-sm sm:px-8"
          idPrefix="faq"
          items={faq.items.map((item) => ({
            id: item.id,
            title: item.question,
            content: <p>{item.answer}</p>,
          }))}
        />
        <p className="mt-6 text-center font-mono text-xs font-semibold text-slate-600">
          {faq.boundary}
        </p>
      </div>
    </section>
  )
}

export function FinalCtaSection({ locale }: { locale: Locale }) {
  return (
    <section className={sectionClass} id="contact">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-950 shadow-xl sm:px-12 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl space-y-5">
          <p className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-xs font-medium text-blue-700">
            {homeContent.finalCta.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            {homeContent.finalCta.title}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {homeContent.finalCta.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[var(--site-burnt-orange)] px-6 py-3 text-sm font-semibold text-[var(--site-ink)] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[var(--site-burnt-orange)] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href={localePath(locale, "/contact")}
            >
              {homeContent.finalCta.buildAction}
              <span aria-hidden="true">→</span>
            </Link>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href="#how-it-works"
            >
              {homeContent.finalCta.callAction}
              <span aria-hidden="true" className="text-slate-500">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
