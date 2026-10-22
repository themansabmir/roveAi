import { robotsAllows, sitemapLocs } from "./robots";

describe("robots and sitemap", () => {
  it("honors a wildcard disallow and a more specific allow", () => {
    const body = "User-agent: *\nDisallow: /\nAllow: /contact\n";
    expect(robotsAllows(body, "/")).toBe(false);
    expect(robotsAllows(body, "/contact")).toBe(true);
  });

  it("prefers the RoveAudit group over the wildcard group", () => {
    const body = "User-agent: *\nDisallow: /\n\nUser-agent: RoveAudit\nAllow: /\n";
    expect(robotsAllows(body, "/services")).toBe(true);
  });

  it("reads sitemap locations", () => {
    const xml = "<urlset><url><loc>https://example.com/a</loc></url><url><loc>https://example.com/b?x=1&amp;y=2</loc></url></urlset>";
    expect(sitemapLocs(xml)).toEqual(["https://example.com/a", "https://example.com/b?x=1&y=2"]);
  });
});
