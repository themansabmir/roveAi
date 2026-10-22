import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "@core/errors";
import type { OrgRole, PlatformRole } from "@features/auth/auth.types";

/**
 * Platform role guard for internal team staff. Not an organization role.
 * Internal team members (super admin, member, support) oversee organizations
 * and are not required to be a member of any customer organization.
 */
export function requirePlatformRole(allowed: PlatformRole[] = ["SUPER_ADMIN"]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }

    const isPlatformStaff =
      (req.auth.isSuperAdmin && allowed.includes("SUPER_ADMIN")) ||
      (req.auth.platformRole && allowed.includes(req.auth.platformRole));

    if (!isPlatformStaff) {
      next(new ForbiddenError("Platform staff access required"));
      return;
    }

    next();
  };
}

/**
 * Platform super-admin guard. Convenience wrapper for requirePlatformRole(["SUPER_ADMIN"]).
 */
export function requireSuperAdmin() {
  return requirePlatformRole(["SUPER_ADMIN"]);
}

/**
 * Guard for organization-scoped routes (/api/organizations/:organizationId/*).
 * 1. Platform SUPER_ADMIN has root read/write access across all organizations.
 * 2. Platform MEMBER has full inspection and operation access across all organizations.
 * 3. Platform SUPPORT has read-only (GET/HEAD) inspection access across all organizations.
 * 4. Regular customer users must have an active membership in the target organization.
 */
export function requireOrgAccess(paramName = "organizationId") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }

    const raw = req.params[paramName];
    const organizationId = Array.isArray(raw) ? raw[0] : raw;
    if (!organizationId) {
      next(new UnauthorizedError(`${paramName} is required`));
      return;
    }

    // Platform Super Admin & Staff bypass
    if (req.auth.isSuperAdmin || req.auth.platformRole === "SUPER_ADMIN" || req.auth.platformRole === "MEMBER") {
      req.organizationId = organizationId;
      next();
      return;
    }

    // Platform Support: read-only access to customer orgs
    if (req.auth.platformRole === "SUPPORT") {
      if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        next(new ForbiddenError("Support staff has read-only access to tenant organizations"));
        return;
      }
      req.organizationId = organizationId;
      next();
      return;
    }

    // Tenant check for customer agency members
    const isMember = req.auth.memberships.some((membership) => membership.organizationId === organizationId);
    if (!isMember) {
      next(new ForbiddenError("Not a member of this organization"));
      return;
    }

    req.organizationId = organizationId;
    next();
  };
}

/**
 * Requires the caller to have one of the allowed roles within the organization.
 * Super admins and internal platform members bypass tenant role constraints.
 */
export function requireOrgRole(allowed: OrgRole[], paramName = "organizationId") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }

    const raw = req.params[paramName];
    const organizationId = Array.isArray(raw) ? raw[0] : raw;
    if (!organizationId) {
      next(new UnauthorizedError(`${paramName} is required`));
      return;
    }

    // Platform Super Admin bypasses all org role checks
    if (req.auth.isSuperAdmin || req.auth.platformRole === "SUPER_ADMIN") {
      req.organizationId = organizationId;
      next();
      return;
    }

    // Platform Member has operator rights on tenant orgs
    if (req.auth.platformRole === "MEMBER") {
      req.organizationId = organizationId;
      next();
      return;
    }

    // Platform Support has read-only rights
    if (req.auth.platformRole === "SUPPORT") {
      if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        next(new ForbiddenError("Support staff has read-only access to tenant organizations"));
        return;
      }
      req.organizationId = organizationId;
      next();
      return;
    }

    const membership = req.auth.memberships.find((item) => item.organizationId === organizationId);
    if (!membership) {
      next(new ForbiddenError("Not a member of this organization"));
      return;
    }

    if (!allowed.includes(membership.role)) {
      next(new ForbiddenError("Insufficient role for this action"));
      return;
    }

    req.organizationId = organizationId;
    next();
  };
}
