import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { LayoutDashboard, LogOut } from "lucide-react"
import { useAuth } from "@/features/auth/application/useAuth"
import { cn } from "@rove/ui/lib/cn"
import { Button } from "@rove/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@rove/ui/components/dropdown-menu"
import { Separator } from "@rove/ui/components/separator"

export function DashboardLayout() {
  const { me, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const agencyName = me?.organization?.name ?? "Workspace"

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-card">
        <div className="px-4 py-4">
          <p className="text-sm font-semibold">LocalBrief</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{agencyName}</p>
        </div>
        <Separator />
        <nav className="flex-1 px-3 py-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                isActive ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/60",
              )
            }
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Dashboard
          </NavLink>
        </nav>
        <div className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start truncate" size="sm">
                {me?.user.email ?? "Account"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel className="truncate">{agencyName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={signingOut}
                onSelect={() => {
                  setSigningOut(true)
                  void signOut()
                }}
              >
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
