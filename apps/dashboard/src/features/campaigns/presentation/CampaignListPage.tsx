import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useCampaignList, useCreateCampaign } from "@/features/campaigns/application/useCampaigns"
import type { WebsiteFilter } from "@/features/campaigns/domain/campaign"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Input } from "@rove/ui/components/input"
import { Label } from "@rove/ui/components/label"

const formSchema = z.object({
  niche: z.string().trim().min(1, "Niche is required."),
  serviceType: z.string().trim().min(1, "Service type is required."),
  city: z.string().trim().min(1, "City is required."),
  region: z.string().trim().min(1, "Region is required."),
  country: z.string().trim().min(1, "Country is required."),
  maxLeads: z.number().int().min(1, "Use at least 1.").max(100, "100 is the maximum."),
  minRating: z.string().optional(),
  minReviewCount: z.string().optional(),
  websiteFilter: z.enum(["either", "owned", "missing"]),
  exclusionDomains: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CampaignListPage({ organizationId }: { organizationId: string }) {
  const campaigns = useCampaignList(organizationId)
  const create = useCreateCampaign(organizationId)
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: "",
      serviceType: "",
      city: "",
      region: "",
      country: "",
      maxLeads: 25,
      minRating: "",
      minReviewCount: "",
      websiteFilter: "either",
      exclusionDomains: "",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    const minRating = values.minRating?.trim() ? Number(values.minRating) : undefined
    const minReviewCount = values.minReviewCount?.trim() ? Number(values.minReviewCount) : undefined
    if (minRating != null && Number.isNaN(minRating)) {
      setFormError("Minimum rating must be a number.")
      return
    }
    if (minReviewCount != null && !Number.isInteger(minReviewCount)) {
      setFormError("Minimum reviews must be a whole number.")
      return
    }
    try {
      await create.mutateAsync({
        niche: values.niche,
        serviceType: values.serviceType,
        city: values.city,
        region: values.region,
        country: values.country,
        maxLeads: values.maxLeads,
        minRating,
        minReviewCount,
        websiteFilter: values.websiteFilter as WebsiteFilter,
        exclusionDomains: (values.exclusionDomains ?? "")
          .split(",")
          .map((domain: string) => domain.trim())
          .filter(Boolean),
      })
      form.reset()
      setOpen(false)
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Campaigns</h2>
        <Button type="button" size="sm" variant={open ? "outline" : "default"} onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "New campaign"}
        </Button>
      </div>

      {open ? (
        <Card>
          <CardHeader>
            <CardTitle>New campaign</CardTitle>
            <CardDescription>City, region, and country are stored separately.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
              <Field label="Niche" error={form.formState.errors.niche?.message}>
                <Input {...form.register("niche")} />
              </Field>
              <Field label="Service type" error={form.formState.errors.serviceType?.message}>
                <Input {...form.register("serviceType")} />
              </Field>
              <Field label="City" error={form.formState.errors.city?.message}>
                <Input {...form.register("city")} />
              </Field>
              <Field label="Region" error={form.formState.errors.region?.message}>
                <Input {...form.register("region")} />
              </Field>
              <Field label="Country" error={form.formState.errors.country?.message}>
                <Input {...form.register("country")} />
              </Field>
              <Field label="Max leads" error={form.formState.errors.maxLeads?.message}>
                <Input type="number" min={1} max={100} {...form.register("maxLeads", { valueAsNumber: true })} />
              </Field>
              <Field label="Minimum rating">
                <Input type="number" min={0} max={5} step="0.1" {...form.register("minRating")} />
              </Field>
              <Field label="Minimum reviews">
                <Input type="number" min={0} {...form.register("minReviewCount")} />
              </Field>
              <Field label="Websites">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                  {...form.register("websiteFilter")}
                >
                  <option value="either">Owned or missing</option>
                  <option value="owned">Owned sites only</option>
                  <option value="missing">Missing websites only</option>
                </select>
              </Field>
              <Field label="Exclusion domains">
                <Input placeholder="client.com, other.com" {...form.register("exclusionDomains")} />
              </Field>
              {formError ? <p className="text-sm text-destructive sm:col-span-2">{formError}</p> : null}
              <div className="sm:col-span-2">
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating…" : "Create campaign"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {campaigns.isPending ? <p className="text-sm text-muted-foreground">Loading campaigns…</p> : null}
      {campaigns.isError ? <p className="text-sm text-destructive">{getErrorMessage(campaigns.error)}</p> : null}
      {campaigns.data && campaigns.data.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No campaigns yet</CardTitle>
            <CardDescription>Create one to discover local businesses for this agency.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      {campaigns.data && campaigns.data.length > 0 ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Niche</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Leads</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.data.map((campaign) => (
                <tr key={campaign.id} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <Link className="font-medium hover:underline" to={`/campaigns/${campaign.id}`}>
                      {campaign.niche}
                    </Link>
                    <p className="text-xs text-muted-foreground">{campaign.serviceType}</p>
                  </td>
                  <td className="px-3 py-2">
                    {campaign.city}, {campaign.region}
                  </td>
                  <td className="px-3 py-2">{campaign.status}</td>
                  <td className="px-3 py-2">
                    {campaign.leadCount}/{campaign.maxLeads}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
