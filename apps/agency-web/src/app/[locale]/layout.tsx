import { notFound } from "next/navigation"
import { isValidLocale } from "@/lib/i18n"
import { locales } from "@rove/cms/constants"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  return children
}
