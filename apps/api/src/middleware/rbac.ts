import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "@core/errors";

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

    const isMember = req.auth.memberships.some((membership) => membership.organizationId === organizationId);
    if (!isMember) {
      next(new ForbiddenError("Not a member of this organization"));
      return;
    }

    req.organizationId = organizationId;
    next();
  };
}
