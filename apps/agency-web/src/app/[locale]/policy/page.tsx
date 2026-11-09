import Link from "next/link"
import type { Metadata } from "next"
import { mapSeoToMetadata } from "@rove/cms/seo"
import type { Locale } from "@rove/cms/constants"
import { getSanityDataset, getSanityProjectId, getSiteUrl } from "@/lib/env"
import { localePath } from "@/lib/i18n"
import { SiteChrome } from "@/components/site/SiteChrome"
import { PageIntro } from "@/components/site/PageIntro"
import { policy } from "@/content/policy"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return mapSeoToMetadata(null, {
    siteUrl: getSiteUrl(),
    title: policy.title,
    description: policy.description,
    path: localePath(locale as Locale, "/policy"),
    sanityProjectId: getSanityProjectId(),
    sanityDataset: getSanityDataset(),
  })
}

export default async function PolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as Locale

  return (
    <SiteChrome locale={loc}>
      <main>
        <PageIntro description={policy.introduction} title={policy.title} />
        <div className="rv-container grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <nav aria-label="On this page" className="lg:col-span-3">
            <ul className="space-y-2 text-sm lg:sticky lg:top-28">
              {policy.sections.map((section) => (
                <li key={section.id}>
                  <a
                    className="text-quiet transition-colors hover:text-ink"
                    href={`#${section.id}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14 lg:col-span-8 lg:col-start-5">
            {policy.sections.map((section) => (
              <section aria-labelledby={`${section.id}-heading`} id={section.id} key={section.id}>
                <h2 className="rv-heading text-3xl" id={`${section.id}-heading`}>
                  {section.heading}
                </h2>
                {"summary" in section && (
                  <p className="mt-4 max-w-[68ch] text-[17px] leading-relaxed">{section.summary}</p>
                )}
                {section.items.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {section.items.map((item) => (
                      <li
                        className="flex max-w-[68ch] gap-3 text-[16px] leading-relaxed text-quiet"
                        key={item}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="rounded-2xl border border-line bg-surface p-8">
              <h2 className="rv-heading text-2xl">Questions about your data?</h2>
              <p className="mt-3 max-w-lg text-quiet">
                Tell us what you need to know and we&apos;ll reply with the detail.
              </p>
              <Link className="rv-btn-primary mt-6" href={localePath(loc, "/contact")}>
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteChrome>
  )
}
