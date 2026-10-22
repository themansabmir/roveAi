import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DashboardLayout } from "@/layout/DashboardLayout"
import { DashboardPage } from "@/features/dashboard/presentation/DashboardPage"
import { CampaignDetailPage } from "@/features/campaigns/presentation/CampaignDetailPage"
import { GuestRoute, ProtectedRoute, SuperAdminRoute } from "@/features/auth/presentation/ProtectedRoute"
import { LoginPage } from "@/features/auth/presentation/LoginPage"
import { AdminPage } from "@/features/admin/presentation/AdminPage"
import { TeamPage } from "@/features/team/presentation/TeamPage"
import { AcceptInvitePage } from "@/features/team/presentation/AcceptInvitePage"

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
    path: "/invite/:token",
    element: <AcceptInvitePage />,
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
      { path: "team", element: <TeamPage /> },
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
