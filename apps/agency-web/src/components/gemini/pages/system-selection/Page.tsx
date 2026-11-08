import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/system-selection"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  LetSBuildTheSystemYourBusinessNeedsNextSection,
  WhatAreYouLookingToImproveSection,
  IntakeFormSection,
  DirectScheduleSection,
  ASimplePathFromProblemToBuildSection,
  Section6Section,
  HaveASystemWorthBuildingSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary selection:text-on-primary`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 flex-1 bg-background">
            <div className="flex flex-col w-full text-on-surface">
              {" "}
              <LetSBuildTheSystemYourBusinessNeedsNextSection locale={locale} />{" "}
              <WhatAreYouLookingToImproveSection locale={locale} />{" "}
              <IntakeFormSection locale={locale} /> <DirectScheduleSection locale={locale} />{" "}
              <ASimplePathFromProblemToBuildSection locale={locale} />{" "}
              <Section6Section locale={locale} />{" "}
              <HaveASystemWorthBuildingSection locale={locale} />{" "}
            </div>{" "}
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
