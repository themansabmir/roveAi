import type { Metadata, Viewport } from "next"
import { getSiteUrl } from "@/lib/env"
import { geminiFontClasses } from "@/components/GeminiFonts"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Syntropic | Revenue operations for B2B sales teams",
    template: "%s | Syntropic",
  },
  description:
    "Syntropic builds and runs outbound, CRM and pipeline operations for B2B firms that sell through a sales team.",
  applicationName: "Syntropic",
}

export const viewport: Viewport = {
  themeColor: "#0b1324",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={geminiFontClasses} lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
