import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@core/errors";
import { WorkspaceRepository } from "@features/workspaces/workspace.repository";

export class MeController {
  constructor(private readonly workspaces: WorkspaceRepository) {}

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        next(new UnauthorizedError());
        return;
      }

      const membership =
        req.auth.memberships.find((item) => item.organizationId === req.auth?.activeOrganizationId) ??
        req.auth.memberships[0];
      const workspace = membership ? await this.workspaces.findForUser(req.auth.userId) : null;
      const organization = workspace
        ? { id: workspace.id, name: workspace.name, slug: workspace.slug }
        : null;

      res.json({
        user: {
          id: req.auth.userId,
          email: req.auth.email,
          name: req.auth.name,
          platformRole: req.auth.platformRole,
          isSuperAdmin: req.auth.isSuperAdmin,
        },
        organization,
        role: workspace?.role ?? null,
      });
    } catch (err) {
      next(err);
    }
  };
}
