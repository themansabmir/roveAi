import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@core/errors";
import { OrganizationService } from "./organization.service";

export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.organizationId) {
        next(new UnauthorizedError());
        return;
      }
      const organization = await this.service.getById(req.organizationId);
      res.json(organization);
    } catch (err) {
      next(err);
    }
  };
}
