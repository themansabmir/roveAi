import { isBlockedAddress, isBlockedHostname, registrableDomain, sameRegistrableDomain } from "./ssrf";

describe("ssrf guard", () => {
  it("blocks loopback, link-local, and private addresses", () => {
    expect(isBlockedAddress("127.0.0.1")).toBe(true);
    expect(isBlockedAddress("10.1.2.3")).toBe(true);
    expect(isBlockedAddress("192.168.1.8")).toBe(true);
    expect(isBlockedAddress("172.16.0.4")).toBe(true);
    expect(isBlockedAddress("169.254.169.254")).toBe(true);
    expect(isBlockedAddress("::1")).toBe(true);
    expect(isBlockedAddress("fe80::1")).toBe(true);
    expect(isBlockedAddress("::ffff:127.0.0.1")).toBe(true);
    expect(isBlockedAddress("8.8.8.8")).toBe(false);
    expect(isBlockedAddress("2606:4700:4700::1111")).toBe(false);
  });

  it("blocks metadata and local hostnames", () => {
    expect(isBlockedHostname("localhost")).toBe(true);
    expect(isBlockedHostname("metadata.google.internal")).toBe(true);
    expect(isBlockedHostname("example.com")).toBe(false);
  });

  it("compares registrable domains", () => {
    expect(registrableDomain("www.harbor.co.uk")).toBe("harbor.co.uk");
    expect(sameRegistrableDomain("https://www.harbor.example/a", "https://blog.harbor.example/b")).toBe(true);
    expect(sameRegistrableDomain("https://harbor.example", "https://evil.example")).toBe(false);
  });
});
