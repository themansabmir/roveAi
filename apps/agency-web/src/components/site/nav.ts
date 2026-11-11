import { services } from "@/content/revops"

export const primaryNav = [
  { label: "Services", path: "/services" },
  { label: "How it works", path: "/how-it-works" },
  { label: "Case studies", path: "/case-studies" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
] as const

export const footerNav = [
  {
    title: "Services",
    links: services.items.map((item) => ({ label: item.name, path: `/services/${item.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "How it works", path: "/how-it-works" },
      { label: "About", path: "/about" },
      { label: "Case studies", path: "/case-studies" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", path: "/blog" },
      { label: "FAQ", path: "/how-it-works#faq" },
      { label: "AI and data policy", path: "/policy" },
    ],
  },
]

export const primaryCta = { label: "Book a 30-minute review", path: "/contact" } as const
