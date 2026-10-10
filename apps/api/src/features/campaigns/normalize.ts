import { WebsiteClass } from "@prisma/client";

const SOCIAL_HOSTS = [
  "facebook.com",
  "instagram.com",
  "linktr.ee",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "youtube.com",
];

const DIRECTORY_HOSTS = ["yelp.com", "yellowpages.com", "tripadvisor.com", "bbb.org", "google.com"];

const BOOKING_HOSTS = [
  "calendly.com",
  "booksy.com",
  "fresha.com",
  "opentable.com",
  "resy.com",
  "square.site",
  "toasttab.com",
  "mindbodyonline.com",
];

export function normalizeDomain(value: string): string {
  const stripped = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "")
    .replace(/^www\./, "");
  return stripped;
}

export function hostOf(url: string | null | undefined): string | null {
  if (!url || url.trim() === "") return null;
  const normalized = normalizeDomain(url);
  if (!normalized || normalized.includes(" ")) return null;
  return normalized;
}

export function classifyWebsite(url: string | null | undefined): WebsiteClass {
  const host = hostOf(url);
  if (!host) return "MISSING";
  if (matchesHost(host, SOCIAL_HOSTS)) return "SOCIAL";
  if (matchesHost(host, DIRECTORY_HOSTS)) return "DIRECTORY";
  if (matchesHost(host, BOOKING_HOSTS)) return "BOOKING";
  return "OWNED_SITE";
}

export function exclusionMatches(websiteUrl: string | null | undefined, exclusions: string[]): boolean {
  const host = hostOf(websiteUrl);
  if (!host) return false;
  return exclusions.some((entry) => hostOf(entry) === host);
}

function matchesHost(host: string, roots: string[]): boolean {
  return roots.some((root) => host === root || host.endsWith(`.${root}`));
}

export function normalizeName(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 255);
}

export function normalizePhone(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}
