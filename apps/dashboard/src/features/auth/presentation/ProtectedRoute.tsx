import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/application/useAuth"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <StatusScreen label="Loading…" />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <StatusScreen label="Loading…" />
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export function SuperAdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, me } = useAuth()
  const location = useLocation()

  if (isLoading) return <StatusScreen label="Loading…" />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!me?.user.isSuperAdmin) return <Navigate to="/" replace />
  return children
}

function StatusScreen({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted text-sm text-muted-foreground">
      {label}
    </div>
  )
}
