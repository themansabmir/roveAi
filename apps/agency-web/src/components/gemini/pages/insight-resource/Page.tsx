import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/insight-resource"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  IdeasForBuildingASmarterRevenueSystemSection,
  FeaturedSection,
  ExploreWhatYouReSolvingForSection,
  LatestThinkingSection,
  DonTJustReadItBuildItSection,
  ResearchWorthKeepingSection,
  SeeTheSystemsInActionSection,
  TheSignalSection,
  HaveSomethingWorthBuildingSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-background font-body-md text-on-surface antialiased`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 bg-background">
            <div className="flex flex-col w-full">
              {" "}
              <IdeasForBuildingASmarterRevenueSystemSection locale={locale} />{" "}
              <FeaturedSection locale={locale} />{" "}
              <ExploreWhatYouReSolvingForSection locale={locale} />{" "}
              <LatestThinkingSection locale={locale} />{" "}
              <DonTJustReadItBuildItSection locale={locale} />{" "}
              <ResearchWorthKeepingSection locale={locale} />{" "}
              <SeeTheSystemsInActionSection locale={locale} /> <TheSignalSection locale={locale} />{" "}
              <HaveSomethingWorthBuildingSection locale={locale} />{" "}
            </div>
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
