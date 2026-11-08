import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/system-breakdown"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  SystemsThatTurnedMessyRevenueProblemsIntoWorkingInfrastructureSection,
  TheTeamHadTheDataTheSystemDidnTSection,
  The3SecondEvolutionSection,
  SystemBlueprintSection,
  EngineeredDirectlyIntoProductionSection,
  MeasurableOperationalTransformationSection,
  AutomationDidnTReplaceTheTeamItRemovedTheFrictionAroundThemSection,
  BuildProtocolSection,
  Section9Section,
  MoreSystemsWeVeEngineeredSection,
  HaveARevenueProblemWorthEngineeringSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 bg-surface flex-1">
            <div className="flex flex-col w-full">
              {" "}
              <SystemsThatTurnedMessyRevenueProblemsIntoWorkingInfrastructureSection
                locale={locale}
              />{" "}
              <TheTeamHadTheDataTheSystemDidnTSection locale={locale} />{" "}
              <The3SecondEvolutionSection locale={locale} />{" "}
              <SystemBlueprintSection locale={locale} />{" "}
              <EngineeredDirectlyIntoProductionSection locale={locale} />{" "}
              <MeasurableOperationalTransformationSection locale={locale} />{" "}
              <AutomationDidnTReplaceTheTeamItRemovedTheFrictionAroundThemSection locale={locale} />{" "}
              <BuildProtocolSection locale={locale} /> <Section9Section locale={locale} />{" "}
              <MoreSystemsWeVeEngineeredSection locale={locale} />{" "}
              <HaveARevenueProblemWorthEngineeringSection locale={locale} />{" "}
            </div>
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
