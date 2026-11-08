import { Inter, JetBrains_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-home-inter",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-home-display",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
  variable: "--font-home-editorial",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-home-mono",
})

export const geminiFontClasses = [
  inter.variable,
  plusJakartaSans.variable,
  newsreader.variable,
  jetBrainsMono.variable,
].join(" ")
