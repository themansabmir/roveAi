import { locales, type Locale } from "@rove/cms/constants"

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `/${locale}${normalized === "/" ? "" : normalized}`
}
