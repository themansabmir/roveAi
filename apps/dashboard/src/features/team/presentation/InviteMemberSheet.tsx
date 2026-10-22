import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@rove/ui/components/button"
import { Input } from "@rove/ui/components/input"
import { Label } from "@rove/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@rove/ui/components/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@rove/ui/components/sheet"
import { getErrorMessage } from "@/features/auth/domain/auth-error"
import { useCreateInvitation } from "@/features/team/application/useTeam"

type Role = "admin" | "member"

export function InviteMemberSheet({
  open,
  onOpenChange,
  organizationId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string | undefined
}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("member")
  const createInvite = useCreateInvitation(organizationId)

  const reset = () => {
    setEmail("")
    setRole("member")
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createInvite.mutate(
      { email, role },
      {
        onSuccess: () => {
          toast.success(`Invitation sent to ${email}`)
          reset()
          onOpenChange(false)
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite a team member</SheetTitle>
          <SheetDescription>
            They'll get an email with a link to join this workspace.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teammate@agency.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={createInvite.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createInvite.isPending || !organizationId}>
              {createInvite.isPending ? "Sending…" : "Send invite"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
