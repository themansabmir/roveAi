import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rove — Automated opportunity engine for local businesses",
  description:
    "Rove turns business prospects into researched, sales-ready opportunity briefs with evidence-based audits and AI reasoning.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
