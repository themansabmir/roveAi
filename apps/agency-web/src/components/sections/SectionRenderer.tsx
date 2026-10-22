import Link from "next/link"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import type { CmsSection, Cta } from "@rove/cms/types"
import { PortableTextBlock } from "@/components/sanity/PortableTextBlock"

function CtaButton({ cta, variant }: { cta: Cta; variant?: "primary" | "outline" }) {
  if (!cta.href || !cta.label) return null
  const isExternal = cta.href.startsWith("http")
  const v = cta.variant ?? variant ?? "primary"
  return (
    <Button asChild size="lg" variant={v === "outline" ? "outline" : "default"}>
      {isExternal ? (
        <a href={cta.href} target="_blank" rel="noopener noreferrer">
          {cta.label}
        </a>
      ) : (
        <Link href={cta.href}>{cta.label}</Link>
      )}
    </Button>
  )
}

export function SectionRenderer({ sections }: { sections?: CmsSection[] | null }) {
  if (!sections?.length) return null

  return (
    <div className="flex flex-col gap-16">
      {sections.map((section, index) => {
        switch (section._type) {
          case "heroBlock":
            return (
              <section key={index} className="flex flex-col items-start gap-6">
                {section.eyebrow ? (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {section.eyebrow}
                  </span>
                ) : null}
                {section.heading ? (
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{section.heading}</h1>
                ) : null}
                {section.subheading ? (
                  <p className="max-w-2xl text-lg text-muted-foreground">{section.subheading}</p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  {section.primaryCta ? <CtaButton cta={section.primaryCta} /> : null}
                  {section.secondaryCta ? <CtaButton cta={section.secondaryCta} variant="outline" /> : null}
                </div>
              </section>
            )
          case "featureGridBlock":
            return (
              <section key={index} className="grid gap-6 sm:grid-cols-3">
                {section.heading ? (
                  <h2 className="col-span-full text-2xl font-semibold">{section.heading}</h2>
                ) : null}
                {section.items?.map((item, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      {item.description ? <CardDescription>{item.description}</CardDescription> : null}
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground" />
                  </Card>
                ))}
              </section>
            )
          case "faqBlock":
            return (
              <section key={index} className="max-w-2xl space-y-6">
                {section.heading ? <h2 className="text-2xl font-semibold">{section.heading}</h2> : null}
                <dl className="space-y-4">
                  {section.items?.map((item, i) => (
                    <div key={i}>
                      <dt className="font-medium">{item.question}</dt>
                      <dd className="mt-1 text-muted-foreground">{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )
          case "richTextBlock":
            return (
              <section key={index} className="prose prose-neutral dark:prose-invert max-w-none">
                <PortableTextBlock value={section.body} />
              </section>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
