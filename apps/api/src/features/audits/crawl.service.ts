import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { FetchError, PageFetcher } from "@plugins/fetch/fetch.types";
import { robotsAllows } from "@plugins/fetch/robots";
import { parseHttpUrl } from "@plugins/fetch/ssrf";
import { IObjectStorage } from "@plugins/storage/storage.types";
import { AuditJobPayload } from "@plugins/queue/queue.types";
import { logger } from "@core/logger";
import { AuditWrite, JobPublisher } from "./audit-scheduler";
import { analyzePages, FindingDraft, inspectPage, PageInspect, scoreFromFindings, selectCrawlUrls } from "./analyzers";
import { CrawlRepository } from "./crawl.repository";
import { contentHash } from "./url";

const DAY_MS = 24 * 60 * 60 * 1000;

export class CrawlService {
  constructor(
    private readonly repository: CrawlRepository,
    private readonly fetcher: PageFetcher,
    private readonly storage: IObjectStorage,
    private readonly queue: JobPublisher,
    private readonly limits: { maxPages: number; jobTimeoutMs: number }
  ) {}

  async run(payload: AuditJobPayload, meta: { retrycount: number; retrylimit: number }): Promise<void> {
    console.log(`[CrawlService.run] 🕷️ Crawl job started for lead: ${payload.leadId} (${payload.url})`);
    const claim = await this.repository.claimJob(payload.jobId, this.limits.jobTimeoutMs);
    console.log(`[CrawlService.run] 🔒 Job claim result: "${claim}" for jobId: ${payload.jobId}`);
    if (claim === "done") {
      console.log(`[CrawlService.run] ⏩ Job already done, calling publishIfReady()`);
      await this.repository.publishIfReady(this.queue, payload);
      return;
    }
    if (claim !== "ready") return;

    try {
      await this.execute(payload);
    } catch (err) {
      if (meta.retrycount >= meta.retrylimit) {
        console.error(`[CrawlService.run] ❌ Crawl terminal failure:`, err);
        await this.failModules(payload, "FAILED", errorMessage(err));
        await this.repository.publishIfReady(this.queue, payload);
        await this.repository.finishJob(payload.jobId, "FAILED", errorMessage(err));
        return;
      }
      await this.repository.releaseJob(payload.jobId);
      throw err;
    }
    console.log(`[CrawlService.run] ✅ Crawl completed for lead: ${payload.leadId}. Triggering publishIfReady()`);
    await this.repository.publishIfReady(this.queue, payload);
    await this.repository.finishJob(payload.jobId, "COMPLETED");
  }

