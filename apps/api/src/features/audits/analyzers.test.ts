import { analyzePages, inspectPage, scoreFromFindings, selectCrawlUrls } from "./analyzers";

const home = `<!doctype html><html><head>
  <title>Harbor Dental</title>
  <meta name="description" content="Dentist in Austin">
  <link rel="canonical" href="https://harbor.example/">
</head><body>
  <h1>Harbor Dental</h1>
  <a href="/contact">Contact</a>
  <a href="tel:+15125550101">Call</a>
  <a href="mailto:hello@harbor.example">Email</a>
  <form action="/contact"></form>
  <img src="/a.jpg" alt="Reception">
</body></html>`;

describe("cheerio analyzers", () => {
  it("emits no absence findings for a complete homepage", () => {
    const page = inspectPage("https://harbor.example/", 200, home, "text/html");
    const contact = inspectPage("https://harbor.example/contact", 200, home, "text/html");
    const { seo, experience } = analyzePages([page, contact]);
    expect(seo.map((finding) => finding.code)).toEqual([]);
    expect(experience.map((finding) => finding.code)).toEqual([]);
    expect(scoreFromFindings(seo)).toBe(100);
  });

  it("records missing tags, a broken page, and missing contact paths", () => {
    const thin = inspectPage("https://harbor.example/", 200, "<html><body><img src='/x.jpg'></body></html>", "text/html");
    const missing = inspectPage("https://harbor.example/services", 404, "missing", "text/plain");
    const { seo, experience } = analyzePages([thin, missing]);
    const codes = [...seo, ...experience].map((finding) => finding.code);
    expect(codes).toContain("MISSING_TITLE");
    expect(codes).toContain("BROKEN_INTERNAL_LINK");
    expect(codes).toContain("NO_TEL_LINK");
    expect(codes).toContain("NO_CONTACT_FORM");
    expect(codes).toContain("NO_CONTACT_PAGE");
    expect(thin.textSize).toBeLessThan(200);
    expect(seo.find((finding) => finding.code === "MISSING_TITLE")?.confidence).toBe(0.6);
  });

  it("keeps the crawl inside the registrable domain and the page cap", () => {
    const html = `<a href="/contact">Contact</a><a href="https://evil.example/contact">Elsewhere</a><a href="/services">Services</a>`;
    const urls = selectCrawlUrls({
      homepage: "https://www.harbor.example/",
      homeHtml: html,
      sitemapXml: "<urlset><url><loc>https://blog.harbor.example/about</loc></url><url><loc>https://other.example/a</loc></url></urlset>",
      maxPages: 3,
    });
    expect(urls).toEqual([
      "https://www.harbor.example/",
      "https://blog.harbor.example/about",
      "https://www.harbor.example/contact",
    ]);
  });
});
