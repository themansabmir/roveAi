export interface AuthUser {
  id: string
  email: string
  name: string | null
  isSuperAdmin: boolean
}

export interface AuthOrganization {
  id: string
  name: string
  slug: string
}

export interface MeResponse {
  user: AuthUser
  organization: AuthOrganization | null
  role: "owner" | "admin" | "member" | null
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput extends SignInInput {
  name: string
  agencyName: string
}
