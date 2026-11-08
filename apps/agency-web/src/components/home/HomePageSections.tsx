import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { homeContent } from "@/content/home"
import { localePath } from "@/lib/i18n"
import { HomeAccordion } from "@/components/home/HomeAccordion"
import { ClientMarquee } from "@/components/home/ClientMarquee"
import { RevenueSystemFlow } from "@/components/home/RevenueSystemFlow"

const sectionClass = "mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
const sectionHeadingClass =
  "font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"

const pathAccent = {
  Fix: "bg-slate-300",
  Generate: "bg-blue-300",
  Run: "bg-purple-300",
} as const

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

function ConditionalOffer({ scope }: { scope: string }) {
  return (
    <p className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs leading-relaxed text-slate-700">
      <span className="font-semibold text-purple-800">{homeContent.labels.condition}: </span>
      {scope}
    </p>
  )
}

function PathCard({
  card,
  locale,
}: {
  card: (typeof homeContent.paths.cards)[number]
  locale: Locale
}) {
  const isPrimary = card.path === "Generate"

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${
        isPrimary
          ? "border-blue-300 bg-white shadow-lg shadow-blue-950/5"
          : "border-slate-200/90 bg-white shadow-sm"
      } p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7`}
    >
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${pathAccent[card.path]}`} />
      <div className="mb-5 flex items-center justify-between gap-3">
        <span
          className={`inline-flex w-fit rounded px-2.5 py-1 font-mono text-xs font-semibold ${
            isPrimary ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"
          }`}
        >
          {card.path}
        </span>
        {isPrimary && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            {homeContent.labels.defaultEntry}
          </span>
        )}
      </div>
      <h3 className="font-display text-xl font-bold leading-snug text-slate-950">{card.pain}</h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.work}</p>
      <div className="mt-auto pt-7">
        <p className="border-t border-slate-100 pt-4 font-display font-bold text-slate-950">
          {card.offer}
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{card.price}</p>
        <p className="mt-1 font-mono text-xs text-slate-500">{card.timing}</p>
        {card.id === "run" ? (
          <ConditionalOffer scope={card.scope} />
        ) : (
          <p className="mt-4 min-h-10 text-xs leading-relaxed text-slate-600">{card.scope}</p>
        )}
        <Link
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          href={localePath(locale, "/contact")}
        >
          {homeContent.labels.discussPath}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  )
}

