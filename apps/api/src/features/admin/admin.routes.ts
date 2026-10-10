import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { requireSuperAdmin } from "../../middleware/rbac";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";

export function adminRouter(deps: { prisma: PrismaClient }): Router {
  const controller = new AdminController(new AdminRepository(deps.prisma));
  const router = Router();
  // Every admin route requires an authenticated platform super admin.
  router.use(requireAuth(), requireSuperAdmin());
  router.get("/overview", controller.overview);
  router.get("/organizations", controller.listOrganizations);
  return router;
}
