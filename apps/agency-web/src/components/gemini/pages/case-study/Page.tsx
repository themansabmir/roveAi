import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/case-study"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  FromFragmentedWorkflowsToARevenueSystemSection,
  TheFrictionWasnTInOnePlaceItWasEverywhereSection,
  FromFrictionToDeterministicFlowSection,
  SystemFlowSection,
  LookingUnderTheHoodLayeredRevenueArchitectureSection,
  WhatChangedAfterTheBuildSection,
  MoreSystemsWeVeEngineeredSection,
  HaveAProblemWorthEngineeringSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-[#F8F9FA] text-[#0B0F19] font-['Inter'] antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 flex-1">
            {" "}
            <FromFragmentedWorkflowsToARevenueSystemSection locale={locale} />{" "}
            <TheFrictionWasnTInOnePlaceItWasEverywhereSection locale={locale} />{" "}
            <FromFrictionToDeterministicFlowSection locale={locale} />{" "}
            <SystemFlowSection locale={locale} />{" "}
            <LookingUnderTheHoodLayeredRevenueArchitectureSection locale={locale} />{" "}
            <WhatChangedAfterTheBuildSection locale={locale} />{" "}
            <MoreSystemsWeVeEngineeredSection locale={locale} />{" "}
            <HaveAProblemWorthEngineeringSection locale={locale} />{" "}
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
