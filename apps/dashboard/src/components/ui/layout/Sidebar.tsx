import * as React from "react"
import { NavLink } from "react-router-dom"
import {
  ChevronDown,
  CreditCard,
  History,
  Home,
  Layers,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@rove/ui/lib/cn"
import { useAuth } from "@/features/auth/application/useAuth"

export interface SidebarNavItem {
  id: string
  label: string
  href: string
  icon: typeof Home
  badge?: string | number
}

const DEFAULT_SIDEBAR_NAV: SidebarNavItem[] = [
  { id: "home", label: "Dashboard", href: "/", icon: Home },
  { id: "campaigns", label: "Campaigns", href: "/", icon: Search },
  { id: "team", label: "Team", href: "/team", icon: Users },
  { id: "task-history", label: "Task History", href: "/task-history", icon: History },
  { id: "credits-usage", label: "Credits & Usage", href: "/credits-usage", icon: CreditCard },
  { id: "integrations", label: "Integrations", href: "/integrations", icon: Layers },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
]

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: SidebarNavItem[]
  activeId?: string
  onNavigate?: (item: SidebarNavItem) => void
  user?: {
    name: string
    organization?: string
    initials?: string
  }
}

export function Sidebar({
  navItems = DEFAULT_SIDEBAR_NAV,
  activeId,
  onNavigate,
  user: userProp,
  className,
  ...props
}: SidebarProps) {
  let authUser: { name: string; organization?: string; initials?: string } | undefined
  try {
    const auth = useAuth()
    if (auth?.me?.user) {
      const email = auth.me.user.email ?? ""
      const name = auth.me.user.name || email.split("@")[0] || "User"
      const org = auth.me.organization?.name ?? "Workspace"
      const initials = (auth.me.user.name ?? email).slice(0, 2).toUpperCase()
      authUser = { name, organization: org, initials }
    }
  } catch {
    // Rendered outside AuthProvider (e.g. preview)
  }

  const user = userProp || authUser || {
    name: "Rove User",
    organization: "Workspace",
    initials: "RU",
  }

  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col justify-between border-r border-border bg-card text-foreground select-none",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="size-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-xs font-bold leading-none">R</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">Rove AI</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-0.5 p-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.id}
                to={item.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate(item)
                  }
                }}
                className={({ isActive }) => {
                  const active = activeId ? activeId === item.id : isActive
                  return cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="p-2 border-t border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
              {user.initials || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col truncate leading-tight">
              <span className="text-xs font-medium text-foreground truncate">{user.name}</span>
              {user.organization && (
                <span className="text-[11px] text-muted-foreground truncate">
                  {user.organization}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
