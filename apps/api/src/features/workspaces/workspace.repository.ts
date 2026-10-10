import { Prisma, PrismaClient } from "@prisma/client";
import type { OrgRole } from "@features/auth/auth.types";

export interface WorkspaceView {
  id: string;
  name: string;
  slug: string;
  role: OrgRole;
}

export class WorkspaceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findForUser(userId: string): Promise<WorkspaceView | null> {
    const membership = await this.prisma.membership.findFirst({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: "asc" },
    });
    if (!membership) return null;
    return {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
    };
  }

  async create(input: { userId: string; name: string; slug: string }): Promise<WorkspaceView> {
    const now = new Date();
    const organization = await this.prisma.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        createdAt: now,
        memberships: {
          create: {
            userId: input.userId,
            role: "owner",
            createdAt: now,
          },
        },
      },
    });
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      role: "owner",
    };
  }

  async setActiveOrganization(sessionId: string, organizationId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { activeOrganizationId: organizationId },
    });
  }

  isUniqueViolation(err: unknown): boolean {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
  }
}