  private async execute(payload: AuditJobPayload): Promise<void> {
    const lead = await this.repository.findLeadForCrawl(payload.leadId);
    if (!lead || lead.campaign.status === "CANCELLED") {
      console.log(`[CrawlService.execute] 🛑 Campaign lead missing or cancelled`);
      await this.repository.finishJob(payload.jobId, "CANCELLED");
      return;
    }

    const reused = await this.reuseRecent(payload);
    if (reused) {
      console.log(`[CrawlService.execute] ♻️ Reusing cached snapshot from last 24h: ${reused.snapshotId}`);
      await this.writeCompleted(payload, reused.snapshotId, reused.pages);
      return;
    }

    const home = parseHttpUrl(payload.url);
    if (!home) {
      console.log(`[CrawlService.execute] 🚫 URL is not valid public http(s): ${payload.url}`);
      await this.failModules(payload, "BLOCKED", "website url is not public http(s)");
      return;
    }

    const robots = await this.readText(new URL("/robots.txt", home.origin).toString());
    if (robots.outcome === "blocked") {
      await this.failModules(payload, "BLOCKED", "robots fetch was blocked");
      return;
    }
    const robotsBody = robots.outcome === "ok" ? robots.text : "";
    const homePath = `${home.pathname || "/"}${home.search}`;
    if (robotsBody && !robotsAllows(robotsBody, homePath)) {
      await this.failModules(payload, "SKIPPED_BY_ROBOTS", "robots.txt disallows the homepage");
      return;
    }

    let homepage;
    try {
      console.log(`[CrawlService.execute] 🌐 Fetching homepage: ${payload.url}`);
      homepage = await this.fetcher.fetch(payload.url);
      console.log(`[CrawlService.execute] 📥 Fetched homepage: status=${homepage.httpStatus}, finalUrl=${homepage.finalUrl}`);
    } catch (err) {
      if (err instanceof FetchError && err.code === "blocked") {
        console.warn(`[CrawlService.execute] 🚫 SSRF blocked URL: ${payload.url}`);
        await this.failModules(payload, "BLOCKED", err.message);
        return;
      }
      if (err instanceof FetchError) {
        console.warn(`[CrawlService.execute] ⚠️ Site unreachable: ${payload.url}`);
        await this.failModules(payload, "UNREACHABLE", err.message);
        return;
      }
      throw err;
    }

    const sitemap =
      !robotsBody || robotsAllows(robotsBody, "/sitemap.xml")
        ? await this.readText(new URL("/sitemap.xml", home.origin).toString())
        : { outcome: "skipped" as const };
    const targets = selectCrawlUrls({
      homepage: homepage.finalUrl,
      homeHtml: homepage.body.toString("utf8"),
      sitemapXml: sitemap.outcome === "ok" ? sitemap.text : null,
      maxPages: this.limits.maxPages,
    });
    console.log(`[CrawlService.execute] 🎯 Discovered ${targets.length} pages from sitemap/links to crawl`);

    const documents = [homepage];
    for (const target of targets) {
      if (canonicalKey(target) === canonicalKey(homepage.finalUrl) || canonicalKey(target) === canonicalKey(payload.url)) {
        continue;
      }
      if (robotsBody) {
        const path = new URL(target).pathname;
        if (!robotsAllows(robotsBody, path)) continue;
      }
      try {
        const doc = await this.fetcher.fetch(target);
        documents.push(doc);
        console.log(`[CrawlService.execute] 📄 Crawled sub-page: ${target} (status: ${doc.httpStatus})`);
      } catch (err) {
        logger.warn({ err, target }, "Skipped a page that could not be fetched");
      }
    }

    console.log(`[CrawlService.execute] 🔍 Analyzing ${documents.length} pages and computing content hash...`);
    const pages = documents.map((document) =>
      inspectPage(document.finalUrl, document.httpStatus, document.body.toString("utf8"), document.contentType)
    );
    const hash = contentHash(
      documents.map((document) => ({
        url: document.finalUrl,
        httpStatus: document.httpStatus,
        body: document.body,
      }))
    );
    const snapshotId = await this.storeSnapshot(payload, homepage.finalUrl, homepage.httpStatus, hash, robotsBody ? "checked" : "unavailable", pages, documents);
    console.log(`[CrawlService.execute] 💾 Stored WebsiteSnapshot ID: ${snapshotId}`);
    await this.writeCompleted(payload, snapshotId, pages);
    await this.repository.recordPageUsage(payload.organizationId, payload.campaignId, documents.length);
    console.log(`[CrawlService.execute] 📊 Recorded WEBSITE_PAGE usage (+${documents.length})`);
  }

  private async writeCompleted(payload: AuditJobPayload, snapshotId: string, pages: PageInspect[]): Promise<void> {
    const { seo, experience } = analyzePages(pages);
    const home = pages.find((page) => page.role === "home") ?? pages[0];
    const seoScore = scoreFromFindings(seo);
    const expScore = scoreFromFindings(experience);
    console.log(`[CrawlService.writeCompleted] ✍️ Writing audits -> TECHNICAL_SEO score: ${seoScore} (${seo.length} findings), WEBSITE_EXPERIENCE score: ${expScore} (${experience.length} findings)`);
    await this.repository.replaceAudit(payload.jobId, moduleWrite(payload, snapshotId, "TECHNICAL_SEO", seo, home, pages.length));
    await this.repository.replaceAudit(payload.jobId, moduleWrite(payload, snapshotId, "WEBSITE_EXPERIENCE", experience, home, pages.length));
  }

  private async failModules(
    payload: AuditJobPayload,
    status: "FAILED" | "SKIPPED_BY_ROBOTS" | "UNREACHABLE" | "BLOCKED",
    reason: string
  ): Promise<void> {
    for (const module of ["TECHNICAL_SEO", "WEBSITE_EXPERIENCE"] as const) {
      await this.repository.replaceAudit(payload.jobId, {
        organizationId: payload.organizationId,
        leadId: payload.leadId,
        snapshotId: null,
        module,
        status,
        score: null,
        metrics: null,
        toolName: "cheerio",
        toolVersion: "1",
        deviceProfile: null,
        observedAt: new Date(),
        failureReason: reason.slice(0, 500),
        findings: [],
      });
    }
  }

