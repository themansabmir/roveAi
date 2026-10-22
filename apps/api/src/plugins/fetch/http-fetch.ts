import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { FetchError, FetchedDocument } from "./fetch.types";
import { isBlockedAddress, isBlockedHostname, parseHttpUrl } from "./ssrf";

export type AddressLookup = (hostname: string) => Promise<string[]>;

const MAX_REDIRECTS = 5;

export async function dnsLookupAll(hostname: string): Promise<string[]> {
  const records = await dns.lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

export async function resolvePublicAddress(hostname: string, lookup: AddressLookup): Promise<string> {
  const host = hostname.replace(/^\[|\]$/g, "");
  if (isBlockedHostname(host)) throw new FetchError("blocked host", "blocked");
  if (net.isIP(host)) {
    if (isBlockedAddress(host)) throw new FetchError("blocked address", "blocked");
    return host;
  }
  let addresses: string[];
  try {
    addresses = await lookup(host);
  } catch {
    throw new FetchError("dns failure", "unreachable");
  }
  if (addresses.length === 0) throw new FetchError("dns failure", "unreachable");
  for (const address of addresses) {
    if (isBlockedAddress(address)) throw new FetchError("blocked address", "blocked");
  }
  return addresses[0]!;
}

export async function fetchPublic(
  rawUrl: string,
  options: { timeoutMs: number; maxBytes: number; lookup?: AddressLookup }
): Promise<FetchedDocument> {
  const lookup = options.lookup ?? dnsLookupAll;
  let current = parseHttpUrl(rawUrl);
  if (!current) throw new FetchError("url is not public http(s)", "blocked");

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const pinned = await resolvePublicAddress(current.hostname, lookup);
    const response = await requestOnce(current, pinned, options.timeoutMs, options.maxBytes);
    if (response.statusCode >= 300 && response.statusCode < 400) {
      const location = response.headers["location"];
      if (!location) throw new FetchError("redirect missing location", "unreachable");
      const next = parseHttpUrl(new URL(location, current).toString());
      if (!next) throw new FetchError("redirect target is not public http(s)", "blocked");
      current = next;
      continue;
    }
    if (hop > MAX_REDIRECTS) break;
    return {
      url: rawUrl,
      finalUrl: current.toString(),
      httpStatus: response.statusCode,
      headers: response.headers,
      body: response.body,
      contentType: response.headers["content-type"] ?? "",
    };
  }
  throw new FetchError("too many redirects", "unreachable");
}

interface RawResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: Buffer;
}

function requestOnce(target: URL, ip: string, timeoutMs: number, maxBytes: number): Promise<RawResponse> {
  const lib = target.protocol === "https:" ? https : http;
  const family = net.isIP(ip);
  return new Promise((resolve, reject) => {
    const req = lib.request(
      target,
      {
        method: "GET",
        headers: {
          "User-Agent": "RoveAudit/0.1",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        lookup: (_hostname, _options, callback) => {
          callback(null, ip, family === 6 ? 6 : 4);
        },
        timeout: timeoutMs,
      },
      (res) => {
        const declared = Number(res.headers["content-length"] ?? 0);
        if (Number.isFinite(declared) && declared > maxBytes) {
          req.destroy();
          reject(new FetchError("response exceeded size cap", "too_large"));
          return;
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > maxBytes) {
            req.destroy();
            reject(new FetchError("response exceeded size cap", "too_large"));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => {
          const headers: Record<string, string> = {};
          for (const [key, value] of Object.entries(res.headers)) {
            if (typeof value === "string") headers[key.toLowerCase()] = value;
            else if (Array.isArray(value)) headers[key.toLowerCase()] = value.join(", ");
          }
          resolve({ statusCode: res.statusCode ?? 0, headers, body: Buffer.concat(chunks) });
        });
      }
    );
    req.on("timeout", () => {
      req.destroy();
      reject(new FetchError("timeout", "timeout"));
    });
    req.on("error", (err) => {
      if (err instanceof FetchError) {
        reject(err);
        return;
      }
      reject(new FetchError(err.message, "unreachable"));
    });
    req.end();
  });
}
