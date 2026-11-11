import type { Metadata, Viewport } from "next"
import { getSiteUrl } from "@/lib/env"
import { fontClasses } from "@/components/fonts"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ElqoraLabs | Revenue operations for B2B sales teams",
    template: "%s | ElqoraLabs",
  },
  description:
    "ElqoraLabs builds outbound, CRM and pipeline systems for B2B firms that sell through a sales team.",
  applicationName: "ElqoraLabs",
}

export const viewport: Viewport = {
  themeColor: "#0b1324",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={fontClasses} lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
