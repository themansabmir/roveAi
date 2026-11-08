export const geminiPages = [
  { slug: "build-system" },
  { slug: "faq" },
  { slug: "policy" },
  { slug: "what-we-build" },
  { slug: "why-us" },
] as const

export type GeminiPageSlug = (typeof geminiPages)[number]["slug"]
