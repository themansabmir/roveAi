import { GeminiIcon } from "@/components/gemini/GeminiIcon"
import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/policy"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  TheDetailsMatterTooSection,
  Section2Section,
  Section3Section,
  HaveAQuestionAboutYourDataSection,
  DeliveryStandardsSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-16 flex-1 bg-surface">
            <div className="flex flex-col w-full bg-[#F8F9FB] text-[#0B0F19]">
              {" "}
              <div className="w-full max-w-[1180px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl md:py-space-2xl flex flex-col gap-space-2xl md:gap-space-3xl">
                {" "}
                <TheDetailsMatterTooSection locale={locale} /> <Section2Section locale={locale} />{" "}
                <Section3Section locale={locale} />{" "}
                <HaveAQuestionAboutYourDataSection locale={locale} /> <DeliveryStandardsSection />{" "}
                <div className="w-full flex items-center justify-start pt-2">
                  {" "}
                  <a
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0B0F19] transition-colors"
                    data-path="what-we-build"
                    href={localePath(locale, "/what-we-build")}
                  >
                    {" "}
                    <GeminiIcon name="arrow_back" className="text-[16px]" />{" "}
                    <span>{pageContent.text[38]}</span>{" "}
                  </a>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
