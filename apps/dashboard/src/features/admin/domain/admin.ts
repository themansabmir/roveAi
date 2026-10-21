export interface AdminOverview {
  organizations: number
  users: number
  superAdmins: number
  campaigns: number
}

export interface AdminOrganization {
  id: string
  name: string
  slug: string
  createdAt: string
  memberCount: number
  campaignCount: number
}

export interface AdminOrganizationsResponse {
  page: number
  pageSize: number
  organizations: AdminOrganization[]
}

export type DiscoveryProviderKey = "OUTSCRAPER" | "SERPAPI" | "GOOGLE_PLACES" | "FIXTURE"

export interface DiscoveryProviderInfo {
  key: DiscoveryProviderKey
  label: string
  configured: boolean
}

export interface ProvidersResponse {
  default: DiscoveryProviderKey
  providers: DiscoveryProviderInfo[]
}
