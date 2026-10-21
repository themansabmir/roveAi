import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/session";
import { requireOrgRole } from "../../middleware/rbac";
import { IEmailService } from "@plugins/email/email.plugin";
import { InvitationController } from "./invitation.controller";
import { InvitationRepository } from "./invitation.repository";
import { InvitationService } from "./invitation.service";

interface Deps {
  prisma: PrismaClient;
  email: IEmailService;
  appWebUrl: string;
}

function build(deps: Deps): InvitationController {
  return new InvitationController(
    new InvitationService(new InvitationRepository(deps.prisma), deps.email, deps.appWebUrl)
  );
}

/**
 * Org-scoped team management. Mounted at
 * /api/organizations/:organizationId/team. Only owners/admins may invite/revoke.
 */
export function teamRouter(deps: Deps): Router {
  const controller = build(deps);
  const router = Router({ mergeParams: true });
  router.use(requireAuth());
  router.get("/", requireOrgRole(["owner", "admin", "member"]), controller.listTeam);
  router.post("/invitations", requireOrgRole(["owner", "admin"]), controller.create);
  router.delete("/invitations/:invitationId", requireOrgRole(["owner", "admin"]), controller.revoke);
  return router;
}

/**
 * Public + authed invite acceptance. Mounted at /api/invitations.
 * GET /:token is public (so the accept page can render before login).
 * POST /:token/accept requires an authenticated user whose email matches.
 */
export function invitationsRouter(deps: Deps): Router {
  const controller = build(deps);
  const router = Router();
  router.get("/:token", controller.getByToken);
  router.post("/:token/accept", requireAuth(), controller.accept);
  return router;
}
