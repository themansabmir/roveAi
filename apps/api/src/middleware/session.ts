import type { PrismaClient } from "@prisma/client";
import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@core/errors";
import type { Auth } from "@features/auth/better-auth";
import "@features/auth/auth.types";

export function attachSession(deps: { auth: Auth; prisma: PrismaClient }) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const session = await deps.auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session) {
        next();
        return;
      }

      const [memberships, account] = await Promise.all([
        deps.prisma.membership.findMany({
          where: { userId: session.user.id },
          select: { organizationId: true, role: true },
        }),
        deps.prisma.user.findUnique({
          where: { id: session.user.id },
          select: { isSuperAdmin: true, platformRole: true },
        }),
      ]);

      const activeOrganizationId = session.session.activeOrganizationId ?? null;
      const isSuperAdmin = (account?.isSuperAdmin ?? false) || account?.platformRole === "SUPER_ADMIN";
      req.auth = {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
        emailVerified: session.user.emailVerified ?? false,
        platformRole: account?.platformRole ?? null,
        isSuperAdmin,
        sessionId: session.session.id,
        activeOrganizationId,
        memberships: memberships.map((membership) => ({
          organizationId: membership.organizationId,
          role: membership.role,
        })),
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function requireAuth() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }
    next();
  };
}
