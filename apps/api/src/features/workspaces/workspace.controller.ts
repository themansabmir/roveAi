import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@core/errors";
import { CreateWorkspaceInput } from "./workspace.schemas";
import { WorkspaceService } from "./workspace.service";

export class WorkspaceController {
  constructor(private readonly service: WorkspaceService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        next(new UnauthorizedError());
        return;
      }
      const body = req.body as CreateWorkspaceInput;
      const workspace = await this.service.provision(req.auth.userId, req.auth.sessionId, body.name);
      res.status(200).json(workspace);
    } catch (err) {
      next(err);
    }
  };
}
