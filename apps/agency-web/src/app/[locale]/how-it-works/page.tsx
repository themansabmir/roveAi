import type { Metadata } from "next"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/agency-jsonld"
import { PageIntro } from "@/components/site/PageIntro"
import { CtaPanel } from "@/components/site/CtaPanel"
import { GateLog, HandoverKit, PhaseRail } from "@/components/how/HowItWorksSections"
import { EngagementTimeline } from "@/components/how/EngagementTimeline"
import { CommitmentsBand, StartSteps, TeamRoles } from "@/components/blocks/Blocks"
import { AgentRules } from "@/components/blocks/TrustSections"
import { homeContent } from "@/content/home"

const phases = [
  {
    when: "Day one",
    name: "Diagnose",
    detail: "A 30-minute review of your pipeline, from first touch to retention.",
    output: "A written map of where it breaks and what we'd fix first.",
  },
  {
    when: "Before any work",
    name: "Scope",
    detail: "We agree which systems to build, in which accounts, and how success is reviewed.",
    output: "A fixed scope and price, in writing.",
  },
  {
    when: "In your accounts",
    name: "Build",
    detail:
      "Data, targeting, sending, reply handling and CRM records set up in your accounts. New domains warm up for 2–4 weeks in parallel.",
    output: "A working system, approved by you before it goes live.",
  },
  {
    when: "Every week",
    name: "Run",
    detail: "Agents do the daily work. A named operator reviews it with you every week.",
    output: "A weekly report on what moved and what's next.",
  },
  {
    when: "Final 30 days",
    name: "Hand over",
    detail: "Documentation, a walkthrough and overlap while your team takes over.",
    output: "A system your team runs without us.",
  },
]

const processFaqIds = [
  "timing",
  "one-time",
  "brand-risk",
  "salesperson",
  "ownership",
  "after-handover",
]
const processFaq = homeContent.faq.items.filter((item) => processFaqIds.includes(item.id))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "How our RevOps engagements work",
    description:
      "Diagnose, build, run and hand over. How an ElqoraLabs engagement works, where you approve, and what you keep.",
    path: localePath(locale as Locale, "/how-it-works"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale

  return (
    <SiteChrome locale={loc}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: localePath(loc, "/") },
            { name: "How it works", path: localePath(loc, "/how-it-works") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: processFaq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <main>
        <PageIntro
          description="From a 30-minute review to a system your team runs on its own. Every step ends with something in writing."
          title="How an engagement works."
        />

        <section className="py-20 lg:py-24">
          <div className="rv-container">
            <h2 className="rv-heading max-w-2xl text-4xl sm:text-5xl" data-reveal>
              Three steps to start.
            </h2>
            <div className="mt-12">
              <StartSteps />
            </div>
          </div>
        </section>

        <section className="bg-surface py-24 lg:py-28">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                Five phases, one written outcome each.
              </h2>
              <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
                Hover a phase to see what happens and what you walk away with.
              </p>
            </div>
            <div className="mt-14" data-reveal>
              <PhaseRail phases={phases} />
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-28">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                What an engagement looks like over time.
              </h2>
              <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
                Phases overlap. Domains warm up while we build, and handover starts while the system
                is already running.
              </p>
            </div>
            <div className="mt-12">
              <EngagementTimeline />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                A person approves every step that matters.
              </h2>
              <p
                className="text-lg leading-relaxed text-ink-muted lg:col-span-5 lg:pt-2"
                data-reveal
              >
                Agents do the repeatable work. These four gates are where a person signs off before
                anything reaches a buyer.
              </p>
            </div>
            <div className="mt-16" data-reveal>
              <GateLog />
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="rv-container">
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
                Who works on your system.
              </h2>
              <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
                A small, named team, with you as the approver at the end of the line.
              </p>
            </div>
            <div className="mt-14">
              <TeamRoles />
            </div>
          </div>
        </section>

        <AgentRules locale={loc} />

        <div className="border-y border-line bg-surface" id="commitments">
          <CommitmentsBand />
        </div>

        <section className="py-24 lg:py-32">
          <div className="rv-container grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 className="rv-heading text-4xl sm:text-5xl" data-reveal>
                What you get at handover.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-quiet" data-reveal>
                Over the final 30 days, day-to-day running moves from us to your team. The goal is a
                system you run without us.
              </p>
            </div>
            <div className="lg:col-span-7" data-reveal>
              <HandoverKit />
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface py-24 lg:py-28" id="faq">
          <div className="rv-container">
            <h2 className="rv-heading max-w-2xl text-4xl sm:text-5xl" data-reveal>
              Common questions about the process
            </h2>
            <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {processFaq.map((item, index) => (
                <div
                  className="border-t border-line pt-6"
                  data-reveal
                  key={item.id}
                  style={{ ["--rv-i" as string]: index % 2 }}
                >
                  <dt className="text-lg font-semibold">{item.question}</dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-quiet">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <CtaPanel
          description="Phase one is a 30-minute review. You'll leave with a written map of where your pipeline breaks."
          locale={loc}
          title="Start with phase one."
        />
      </main>
    </SiteChrome>
  )
}
