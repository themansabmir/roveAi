import { randomBytes } from "node:crypto";
import { MembershipRole } from "@prisma/client";
import { BadRequestError, ConflictError, NotFoundError } from "@core/errors";
import { logger } from "@core/logger";
import { IEmailService } from "@plugins/email/email.plugin";
import {
  InvitationRepository,
  InvitationTokenView,
  InvitationView,
  MemberView,
} from "./invitation.repository";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface CreateInvitationCommand {
  organizationId: string;
  email: string;
  role: Exclude<MembershipRole, "owner">;
  invitedByUserId: string;
}

export class InvitationService {
  constructor(
    private readonly repository: InvitationRepository,
    private readonly email: IEmailService,
    private readonly appWebUrl: string
  ) {}

  listMembers(organizationId: string): Promise<MemberView[]> {
    return this.repository.listMembers(organizationId);
  }

  listPending(organizationId: string): Promise<InvitationView[]> {
    return this.repository.listPending(organizationId);
  }

  async create(command: CreateInvitationCommand): Promise<InvitationView> {
    const existingMember = await this.repository.membershipByEmail(command.organizationId, command.email);
    if (existingMember) {
      throw new ConflictError("That person is already a member of this workspace");
    }

    const existingInvite = await this.repository.findLivePending(command.organizationId, command.email);
    if (existingInvite) {
      throw new ConflictError("An invite is already pending for that email");
    }

    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    const invitation = await this.repository.create({
      organizationId: command.organizationId,
      email: command.email,
      role: command.role,
      token,
      invitedByUserId: command.invitedByUserId,
      expiresAt,
    });

    await this.sendInviteEmail(command.email, token, invitation.invitedByName);
    return invitation;
  }

  async revoke(organizationId: string, invitationId: string): Promise<void> {
    const revoked = await this.repository.revoke(organizationId, invitationId);
    if (!revoked) {
      throw new NotFoundError("Invitation not found or already handled");
    }
  }

  async getByToken(token: string): Promise<InvitationTokenView> {
    const invitation = await this.repository.findByToken(token);
    if (!invitation || invitation.status !== "PENDING") {
      throw new NotFoundError("This invite is no longer valid");
    }
    if (invitation.expiresAt.getTime() < Date.now()) {
      throw new NotFoundError("This invite has expired");
    }
    return invitation;
  }

  async accept(token: string, user: { id: string; email: string }): Promise<{ organizationId: string }> {
    const invitation = await this.repository.findByToken(token);
    if (!invitation || invitation.status !== "PENDING") {
      throw new NotFoundError("This invite is no longer valid");
    }
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new BadRequestError("This invite was sent to a different email address");
    }

    const result = await this.repository.accept({ token, userId: user.id });
    if (!result) {
      throw new NotFoundError("This invite is no longer valid");
    }
    return { organizationId: result.organizationId };
  }

  private async sendInviteEmail(email: string, token: string, invitedByName: string | null): Promise<void> {
    const link = `${this.appWebUrl.replace(/\/$/, "")}/invite/${token}`;
    const inviter = invitedByName ? `${invitedByName} invited you` : "You've been invited";
    try {
      await this.email.send({
        to: email,
        subject: "You've been invited to Rove",
        html: inviteHtml(inviter, link),
        text: `${inviter} to join a workspace on Rove.\n\nAccept your invite: ${link}\n\nThis link expires in 7 days.`,
      });
    } catch (err) {
      // The invite row is already persisted; delivery failure should not 500 the
      // request. Log and surface the link via logs for recovery.
      logger.error({ err, email }, "Failed to send invitation email");
    }
  }
}

function inviteHtml(inviter: string, link: string): string {
  return `
  <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="margin: 0 0 8px; font-size: 18px;">${inviter} to Rove</h2>
    <p style="margin: 0 0 20px; color: #52525b; font-size: 14px;">
      Join the workspace to collaborate on prospect research and opportunity briefs.
    </p>
    <a href="${link}"
       style="display: inline-block; background: #18181b; color: #fff; text-decoration: none;
              padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500;">
      Accept invite
    </a>
    <p style="margin: 20px 0 0; color: #a1a1aa; font-size: 12px;">
      This invite expires in 7 days. If you weren't expecting it, you can ignore this email.
    </p>
  </div>`;
}
