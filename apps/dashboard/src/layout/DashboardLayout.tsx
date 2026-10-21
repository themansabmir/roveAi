import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { ChevronDown, LayoutDashboard, LogOut, Shield, Users } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@rove/ui/components/avatar"
import { ThemeToggle } from "@/shared/ui/ThemeToggle"

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  superAdmin?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/team", label: "Team", icon: Users },
  { to: "/admin", label: "Platform admin", icon: Shield, superAdmin: true },
]

export function DashboardLayout() {
  const { me, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const agencyName = me?.organization?.name ?? "Workspace"
  const email = me?.user.email ?? ""
  const initials = (me?.user.name ?? email).slice(0, 2).toUpperCase()

  const items = NAV_ITEMS.filter((item) => !item.superAdmin || me?.user.isSuperAdmin)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">R</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Rove</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="px-3 py-3 text-xs text-muted-foreground">
          <p className="truncate font-medium text-foreground">{agencyName}</p>
          <p className="truncate">{email}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm font-medium text-muted-foreground">{agencyName}</span>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-2" aria-label="Account menu">
                  <Avatar className="size-7">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                    {me?.user.name ?? email}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate font-normal">
                  <span className="block font-medium text-foreground">{me?.user.name ?? "Account"}</span>
                  <span className="block truncate text-muted-foreground">{email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  disabled={signingOut}
                  onSelect={() => {
                    setSigningOut(true)
                    void signOut()
                  }}
                >
                  <LogOut className="size-4" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-6 py-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
  )
}
