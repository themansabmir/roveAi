import type { Locale } from "@rove/cms/constants"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { SiteHeader } from "@/components/site/SiteHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { PositioningStatement } from "@/components/home/PositioningStatement"
import { RevenueLeakAudit } from "@/components/home/RevenueLeakAudit"
import {
  AgentsSection,
  ClientMarqueeSection,
  ComparisonSection,
  ControlSection,
  EngagementSection,
  FaqSection,
  FinalCtaSection,
  FitSection,
  HeroSection,
  PathsSection,
  PricingSection,
  ProofSection,
  ToolsSection,
} from "@/components/home/HomePageSections"
import styles from "./HomePage.module.css"

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <div
      className={`${styles.home} ${geminiFontClasses} bg-[#FAFAFD] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white`}
    >
      <SiteHeader faqHref="#faq" locale={locale} />
      <main className="pt-16">
        <div className="flex flex-col w-full text-slate-900 antialiased overflow-hidden selection:bg-blue-600 selection:text-white">
          <HeroSection locale={locale} />
          <ClientMarqueeSection />
          <PositioningStatement />
          <PathsSection locale={locale} />
          <ProofSection />
          <AgentsSection />
          <ControlSection />
          <EngagementSection />
          <ToolsSection />
          <ComparisonSection />
          <PricingSection locale={locale} />
          <FitSection />
          <FaqSection />
          <RevenueLeakAudit locale={locale} />
          <FinalCtaSection locale={locale} />
        </div>
      </main>
      <HomeFooter locale={locale} />
    </div>
  )
}
