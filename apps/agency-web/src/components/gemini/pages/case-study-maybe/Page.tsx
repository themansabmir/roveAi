import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/case-study-maybe"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  HowAISystemsAreChangingTheWayModernRevenueTeamsOperateSection,
  EnterpriseRevenueDoesnTNeedMoreDisconnectedToolsItNeedsAConnectedSystemSection,
  WhereAICreatesOperationalLeverageSection,
  Section4Section,
  StartWithTheWorkflowNotTheModelSection,
  KeyArchitecturalTakeawaysSection,
  HaveSomethingWorthBuildingSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <>
      <div
        className={`${styles.page} ${geminiFontClasses} bg-[#F8F9FB] font-body-md text-[#334155] antialiased`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 bg-[#F8F9FB]">
            <div className="flex flex-col w-full bg-[#F8F9FB] text-[#334155]">
              {" "}
              <HowAISystemsAreChangingTheWayModernRevenueTeamsOperateSection locale={locale} />{" "}
              <EnterpriseRevenueDoesnTNeedMoreDisconnectedToolsItNeedsAConnectedSystemSection
                locale={locale}
              />{" "}
              <WhereAICreatesOperationalLeverageSection locale={locale} />{" "}
              <Section4Section locale={locale} />{" "}
              <StartWithTheWorkflowNotTheModelSection locale={locale} />{" "}
              <KeyArchitecturalTakeawaysSection locale={locale} />{" "}
              <HaveSomethingWorthBuildingSection locale={locale} />{" "}
            </div>
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </>
  )
}
