import { PrismaClient } from "@prisma/client";

export interface AdminOrganizationView {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  memberCount: number;
  campaignCount: number;
}

export interface AdminOverview {
  organizations: number;
  users: number;
  superAdmins: number;
  campaigns: number;
}

export class AdminRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async overview(): Promise<AdminOverview> {
    const [organizations, users, superAdmins, campaigns] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isSuperAdmin: true } }),
      this.prisma.campaign.count(),
    ]);
    return { organizations, users, superAdmins, campaigns };
  }

  async listOrganizations(params: { take: number; skip: number }): Promise<AdminOrganizationView[]> {
    const rows = await this.prisma.organization.findMany({
      take: params.take,
      skip: params.skip,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: { select: { memberships: true, campaigns: true } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      createdAt: row.createdAt,
      memberCount: row._count.memberships,
      campaignCount: row._count.campaigns,
    }));
  }
}
