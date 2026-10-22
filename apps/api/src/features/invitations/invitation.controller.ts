import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@core/errors";
import { createInvitationSchema, invitationTokenSchema } from "./invitation.schemas";
import { InvitationService } from "./invitation.service";

export class InvitationController {
  constructor(private readonly service: InvitationService) {}

  listTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = req.organizationId!;
      const [members, invitations] = await Promise.all([
        this.service.listMembers(organizationId),
        this.service.listPending(organizationId),
      ]);
      res.json({ members, invitations });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const organizationId = req.organizationId!;
      const { email, role } = createInvitationSchema.parse(req.body);
      const invitation = await this.service.create({
        organizationId,
        email,
        role,
        invitedByUserId: req.auth.userId,
      });
      res.status(201).json({ invitation });
    } catch (err) {
      next(err);
    }
  };

  revoke = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = req.organizationId!;
      const rawId = req.params.invitationId;
      const invitationId = Array.isArray(rawId) ? rawId[0]! : rawId!;
      await this.service.revoke(organizationId, invitationId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };

  getByToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = invitationTokenSchema.parse(req.params);
      const invitation = await this.service.getByToken(token);
      res.json({
        organizationName: invitation.organizationName,
        email: invitation.email,
        role: invitation.role,
      });
    } catch (err) {
      next(err);
    }
  };

  accept = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      const { token } = invitationTokenSchema.parse(req.params);
      const result = await this.service.accept(token, {
        id: req.auth.userId,
        email: req.auth.email,
      });
      res.json({ organizationId: result.organizationId });
    } catch (err) {
      next(err);
    }
  };
}
