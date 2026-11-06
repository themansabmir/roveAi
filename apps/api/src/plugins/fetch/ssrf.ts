import net from "node:net";

const BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal", "metadata.goog"]);

export function parseHttpUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (!url.hostname) return null;
  return url;
}

export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host || BLOCKED_HOSTS.has(host)) return true;
  if (host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (/^\d+$/.test(host)) return true;
  return false;
}

export function isBlockedAddress(address: string): boolean {
  const ip = address.toLowerCase().split("%")[0] ?? address;
  const mapped = mappedIpv4(ip);
  if (mapped) return isBlockedAddress(mapped);
  if (net.isIP(ip) === 4) return isBlockedIpv4(ip);
  if (net.isIP(ip) === 6) return isBlockedIpv6(ip);
  return true;
}

export function registrableDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  if (net.isIP(host)) return host;
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  const multi = new Set([
    "co.uk",
    "org.uk",
    "ac.uk",
    "co.in",
    "com.au",
    "net.au",
    "com.br",
    "co.nz",
    "co.za",
    "com.mx",
    "co.jp",
    "com.sg",
    "com.tr",
    "co.kr",
  ]);
  if (multi.has(lastTwo) && parts.length >= 3) return parts.slice(-3).join(".");
  return lastTwo;
}

export function sameRegistrableDomain(left: string, right: string): boolean {
  const a = parseHttpUrl(left);
  const b = parseHttpUrl(right);
  if (!a || !b) return false;
  return registrableDomain(a.hostname) === registrableDomain(b.hostname);
}

function isBlockedIpv4(ip: string): boolean {
  const value = ipv4ToInt(ip);
  if (value == null) return true;
  return (
    inCidr(value, ipv4ToInt("0.0.0.0")!, 8) ||
    inCidr(value, ipv4ToInt("10.0.0.0")!, 8) ||
    inCidr(value, ipv4ToInt("100.64.0.0")!, 10) ||
    inCidr(value, ipv4ToInt("127.0.0.0")!, 8) ||
    inCidr(value, ipv4ToInt("169.254.0.0")!, 16) ||
    inCidr(value, ipv4ToInt("172.16.0.0")!, 12) ||
    inCidr(value, ipv4ToInt("192.0.2.0")!, 24) ||
    inCidr(value, ipv4ToInt("192.168.0.0")!, 16) ||
    inCidr(value, ipv4ToInt("198.18.0.0")!, 15) ||
    inCidr(value, ipv4ToInt("198.51.100.0")!, 24) ||
    inCidr(value, ipv4ToInt("203.0.113.0")!, 24) ||
    inCidr(value, ipv4ToInt("224.0.0.0")!, 4) ||
    inCidr(value, ipv4ToInt("240.0.0.0")!, 4)
  );
}

function isBlockedIpv6(ip: string): boolean {
  const normalized = expandIpv6(ip);
  if (!normalized) return true;
  if (normalized === "0000:0000:0000:0000:0000:0000:0000:0000") return true;
  if (normalized === "0000:0000:0000:0000:0000:0000:0000:0001") return true;
  const first = parseInt(normalized.slice(0, 4), 16);
  if ((first & 0xfe00) === 0xfc00) return true;
  if ((first & 0xffc0) === 0xfe80) return true;
  if ((first & 0xff00) === 0xff00) return true;
  return false;
}

function mappedIpv4(ip: string): string | null {
  const dotted = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (dotted?.[1]) return dotted[1];
  const hex = ip.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (!hex?.[1] || !hex[2]) return null;
  const hi = parseInt(hex[1], 16);
  const lo = parseInt(hex[2], 16);
  return `${(hi >> 8) & 255}.${hi & 255}.${(lo >> 8) & 255}.${lo & 255}`;
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n > 255) return null;
    value = (value << 8) + n;
  }
  return value >>> 0;
}

function inCidr(ip: number, base: number, bits: number): boolean {
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ip & mask) === (base & mask);
}

function expandIpv6(ip: string): string | null {
  if (ip.includes(".")) return null;
  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  if (halves.length === 1 && head.length !== 8) return null;
  const missing = 8 - head.length - tail.length;
  if (missing < 0) return null;
  const groups = [...head, ...Array.from({ length: missing }, () => "0"), ...tail];
  if (groups.length !== 8) return null;
  const expanded = groups.map((group) => {
    if (!/^[0-9a-f]{1,4}$/i.test(group)) return null;
    return group.padStart(4, "0").toLowerCase();
  });
  if (expanded.some((group) => group == null)) return null;
  return expanded.join(":");
}
