interface RobotRule {
  type: "allow" | "disallow";
  path: string;
}

interface RobotGroup {
  agents: string[];
  rules: RobotRule[];
}

export function robotsAllows(body: string, path: string, userAgent = "RoveAudit"): boolean {
  const groups = parseGroups(body);
  const specific = groups.filter((group) =>
    group.agents.some((agent) => agent !== "*" && userAgent.toLowerCase().startsWith(agent))
  );
  const chosen = specific.length > 0 ? specific : groups.filter((group) => group.agents.includes("*"));
  let match: { length: number; allow: boolean } | null = null;
  const target = path.startsWith("/") ? path : `/${path}`;
  for (const group of chosen) {
    for (const rule of group.rules) {
      if (!rule.path) continue;
      if (!pathMatches(rule.path, target)) continue;
      if (!match || rule.path.length > match.length) {
        match = { length: rule.path.length, allow: rule.type === "allow" };
      }
    }
  }
  return match ? match.allow : true;
}

export function sitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const pattern = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xml))) {
    const value = decodeXml(match[1]?.trim() ?? "");
    if (value) locs.push(value);
  }
  return locs;
}

function parseGroups(body: string): RobotGroup[] {
  const groups: RobotGroup[] = [];
  let current: RobotGroup | null = null;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const splitAt = line.indexOf(":");
    if (splitAt < 0) continue;
    const field = line.slice(0, splitAt).trim().toLowerCase();
    const value = line.slice(splitAt + 1).trim();
    if (field === "user-agent") {
      const agent = value.toLowerCase();
      if (!current || current.rules.length > 0) {
        current = { agents: [agent], rules: [] };
        groups.push(current);
      } else {
        current.agents.push(agent);
      }
      continue;
    }
    if ((field === "allow" || field === "disallow") && current) {
      current.rules.push({ type: field, path: value });
    }
  }
  return groups;
}

function pathMatches(rulePath: string, target: string): boolean {
  if (rulePath === "/") return true;
  const end = rulePath.endsWith("$");
  const raw = end ? rulePath.slice(0, -1) : rulePath;
  const escaped = raw.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(end ? `^${escaped}$` : `^${escaped}`).test(target);
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
