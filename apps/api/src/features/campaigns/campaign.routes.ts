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
import { LeadController } from "./lead.controller";
import { LeadService } from "./lead.service";

export function campaignsRouter(deps: { prisma: PrismaClient; queue: IQueueService }): Router {
  const repo = new CampaignRepository(deps.prisma);
  const campaignService = new CampaignService(repo, deps.queue);
  const campaignController = new CampaignController(campaignService);
  const leadService = new LeadService(repo);
  const leadController = new LeadController(leadService);

  const router = Router({ mergeParams: true });
  router.use(requireAuth(), requireOrgAccess());

  // Campaign routes
  router.get("/", campaignController.list);
  router.post("/", validate(createCampaignSchema), campaignController.create);
  router.get("/:campaignId", campaignController.get);
  router.post("/:campaignId/run", campaignController.run);
  router.post("/:campaignId/cancel", campaignController.cancel);

  // Prospect workspace: Leads endpoints
  router.get("/:campaignId/leads", leadController.listLeads);
  router.get("/:campaignId/leads/:leadId", leadController.getLead);
  router.get("/:campaignId/leads/:leadId/activity", leadController.getLeadActivity);
  router.patch("/:campaignId/leads/:leadId", leadController.updateLead);
  router.post("/:campaignId/leads/bulk", leadController.bulkLeads);
  router.get("/:campaignId/export", leadController.exportCsv);
  router.get("/:campaignId/leads/export.csv", leadController.exportCsv);

  return router;
}

export function tagsRouter(deps: { prisma: PrismaClient }): Router {
  const repo = new CampaignRepository(deps.prisma);
  const leadService = new LeadService(repo);
  const leadController = new LeadController(leadService);

  const router = Router({ mergeParams: true });
  router.use(requireAuth(), requireOrgAccess());

  router.get("/", leadController.listTags);
  router.post("/", leadController.createTag);
  router.delete("/:tagId", leadController.deleteTag);

  return router;
}
