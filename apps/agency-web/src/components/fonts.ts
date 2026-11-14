import { Bricolage_Grotesque, Geist, Geist_Mono, Newsreader } from "next/font/google"

// Variable names are referenced by globals.css and tailwind.config.ts.
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

export const fontClasses = [
  body.variable,
  display.variable,
  newsreader.variable,
  mono.variable,
].join(" ")
