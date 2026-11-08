import type { Locale } from "@rove/cms/constants"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { homeContent } from "@/content/home"
import { SiteHeader } from "@/components/site/SiteHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { HomeChapterNav } from "@/components/home/HomeChapterNav"
import { ThreePartsSection } from "@/components/home/ThreePartsSection"
import {
  BuildProcessSection,
  ControlSection,
  FaqSection,
  FinalCtaSection,
  HeroSection,
  PricingSection,
  PipelineUpgrade,
  ProofSection,
  WhoItsForSection,
} from "@/components/home/HomePageSections"
import styles from "./HomePage.module.css"

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <div
      className={`${styles.home} ${geminiFontClasses} bg-[#F3EEE3] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white`}
    >
      <SiteHeader locale={locale} showFaq={false} ctaLabel={homeContent.labels.bookCall} />
      <main className="pt-16">
        <div className="flex flex-col w-full text-slate-900 antialiased overflow-x-clip selection:bg-blue-600 selection:text-white">
          <HeroSection locale={locale} />
          <HomeChapterNav />
          <WhoItsForSection />
          <PipelineUpgrade />
          <ThreePartsSection />
          <BuildProcessSection />
          <ProofSection />
          <ControlSection />
          <PricingSection locale={locale} />
          <FaqSection />
          <FinalCtaSection locale={locale} />
        </div>
      </main>
      <HomeFooter locale={locale} />
    </div>
  )
}
