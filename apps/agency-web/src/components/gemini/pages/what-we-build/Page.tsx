import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/what-we-build"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  SystemsBuiltAroundHowYourBusinessActuallyGrowsSection,
  WhatWeBuildSection,
  ConnectedSystemSection,
  TurnSignalsIntoPipelineSection,
  AiComparisonSection,
  ProductsSection,
  FromBottleneckToProductionIn14DaysSection,
  SovereigntySection,
  Section9Section,
  ContactSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <>
      <div
        className={`${styles.page} ${geminiFontClasses} bg-[#FAFAFD] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="pt-16">
            {" "}
            <SystemsBuiltAroundHowYourBusinessActuallyGrowsSection locale={locale} />{" "}
            <WhatWeBuildSection locale={locale} /> <ConnectedSystemSection locale={locale} />{" "}
            <TurnSignalsIntoPipelineSection locale={locale} />{" "}
            <AiComparisonSection locale={locale} /> <ProductsSection locale={locale} />{" "}
            <FromBottleneckToProductionIn14DaysSection locale={locale} />{" "}
            <SovereigntySection locale={locale} /> <Section9Section locale={locale} />{" "}
            <ContactSection locale={locale} />{" "}
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </>
  )
}
