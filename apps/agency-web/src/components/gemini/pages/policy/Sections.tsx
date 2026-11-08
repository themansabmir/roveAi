import { deliveryStandards, pageContent } from "@/content/gemini/policy"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function TheDetailsMatterTooSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-gutter-lg items-center">
      {" "}
      <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
        {" "}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-sm">
          {" "}
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>{" "}
          <span className="font-label-mono-sm text-label-mono-sm tracking-widest text-[#475569] uppercase font-semibold">
            {pageContent.text[10]}
          </span>{" "}
        </div>{" "}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] font-bold text-[#0B0F19] tracking-tight">
          {" "}
          {pageContent.text[11]}{" "}
          <span className="italic font-editorial-italic font-normal text-[#2563EB]">
            {pageContent.text[12]}
          </span>{" "}
        </h1>{" "}
        <p className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-xl font-normal">
          {" "}
          {pageContent.text[13]}{" "}
        </p>{" "}
        <div className="pt-space-xs flex items-center gap-2 text-xs md:text-sm text-[#64748B] font-label-mono-sm">
          {" "}
          <span>{pageContent.text[14]}</span>{" "}
          <span className="text-[#CBD5E1]">{pageContent.text[15]}</span>{" "}
          <span>{pageContent.text[16]}</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="lg:col-span-5 w-full">
        {" "}
        <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)]">
          {" "}
          <img
            alt="Reflective crystalline prism organizing chaotic light into structured data streams"
            className="w-full h-auto object-cover rounded-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD65_2E1RhrVxYQEqw1pio0ZkaSOzbWbcAlU87yD7AZM_9v_X_Y0aCEEkQSIxTVugKwqpHdYSufu7qDxGjUSYeFhf3xIgQr_6ZS8bGLmw_JQKWr2s3SOHrO1Q1LDRbYkTKlk8Zv1MGoLIcpWrWvRCfXILE_4k-6mT43yEJB2iFAYggLWASPY65ZoBAHQkovpXZzoUh2hhqTr9E8NSzt8f1M2IUIL_XdF1EKzVcvUHI"
          />{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section2Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full flex flex-col gap-3">
      {" "}
      <a
        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-200"
        data-path="privacy-policy"
        href={localePath(locale, "/policy")}
      >
        {" "}
        <div className="flex items-baseline sm:items-center gap-5">
          {" "}
          <span className="font-label-mono-md text-sm font-semibold text-[#64748B] group-hover:text-[#2563EB] transition-colors">
            {pageContent.text[17]}
          </span>{" "}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            {" "}
            <span className="text-lg font-bold text-[#0B0F19] tracking-tight group-hover:text-[#2563EB] transition-colors">
              {pageContent.text[18]}
            </span>{" "}
            <span className="text-sm text-[#475569]">{pageContent.text[19]}</span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-4 sm:mt-0 flex items-center justify-end">
          {" "}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all">
            {" "}
            <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
          </span>{" "}
        </div>{" "}
      </a>{" "}
      <a
        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-200"
        data-path="terms-of-service"
        href={localePath(locale, "/policy")}
      >
        {" "}
        <div className="flex items-baseline sm:items-center gap-5">
          {" "}
          <span className="font-label-mono-md text-sm font-semibold text-[#64748B] group-hover:text-[#2563EB] transition-colors">
            {pageContent.text[20]}
          </span>{" "}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            {" "}
            <span className="text-lg font-bold text-[#0B0F19] tracking-tight group-hover:text-[#2563EB] transition-colors">
              {pageContent.text[21]}
            </span>{" "}
            <span className="text-sm text-[#475569]">{pageContent.text[22]}</span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-4 sm:mt-0 flex items-center justify-end">
          {" "}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all">
            {" "}
            <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
          </span>{" "}
        </div>{" "}
      </a>{" "}
      <a
        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-200"
        data-path="cookie-policy"
        href={localePath(locale, "/policy")}
      >
        {" "}
        <div className="flex items-baseline sm:items-center gap-5">
          {" "}
          <span className="font-label-mono-md text-sm font-semibold text-[#64748B] group-hover:text-[#2563EB] transition-colors">
            {pageContent.text[23]}
          </span>{" "}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            {" "}
            <span className="text-lg font-bold text-[#0B0F19] tracking-tight group-hover:text-[#2563EB] transition-colors">
              {pageContent.text[24]}
            </span>{" "}
            <span className="text-sm text-[#475569]">{pageContent.text[25]}</span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-4 sm:mt-0 flex items-center justify-end">
          {" "}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-all">
            {" "}
            <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
          </span>{" "}
        </div>{" "}
      </a>{" "}
    </section>
  )
}

