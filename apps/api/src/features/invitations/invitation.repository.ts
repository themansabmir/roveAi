import { InvitationStatus, MembershipRole, Prisma, PrismaClient } from "@prisma/client";

export interface InvitationView {
  id: string;
  email: string;
  role: MembershipRole;
  status: InvitationStatus;
  invitedByName: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface MemberView {
  userId: string;
  name: string | null;
  email: string;
  role: MembershipRole;
  joinedAt: Date;
}

export interface InvitationTokenView {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  role: MembershipRole;
  status: InvitationStatus;
  expiresAt: Date;
}

export class InvitationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listMembers(organizationId: string): Promise<MemberView[]> {
    const rows = await this.prisma.membership.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => ({
      userId: row.userId,
      name: row.user.name,
      email: row.user.email,
      role: row.role,
      joinedAt: row.createdAt,
    }));
  }

  async listPending(organizationId: string): Promise<InvitationView[]> {
    const rows = await this.prisma.invitation.findMany({
      where: { organizationId, status: "PENDING" },
      include: { invitedBy: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role,
      status: row.status,
      invitedByName: row.invitedBy.name,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    }));
  }

  async findLivePending(organizationId: string, email: string) {
    return this.prisma.invitation.findFirst({
      where: { organizationId, email, status: "PENDING" },
    });
  }

  async membershipByEmail(organizationId: string, email: string) {
    return this.prisma.membership.findFirst({
      where: { organizationId, user: { email } },
    });
  }

  async create(input: {
    organizationId: string;
    email: string;
    role: MembershipRole;
    token: string;
    invitedByUserId: string;
    expiresAt: Date;
  }): Promise<InvitationView> {
    const row = await this.prisma.invitation.create({
      data: {
        organizationId: input.organizationId,
        email: input.email,
        role: input.role,
        token: input.token,
        invitedByUserId: input.invitedByUserId,
        expiresAt: input.expiresAt,
      },
      include: { invitedBy: true },
    });
    return {
      id: row.id,
      email: row.email,
      role: row.role,
      status: row.status,
      invitedByName: row.invitedBy.name,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    };
  }

  async revoke(organizationId: string, invitationId: string): Promise<boolean> {
    const result = await this.prisma.invitation.updateMany({
      where: { id: invitationId, organizationId, status: "PENDING" },
      data: { status: "REVOKED" },
    });
    return result.count > 0;
  }

  async findByToken(token: string): Promise<InvitationTokenView | null> {
    const row = await this.prisma.invitation.findUnique({
      where: { token },
      include: { organization: true },
    });
    if (!row) return null;
    return {
      id: row.id,
      organizationId: row.organizationId,
      organizationName: row.organization.name,
      email: row.email,
      role: row.role,
      status: row.status,
      expiresAt: row.expiresAt,
    };
  }

  /**
   * Accepts the invite: marks it ACCEPTED and upserts the membership in one
   * transaction. Returns false if the invite is no longer PENDING.
   */
  async accept(input: {
    token: string;
    userId: string;
  }): Promise<{ organizationId: string; role: MembershipRole } | null> {
    return this.prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({ where: { token: input.token } });
      if (!invitation || invitation.status !== "PENDING") return null;
      if (invitation.expiresAt.getTime() < Date.now()) {
        await tx.invitation.update({ where: { id: invitation.id }, data: { status: "EXPIRED" } });
        return null;
      }

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", acceptedByUserId: input.userId, acceptedAt: new Date() },
      });

      await tx.membership.upsert({
        where: { userId_organizationId: { userId: input.userId, organizationId: invitation.organizationId } },
        update: {},
        create: {
          userId: input.userId,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      });

      return { organizationId: invitation.organizationId, role: invitation.role };
    });
  }

  isUniqueViolation(err: unknown): boolean {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
  }
}
