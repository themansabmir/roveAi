import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@rove/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@rove/ui/components/card"
import { Badge } from "@rove/ui/components/badge"
import { Skeleton } from "@rove/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@rove/ui/components/table"
import { PageHeader } from "@/shared/ui/PageHeader"
import { useAuth } from "@/features/auth/application/useAuth"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useRevokeInvitation, useTeam } from "@/features/team/application/useTeam"
import { InviteMemberSheet } from "@/features/team/presentation/InviteMemberSheet"

export function TeamPage() {
  const { me } = useAuth()
  const organizationId = me?.organization?.id
  const canManage = me?.role === "owner" || me?.role === "admin" || me?.user.isSuperAdmin
  const team = useTeam(organizationId)
  const revoke = useRevokeInvitation(organizationId)
  const [inviteOpen, setInviteOpen] = useState(false)

  const handleRevoke = (invitationId: string) => {
    revoke.mutate(invitationId, {
      onSuccess: () => toast.success("Invitation revoked"),
      onError: (err) => toast.error(getErrorMessage(err)),
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Manage who has access to this workspace."
        actions={
          canManage ? <Button onClick={() => setInviteOpen(true)}>Invite member</Button> : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>People with access to this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          {team.isPending ? (
            <Skeleton className="h-32 w-full" />
          ) : team.data && team.data.members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.data.members.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">{member.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending invitations</CardTitle>
          <CardDescription>Invites that haven't been accepted yet.</CardDescription>
        </CardHeader>
        <CardContent>
          {team.isPending ? (
            <Skeleton className="h-20 w-full" />
          ) : team.data && team.data.invitations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited by</TableHead>
                  <TableHead>Expires</TableHead>
                  {canManage ? <TableHead className="text-right">Actions</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.data.invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invite.role}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invite.invitedByName ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </TableCell>
                    {canManage ? (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={revoke.isPending}
                          onClick={() => handleRevoke(invite.id)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No pending invitations.</p>
          )}
        </CardContent>
      </Card>

      {canManage ? (
        <InviteMemberSheet
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          organizationId={organizationId}
        />
      ) : null}
    </div>
  )
}
