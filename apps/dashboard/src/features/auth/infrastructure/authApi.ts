import { axiosInstance } from "@/shared/api/axiosInstance"
import type { AuthOrganization, MeResponse, SignInInput } from "@/features/auth/domain/auth"

export async function signInWithEmail(input: SignInInput): Promise<void> {
  await axiosInstance.post("/api/auth/sign-in/email", input)
}

export async function signUpWithEmail(input: { name: string; email: string; password: string }): Promise<void> {
  await axiosInstance.post("/api/auth/sign-up/email", input)
}

export async function signOutRequest(): Promise<void> {
  await axiosInstance.post("/api/auth/sign-out")
}

export async function getSession(): Promise<unknown> {
  const { data } = await axiosInstance.get("/api/auth/get-session")
  return data
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await axiosInstance.get<MeResponse>("/api/me")
  return data
}

export async function createWorkspace(name: string): Promise<AuthOrganization> {
  const { data } = await axiosInstance.post<AuthOrganization>("/api/workspaces", { name })
  return data
}

export async function fetchCurrentUser(): Promise<MeResponse | null> {
  try {
    const session = await getSession()
    if (!session) return null
    return await getMe()
  } catch (err) {
    if (isUnauthorized(err)) return null
    throw err
  }
}

function isUnauthorized(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    (err as { response?: { status?: number } }).response?.status === 401
  )
}
