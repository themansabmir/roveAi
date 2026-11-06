import { createHash } from "node:crypto";

export function canonicalAuditUrl(raw: string): string {
  const url = new URL(raw);
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

export function contentHash(pages: Array<{ url: string; httpStatus: number; body: Buffer }>): string {
  const hash = createHash("sha256");
  const sorted = [...pages].sort((left, right) => left.url.localeCompare(right.url));
  for (const page of sorted) {
    hash.update(page.url);
    hash.update("\n");
    hash.update(String(page.httpStatus));
    hash.update("\n");
    hash.update(createHash("sha256").update(page.body).digest());
    hash.update("\n");
  }
  return hash.digest("hex");
}

export function startOfUtcDay(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
