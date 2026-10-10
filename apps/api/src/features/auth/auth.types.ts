export interface MembershipSummary {
  organizationId: string;
  role: "owner" | "member";
}

export interface AuthPrincipal {
  userId: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
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
