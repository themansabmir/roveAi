import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { requireSuperAdmin } from "../../middleware/rbac";
import { IMapsService } from "@plugins/maps/maps.plugin";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";

export function adminRouter(deps: { prisma: PrismaClient; maps: IMapsService }): Router {
  const controller = new AdminController(new AdminRepository(deps.prisma), deps.maps);
  const router = Router();
  // Every admin route requires an authenticated platform super admin.
  router.use(requireAuth(), requireSuperAdmin());
  router.get("/overview", controller.overview);
  router.get("/organizations", controller.listOrganizations);
  router.get("/providers", controller.listProviders);
  router.patch("/providers/default", controller.setDefaultProvider);
  return router;
}
