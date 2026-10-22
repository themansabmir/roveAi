import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Badge } from "@rove/ui/components/badge"
import { Skeleton } from "@rove/ui/components/skeleton"
import { Button } from "@rove/ui/components/button"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useProviders, useSetDefaultProvider } from "@/features/admin/application/useAdmin"

export function ProvidersCard() {
  const providers = useProviders()
  const setDefault = useSetDefaultProvider()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discovery provider</CardTitle>
        <CardDescription>
          The default source used for lead discovery. New runs use this automatically; users never
          choose a provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {providers.isPending ? (
          <Skeleton className="h-28 w-full" />
        ) : providers.data ? (
          <div className="space-y-2">
            {providers.data.providers.map((provider) => {
              const isDefault = provider.key === providers.data.default
              return (
                <div
                  key={provider.key}
                  className="flex items-center justify-between rounded-md border px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{provider.label}</span>
                    {provider.configured ? (
                      <Badge variant="success">Configured</Badge>
                    ) : (
                      <Badge variant="outline">No API key</Badge>
                    )}
                    {isDefault ? <Badge>Default</Badge> : null}
                  </div>
                  {!isDefault ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!provider.configured || setDefault.isPending}
                      onClick={() => setDefault.mutate(provider.key)}
                    >
                      Set as default
                    </Button>
                  ) : null}
                </div>
              )
            })}
            {setDefault.isError ? (
              <p className="text-sm text-destructive">{getErrorMessage(setDefault.error)}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Could not load providers.</p>
        )}
      </CardContent>
    </Card>
  )
}