export function HeroSection({ locale }: { locale: Locale }) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[360px] w-[700px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-100/60 via-indigo-100/40 to-transparent blur-3xl" />
      <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-3.5 py-1 font-mono text-xs font-medium tracking-wide text-blue-700 shadow-sm">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600"
          />
          {homeContent.hero.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {homeContent.hero.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {homeContent.hero.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            href="#revenue-leak-audit"
          >
            <span>{homeContent.hero.primaryAction}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold tracking-wide text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            href={localePath(locale, "/contact")}
          >
            {homeContent.hero.secondaryAction}
            <span aria-hidden="true" className="text-slate-400">
              →
            </span>
          </Link>
        </div>
      </div>
      <RevenueSystemFlow />
    </section>
  )
}

export function ClientMarqueeSection() {
  return <ClientMarquee />
}

export function PathsSection({ locale }: { locale: Locale }) {
  return (
    <section className={`${sectionClass} border-t border-slate-200/70`} id="paths">
      <SectionHeading
        accent="ways in"
        centered
        description={homeContent.paths.description}
        eyebrow={homeContent.paths.eyebrow}
        title={homeContent.paths.title}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {homeContent.paths.cards.map((card) => (
          <PathCard card={card} key={card.id} locale={locale} />
        ))}
      </div>
    </section>
  )
}

function ProofFlow({ project }: { project: (typeof homeContent.proof.projects)[number] }) {
  const titleId = `${project.id}-flow-title`
  const descriptionId = `${project.id}-flow-description`

  return (
    <figure className="relative">
      <svg
        aria-labelledby={`${titleId} ${descriptionId}`}
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-10 w-full -translate-y-1/2 lg:block"
        preserveAspectRatio="none"
        role="img"
        viewBox="0 0 1000 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{project.flowTitle}</title>
        <desc id={descriptionId}>{project.flowDescription}</desc>
        <defs>
          <marker
            id={`${project.id}-flow-arrow`}
            markerHeight="7"
            markerWidth="7"
            orient="auto"
            refX="6"
            refY="3.5"
            viewBox="0 0 7 7"
          >
            <path d="M0 0 7 3.5 0 7" fill="#64748b" />
          </marker>
        </defs>
        <path
          d="M200 50H300 M450 50H550 M700 50H800"
          fill="none"
          markerEnd={`url(#${project.id}-flow-arrow)`}
          stroke="#64748b"
          strokeDasharray="4 6"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <ol
        aria-label={project.flowTitle}
        className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {project.steps.map((step, index) => (
          <li className="flex items-center gap-2" key={step}>
            <span className="flex min-h-16 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold leading-relaxed text-slate-800">
              {step}
            </span>
            {index < project.steps.length - 1 && (
              <span aria-hidden="true" className="hidden font-mono text-slate-400 lg:inline">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}

export function ProofSection() {
  const { proof } = homeContent

  return (
    <section className={sectionClass} id="proof">
      <SectionHeading
        accent="production."
        centered
        description={proof.description}
        eyebrow={proof.eyebrow}
        title={proof.title}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {proof.projects.map((project) => (
          <article
            className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-7"
            key={project.id}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-slate-950">{project.name}</h3>
              <span className="rounded bg-blue-50 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-blue-800">
                {project.path}
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">{project.claim}</p>
            <ProofFlow project={project} />
          </article>
        ))}
      </div>
      <article className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 transition-colors hover:border-blue-300 hover:bg-blue-50/30 sm:p-7">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-slate-500">
          {proof.placeholder.title}
        </p>
        <p className="mt-3 font-display text-xl font-bold text-slate-950">
          {proof.placeholder.description}
        </p>
      </article>
    </section>
  )
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
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {homeContent.control.gates.map((gate, index) => (
        <li
          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-[#FAFAFD] p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          key={gate.name}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-400"
          />
          <p className="font-mono text-xs font-semibold tracking-wider text-blue-700">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-display font-bold text-slate-950">{gate.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{gate.approval}</p>
          <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-500">
            {gate.repeats}
          </p>
        </li>
      ))}
    </ol>
  )
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
        <p className="mx-auto mt-6 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
          {control.replyRule}
        </p>
        <div className="mt-20">
          <SectionHeading
            accent="three clear tiers."
            centered
            eyebrow={control.eyebrow}
            title={control.ownershipTitle}
          />
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
      <ol className="grid gap-5 md:grid-cols-3">
        {process.steps.map((step, index) => (
          <li
            className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            key={step.name}
          >
            <span className="font-mono text-2xl font-black text-blue-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-950">{step.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
          </li>
        ))}
      </ol>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tools.groups.map((group) => (
            <div
              className="rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              key={group.name}
            >
              <h3 className="font-mono text-xs font-bold uppercase tracking-wide text-slate-500">
                {group.name}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.tools.map((tool) => (
                  <li
                    className="rounded bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-800"
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
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#070A12] px-6 py-16 text-center text-white shadow-2xl shadow-slate-950/10 sm:px-12 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl space-y-5">
          <p className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs font-medium text-blue-300">
            {homeContent.finalCta.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {homeContent.finalCta.title}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {homeContent.finalCta.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="#revenue-leak-audit"
            >
              {homeContent.finalCta.auditAction}
              <span aria-hidden="true">→</span>
            </a>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href={localePath(locale, "/contact")}
            >
              {homeContent.finalCta.callAction}
              <span aria-hidden="true" className="text-slate-500">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
