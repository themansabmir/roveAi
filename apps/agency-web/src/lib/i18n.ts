import { locales, type Locale } from "@rove/cms/constants"
import { getCanonicalSitePath } from "@/content/siteMap"

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const canonicalPath = getCanonicalSitePath(normalized)
  return `/${locale}${canonicalPath === "/" ? "" : canonicalPath}`
}
