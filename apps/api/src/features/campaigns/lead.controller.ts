import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "@core/errors";
import { LeadService } from "./lead.service";
import { bulkLeadsSchema, createTagSchema, leadsQuerySchema, updateLeadSchema } from "./lead.schemas";

export class LeadController {
  constructor(private readonly service: LeadService) {}

  // GET /campaigns/:campaignId/leads
  listLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const campaignId = requiredParam(req, "campaignId");
      const query = leadsQuerySchema.parse(req.query);
      res.json(await this.service.list(organizationId, campaignId, query));
    } catch (err) {
      next(err);
    }
  };

  // GET /campaigns/:campaignId/leads/:leadId
  getLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const campaignId = requiredParam(req, "campaignId");
      const leadId = requiredParam(req, "leadId");
      res.json(await this.service.getDetail(organizationId, campaignId, leadId));
    } catch (err) {
      next(err);
    }
  };

  // PATCH /campaigns/:campaignId/leads/:leadId
  updateLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const campaignId = requiredParam(req, "campaignId");
      const leadId = requiredParam(req, "leadId");
      const userId = req.auth?.userId ?? "";
      const input = updateLeadSchema.parse(req.body);
      res.json(await this.service.update(organizationId, campaignId, leadId, input, userId));
    } catch (err) {
      next(err);
    }
  };

  // POST /campaigns/:campaignId/leads/bulk
  bulkLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const campaignId = requiredParam(req, "campaignId");
      const userId = req.auth?.userId ?? "";
      const input = bulkLeadsSchema.parse(req.body);
      res.json(await this.service.bulk(organizationId, campaignId, input, userId));
    } catch (err) {
      next(err);
    }
  };

  // GET /campaigns/:campaignId/export.csv
  exportCsv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const campaignId = requiredParam(req, "campaignId");
      const rawLeadIds = req.query["leadIds"] as string | undefined;
      const leadIds = rawLeadIds ? rawLeadIds.split(",").filter(Boolean) : undefined;
      const csv = await this.service.exportCsv(organizationId, campaignId, leadIds);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="prospects-${campaignId}.csv"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };

  // GET /tags
  listTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      res.json(await this.service.listTags(organizationId));
    } catch (err) {
      next(err);
    }
  };

  // POST /tags
  createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const input = createTagSchema.parse(req.body);
      res.status(201).json(await this.service.createTag(organizationId, input.name));
    } catch (err) {
      next(err);
    }
  };

  // DELETE /tags/:tagId
  deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const tagId = requiredParam(req, "tagId");
      await this.service.deleteTag(organizationId, tagId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}

function requiredOrg(req: Request): string {
  if (!req.organizationId) throw new UnauthorizedError();
  return req.organizationId;
}

function requiredParam(req: Request, name: string): string {
  const raw = req.params[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) throw new BadRequestError(`${name} is required`);
  return value;
}
