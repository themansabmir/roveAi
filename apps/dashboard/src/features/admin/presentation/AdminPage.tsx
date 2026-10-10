import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { useAdminOrganizations, useAdminOverview } from "@/features/admin/application/useAdmin"

export function AdminPage() {
  const overview = useAdminOverview()
  const orgs = useAdminOrganizations(1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform admin</h1>
        <p className="text-sm text-muted-foreground">Oversight across all organizations.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Organizations" value={overview.data?.organizations} />
        <StatCard label="Users" value={overview.data?.users} />
        <StatCard label="Super admins" value={overview.data?.superAdmins} />
        <StatCard label="Campaigns" value={overview.data?.campaigns} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>All agency workspaces on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {orgs.isPending ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : orgs.data && orgs.data.organizations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Slug</th>
                    <th className="py-2 pr-4 font-medium">Members</th>
                    <th className="py-2 pr-4 font-medium">Campaigns</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.data.organizations.map((org) => (
                    <tr key={org.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{org.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{org.slug}</td>
                      <td className="py-2 pr-4">{org.memberCount}</td>
                      <td className="py-2 pr-4">{org.campaignCount}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No organizations yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value ?? "—"}</CardTitle>
      </CardHeader>
    </Card>
  )
}
