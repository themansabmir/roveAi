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
