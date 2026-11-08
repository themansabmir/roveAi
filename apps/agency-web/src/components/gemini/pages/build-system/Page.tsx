import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/build-system"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  LetSBuildTheSystemYourBusinessNeedsSection,
  WhatAreYouLookingToImproveSection,
  IntakeCardSection,
  DirectCallSection,
  ASimplePathFromProblemToBuildSection,
  Section6Section,
  HaveASystemWorthBuildingSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <>
      <div
        className={`${styles.page} ${geminiFontClasses} bg-[#f8f9fa] text-[#0b0f19] antialiased selection:bg-blue-600 selection:text-white`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20">
            <div className="flex flex-col w-full">
              {" "}
              <LetSBuildTheSystemYourBusinessNeedsSection locale={locale} />{" "}
              <WhatAreYouLookingToImproveSection locale={locale} />{" "}
              <IntakeCardSection locale={locale} /> <DirectCallSection locale={locale} />{" "}
              <ASimplePathFromProblemToBuildSection locale={locale} />{" "}
              <Section6Section locale={locale} />{" "}
              <HaveASystemWorthBuildingSection locale={locale} />{" "}
            </div>
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </>
  )
}
