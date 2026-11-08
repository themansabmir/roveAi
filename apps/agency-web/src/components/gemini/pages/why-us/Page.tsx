import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/why-us"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  AIShouldChangeHowYourBusinessWorksNotJustWhatYourSoftwareCanDoSection,
  MostBusinessesDonTNeedAnotherToolTheyNeedTheirSystemsToWorkTogetherSection,
  HowWeThinkAboutRevenueArchitectureSection,
  TechnologyFollowsTheBusinessNotTheOtherWayAroundSection,
  AutomationHandlesTheRepeatablePeopleHandleWhatMattersSection,
  FromFrictionToProductionIn14DaysSection,
  EngineeredNotPromptedSection,
  BuiltWithYourTeamOwnedByYourBusinessSection,
  SmallTeamDeepSystemsThinkingSection,
  Section10Section,
  HaveASystemWorthBuildingSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 flex-1">
            {" "}
            <div className="flex flex-col w-full">
              {" "}
              <div className="w-full bg-[#F8F9FA] text-[#0B0F19]">
                {" "}
                <AIShouldChangeHowYourBusinessWorksNotJustWhatYourSoftwareCanDoSection
                  locale={locale}
                />{" "}
                <MostBusinessesDonTNeedAnotherToolTheyNeedTheirSystemsToWorkTogetherSection
                  locale={locale}
                />{" "}
                <HowWeThinkAboutRevenueArchitectureSection locale={locale} />{" "}
                <TechnologyFollowsTheBusinessNotTheOtherWayAroundSection locale={locale} />{" "}
                <AutomationHandlesTheRepeatablePeopleHandleWhatMattersSection locale={locale} />{" "}
                <FromFrictionToProductionIn14DaysSection locale={locale} />{" "}
              </div>{" "}
              <EngineeredNotPromptedSection locale={locale} />{" "}
              <div className="w-full bg-[#F8F9FA] text-[#0B0F19]">
                {" "}
                <BuiltWithYourTeamOwnedByYourBusinessSection locale={locale} />{" "}
                <SmallTeamDeepSystemsThinkingSection locale={locale} />{" "}
                <Section10Section locale={locale} />{" "}
              </div>{" "}
              <HaveASystemWorthBuildingSection locale={locale} />{" "}
            </div>{" "}
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
