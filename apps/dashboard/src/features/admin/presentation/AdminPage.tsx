import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@rove/ui/components/table"
import { Skeleton } from "@rove/ui/components/skeleton"
import { PageHeader } from "@/shared/ui/PageHeader"
import { useAdminOrganizations, useAdminOverview } from "@/features/admin/application/useAdmin"
import { ProvidersCard } from "@/features/admin/presentation/ProvidersCard"

export function AdminPage() {
  const overview = useAdminOverview()
  const orgs = useAdminOrganizations(1)

  return (
    <div className="space-y-8">
      <PageHeader title="Platform admin" description="Oversight across all organizations." />

      <section className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Organizations" value={overview.data?.organizations} />
        <StatCard label="Users" value={overview.data?.users} />
        <StatCard label="Super admins" value={overview.data?.superAdmins} />
        <StatCard label="Campaigns" value={overview.data?.campaigns} />
      </section>

      <ProvidersCard />

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>All agency workspaces on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {orgs.isPending ? (
            <Skeleton className="h-40 w-full" />
          ) : orgs.data && orgs.data.organizations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.data.organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="text-muted-foreground">{org.slug}</TableCell>
                    <TableCell>{org.memberCount}</TableCell>
                    <TableCell>{org.campaignCount}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
