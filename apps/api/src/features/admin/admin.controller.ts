import { NextFunction, Request, Response } from "express";
import { listOrganizationsQuerySchema } from "./admin.schemas";
import { AdminRepository } from "./admin.repository";

export class AdminController {
  constructor(private readonly repository: AdminRepository) {}

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
}
