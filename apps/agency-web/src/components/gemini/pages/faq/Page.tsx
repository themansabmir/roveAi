import type { Locale } from "@rove/cms/constants"
import { pageContent } from "@/content/gemini/faq"
import { GeminiInteractionLayer } from "@/components/gemini/GeminiInteractionLayer"
import { geminiFontClasses } from "@/components/GeminiFonts"
import { localePath } from "@/lib/i18n"
import styles from "./Page.module.css"
import { SiteHeader as Header } from "@/components/site/SiteHeader"
import { SiteFooter as Footer } from "@/components/site/SiteFooter"
import {
  BeforeWeBuildLetSMakeSureItWorksSection,
  GoodSystemsStartWithClearAnswersSection,
  Cat01Section,
  Cat02Section,
  Cat03Section,
  Cat04Section,
  OurOperatingModelSection,
  Section8Section,
  RealWorldSecuritySection,
  HowAnEngagementMovesSection,
  StillFiguringItOutSection,
  ConversationSection,
} from "./Sections"

export function Page({ locale }: { locale: Locale }) {
  return (
    <div className="dark">
      <div
        className={`${styles.page} ${geminiFontClasses} bg-brand-navy font-body-md text-slate-800 antialiased selection:bg-blue-500/20 selection:text-blue-900`}
      >
        <GeminiInteractionLayer className={styles.interactionLayer}>
          <Header locale={locale} />
          <main className="w-full pt-20 bg-[#F8F9FA] min-h-screen text-[#0F172A]">
            {" "}
            <BeforeWeBuildLetSMakeSureItWorksSection locale={locale} />{" "}
            <nav className="sticky top-20 z-40 w-full bg-[#F8F9FA]/95 backdrop-blur-md border-b border-[#E2E8F0] py-3.5 px-6 lg:px-12">
              {" "}
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {" "}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  {" "}
                  <a
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-label-mono-sm font-semibold tracking-wide bg-[#3B82F6] text-white shadow-xs whitespace-nowrap transition-all"
                    href="#cat-01"
                  >
                    {" "}
                    <span className="opacity-80">{pageContent.text[17]}</span>{" "}
                    {pageContent.text[18]}{" "}
                  </a>{" "}
                  <a
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-label-mono-sm font-medium tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 whitespace-nowrap transition-all"
                    href="#cat-02"
                  >
                    {" "}
                    <span className="text-slate-400">{pageContent.text[19]}</span>{" "}
                    {pageContent.text[20]}{" "}
                  </a>{" "}
                  <a
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-label-mono-sm font-medium tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 whitespace-nowrap transition-all"
                    href="#cat-03"
                  >
                    {" "}
                    <span className="text-slate-400">{pageContent.text[21]}</span>{" "}
                    {pageContent.text[22]}{" "}
                  </a>{" "}
                  <a
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-label-mono-sm font-medium tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 whitespace-nowrap transition-all"
                    href="#cat-04"
                  >
                    {" "}
                    <span className="text-slate-400">{pageContent.text[23]}</span>{" "}
                    {pageContent.text[24]}{" "}
                  </a>{" "}
                  <a
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-label-mono-sm font-medium tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 whitespace-nowrap transition-all"
                    href="#real-world-security"
                  >
                    {" "}
                    <span className="text-slate-400">{pageContent.text[25]}</span>{" "}
                    {pageContent.text[26]}{" "}
                  </a>{" "}
                </div>{" "}
                <div className="hidden md:flex items-center gap-2 text-slate-400 font-label-mono-sm text-[11px] shrink-0">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                  <span>{pageContent.text[27]}</span>{" "}
                </div>{" "}
              </div>{" "}
            </nav>{" "}
            <GoodSystemsStartWithClearAnswersSection locale={locale} />{" "}
            <div className="w-full py-16 md:py-24 px-6 lg:px-12 bg-[#F8F9FA]" id="faq-section">
              {" "}
              <div className="max-w-7xl mx-auto flex flex-col gap-14">
                {" "}
                <Cat01Section locale={locale} /> <Cat02Section locale={locale} />{" "}
                <Cat03Section locale={locale} /> <Cat04Section locale={locale} />{" "}
              </div>{" "}
            </div>{" "}
            <OurOperatingModelSection locale={locale} /> <Section8Section locale={locale} />{" "}
            <RealWorldSecuritySection locale={locale} />{" "}
            <HowAnEngagementMovesSection locale={locale} />{" "}
            <StillFiguringItOutSection locale={locale} />{" "}
            <ConversationSection locale={locale} />{" "}
          </main>
          <Footer locale={locale} />
        </GeminiInteractionLayer>
      </div>
    </div>
  )
}
