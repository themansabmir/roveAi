import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptInvitation,
  createInvitation,
  fetchInvitePreview,
  fetchTeam,
  revokeInvitation,
} from "@/features/team/infrastructure/teamApi"

export function useTeam(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["team", organizationId],
    queryFn: () => fetchTeam(organizationId!),
    enabled: Boolean(organizationId),
  })
}

export function useCreateInvitation(organizationId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { email: string; role: "admin" | "member" }) =>
      createInvitation(organizationId!, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["team", organizationId] })
    },
  })
}

export function useRevokeInvitation(organizationId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invitationId: string) => revokeInvitation(organizationId!, invitationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["team", organizationId] })
    },
  })
}

export function useInvitePreview(token: string) {
  return useQuery({
    queryKey: ["invite", token],
    queryFn: () => fetchInvitePreview(token),
    retry: false,
  })
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (token: string) => acceptInvitation(token),
  })
}
