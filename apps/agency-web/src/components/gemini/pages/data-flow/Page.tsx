import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/data-flow"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  TheRightSystemDependsOnWhatYourBusinessNeedsNextSection,
  BottlenecksSection,
  YouDonTNeedMoreToolsYouNeedTheMachineBehindThemSection,
  PipelineSection,
  MarketingSection,
  RevopsSection,
  AiSection,
  ApproachSection,
  DifferentTeamsOneConnectedSystemSection,
  BeforeVsAfterSection,
  ContactSection,
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
            {" "}
            <TheRightSystemDependsOnWhatYourBusinessNeedsNextSection locale={locale} />{" "}
            <BottlenecksSection locale={locale} />{" "}
            <YouDonTNeedMoreToolsYouNeedTheMachineBehindThemSection locale={locale} />{" "}
            <PipelineSection locale={locale} /> <MarketingSection locale={locale} />{" "}
            <RevopsSection locale={locale} /> <AiSection locale={locale} />{" "}
            <ApproachSection locale={locale} />{" "}
            <DifferentTeamsOneConnectedSystemSection locale={locale} />{" "}
            <BeforeVsAfterSection locale={locale} /> <ContactSection locale={locale} />{" "}
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </>
  )
}
