import { useState } from "react"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Input } from "@rove/ui/components/input"
import { Label } from "@rove/ui/components/label"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAuth } from "@/features/auth/application/useAuth"
import { PageHeader } from "@/shared/ui/PageHeader"
import { RunListPage } from "@/features/campaigns/presentation/RunListPage"

export function DashboardPage() {
  const { me, createAgency } = useAuth()
  const [agencyName, setAgencyName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isPlatformStaff = Boolean(me?.user.isSuperAdmin || me?.user.platformRole)

  if (!me?.organization) {
    if (isPlatformStaff) {
      return (
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Platform Staff Console</CardTitle>
            <CardDescription>
              You are logged in as internal platform staff ({me?.user.platformRole ?? "SUPER_ADMIN"}). You oversee all organizations without belonging to any tenant agency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have global authority across the platform. You can inspect discovery providers, system settings, and customer organizations.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <a href="/admin">Go to Platform Admin</a>
              </Button>
            </div>
            <div className="border-t pt-4 text-xs text-muted-foreground">
              Want to run personal test campaigns? You can optionally create an agency workspace below:
            </div>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault()
                setSaving(true)
                setError(null)
                void createAgency(agencyName)
                  .catch((err: unknown) => setError(getErrorMessage(err)))
                  .finally(() => setSaving(false))
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="agency-name">Test agency name</Label>
                <Input
                  id="agency-name"
                  placeholder="e.g. Rove Internal Test"
                  value={agencyName}
                  onChange={(event) => setAgencyName(event.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" variant="outline" disabled={saving || agencyName.trim().length === 0}>
                {saving ? "Creating…" : "Create Test Workspace"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Name your agency</CardTitle>
          <CardDescription>This becomes the workspace for your research runs and briefs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              setSaving(true)
              setError(null)
              void createAgency(agencyName)
                .catch((err: unknown) => setError(getErrorMessage(err)))
                .finally(() => setSaving(false))
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="agency-name">Agency name</Label>
              <Input
                id="agency-name"
                value={agencyName}
                onChange={(event) => setAgencyName(event.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={saving || agencyName.trim().length === 0}>
              {saving ? "Saving…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={me.organization.name}
        description="Research local-business prospects, audit their web presence, and hand off the best opportunities."
      />
      <RunListPage organizationId={me.organization.id} />
    </div>
  )
}
