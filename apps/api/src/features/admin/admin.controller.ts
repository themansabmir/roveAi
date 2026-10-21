import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "@core/errors";
import { IMapsService } from "@plugins/maps/maps.plugin";
import { listOrganizationsQuerySchema, setDefaultProviderSchema } from "./admin.schemas";
import { AdminRepository } from "./admin.repository";

export class AdminController {
  constructor(
    private readonly repository: AdminRepository,
    private readonly maps: IMapsService
  ) {}

  overview = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const overview = await this.repository.overview();
      res.json(overview);
    } catch (err) {
      next(err);
    }
  };

  listOrganizations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = listOrganizationsQuerySchema.parse(req.query);
      const organizations = await this.repository.listOrganizations({
        take: pageSize,
        skip: (page - 1) * pageSize,
      });
      res.json({ page, pageSize, organizations });
    } catch (err) {
      next(err);
    }
  };

  listProviders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const providers = this.maps.listProviders();
      const current = await this.maps.getDefaultProvider();
      res.json({ default: current, providers });
    } catch (err) {
      next(err);
    }
  };

  setDefaultProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth?.userId;
      if (!userId) throw new UnauthorizedError();

      const { provider } = setDefaultProviderSchema.parse(req.body);
      const configured = this.maps.listProviders().find((p) => p.key === provider);
      if (!configured?.configured) {
        throw new BadRequestError(`Provider ${provider} is not configured (missing API key)`);
      }

      const current = await this.maps.setDefaultProvider(provider, userId);
      res.json({ default: current, providers: this.maps.listProviders() });
    } catch (err) {
      next(err);
    }
  };
}
