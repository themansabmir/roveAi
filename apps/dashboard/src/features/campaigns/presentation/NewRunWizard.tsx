import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@rove/ui/components/button"
import { Input } from "@rove/ui/components/input"
import { Label } from "@rove/ui/components/label"
import { Badge } from "@rove/ui/components/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@rove/ui/components/sheet"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useCreateCampaign } from "@/features/campaigns/application/useCampaigns"
import type { WebsiteFilter } from "@/features/campaigns/domain/campaign"

const schema = z.object({
  niche: z.string().trim().min(1, "Tell us who you're targeting."),
  serviceType: z.string().trim().min(1, "What do you sell them?"),
  city: z.string().trim().min(1, "City is required."),
  region: z.string().trim().min(1, "Region is required."),
  country: z.string().trim().min(1, "Country is required."),
  maxLeads: z.number().int().min(1, "At least 1.").max(100, "100 max."),
  minRating: z.string().optional(),
  minReviewCount: z.string().optional(),
  websiteFilter: z.enum(["either", "owned", "missing"]),
  exclusionDomains: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const WEBSITE_OPTIONS: { value: WebsiteFilter; label: string; hint: string }[] = [
  { value: "either", label: "Either", hint: "Owned or missing" },
  { value: "owned", label: "Owned site", hint: "Has their own website" },
  { value: "missing", label: "No site", hint: "Missing a website" },
]

export function NewRunWizard({
  organizationId,
  open,
  onOpenChange,
}: {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const create = useCreateCampaign(organizationId)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      niche: "",
      serviceType: "",
      city: "",
      region: "",
      country: "",
      maxLeads: 50,
      minRating: "",
      minReviewCount: "",
      websiteFilter: "either",
      exclusionDomains: "",
    },
  })

  const maxLeads = form.watch("maxLeads") || 0
  const estimate = useMemo(() => {
    const pages = Math.round(maxLeads * 1.8)
    const briefs = Math.round(maxLeads * 0.5)
    return { businesses: maxLeads, pages, briefs }
  }, [maxLeads])

  const websiteFilter = form.watch("websiteFilter")

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
      const campaign = await create.mutateAsync({
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
          .map((domain) => domain.trim())
          .filter(Boolean),
      })
      form.reset()
      onOpenChange(false)
      navigate(`/campaigns/${campaign.id}`)
    } catch (err) {
      setFormError(getErrorMessage(err))
    }
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New research run</SheetTitle>
          <SheetDescription>
            Tell Rove who to research. We discover prospects, audit their web presence, and surface
            the best opportunities — one decision per step.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
          <Field label="Who are you targeting?" hint="niche" error={form.formState.errors.niche?.message}>
            <Input placeholder="Dentists" {...form.register("niche")} />
          </Field>
          <Field
            label="What service do you sell them?"
            hint="serviceType"
            error={form.formState.errors.serviceType?.message}
          >
            <Input placeholder="Website + local SEO" {...form.register("serviceType")} />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="City" error={form.formState.errors.city?.message}>
              <Input placeholder="Austin" {...form.register("city")} />
            </Field>
            <Field label="Region" error={form.formState.errors.region?.message}>
              <Input placeholder="Texas" {...form.register("region")} />
            </Field>
            <Field label="Country" error={form.formState.errors.country?.message}>
              <Input placeholder="USA" {...form.register("country")} />
            </Field>
          </div>

          <Field label="Max leads" error={form.formState.errors.maxLeads?.message}>
            <Input
              type="number"
              min={1}
              max={100}
              {...form.register("maxLeads", { valueAsNumber: true })}
            />
          </Field>

          <div className="space-y-2">
            <Label>Website filter</Label>
            <div className="flex flex-wrap gap-2">
              {WEBSITE_OPTIONS.map((option) => {
                const active = websiteFilter === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => form.setValue("websiteFilter", option.value)}
                    className={pillClass(active)}
                    title={option.hint}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Run estimate</p>
              <Badge variant="outline">before commit</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Estimate value={`~${estimate.businesses}`} label="businesses" />
              <Estimate value={`~${estimate.pages}`} label="pages crawled" />
              <Estimate value={`~${estimate.briefs}`} label="AI briefs" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Approximate, shown against your monthly ceilings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((value) => !value)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {showAdvanced ? "Hide advanced filters" : "Advanced filters"}
          </button>

          {showAdvanced ? (
            <div className="space-y-4 border-l pl-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min rating">
                  <Input type="number" min={0} max={5} step="0.1" {...form.register("minRating")} />
                </Field>
                <Field label="Min reviews">
                  <Input type="number" min={0} {...form.register("minReviewCount")} />
                </Field>
              </div>
              <Field label="Exclusion domains" hint="existing clients">
                <Input placeholder="client.com, other.com" {...form.register("exclusionDomains")} />
              </Field>
            </div>
          ) : null}

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || create.isPending}>
              {create.isPending ? "Creating…" : "Review & run"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {hint ? <span className="text-xs text-muted-foreground/70">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

function Estimate({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function pillClass(active: boolean): string {
  return [
    "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-input bg-background text-muted-foreground hover:text-foreground",
  ].join(" ")
}
