import { axiosInstance } from "@/shared/api/axiosInstance"
import type { InvitePreview, TeamResponse } from "@/features/team/domain/team"

export async function fetchTeam(organizationId: string): Promise<TeamResponse> {
  const { data } = await axiosInstance.get<TeamResponse>(
    `/api/organizations/${organizationId}/team`,
  )
  return data
}

export async function createInvitation(
  organizationId: string,
  input: { email: string; role: "admin" | "member" },
): Promise<void> {
  await axiosInstance.post(`/api/organizations/${organizationId}/team/invitations`, input)
}

export async function revokeInvitation(
  organizationId: string,
  invitationId: string,
): Promise<void> {
  await axiosInstance.delete(
    `/api/organizations/${organizationId}/team/invitations/${invitationId}`,
  )
}

export async function fetchInvitePreview(token: string): Promise<InvitePreview> {
  const { data } = await axiosInstance.get<InvitePreview>(`/api/invitations/${token}`)
  return data
}

export async function acceptInvitation(token: string): Promise<{ organizationId: string }> {
  const { data } = await axiosInstance.post<{ organizationId: string }>(
    `/api/invitations/${token}/accept`,
  )
  return data
}
