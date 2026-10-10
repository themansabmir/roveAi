import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DashboardLayout } from "@/layout/DashboardLayout"
import { DashboardPage } from "@/features/dashboard/presentation/DashboardPage"
import { CampaignDetailPage } from "@/features/campaigns/presentation/CampaignDetailPage"
import { GuestRoute, ProtectedRoute, SuperAdminRoute } from "@/features/auth/presentation/ProtectedRoute"
import { LoginPage } from "@/features/auth/presentation/LoginPage"
import { AdminPage } from "@/features/admin/presentation/AdminPage"

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "campaigns/:campaignId", element: <CampaignDetailPage /> },
      {
        path: "admin",
        element: (
          <SuperAdminRoute>
            <AdminPage />
          </SuperAdminRoute>
        ),
      },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
