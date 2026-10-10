import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DashboardLayout } from "@/layout/DashboardLayout"
import { DashboardPage } from "@/features/dashboard/presentation/DashboardPage"
import { CampaignDetailPage } from "@/features/campaigns/presentation/CampaignDetailPage"
import { GuestRoute, ProtectedRoute } from "@/features/auth/presentation/ProtectedRoute"
import { LoginPage } from "@/features/auth/presentation/LoginPage"

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
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
