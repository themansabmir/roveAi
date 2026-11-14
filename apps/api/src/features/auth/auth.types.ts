export type PlatformRole = "SUPER_ADMIN" | "MEMBER" | "SUPPORT";

export type OrgRole = "owner" | "admin" | "member";

export interface MembershipSummary {
  organizationId: string;
  role: OrgRole;
}

export interface AuthPrincipal {
  userId: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  platformRole: PlatformRole | null;
  isSuperAdmin: boolean;
  sessionId: string;
  activeOrganizationId: string | null;
  memberships: MembershipSummary[];
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPrincipal;
    }
  }
}
