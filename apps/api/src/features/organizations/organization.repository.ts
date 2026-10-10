import { PrismaClient } from "@prisma/client";

export class OrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });
  }
}
