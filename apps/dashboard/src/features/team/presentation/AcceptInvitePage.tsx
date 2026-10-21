import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Skeleton } from "@rove/ui/components/skeleton"
import { useAuth } from "@/features/auth/application/useAuth"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useAcceptInvitation, useInvitePreview } from "@/features/team/application/useTeam"

const PENDING_INVITE_KEY = "rove-pending-invite"

export function AcceptInvitePage() {
  const { token = "" } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, me, refresh } = useAuth()
  const preview = useInvitePreview(token)
  const accept = useAcceptInvitation()

  // Preserve the invite target across a login round-trip.
  useEffect(() => {
    if (token) sessionStorage.setItem(PENDING_INVITE_KEY, token)
  }, [token])

  const emailMismatch =
    isAuthenticated && preview.data && me?.user.email
      ? preview.data.email.toLowerCase() !== me.user.email.toLowerCase()
      : false

  const handleAccept = () => {
    accept.mutate(token, {
      onSuccess: async () => {
        sessionStorage.removeItem(PENDING_INVITE_KEY)
        await refresh()
        toast.success("You've joined the workspace")
        navigate("/", { replace: true })
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Workspace invitation</CardTitle>
          <CardDescription>
            {preview.data
              ? `You've been invited to join ${preview.data.organizationName}.`
              : "Join a Rove workspace."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preview.isPending || isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : preview.isError ? (
            <>
              <p className="text-sm text-destructive">{getErrorMessage(preview.error)}</p>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/">Go to dashboard</Link>
              </Button>
            </>
          ) : !isAuthenticated ? (
            <>
              <p className="text-sm text-muted-foreground">
                Sign in or create an account with <strong>{preview.data?.email}</strong> to accept
                this invite.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Sign in to continue</Link>
              </Button>
            </>
          ) : emailMismatch ? (
            <p className="text-sm text-destructive">
              This invite was sent to {preview.data?.email}, but you're signed in as{" "}
              {me?.user.email}. Sign in with the invited email to accept.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                You'll join as a <strong>{preview.data?.role}</strong>.
              </p>
              <Button className="w-full" disabled={accept.isPending} onClick={handleAccept}>
                {accept.isPending ? "Joining…" : "Accept invitation"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
