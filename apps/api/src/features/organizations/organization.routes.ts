import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireOrgAccess } from "../../middleware/rbac";
import { requireAuth } from "../../middleware/session";
import { OrganizationController } from "./organization.controller";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";

export function organizationsRouter(deps: { prisma: PrismaClient }): Router {
  const controller = new OrganizationController(new OrganizationService(new OrganizationRepository(deps.prisma)));
  const router = Router();
  router.get("/:organizationId", requireAuth(), requireOrgAccess(), controller.get);
  return router;
}
