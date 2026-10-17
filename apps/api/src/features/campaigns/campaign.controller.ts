import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "@core/errors";
import { CreateCampaignInput } from "./campaign.schemas";
import { CampaignService } from "./campaign.service";

export class CampaignController {
  constructor(private readonly service: CampaignService) { }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      res.json(await this.service.list(organizationId));
    } catch (err) {
      next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      res.json(await this.service.get(organizationId, requiredParam(req, "campaignId")));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      const campaign = await this.service.create(organizationId, req.body as CreateCampaignInput);
      res.status(201).json(campaign);
      // console.log("cAMPIGN CREATE OUTPUT", campaign);
    } catch (err) {
      next(err);
    }
  };

  run = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      res.json(await this.service.run(organizationId, requiredParam(req, "campaignId")));
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = requiredOrg(req);
      res.json(await this.service.cancel(organizationId, requiredParam(req, "campaignId")));
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
