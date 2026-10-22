import { AuditModule, AuditStatus } from "@prisma/client";

export const REQUIRED_MODULES: AuditModule[] = ["TECHNICAL_SEO", "WEBSITE_EXPERIENCE", "PERFORMANCE"];

const TERMINAL = new Set<AuditStatus>([
  "SKIPPED_NO_WEBSITE",
  "SKIPPED_NOT_OWNED_SITE",
  "SKIPPED_BY_ROBOTS",
  "SKIPPED_BUDGET",
  "UNREACHABLE",
  "BLOCKED",
  "LOW_TEXT",
  "COMPLETED",
  "FAILED",
]);

const HARD_FAIL = new Set<AuditStatus>(["FAILED", "UNREACHABLE", "BLOCKED"]);

export interface ModuleSnapshot {
  module: AuditModule;
  status: AuditStatus;
}

export function leadAuditStatus(modules: ModuleSnapshot[]): AuditStatus | null {
  const byModule = new Map(modules.map((module) => [module.module, module.status]));
  const statuses: AuditStatus[] = [];
  for (const required of REQUIRED_MODULES) {
    const status = byModule.get(required);
    if (!status || !TERMINAL.has(status)) return null;
    statuses.push(status);
  }
  if (statuses.some((status) => status === "BLOCKED")) return "BLOCKED";
  if (statuses.some((status) => status === "UNREACHABLE")) return "UNREACHABLE";
  if (statuses.some((status) => status === "FAILED")) return "FAILED";
  if (statuses.every((status) => status === "SKIPPED_BY_ROBOTS")) return "SKIPPED_BY_ROBOTS";
  return "COMPLETED";
}

export function campaignOutcome(statuses: AuditStatus[]): "COMPLETED" | "PARTIALLY_COMPLETED" | null {
  if (statuses.some((status) => status === "PENDING")) return null;
  return statuses.some((status) => HARD_FAIL.has(status)) ? "PARTIALLY_COMPLETED" : "COMPLETED";
}