  private async reuseRecent(payload: AuditJobPayload): Promise<{ snapshotId: string; pages: PageInspect[] } | null> {
    const snapshot = await this.repository.findRecentSnapshot(
      payload.organizationId,
      payload.businessId,
      new Date(Date.now() - DAY_MS)
    );
    if (!snapshot || snapshot.pages.length === 0) return null;
    const pages: PageInspect[] = [];
    for (const page of snapshot.pages) {
      if (!page.htmlFile) return null;
      const body = await this.storage.get(page.htmlFile.bucket, page.htmlFile.objectKey);
      if (!body) return null;
      pages.push(inspectPage(page.url, page.httpStatus ?? 0, body.toString("utf8"), page.htmlFile.contentType ?? "text/html"));
    }
    return { snapshotId: snapshot.id, pages };
  }

  private async storeSnapshot(
    payload: AuditJobPayload,
    finalUrl: string,
    httpStatus: number,
    hash: string,
    robotsOutcome: string,
    pages: PageInspect[],
    documents: Array<{ finalUrl: string; httpStatus: number; body: Buffer; contentType: string }>
  ): Promise<string> {
    const home = pages.find((page) => page.role === "home") ?? pages[0];
    const existing = await this.repository.findSnapshotByHash(
      payload.organizationId,
      payload.businessId,
      hash
    );
    if (existing) return existing.id;

    const snapshot = await this.repository.createSnapshot({
      organizationId: payload.organizationId,
      businessId: payload.businessId,
      fetchedUrl: payload.url,
      finalUrl,
      httpStatus,
      contentHash: hash,
      pageCount: pages.length,
      robotsOutcome,
      title: home?.title?.slice(0, 500) ?? null,
      headings: { h1: home?.h1 ?? [], h2: home?.h2 ?? [] },
      techStack: home?.techStack ?? [],
      rawTextSize: home?.textSize ?? 0,
    });
    if (!snapshot.created) return snapshot.id;

    for (const document of documents) {
      const inspected = pages.find((page) => page.url === document.finalUrl);
      const objectKey = `org/${payload.organizationId}/snapshots/${snapshot.id}/${createHash("sha256").update(document.finalUrl).digest("hex").slice(0, 16)}.html`;
      const stored = await this.storage.put({
        objectKey,
        body: document.body,
        contentType: "text/html; charset=utf-8",
      });
      await this.repository.createSnapshotPageFile({
        organizationId: payload.organizationId,
        snapshotId: snapshot.id,
        url: document.finalUrl.slice(0, 1000),
        httpStatus: document.httpStatus,
        role: inspected?.role ?? "page",
        bucket: stored.bucket,
        objectKey: stored.objectKey,
        contentType: "text/html; charset=utf-8",
        sizeBytes: stored.sizeBytes,
        checksum: stored.checksum,
        extracted: extractedJson(inspected),
      });
    }
    return snapshot.id;
  }

  private async readText(url: string): Promise<{ outcome: "ok"; text: string } | { outcome: "missing" } | { outcome: "blocked" }> {
    try {
      const document = await this.fetcher.fetch(url, 512_000);
      if (document.httpStatus >= 400) return { outcome: "missing" };
      return { outcome: "ok", text: document.body.toString("utf8") };
    } catch (err) {
      if (err instanceof FetchError && err.code === "blocked") return { outcome: "blocked" };
      return { outcome: "missing" };
    }
  }
}

function moduleWrite(
  payload: AuditJobPayload,
  snapshotId: string,
  module: "TECHNICAL_SEO" | "WEBSITE_EXPERIENCE",
  findings: FindingDraft[],
  home: PageInspect | undefined,
  pageCount: number
): AuditWrite {
  return {
    organizationId: payload.organizationId,
    leadId: payload.leadId,
    snapshotId,
    module,
    status: "COMPLETED",
    score: scoreFromFindings(findings),
    metrics: {
      pageCount,
      textSize: home?.textSize ?? 0,
      title: home?.title ?? null,
    },
    toolName: "cheerio",
    toolVersion: "1",
    deviceProfile: null,
    observedAt: new Date(),
    failureReason: null,
    findings,
  };
}

function extractedJson(page: PageInspect | undefined): Prisma.InputJsonValue {
  if (!page) return {};
  return {
    title: page.title,
    h1: page.h1,
    canonical: page.canonical,
    robots: page.robots,
    telCount: page.telCount,
    mailtoCount: page.mailtoCount,
    formCount: page.formCount,
    ctaTexts: page.ctaTexts,
    imageCount: page.imageCount,
    imagesMissingAlt: page.imagesMissingAlt,
    textSize: page.textSize,
  };
}

function canonicalKey(raw: string): string {
  try {
    const url = new URL(raw);
    url.hash = "";
    return url.toString();
  } catch {
    return raw;
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "crawl failed";
}
