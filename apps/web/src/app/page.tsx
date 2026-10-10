import Link from "next/link"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"

const features = [
  {
    title: "Lead discovery",
    description:
      "Pull business prospects with profile, category, reviews, and Google Business Profile data.",
  },
  {
    title: "Evidence-based audits",
    description:
      "Run modular audits for technical SEO, performance, local visibility, and conversion paths.",
  },
  {
    title: "AI opportunity briefs",
    description:
      "Turn normalized evidence into ranked pain points, value propositions, and personalized outreach.",
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-20">
      <section className="flex flex-col items-start gap-6">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          Opportunity engine for agencies
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Researched, sales-ready briefs for every local business you target.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Rove collects evidence once, scores opportunities deterministically, and lets AI turn the
          findings into a credible sales conversation — not just 500 business names.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="http://localhost:3000/dashboard">Open dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#features">Learn more</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Built on a modular audit pipeline with normalized evidence records.
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
