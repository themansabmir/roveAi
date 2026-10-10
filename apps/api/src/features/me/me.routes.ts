import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { MeController } from "./me.controller";
import { WorkspaceRepository } from "@features/workspaces/workspace.repository";

export function meRouter(deps: { prisma: PrismaClient }): Router {
  const controller = new MeController(new WorkspaceRepository(deps.prisma));
  const router = Router();
  router.get("/", requireAuth(), controller.get);
  return router;
}
