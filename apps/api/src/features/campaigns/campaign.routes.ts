import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireOrgAccess } from "../../middleware/rbac";
import { requireAuth } from "../../middleware/session";
import { validate } from "../../middleware/validate";
import { IQueueService } from "@plugins/queue/queue.types";
import { CampaignController } from "./campaign.controller";
import { CampaignRepository } from "./campaign.repository";
import { createCampaignSchema } from "./campaign.schemas";
import { CampaignService } from "./campaign.service";

export function campaignsRouter(deps: { prisma: PrismaClient; queue: IQueueService }): Router {
  const controller = new CampaignController(new CampaignService(new CampaignRepository(deps.prisma), deps.queue));
  const router = Router({ mergeParams: true });
  router.use(requireAuth(), requireOrgAccess());
  router.get("/", controller.list);
  router.post("/", validate(createCampaignSchema), controller.create);
  router.get("/:campaignId", controller.get);
  router.post("/:campaignId/run", controller.run);
  router.post("/:campaignId/cancel", controller.cancel);
  return router;
}
