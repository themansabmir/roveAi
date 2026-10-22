export const locales = ["en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"

export const roveDatasets = {
  production: "production-rove",
  development: "development-rove",
} as const

export const agencyDatasets = {
  production: "production-agency",
  development: "development-agency",
} as const

/** URL segments that must not be used as CMS page slugs (Rove marketing). */
export const ROVE_RESERVED_SEGMENTS = [
  "blog",
  "solutions",
  "api",
  "studio",
  "_next",
] as const

/** URL segments reserved on the agency marketing site. */
export const AGENCY_RESERVED_SEGMENTS = [
  "blog",
  "services",
  "work",
  "api",
  "studio",
  "_next",
] as const
