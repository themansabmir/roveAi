export type OrgRole = "owner" | "admin" | "member"

export interface TeamMember {
  userId: string
  name: string | null
  email: string
  role: OrgRole
  joinedAt: string
}

export interface PendingInvitation {
  id: string
  email: string
  role: OrgRole
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED"
  invitedByName: string | null
  expiresAt: string
  createdAt: string
}

export interface TeamResponse {
  members: TeamMember[]
  invitations: PendingInvitation[]
}

export interface InvitePreview {
  organizationName: string
  email: string
  role: OrgRole
}
