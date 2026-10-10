Your idea is to build an automated opportunity engine for local businesses. Outscraper supplies the prospects, open-source tools gather evidence about each business, and an AI reasoning layer turns that evidence into actionable sales opportunities.

The important design decision is this: don't run every audit on every lead indiscriminately. Build a modular audit pipeline, collect evidence once, calculate deterministic scores, and then let the AI interpret the results.

For example, a digital marketing agency searching for dentists in Delhi shouldn't just receive 500 business names. It should receive 500 researched businesses, with each one showing its problems, the evidence behind them, the services it may need, and a personalized pitch.

## 1. The complete opportunity-engine workflow

1\. Lead discovery

Outscraper: business name, category, address, website, phone, ratings, reviews, and Google Business Profile data.

2\. Normalize and enrich

Deduplicate businesses, normalize domains, classify industry, check website availability, and queue audits.

3\. Parallel audit workers

Website & SEO

Performance & UX

Local visibility

Reviews & reputation

Content & conversion

Competitors & market

4\. Deterministic opportunity engine

Normalize results, calculate scores, identify missing capabilities, and estimate opportunity confidence.

5\. AI reasoning agent

Combine audit evidence, business context, and agency services to produce ranked pain points, value propositions, and personalized outreach.

6\. Sales-ready lead report

Business profile, audit findings, evidence, opportunity score, recommended service, cold email, and call script.

## 2. The audit modules you can build with open-source tools

I'll separate the tools into three categories:

- Self-hostable/open source: run in your Docker infrastructure and control the results.
- Free external data sources: useful, but may have quotas or require API credentials.
- AI-derived insights: your own reasoning layer, based on the evidence collected.

A key distinction: open-source software does not mean every data source it uses is free. Google rankings, search volume, backlink indexes, and real-user performance data are examples where you may still need an external provider or account authorization.

### A. Website health, technical SEO, and crawlability

