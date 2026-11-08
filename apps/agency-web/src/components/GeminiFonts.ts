import { Bricolage_Grotesque, Geist, Geist_Mono, Newsreader } from "next/font/google"

// Variable names are kept stable because every page module references them.
const body = Geist({
  subsets: ["latin"],
  variable: "--font-home-inter",
  display: "swap",
})

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-home-display",
  display: "swap",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-home-editorial",
  display: "swap",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-home-mono",
  display: "swap",
})

export const geminiFontClasses = [
  body.variable,
  display.variable,
  newsreader.variable,
  mono.variable,
].join(" ")
