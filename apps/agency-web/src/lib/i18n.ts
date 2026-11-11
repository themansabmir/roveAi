import { locales, type Locale } from "@rove/cms/constants"
import { getCanonicalSitePath } from "@/content/siteMap"

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function localePath(locale: Locale, path: string): string {
  const [pathname = "/", hash] = path.split("#")
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  const canonicalPath = getCanonicalSitePath(normalized)
  const fragment = hash ? `#${hash}` : ""
  return `/${locale}${canonicalPath === "/" ? "" : canonicalPath}${fragment}`
}