[Crab - Free SEO Crawler & Technical Site Audit Tool](https://images.openai.com/static-rsc-4/ptNZDUziuoYlwwfjrbNRWIA4jEOuTfreee0qW2LtNoYNKYShRa8Z31LJp54SwZdEb4tqui-_JUVPJmxGbpMjISAL7JHeateCa_EDFNtZC8G6eWmcDJLKHwlyUOwQPFhlZS1AFuzDYjUMd65ryMiVbp3Tsf_bwYFScyH0z0nTuNc?purpose=inline)

1\. Technical SEO audit

Build first

Check missing title tags, duplicate metadata, broken links, redirects, canonical tags, robots directives, sitemap coverage, heading structure, image alt text, indexability, and structured data.

Tools: gocrawl — [GitHub](https://github.com/Patience-dot-devl/gocrawl); Scouter — [GitHub](https://github.com/lokoe-mehdi/scouter).

Both are worth evaluating as existing crawler foundations. Gocrawl is designed around pluggable audit analyzers and structured reports.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

+1



[Of how I pushed my personal website Lighthouse Audit score to the max (possible) | by Lorena Ramonda | Medium](https://images.openai.com/static-rsc-4/n9SPUZ1UYjMc4gowDyC80i2FfmQz9Y8b2lZ_90xiMoQy-GHxWRODyD1k3znnk01oAbfUNcys0MSvpdEutvHZVI7XUL5Tl9zjuKUSOsssOQ0qmUs0LKsd8M7qTJF889rlAdGoXac67nYgKNNUeiuKJtV6QQMxTsfK0yBZ83sYCn4?purpose=inline)

2\. Page speed and Core Web Vitals

Measure LCP, CLS, INP where supported by the measurement source, TTFB, page weight, JavaScript cost, render-blocking resources, and mobile versus desktop performance.

Tools: Lighthouse and sitespeed.io — [GitHub](https://github.com/sitespeedio/sitespeed.io).

Sitespeed.io runs browser-based tests in Docker and supports Lighthouse integration. Repeat measurements rather than trusting a single run.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

+1



[Web Check: Open-source intelligence for any website - Help Net Security](https://images.openai.com/static-rsc-4/AjTa870Jg-dYdGm8660du5K09yhW7K8-cL2W7ns_7f3_6MLOYBgMHlVGkRwvx3x0Eus202WBsisz1WYwZcVw2Qht3QPdQSt8Vdhfi8xENMNVVhRzG1Ik8wpKz2QAYR6lFsx3DXMMiIeeILGjjSg9FFIeNNAiqz6MtvrzUVXVRzY?purpose=inline)

3\. Website security and configuration

Check HTTPS, TLS certificate validity, expiry, redirect-to-HTTPS, HSTS, content security policy, mixed content, and exposed server information.

Tools: testssl.sh — [GitHub](https://github.com/testssl/testssl.sh); Mozilla HTTP Observatory — [GitHub](https://github.com/mozilla/http-observatory).

Use these as configuration checks, not as proof that a business website is secure or vulnerable overall.

[Accessibility Toolkit Reports | QualiBooth](https://images.openai.com/static-rsc-4/lKf7tdz3_yY1t70dX8h6IQglULb_Ljsd4BVj9uAQR8livdxB0qXDeHpVAJlAViUsN__q4sG7942UGsyp8mBunsgB9ew8H1SLQx4qtfcXVpnXYrDpKQYoKzpO97RjJL6QtAzQHK5fS7aCU44Zo4etiH0o9nJI9_I16Fy9LrD10IM?purpose=inline)

4\. Accessibility audit

Detect missing form labels, low-contrast text, missing accessible names, invalid ARIA patterns, and other automated accessibility violations.

Tools: axe-core — [GitHub](https://github.com/dequelabs/axe-core); Pa11y — [GitHub](https://github.com/pa11y/pa11y).

Automated checks find only some accessibility problems; they cannot certify full WCAG conformance.

### B. Website experience and conversion opportunities

These checks are particularly valuable because they help you sell website redesign, conversion optimization, and lead-generation services.

| Audit              | What to collect                                                   | How to identify an opportunity                                        |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Mobile usability   | Viewport behavior, overflow, layout failures                      | Important content or calls to action are difficult to use on mobile   |
| Contactability     | Phone links, email links, contact forms, address visibility       | Customers may struggle to contact the business                        |
| Conversion paths   | Booking buttons, quote forms, appointment links, CTAs             | High-friction or missing inquiry paths                                |
| Page structure     | Homepage, service pages, location pages, contact page             | Missing pages for important services or locations                     |
| Content quality    | Service coverage, headings, FAQs, clarity                         | Important customer questions or services are not addressed            |
| Image optimization | Image dimensions, formats, payload size, lazy loading             | Oversized images may slow down pages                                  |
| Technology stack   | CMS, analytics tags, frameworks, visible widgets                  | Identify potential migration, integration, or analytics opportunities |
| Trust signals      | Testimonials, reviews, credentials, case studies, contact details | Important credibility information may be missing                      |

Tools: Use Playwright for automated browser interactions and screenshots, Lighthouse for audits, and your own HTML/DOM extraction for page structure. A lot of this is better implemented as small deterministic analyzers than as separate heavyweight Docker services.

Do not label a missing feature as a confirmed business problem. For example, a website without online booking may be intentional. Treat it as a hypothesis until the business model supports it.

### C. Google Business Profile and local SEO

This is one of your highest-value audit categories because your lead source already provides much of the starting data.

| Audit                    | What to measure                                                   | Potential opportunity                                      |
| ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Profile completeness     | Business name, category, address, hours, phone, website           | Missing or inconsistent information                        |
| Category relevance       | Primary/secondary categories versus actual services               | Potential mismatch between services and profile categories |
| Service coverage         | Listed services versus website service pages                      | Relevant services may be underrepresented                  |
| Review quality           | Rating, review count, recency, themes, owner responses            | Reputation management and review-response services         |
| Profile activity         | Available posts, updates, photos and other public signals         | Possible profile-maintenance opportunity                   |
| Website consistency      | Name, address, phone and opening hours across sources             | Conflicting business information                           |
| Local keyword visibility | Search results for service + location queries                     | Potential local SEO opportunity                            |
| Competitor comparison    | Reviews, categories, websites and visibility against nearby peers | Areas where competitors appear stronger                    |

Data sources and limitations:

- Outscraper: Use the profile and review data it already returns. Verify which fields and review-history features your plan actually provides.

- Google Business Profile APIs: For owner-authorized accounts, these can provide access to managed profile information, reviews, and performance insights, subject to API approval and OAuth permissions. They are not a general API for auditing every competitor's private performance data.&#x20;

  [image](https://www.google.com/s2/favicons?domain=https://developers.google.com\&sz=32)

  Google for Developers

  +2

- Local rank tracking: You can build the keyword, location, and competitor comparison framework yourself. Reliable, repeatable geographic search rankings usually require a search-data provider or carefully managed search collection. An open-source tracker does not automatically provide free ranking data.

- Review sentiment: You can analyze review text using local NLP models or your LLM. Separate observed themes from inferred business problems, and distinguish older reviews from recent feedback.

For local SEO, compare a business against similar businesses in the same geography and category, not against a universal benchmark. A dentist with 80 reviews in one market may be competitive, while another dentist with 80 reviews in a different market may not be.

### D. Business reputation and customer experience

These audits use review data, business metadata, and public website content.

| Audit              | Example finding                                        | Service opportunity                     |
| ------------------ | ------------------------------------------------------ | --------------------------------------- |
| Review sentiment   | Repeated complaints about appointment delays           | Customer experience consulting          |
| Unanswered reviews | Many recent reviews have no owner response             | Reputation management                   |
| Review recency     | No recent reviews relative to comparable businesses    | Review-generation workflow              |
| Complaint themes   | Customers repeatedly mention unclear pricing           | Website content and pricing clarity     |
| Trust signals      | Few testimonials or case studies on the website        | Conversion-focused website improvements |
| Brand consistency  | Business name or contact details differ across sources | Local listing cleanup                   |

You can implement these checks with your own TypeScript/Python processors and an open-source NLP model. You do not need a separate Docker container for every category.

Be careful with the conclusion. A review mentioning long waits does not prove that the business is losing revenue. It is evidence of a customer-experience issue worth investigating.

### E. Content, search intent, and service opportunities

Your crawler can extract service pages, headings, metadata, FAQs, location pages, and publicly visible content. Then use a deterministic analyzer and AI to find gaps.

Examples:

- A plumber offers emergency repairs but does not clearly advertise emergency service on the website.
- A clinic has a service page but lacks clear booking instructions.
- A local law firm has no dedicated pages for important practice areas.
- A business has location-specific services but no relevant location pages.
- A homepage has no clear primary call to action.
- A page mentions a service but provides little information about pricing, process, or customer questions.

For keyword research and search intent, consider:

- Google Search Console, when the owner authorizes access, to retrieve actual impressions, clicks, queries, and click-through rates.
- Search autocomplete and public search results as discovery signals, subject to applicable terms and restrictions.
- An optional third-party keyword or SERP provider when you need search-volume estimates, ranking history, or broad competitor data.

The most useful insight is not “this business needs more content.” It is something like:

> The business advertises emergency plumbing services, but its homepage does not clearly surface emergency availability or a direct call action. Consider testing a prominent emergency-service CTA and a dedicated service page.

That is a more defensible sales conversation because it connects an observable finding to a proposed improvement.

### F. Technology and digital maturity

Detect technologies that can help you understand how a business operates online.

Possible signals include:

- CMS and framework detection.
- Analytics and tag-manager presence.
- Booking or appointment integrations.
- Chat widgets.
- CRM and form integrations.
- E-commerce or payment capabilities.
- Advertising pixels.
- Cookie-consent tooling.
- CDN and hosting indicators.

You can build a basic fingerprinting engine from HTML, HTTP headers, script URLs, and known signatures. Treat technology detection as probabilistic: a missing fingerprint does not prove that a business lacks a particular technology.

Also, avoid making claims such as “the business has no analytics” when the tool only failed to detect a tracking script.

### G. Market and competitor intelligence

This is where the platform can become much more than an audit tool.

For each prospect, discover a small set of comparable businesses and compare:

- Ratings and review counts.
- Review recency and sentiment.
- Website quality and performance.
- Service and location-page coverage.
- Contact and booking experience.
- Publicly observable online visibility.
- Technology and content differences.

Produce a comparison like:

> The prospect has fewer recent reviews and a less direct booking path than three comparable businesses in the same area. Review acquisition and booking-flow improvements may be worth investigating.

Store the comparator set, geography, category, and observation date. Do not use a competitor's rating or review count alone to claim that it ranks higher in Google.

## 3. The open-source stack I would actually deploy

I would not deploy 15 different SEO dashboards and try to glue them together. I'd use a small number of mature tools for the expensive browser and crawling work, then implement the business-specific audit logic in your own workers.

## Recommended stack

SEO crawler — gocrawl or Scouter

Choose one as the primary crawler after testing it against your target websites. Avoid crawling the same site twice for overlapping checks.

[gocrawl](https://github.com/Patience-dot-devl/gocrawl) · [Scouter](https://github.com/lokoe-mehdi/scouter)

Browser and performance — sitespeed.io + Lighthouse

Run Chromium-based audits in isolated workers, with bounded page counts and repeatable measurements.

[sitespeed.io](https://github.com/sitespeedio/sitespeed.io)

Security and accessibility — testssl.sh + axe-core

Use dedicated checks for TLS configuration and automated accessibility violations.

[testssl.sh](https://github.com/testssl/testssl.sh) · [axe-core](https://github.com/dequelabs/axe-core)

Custom analyzers — TypeScript or Python

Implement contactability, CTA detection, NAP consistency, profile completeness, review aggregation, evidence normalization, and opportunity scoring.

Reasoning — your chosen LLM provider

Send compact, structured audit evidence into a model. The model ranks opportunities and drafts outreach; it should not invent audit measurements.

The listed tools are starting candidates, not an endorsement of their production readiness. Before adopting any repository in a commercial SaaS, verify its current maintenance, license, security posture, Docker support, resource usage, and redistribution or hosted-service obligations.

### Docker deployment pattern

Given the number of browser jobs and potentially large audit payloads, I would separate the API from the workers.

```

services:
  api:
    build: ./apps/api
    depends_on:
      - postgres
      - redis

  audit-worker:
    build: ./apps/audit-worker
    depends_on:
      - redis
      - postgres
    deploy:
      replicas: 2

  browser-worker:
    build: ./apps/browser-worker
    shm_size: "1gb"
    depends_on:
      - redis

  reasoning-worker:
    build: ./apps/reasoning-worker
    depends_on:
      - redis

  postgres:
    image: postgres:17
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:

```

This is an architectural sketch, not a complete production Compose file. Add health checks, resource limits, authentication, private networking, persistent backups, and pinned image versions before deployment. Browser jobs may require more shared memory and CPU than ordinary API workers.

Since you already work with Node.js, TypeScript, Redis queues, PostgreSQL, and Docker Compose, I would keep the orchestration and custom analyzers in your existing stack rather than introduce a new platform solely for this feature.&#x20;

## 4. Build a structured audit schema before building the AI agent

This is the most important engineering decision. Every tool should emit a normalized record, not a custom blob that the AI has to interpret from scratch.

For example:

```
{
  "audit_type": "performance",
  "status": "completed",
  "subject": "https://example.com",
  "observed_at": "2026-10-10T10:00:00Z",
  "metrics": {
    "lighthouse_performance": 48,
    "lcp_ms": 4200,
    "cls": 0.18
  },
  "findings": [
    {
      "code": "SLOW_LCP",
      "severity": "high",
      "evidence": {
        "metric": "lcp_ms",
        "value": 4200
      },
      "source": "lighthouse",
      "confidence": 0.99
    }
  ]
}
```

The values above are illustrative, not actual measurements.

For production, also record the tool version, device profile, test conditions, URL, HTTP status, failure reason, and whether a measurement came from lab testing or real-user data.

Keep these three concepts separate:

- Finding: An observable issue, such as a slow LCP measurement.
- Opportunity: A possible service that could address the finding, such as performance optimization.
- Business impact hypothesis: A possible outcome, such as improving the experience for prospective customers.

The last item is not established merely by observing the first.

## 5. How the AI reasoning engine should work

Don't pass every raw HTML document, screenshot, and crawler response into one giant prompt. Have your pipeline prepare a compact evidence package first.

Example input:

- Business: local dental clinic.
- Profile: 4.1 rating, 65 reviews.
- Website: performance score 48 in a mobile lab test.
- Contact page: phone number exists, but no obvious online appointment path was detected.
- Reviews: several recent reviews mention difficulty scheduling appointments.
- Competitors: three nearby clinics have more recent reviews and visible appointment links.

The agent should return structured findings:

| Field               | Example output                                                         |
| ------------------- | ---------------------------------------------------------------------- |
| Opportunity         | Improve mobile appointment conversion                                  |
| Evidence            | Slow mobile test, missing detected booking path, scheduling complaints |
| Confidence          | Medium                                                                 |
| Suggested service   | Website optimization and booking-flow improvements                     |
| Value proposition   | Make it easier for prospective patients to request appointments        |
| Outreach angle      | Mention the observed mobile experience and appointment path            |
| Verification needed | Confirm whether booking is available through a separate system         |

The AI should explicitly identify conflicting evidence, missing data, and alternative explanations. For example, a booking button may be hidden behind a third-party widget or require JavaScript interactions that your crawler failed to detect.

Do not let the AI invent search rankings, revenue losses, conversion rates, or competitor performance. Those claims need supporting measurements or must be clearly labelled as hypotheses.

## 6. Prioritize implementation in three phases

Phase 1 — MVP

## Generate useful leads cheaply

- Outscraper ingestion and deduplication.
- Website availability and basic technical SEO.
- Lighthouse performance audits.
- Google Business Profile and review analysis using available data.
- Contactability and CTA checks.
- Evidence-based AI pain points, email, and call script.

  Goal: deliver a credible audit for a useful subset of prospects, without running every expensive test.

Phase 2 — Competitive intelligence

## Make prospect research deeper

- Multi-page crawling.
- Accessibility and TLS checks.
- Review sentiment and competitor comparisons.
- Local keyword visibility through an appropriate data source.
- Better industry-specific opportunity scoring.

  Goal: improve differentiation and reduce generic AI recommendations.

Phase 3 — Autonomous sales agent

## Move from research to execution

- Scheduled re-audits and change detection.
- Prospect prioritization and campaign preparation.
- CRM integration.
- Human-approved campaign launch.
- Follow-up workflows and outcome tracking.

  Goal: become an ongoing prospecting system rather than a one-time audit generator.

## 7. Production guardrails you should not skip

Because you will crawl websites supplied by external data sources, your browser workers are an important security boundary.

- Block requests to private IP ranges, loopback, link-local addresses, cloud metadata endpoints, and internal network services. Revalidate destinations after DNS resolution and redirects to prevent SSRF.
- Run browser and security-scan containers with restricted network access, non-root users, CPU/memory limits, timeouts, and concurrency limits.
- Respect crawl policies and applicable terms, and avoid aggressive scanning of businesses that have not authorized it.
- Cache results and use deduplication so repeated prospects do not trigger unnecessary audits.
- Treat scraped HTML, page text, and review content as untrusted input. A webpage must never be allowed to override the AI agent's system instructions.
- Check the licenses of each open-source dependency and tool, especially when offering the platform as a commercial hosted service.

## My recommendation

Start with five audit families: technical SEO, performance, Google Business Profile and reviews, contact/conversion paths, and competitor comparison. They provide a strong foundation for agency prospecting without overwhelming your infrastructure.

Then build the differentiator yourself: the evidence normalization layer, opportunity scoring, industry-specific reasoning, and personalized sales pitches.

The open-source tools are replaceable components. Your real product moat is the quality of the evidence you collect and how reliably you turn it into a sales opportunity.