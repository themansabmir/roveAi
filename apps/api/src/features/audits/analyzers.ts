import * as cheerio from "cheerio";
import { FindingSeverity } from "@prisma/client";
import { sameRegistrableDomain } from "@plugins/fetch/ssrf";
import { sitemapLocs } from "@plugins/fetch/robots";

export interface FindingDraft {
  code: string;
  severity: FindingSeverity;
  source: "CRAWL" | "LAB";
  confidence: number;
  message: string;
  evidence?: Record<string, unknown>;
}

export interface PageInspect {
  url: string;
  httpStatus: number;
  role: string;
  html: boolean;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  h1: string[];
  h2: string[];
  textSize: number;
  imageCount: number;
  imagesMissingAlt: number;
  telCount: number;
  mailtoCount: number;
  formCount: number;
  ctaTexts: string[];
  techStack: string[];
}

const CTA = /\b(contact|book|call|quote|schedule|appointment|get started|request)\b/i;
const PENALTY: Record<FindingSeverity, number> = {
  INFO: 0,
  LOW: 3,
  MEDIUM: 8,
  HIGH: 15,
  CRITICAL: 25,
};

export function inspectPage(url: string, httpStatus: number, body: string, contentType: string): PageInspect {
  const html = /html|xml/i.test(contentType) || /^\s*</.test(body);
  const $ = cheerio.load(html ? body : "");
  const robots = $('meta[name="robots" i]').attr("content") ?? null;
  const h1 = $("h1")
    .map((_index, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);
  const h2 = $("h2")
    .map((_index, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean)
    .slice(0, 20);
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const images = $("img");
  let imagesMissingAlt = 0;
  images.each((_index, el) => {
    if ($(el).attr("alt") == null) imagesMissingAlt += 1;
  });
  const ctaTexts: string[] = [];
  $("a, button").each((_index, el) => {
    const label = $(el).text().replace(/\s+/g, " ").trim();
    if (label && CTA.test(label)) ctaTexts.push(label.slice(0, 120));
  });
  return {
    url,
    httpStatus,
    role: roleFor(url),
    html,
    title: $("title").first().text().replace(/\s+/g, " ").trim() || null,
    description: $('meta[name="description" i]').attr("content")?.trim() || null,
    canonical: $('link[rel="canonical" i]').attr("href")?.trim() || null,
    robots,
    h1,
    h2,
    textSize: text.length,
    imageCount: images.length,
    imagesMissingAlt,
    telCount: $('a[href^="tel:"]').length,
    mailtoCount: $('a[href^="mailto:"]').length,
    formCount: $("form").length,
    ctaTexts: ctaTexts.slice(0, 8),
    techStack: detectTech(body),
  };
}

export function analyzePages(pages: PageInspect[]): { seo: FindingDraft[]; experience: FindingDraft[] } {
  const confidence = pages.some((page) => page.html && page.textSize >= 200) ? 0.9 : 0.6;
  const seo: FindingDraft[] = [];
  const htmlPages = pages.filter((page) => page.html);
  for (const page of pages) {
    if (page.httpStatus >= 400) {
      seo.push({
        code: "BROKEN_INTERNAL_LINK",
        severity: page.role === "home" ? "HIGH" : "MEDIUM",
        source: "CRAWL",
        confidence: 0.95,
        message: `Fetched ${page.url} and received HTTP ${page.httpStatus}.`,
        evidence: { url: page.url, value: page.httpStatus },
      });
    }
  }
  for (const page of htmlPages) {
    if (!page.title) {
      seo.push(crawlFinding("MISSING_TITLE", "HIGH", confidence, `${page.url} has no title tag.`, { url: page.url }));
    }
    if (!page.description) {
      seo.push(
        crawlFinding("MISSING_META_DESCRIPTION", "MEDIUM", confidence, `${page.url} has no meta description.`, {
          url: page.url,
        })
      );
    }
    if (page.h1.length === 0) {
      seo.push(crawlFinding("MISSING_H1", "MEDIUM", confidence, `${page.url} has no h1.`, { url: page.url }));
    } else if (page.h1.length > 1) {
      seo.push(
        crawlFinding("MULTIPLE_H1", "LOW", confidence, `${page.url} has ${page.h1.length} h1 elements.`, {
          url: page.url,
          value: page.h1.length,
        })
      );
    }
    if (page.imagesMissingAlt > 0) {
      seo.push(
        crawlFinding("MISSING_ALT", "LOW", confidence, `${page.url} has images without an alt attribute.`, {
          url: page.url,
          value: page.imagesMissingAlt,
        })
      );
    }
    if (page.role === "home" && !page.canonical) {
      seo.push(crawlFinding("MISSING_CANONICAL", "LOW", confidence, "The homepage has no canonical link.", { url: page.url }));
    }
    if (page.robots && /noindex/i.test(page.robots)) {
      seo.push(crawlFinding("ROBOTS_NOINDEX", "HIGH", 0.95, `${page.url} is marked noindex.`, { url: page.url }));
    }
  }

  const experience: FindingDraft[] = [];
  if (pages.every((page) => page.telCount === 0)) {
    experience.push(crawlFinding("NO_TEL_LINK", "MEDIUM", confidence, "No tel: link was found in the fetched pages.", {}));
  }
  if (pages.every((page) => page.mailtoCount === 0)) {
    experience.push(crawlFinding("NO_MAILTO", "LOW", confidence, "No mailto: link was found in the fetched pages.", {}));
  }
  if (pages.every((page) => page.formCount === 0)) {
    experience.push(crawlFinding("NO_CONTACT_FORM", "MEDIUM", confidence, "No form was found in the fetched pages.", {}));
  }
  if (pages.every((page) => page.role !== "contact")) {
    experience.push(crawlFinding("NO_CONTACT_PAGE", "MEDIUM", confidence, "No contact page was included in the fetched set.", {}));
  }
  if (pages.every((page) => page.ctaTexts.length === 0)) {
    experience.push(
      crawlFinding("NO_CLEAR_CTA", "MEDIUM", confidence, "No contact, booking, or quote call to action was detected.", {})
    );
  }
  return { seo, experience };
}

export function scoreFromFindings(findings: Array<{ severity: FindingSeverity }>): number {
  const penalty = findings.reduce((sum, finding) => sum + PENALTY[finding.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function selectCrawlUrls(input: {
  homepage: string;
  homeHtml: string;
  sitemapXml: string | null;
  maxPages: number;
}): string[] {
  const chosen: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    if (chosen.length >= input.maxPages) return;
    let url: URL;
    try {
      url = new URL(raw, input.homepage);
    } catch {
      return;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (!sameRegistrableDomain(input.homepage, url.toString())) return;
    url.hash = "";
    const key = url.toString();
    if (seen.has(key)) return;
    seen.add(key);
    chosen.push(key);
  };

  push(input.homepage);
  if (input.sitemapXml) {
    for (const loc of sitemapLocs(input.sitemapXml)) push(loc);
  }
  const $ = cheerio.load(input.homeHtml);
  $("a[href]").each((_index, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const label = `${href} ${$(el).text()}`;
    if (!/contact|service|about|location|book/i.test(label)) return;
    push(new URL(href, input.homepage).toString());
  });
  return chosen;
}

function crawlFinding(
  code: string,
  severity: FindingSeverity,
  confidence: number,
  message: string,
  evidence: Record<string, unknown>
): FindingDraft {
  return {
    code,
    severity,
    source: "CRAWL",
    confidence,
    message: message.slice(0, 1000),
    evidence,
  };
}

function roleFor(url: string): string {
  let path = "/";
  try {
    path = new URL(url).pathname.toLowerCase();
  } catch {
    return "page";
  }
  if (path === "/" || path === "") return "home";
  if (path.includes("contact")) return "contact";
  if (path.includes("service")) return "services";
  if (path.includes("about")) return "about";
  if (/location|areas-we-serve/.test(path)) return "location";
  return "page";
}

function detectTech(html: string): string[] {
  const found: string[] = [];
  const needles: Array<[string, RegExp]> = [
    ["wordpress", /wp-content|wp-includes/i],
    ["shopify", /cdn\.shopify\.com/i],
    ["wix", /wix\.com|wixstatic/i],
    ["squarespace", /squarespace/i],
    ["webflow", /webflow/i],
    ["google-analytics", /google-analytics\.com|gtag\(/i],
    ["google-tag-manager", /googletagmanager\.com/i],
  ];
  for (const [name, pattern] of needles) {
    if (pattern.test(html)) found.push(name);
  }
  return found;
}
