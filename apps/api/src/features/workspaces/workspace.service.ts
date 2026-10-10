import { randomBytes } from "crypto";
import { WorkspaceRepository, WorkspaceView } from "./workspace.repository";

export function agencySlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const stem = base.length > 0 ? base : "agency";
  return `${stem}-${randomBytes(3).toString("hex")}`;
}

export class WorkspaceService {
  constructor(private readonly repository: WorkspaceRepository) {}

  async provision(userId: string, sessionId: string, name: string): Promise<WorkspaceView> {
    const existing = await this.repository.findForUser(userId);
    if (existing) {
      await this.repository.setActiveOrganization(sessionId, existing.id);
      return existing;
    }

    let created: WorkspaceView | null = null;
    for (let attempt = 0; attempt < 3 && !created; attempt += 1) {
      try {
        created = await this.repository.create({
          userId,
          name,
          slug: agencySlug(name),
        });
      } catch (err) {
        if (!this.repository.isUniqueViolation(err) || attempt === 2) throw err;
      }
    }
    if (!created) {
      throw new Error("Could not create workspace");
    }

    await this.repository.setActiveOrganization(sessionId, created.id);
    return created;
  }
}
