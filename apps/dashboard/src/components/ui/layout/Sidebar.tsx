import * as React from "react"
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

export interface SidebarNavItem {
  id: string
  label: string
  href: string
  icon: typeof Home
  badge?: string | number
}

const DEFAULT_SIDEBAR_NAV: SidebarNavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "find-leads", label: "Find Leads", href: "/find-leads", icon: Search },
  { id: "prospects", label: "Prospects", href: "/prospects", icon: Users },
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
  activeId = "home",
  onNavigate,
  user = { name: "Alex Chen", organization: "Acme Growth", initials: "AC" },
  className,
  ...props
}: SidebarProps) {
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
              <div className="size-2.5 rounded bg-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">Kinetix</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-0.5 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeId

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onNavigate(item)
                  }
                }}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
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
              </a>
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
