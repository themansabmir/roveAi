import type { Metadata } from "next"
import Link from "next/link"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { ContactForm } from "@/components/contact/ContactForm"
import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo/agency-jsonld"
import { notReadyLinks, services } from "@/content/revops"

const agenda = [
  "Where new pipeline comes from today, and where it stalls",
  "How replies, leads and CRM records are handled",
  "What happens to deals after the first call",
  "Which system we'd build first, or whether you need one at all",
]

const nextSteps = [
  {
    title: "We confirm a time",
    detail: "We reply to arrange a 30-minute call at a time that suits you.",
  },
  {
    title: "We map your pipeline",
    detail: "Where it breaks today, from first touch to retention, and what it's costing you.",
  },
  {
    title: "You get it in writing",
    detail:
      "A short summary of what we'd fix first. If we're a fit, a fixed-scope proposal follows.",
  },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: "Book a 30-minute review",
    description:
      "Book a 30-minute pipeline review. We map where your revenue line breaks and tell you honestly whether we're the right fit.",
    path: localePath(locale as Locale, "/contact"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale

  return (
    <SiteChrome locale={loc}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: localePath(loc, "/") },
            { name: "Contact", path: localePath(loc, "/contact") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Book a 30-minute review",
            url: `${getSiteUrl()}${localePath(loc, "/contact")}`,
          },
        ]}
      />
      <main className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] [background-image:linear-gradient(to_right,rgb(var(--rv-line-c)/0.55)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="rv-container relative grid gap-14 pb-24 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-16">
          <div className="rv-intro lg:col-span-5">
            <h1 className="rv-display text-[clamp(2.6rem,5.5vw,4.5rem)]">
              Book a 30-minute review.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-quiet">
              We&apos;ll map where your pipeline breaks and tell you honestly whether we&apos;re the
              right fit. No pitch deck, no obligation.
            </p>
            <ol className="mt-12 space-y-6">
              {nextSteps.map((step, index) => (
                <li className="grid grid-cols-[2.25rem_1fr] gap-4" key={step.title}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-tint font-mono text-sm text-brand-deep">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="font-semibold">{step.title}</h2>
                    <p className="mt-1 text-[15px] leading-relaxed text-quiet">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-7" style={{ animation: "rv-fade-up 700ms 150ms both" }}>
            <ContactForm />
          </div>
        </div>

        <section className="border-t border-line bg-surface py-20 lg:py-24">
          <div className="rv-container grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-ink p-8 text-white lg:col-span-2" data-reveal>
              <h2 className="rv-heading text-3xl">What we cover in 30 minutes</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {agenda.map((item, index) => (
                  <li
                    className="flex gap-3 rounded-xl bg-ink-2 p-4 text-[15px] leading-relaxed"
                    key={item}
                  >
                    <span className="font-mono text-xs text-brand-bright">{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-muted">
                Nothing to prepare. If you have a CRM or outbound tool, a quick look at it helps.
              </p>
            </div>
            <div
              className="rounded-3xl border border-line bg-paper p-8"
              data-reveal
              style={{ ["--rv-i" as string]: 1 }}
            >
              <h2 className="rv-heading text-2xl">Prefer to read first?</h2>
              <ul className="mt-5 divide-y divide-line">
                {[
                  ...notReadyLinks,
                  ...services.items.map((item) => ({
                    label: item.name,
                    href: `/services/${item.slug}`,
                  })),
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      className="group flex items-center justify-between gap-4 py-3 text-[15px] font-medium hover:text-brand"
                      href={localePath(loc, item.href)}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="text-brand transition-transform duration-300 group-hover:translate-x-1"
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
      </main>
    </SiteChrome>
  )
}
