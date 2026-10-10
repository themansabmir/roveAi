import { NotFoundError } from "@core/errors";
import { OrganizationRepository } from "./organization.repository";

export class OrganizationService {
  constructor(private readonly repository: OrganizationRepository) {}

  async getById(organizationId: string) {
    const organization = await this.repository.findById(organizationId);
    if (!organization) throw new NotFoundError("Organization not found");
    return organization;
  }
}
