import { pageContent } from "@/content/gemini/faq"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function BeforeWeBuildLetSMakeSureItWorksSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full pt-16 md:pt-24 pb-16 px-6 lg:px-12 border-b border-[#E2E8F0] bg-[#F8F9FA]">
      {" "}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {" "}
        <div className="lg:col-span-7 flex flex-col items-start">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-xs mb-6">
            {" "}
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>{" "}
            <span className="font-label-mono-sm text-[11px] font-semibold tracking-wider uppercase text-slate-700">
              {pageContent.text[10]}
            </span>{" "}
          </div>{" "}
          <h1 className="font-display-xl text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#0F172A] tracking-tight leading-[1.08] mb-6">
            {" "}
            {pageContent.text[11]}{" "}
            <span className="font-serif italic font-normal text-[#3B82F6]">
              {pageContent.text[12]}
            </span>{" "}
          </h1>{" "}
          <p className="font-body-lg text-[18px] md:text-[20px] text-slate-600 leading-relaxed max-w-xl mb-8">
            {" "}
            {pageContent.text[13]}{" "}
          </p>{" "}
          <div className="flex flex-wrap items-center gap-5">
            {" "}
            <a
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#3B82F6] text-white font-label-ui text-[14px] font-semibold shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:bg-blue-600 hover:-translate-y-0.5 transition-all"
              href="#faq-section"
            >
              {" "}
              <span>{pageContent.text[14]}</span>{" "}
              <GeminiIcon name="arrow_downward" className="text-[18px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center gap-1.5 font-label-ui text-[14px] font-semibold text-slate-700 hover:text-[#3B82F6] transition-colors py-2"
              href="#conversation"
            >
              {" "}
              <span>{pageContent.text[15]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-5 flex flex-col items-start">
          {" "}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white p-2">
            {" "}
            <img
              alt="Decision pathways converging into deterministic operational clarity"
              className="w-full h-auto rounded-xl object-cover"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WDl_maOaGBzNiS26v0HqlXyTzQM0IiTj1dEQ4ayNPC4vVRry314BCjx7mmaV31AbQ7N8JShfoiX9couw3uU7UJXLlY0KRTm3pn-MBbmTWvf_ourAUUlwZQ-b3eK4272_0Y1L1OpOQja5NPDISWoNKMJtnyOk7f8ii-_vXuH3H2g0E1gh4wTwTVj8mpHcF5slQgb4lKSUuYz_h5I9gzJX93FDu4cNQAdGrJstgflhH8ciHf6m4PGlJ9QYg"
            />{" "}
          </div>{" "}
          <p className="mt-3 font-label-mono-sm text-[11px] text-slate-500 tracking-tight">
            {" "}
            {pageContent.text[16]}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function GoodSystemsStartWithClearAnswersSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 bg-white border-b border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {" "}
        <span className="font-label-mono-sm text-[11px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-2">
          {pageContent.text[28]}
        </span>{" "}
        <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          {pageContent.text[29]}
        </h2>{" "}
        <p className="font-body-md text-slate-600 max-w-xl mb-12 text-[15px]">
          {" "}
          {pageContent.text[30]}{" "}
        </p>{" "}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col items-center text-center relative group hover:border-blue-300 transition-all">
            {" "}
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-200/60 flex items-center justify-center font-label-mono-sm font-bold text-[13px] mb-3">
              {" "}
              {pageContent.text[31]}{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[12px] font-bold text-[#0F172A] tracking-wider uppercase mb-1">
              {pageContent.text[32]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500 leading-snug">
              {pageContent.text[33]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col items-center text-center relative group hover:border-blue-300 transition-all">
            {" "}
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-200/60 flex items-center justify-center font-label-mono-sm font-bold text-[13px] mb-3">
              {" "}
              {pageContent.text[34]}{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[12px] font-bold text-[#0F172A] tracking-wider uppercase mb-1">
              {pageContent.text[35]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500 leading-snug">
              {pageContent.text[36]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col items-center text-center relative group hover:border-blue-300 transition-all">
            {" "}
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-200/60 flex items-center justify-center font-label-mono-sm font-bold text-[13px] mb-3">
              {" "}
              {pageContent.text[37]}{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[12px] font-bold text-[#0F172A] tracking-wider uppercase mb-1">
              {pageContent.text[38]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500 leading-snug">
              {pageContent.text[39]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col items-center text-center relative group">
            {" "}
            <div className="w-10 h-10 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-label-mono-sm font-bold text-[13px] mb-3 shadow-xs">
              {" "}
              {pageContent.text[40]}{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[12px] font-bold text-[#3B82F6] tracking-wider uppercase mb-1">
              {pageContent.text[41]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-600 leading-snug">
              {pageContent.text[42]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Cat01Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-2" id="cat-01">
      {" "}
      <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-36 self-start">
        {" "}
        <span className="font-label-mono-sm text-[12px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-1">
          {pageContent.text[43]}
        </span>{" "}
        <h2 className="font-headline-md text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
          {pageContent.text[44]}
        </h2>{" "}
        <p className="font-body-sm text-slate-600 leading-relaxed"> {pageContent.text[45]} </p>{" "}
      </div>{" "}
      <div className="lg:col-span-8 border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        {" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[46]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[47]}{" "}
          </div>{" "}
        </div>{" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[48]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[49]}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Cat02Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-8 border-t border-[#E2E8F0]"
      id="cat-02"
    >
      {" "}
      <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-36 self-start">
        {" "}
        <span className="font-label-mono-sm text-[12px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-1">
          {pageContent.text[50]}
        </span>{" "}
        <h2 className="font-headline-md text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
          {pageContent.text[51]}
        </h2>{" "}
        <p className="font-body-sm text-slate-600 leading-relaxed"> {pageContent.text[52]} </p>{" "}
      </div>{" "}
      <div className="lg:col-span-8 border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        {" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[53]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[54]}{" "}
          </div>{" "}
        </div>{" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[55]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[56]}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Cat03Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-8 border-t border-[#E2E8F0]"
      id="cat-03"
    >
      {" "}
      <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-36 self-start">
        {" "}
        <span className="font-label-mono-sm text-[12px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-1">
          {pageContent.text[57]}
        </span>{" "}
        <h2 className="font-headline-md text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
          {pageContent.text[58]}
        </h2>{" "}
        <p className="font-body-sm text-slate-600 leading-relaxed"> {pageContent.text[59]} </p>{" "}
      </div>{" "}
      <div className="lg:col-span-8 border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        {" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[60]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[61]}{" "}
          </div>{" "}
        </div>{" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[62]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[63]}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Cat04Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-8 border-t border-[#E2E8F0]"
      id="cat-04"
    >
      {" "}
      <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-36 self-start">
        {" "}
        <span className="font-label-mono-sm text-[12px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-1">
          {pageContent.text[64]}
        </span>{" "}
        <h2 className="font-headline-md text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
          {pageContent.text[65]}
        </h2>{" "}
        <p className="font-body-sm text-slate-600 leading-relaxed"> {pageContent.text[66]} </p>{" "}
      </div>{" "}
      <div className="lg:col-span-8 border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        {" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[67]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[68]}{" "}
          </div>{" "}
        </div>{" "}
        <div className="py-5 group">
          {" "}
          <button
            className="faq-trigger w-full flex items-start justify-between text-left gap-6 cursor-pointer"
            type="button"
          >
            {" "}
            <span className="font-headline-sm text-[17px] md:text-[18px] font-semibold text-[#0F172A] group-hover:text-[#3B82F6] transition-colors">
              {pageContent.text[69]}
            </span>{" "}
            <span className="faq-icon w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-700 shrink-0 group-hover:border-blue-400 group-hover:text-[#3B82F6] transition-all">
              {" "}
              <GeminiIcon
                name="add"
                className="text-[16px] leading-none transition-transform duration-200 rotate-45"
              />{" "}
            </span>{" "}
          </button>{" "}
          <div className="faq-content pt-3 pr-8 text-slate-600 font-body-md text-[15px] leading-relaxed">
            {" "}
            {pageContent.text[70]}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function OurOperatingModelSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 lg:px-12 bg-white border-y border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <div className="flex flex-col items-start mb-12">
          {" "}
          <span className="font-label-mono-sm text-[11px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-2">
            {pageContent.text[71]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">
            {pageContent.text[72]}
          </h2>{" "}
        </div>{" "}
        <div className="relative pt-6 pb-2">
          {" "}
          <div className="hidden md:block absolute top-[36px] left-[5%] right-[5%] h-[2px] bg-[#E2E8F0] z-0"></div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {" "}
            <div className="flex flex-col items-start text-left">
              {" "}
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-label-mono-sm text-[12px] font-bold mb-5 shadow-xs ring-4 ring-white">
                {" "}
                {pageContent.text[73]}{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[12px] font-bold text-[#3B82F6] tracking-wide mb-1">
                {pageContent.text[74]}
              </span>{" "}
              <h3 className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1.5">
                {pageContent.text[75]}
              </h3>{" "}
              <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed max-w-[240px]">
                {" "}
                {pageContent.text[76]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col items-start text-left">
              {" "}
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-label-mono-sm text-[12px] font-bold mb-5 shadow-xs ring-4 ring-white">
                {" "}
                {pageContent.text[77]}{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[12px] font-bold text-[#3B82F6] tracking-wide mb-1">
                {pageContent.text[78]}
              </span>{" "}
              <h3 className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1.5">
                {pageContent.text[79]}
              </h3>{" "}
              <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed max-w-[240px]">
                {" "}
                {pageContent.text[80]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col items-start text-left">
              {" "}
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-label-mono-sm text-[12px] font-bold mb-5 shadow-xs ring-4 ring-white">
                {" "}
                {pageContent.text[81]}{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[12px] font-bold text-[#3B82F6] tracking-wide mb-1">
                {pageContent.text[82]}
              </span>{" "}
              <h3 className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1.5">
                {pageContent.text[83]}
              </h3>{" "}
              <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed max-w-[240px]">
                {" "}
                {pageContent.text[84]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col items-start text-left">
              {" "}
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-label-mono-sm text-[12px] font-bold mb-5 shadow-xs ring-4 ring-white">
                {" "}
                {pageContent.text[85]}{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[12px] font-bold text-[#3B82F6] tracking-wide mb-1">
                {pageContent.text[86]}
              </span>{" "}
              <h3 className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1.5">
                {pageContent.text[87]}
              </h3>{" "}
              <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed max-w-[240px]">
                {" "}
                {pageContent.text[88]}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section8Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 bg-[#F8F9FA]">
      {" "}
      <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-[#E2E8F0] p-10 md:p-14 shadow-xs flex flex-col items-center text-center">
        {" "}
        <span className="font-label-mono-sm text-[11px] font-bold tracking-widest text-[#3B82F6] uppercase mb-4">
          {pageContent.text[89]}
        </span>{" "}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-slate-700 font-label-mono-sm text-[12px] tracking-wide mb-6">
          {" "}
          <span>{pageContent.text[90]}</span>{" "}
          <span className="text-[#3B82F6] font-bold">{pageContent.text[91]}</span>{" "}
          <span>{pageContent.text[92]}</span>{" "}
          <span className="text-[#3B82F6] font-bold">{pageContent.text[93]}</span>{" "}
          <span className="text-[#0F172A] font-bold">{pageContent.text[94]}</span>{" "}
        </div>{" "}
        <p className="font-headline-sm text-2xl md:text-3xl font-bold text-[#0F172A] max-w-2xl leading-tight">
          {" "}
          {pageContent.text[95]}{" "}
        </p>{" "}
      </div>{" "}
    </section>
  )
}

export function RealWorldSecuritySection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="w-full py-20 px-6 lg:px-12 bg-white border-t border-[#E2E8F0]"
      id="real-world-security"
    >
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        {" "}
        <div className="max-w-2xl mb-12">
          {" "}
          <span className="font-label-mono-sm text-[11px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-2 block">
            {pageContent.text[96]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            {pageContent.text[97]}
          </h2>{" "}
          <p className="font-body-md text-slate-600 text-[16px]"> {pageContent.text[98]} </p>{" "}
        </div>{" "}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col">
            {" "}
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center mb-4">
              {" "}
              <GeminiIcon name="shield" className="text-[18px]" />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-1">
              {pageContent.text[99]}
            </span>{" "}
            <h3 className="font-headline-sm text-[17px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[100]}
            </h3>{" "}
            <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed">
              {" "}
              {pageContent.text[101]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col">
            {" "}
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center mb-4">
              {" "}
              <GeminiIcon name="fence" className="text-[18px]" />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-1">
              {pageContent.text[102]}
            </span>{" "}
            <h3 className="font-headline-sm text-[17px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[103]}
            </h3>{" "}
            <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed">
              {" "}
              {pageContent.text[104]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col">
            {" "}
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center mb-4">
              {" "}
              <GeminiIcon name="verified_user" className="text-[18px]" />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-1">
              {pageContent.text[105]}
            </span>{" "}
            <h3 className="font-headline-sm text-[17px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[106]}
            </h3>{" "}
            <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed">
              {" "}
              {pageContent.text[107]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E2E8F0] flex flex-col">
            {" "}
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center mb-4">
              {" "}
              <GeminiIcon name="settings_ethernet" className="text-[18px]" />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-[11px] font-bold text-[#3B82F6] tracking-wider uppercase mb-1">
              {pageContent.text[108]}
            </span>{" "}
            <h3 className="font-headline-sm text-[17px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[109]}
            </h3>{" "}
            <p className="font-body-sm text-[13px] text-slate-500 leading-relaxed">
              {" "}
              {pageContent.text[110]}{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HowAnEngagementMovesSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 bg-[#F8F9FA] border-t border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {" "}
        <span className="font-label-mono-sm text-[11px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-2">
          {pageContent.text[111]}
        </span>{" "}
        <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          {pageContent.text[112]}
        </h2>{" "}
        <p className="font-body-md text-slate-600 max-w-xl mb-10 text-[15px]">
          {" "}
          {pageContent.text[113]}{" "}
        </p>{" "}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {" "}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col items-center">
            {" "}
            <span className="font-label-mono-sm text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {pageContent.text[114]}
            </span>{" "}
            <span className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[115]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500">
              {pageContent.text[116]}
            </span>{" "}
          </div>{" "}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col items-center">
            {" "}
            <span className="font-label-mono-sm text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {pageContent.text[117]}
            </span>{" "}
            <span className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[118]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500">
              {pageContent.text[119]}
            </span>{" "}
          </div>{" "}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col items-center">
            {" "}
            <span className="font-label-mono-sm text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {pageContent.text[120]}
            </span>{" "}
            <span className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[121]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500">
              {pageContent.text[122]}
            </span>{" "}
          </div>{" "}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col items-center">
            {" "}
            <span className="font-label-mono-sm text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {pageContent.text[123]}
            </span>{" "}
            <span className="font-headline-sm text-[18px] font-bold text-[#0F172A] mb-1">
              {pageContent.text[124]}
            </span>{" "}
            <span className="font-body-sm text-[12px] text-slate-500">
              {pageContent.text[125]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function StillFiguringItOutSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 bg-[#F8F9FA]">
      {" "}
      <div className="max-w-3xl mx-auto p-10 md:p-12 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs text-center flex flex-col items-center">
        {" "}
        <span className="font-label-mono-sm text-[11px] font-semibold text-[#3B82F6] tracking-wider uppercase mb-3">
          {pageContent.text[126]}
        </span>{" "}
        <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
          {" "}
          {pageContent.text[127]}{" "}
        </h2>{" "}
        <p className="font-body-md text-slate-600 max-w-lg mb-8 leading-relaxed">
          {" "}
          {pageContent.text[128]}{" "}
        </p>{" "}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {" "}
          <a
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6] text-white font-label-ui text-[14px] font-semibold hover:bg-blue-600 transition-all shadow-xs"
            href="#conversation"
          >
            {" "}
            <span>{pageContent.text[129]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
          </a>{" "}
          <a
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-800 font-label-ui text-[14px] font-semibold border border-slate-300 hover:bg-slate-50 transition-all"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <span>{pageContent.text[130]}</span>{" "}
            <GeminiIcon name="arrow_outward" className="text-[18px] text-slate-400" />{" "}
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ConversationSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full pb-20 px-6 lg:px-12 bg-[#F8F9FA]" id="conversation">
      {" "}
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#0A0E1A] text-white p-8 md:p-16 relative overflow-hidden shadow-2xl border border-white/10">
        {" "}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>{" "}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>{" "}
        <div className="relative z-10 flex flex-col items-start max-w-2xl">
          {" "}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 font-label-mono-sm text-[11px] uppercase tracking-wider mb-6">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>{" "}
            <span>{pageContent.text[131]}</span>{" "}
          </div>{" "}
          <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-4">
            {" "}
            {pageContent.text[132]}{" "}
          </h2>{" "}
          <p className="font-body-lg text-[17px] text-slate-400 max-w-xl mb-8 leading-relaxed">
            {" "}
            {pageContent.text[133]}{" "}
          </p>{" "}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {" "}
            <a
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#3B82F6] text-white font-label-ui text-[14px] font-semibold shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:bg-blue-600 transition-all hover:-translate-y-0.5"
              href={localePath(locale, "/contact")}
            >
              {" "}
              <span>{pageContent.text[134]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/5 text-white font-label-ui text-[14px] font-semibold border border-white/15 hover:bg-white/10 transition-all"
              href={localePath(locale, "/what-we-build")}
            >
              {" "}
              <span>{pageContent.text[135]}</span>{" "}
              <GeminiIcon name="arrow_outward" className="text-[18px] text-slate-400" />{" "}
            </a>{" "}
          </div>{" "}
          <div className="w-full pt-6 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-400 font-label-mono-sm text-[12px]">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="engineering" className="text-[16px] text-blue-400" />{" "}
              <span>{pageContent.text[136]}</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="schedule" className="text-[16px] text-blue-400" />{" "}
              <span>{pageContent.text[137]}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