export function Section3Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full flex flex-col items-center">
      {" "}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6 shadow-sm overflow-hidden flex flex-col items-center">
        {" "}
        <img
          alt="Minimal geometric visual representing structured flow from Data through Protection into Trust"
          className="w-full h-auto object-contain max-h-[460px] rounded-lg"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvuA1o_mzM6Jxwt9qyfmCtgDGGJACNXtXwIuNFmIXdTt-_4c9s7ITztkeyplyyDZ9bvSbepVvy9Nn0A61fQRpNWkKNV5WpyhWWaAWt1u2sQIg_JVt2P5HsnHz5iT1mdvlc0KgQeqe8FXky4pQ0hI07gtEJYFxfsfDqB0LUaBAz7AxONFYIb3STmtK3Vas1Gz1Hc3cATSWgDEHno8gTveMVUBLAJqnAo7W1oPfnifk"
        />{" "}
        <div className="w-full pt-6 pb-2 flex items-center justify-center gap-4 md:gap-8 font-label-mono-sm text-xs md:text-sm tracking-[0.2em] font-semibold text-[#475569]">
          {" "}
          <span className="text-[#0B0F19]">{pageContent.text[26]}</span>{" "}
          <span className="text-[#2563EB]">{pageContent.text[27]}</span>{" "}
          <span className="text-[#0B0F19]">{pageContent.text[28]}</span>{" "}
          <span className="text-[#2563EB]">{pageContent.text[29]}</span>{" "}
          <span className="text-[#0B0F19]">{pageContent.text[30]}</span>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveAQuestionAboutYourDataSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 md:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      {" "}
      <div className="flex flex-col items-start gap-2 max-w-lg">
        {" "}
        <span className="font-label-mono-sm text-xs tracking-widest text-[#64748B] uppercase font-semibold">
          {pageContent.text[31]}
        </span>{" "}
        <h2 className="text-xl md:text-2xl font-bold text-[#0B0F19] tracking-tight">
          {pageContent.text[32]}
        </h2>{" "}
        <p className="text-sm md:text-base text-[#475569] leading-relaxed">
          {" "}
          {pageContent.text[33]}{" "}
        </p>{" "}
      </div>{" "}
      <div className="flex flex-col sm:items-end items-start gap-3">
        {" "}
        <a
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] text-white font-medium text-sm hover:bg-[#1D4ED8] transition-colors shadow-sm"
          href="mailto:legal@syntropic.ai"
        >
          {" "}
          <GeminiIcon name="mail" className="text-[18px]" />{" "}
          <span>{pageContent.text[34]}</span>{" "}
        </a>{" "}
        <div className="flex items-center gap-2 font-label-mono-sm text-xs text-[#64748B]">
          {" "}
          <a className="hover:text-[#2563EB] transition-colors" href="mailto:legal@syntropic.ai">
            {pageContent.text[35]}
          </a>{" "}
          <span className="text-[#CBD5E1]">{pageContent.text[36]}</span>{" "}
          <a className="hover:text-[#2563EB] transition-colors" href="mailto:dpo@syntropic.ai">
            {pageContent.text[37]}
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function DeliveryStandardsSection() {
  const groups = [
    { heading: deliveryStandards.scopeHeading, items: deliveryStandards.scope },
    { heading: deliveryStandards.approvalHeading, items: deliveryStandards.approvalDetails },
    { heading: deliveryStandards.sendingHeading, items: deliveryStandards.sending },
    { heading: deliveryStandards.monitoringHeading, items: deliveryStandards.monitoring },
    {
      heading: deliveryStandards.clientHeading,
      items: deliveryStandards.clientResponsibilities,
    },
  ]

  return (
    <section className="w-full flex flex-col gap-6">
      <div className="max-w-3xl">
        <span className="font-label-mono-sm text-xs font-semibold tracking-widest text-[#2563EB] uppercase">
          {deliveryStandards.eyebrow}
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0B0F19]">
          {deliveryStandards.heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#475569]">
          {deliveryStandards.introduction}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map(({ heading, items }) => (
          <section
            className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
            key={heading}
          >
            <h3 className="text-lg font-bold tracking-tight text-[#0B0F19]">{heading}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569]">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {heading === deliveryStandards.approvalHeading && (
              <p className="mt-4 border-t border-[#E2E8F0] pt-4 text-sm font-medium leading-relaxed text-[#0B0F19]">
                {deliveryStandards.approval}
              </p>
            )}
          </section>
        ))}
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold tracking-tight text-[#0B0F19]">
            {deliveryStandards.aiDataHeading}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#475569]">{deliveryStandards.aiData}</p>
        </section>
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold tracking-tight text-[#0B0F19]">
            {deliveryStandards.handoverHeading}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#475569]">
            {deliveryStandards.handover}
          </p>
        </section>
      </div>
    </section>
  )
}
