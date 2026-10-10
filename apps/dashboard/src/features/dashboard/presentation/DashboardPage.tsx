import { useState } from "react"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Input } from "@rove/ui/components/input"
import { Label } from "@rove/ui/components/label"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAuth } from "@/features/auth/application/useAuth"
import { CampaignListPage } from "@/features/campaigns/presentation/CampaignListPage"

export function DashboardPage() {
  const { me, createAgency } = useAuth()
  const [agencyName, setAgencyName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!me?.organization) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Name your agency</CardTitle>
          <CardDescription>This becomes the workspace for your campaigns and proposals.</CardDescription>
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
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{me.organization.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">local business opportunity briefs for agencies</p>
      </div>
      <CampaignListPage organizationId={me.organization.id} />
    </div>
  )
}
