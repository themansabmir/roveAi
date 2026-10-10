import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { validate } from "../../middleware/validate";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceRepository } from "./workspace.repository";
import { createWorkspaceSchema } from "./workspace.schemas";
import { WorkspaceService } from "./workspace.service";

export function workspaceRouter(deps: { prisma: PrismaClient }): Router {
  const service = new WorkspaceService(new WorkspaceRepository(deps.prisma));
  const controller = new WorkspaceController(service);
  const router = Router();
  router.post("/", requireAuth(), validate(createWorkspaceSchema), controller.create);
  return router;
}
