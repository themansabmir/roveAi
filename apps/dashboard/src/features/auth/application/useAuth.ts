import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { queryClient } from "@/shared/api/queryClient"
import type { SignInInput, SignUpInput } from "@/features/auth/domain/auth"
import {
  createWorkspace,
  fetchCurrentUser,
  signInWithEmail,
  signOutRequest,
  signUpWithEmail,
} from "@/features/auth/infrastructure/authApi"

const SESSION_QUERY_KEY = ["session"] as const
const SESSION_POLL_INTERVAL_MS = 5 * 60 * 1000
const RETRY_BASE_DELAY_MS = 2000

export function useAuth() {
  const session = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: 2,
    retryDelay: (attempt) => RETRY_BASE_DELAY_MS * 2 ** attempt,
    refetchInterval: SESSION_POLL_INTERVAL_MS,
    placeholderData: (previous) => previous,
  })

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
    return queryClient.fetchQuery({ queryKey: SESSION_QUERY_KEY, queryFn: fetchCurrentUser })
  }, [])

  const signIn = useCallback(
    async (input: SignInInput) => {
      await signInWithEmail(input)
      const me = await refresh()
      if (!me) throw new Error("Signed in, but no session was created.")
    },
    [refresh],
  )

  const signUp = useCallback(
    async (input: SignUpInput) => {
      await signUpWithEmail({ name: input.name, email: input.email, password: input.password })
      await createWorkspace(input.agencyName)
      const me = await refresh()
      if (!me) throw new Error("Account created, but no session was created.")
    },
    [refresh],
  )

  const createAgency = useCallback(
    async (name: string) => {
      await createWorkspace(name)
      await refresh()
    },
    [refresh],
  )

  const signOut = useCallback(async () => {
    try {
      await signOutRequest()
    } finally {
      queryClient.setQueryData(SESSION_QUERY_KEY, null)
    }
  }, [])

  return {
    me: session.data ?? null,
    isAuthenticated: session.data != null,
    isLoading: session.isPending,
    signIn,
    signUp,
    createAgency,
    signOut,
  }
}
