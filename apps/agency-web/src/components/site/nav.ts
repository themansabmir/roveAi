export const primaryNav = [
  { label: "Services", path: "/what-we-build" },
  { label: "How it works", path: "/how-it-works" },
  { label: "Work", path: "/work" },
  { label: "About", path: "/about" },
] as const

export const footerNav = [
  {
    title: "What we run",
    links: [
      { label: "Services", path: "/what-we-build" },
      { label: "How engagements work", path: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Work", path: "/work" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", path: "/blog" },
      { label: "FAQ", path: "/how-it-works#faq-section" },
      { label: "AI and data policy", path: "/policy" },
    ],
  },
] as const

export const primaryCta = { label: "Book a 30-minute review", path: "/contact" } as const
