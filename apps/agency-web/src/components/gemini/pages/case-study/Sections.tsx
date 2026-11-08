import { pageContent } from "@/content/gemini/case-study"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function FromFragmentedWorkflowsToARevenueSystemSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-10 lg:px-12 border-b border-[#E2E8F0] bg-[#FAFAFC]">
      {" "}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {" "}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 w-fit">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold tracking-wider uppercase">
              {pageContent.text[9]}
            </span>{" "}
          </div>{" "}
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B0F19] tracking-tight leading-[1.08]">
            {" "}
            {pageContent.text[10]}{" "}
            <span className="font-['Newsreader'] font-normal italic text-blue-600">
              {pageContent.text[11]}
            </span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
            {" "}
            {pageContent.text[12]}{" "}
          </p>{" "}
          <div className="py-3 px-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-2 w-fit">
            {" "}
            <span className="font-['JetBrains_Mono'] text-xs text-slate-500 font-medium">
              {pageContent.text[13]}
            </span>{" "}
            <span className="text-slate-300">{pageContent.text[14]}</span>{" "}
            <span className="font-['JetBrains_Mono'] text-xs text-slate-700 font-semibold">
              {pageContent.text[15]}
            </span>{" "}
            <span className="text-slate-300">{pageContent.text[16]}</span>{" "}
            <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold">
              {pageContent.text[17]}
            </span>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {" "}
            <a
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
              data-path="book-a-discovery"
              href={localePath(locale, "/build-system")}
            >
              {" "}
              <span>{pageContent.text[18]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#E2E8F0] font-semibold text-sm shadow-sm transition-all"
              href="#system-flow"
            >
              {" "}
              <span>{pageContent.text[19]}</span>{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-5">
          {" "}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-3 shadow-xl">
            {" "}
            <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100 aspect-[4/3] flex items-center justify-center">
              {" "}
              <img
                alt="AI revenue orchestration system"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UjU8lEEyb_zkihPtNPP4DKmAIRIxx7rY_IRtZ0TDLi5jfYqG7wjicLo_iKfOvCDXUmCpfvh7AR6l_QQ7MDqQFceimLKI8_qgMWSqXREsVVOMYbCD3yuoK5xyIkRMMDUfZiexL8gm3gb4RyjQJyWIXK80FLkth8vGIxWZxrj3MN3X3vjyqERUpsJlJxwtD2h5uIgSZzL-2_Ejh_VxJOjEc86C8mPh_0Uwg-Nc9HMF0lhXPmr0rfYx_n518"
              />{" "}
            </div>{" "}
            <div className="pt-3 px-2 flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-slate-400 uppercase tracking-wider">
              {" "}
              <span>{pageContent.text[20]}</span>{" "}
              <span className="text-blue-600 font-semibold">{pageContent.text[21]}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function TheFrictionWasnTInOnePlaceItWasEverywhereSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 md:px-10 lg:px-12 bg-white border-b border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {" "}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {" "}
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-blue-600 uppercase tracking-widest">
            {pageContent.text[22]}
          </span>{" "}
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-[#0B0F19] tracking-tight leading-tight">
            {" "}
            {pageContent.text[23]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-600 leading-relaxed"> {pageContent.text[24]} </p>{" "}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {" "}
            <span className="px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-['JetBrains_Mono'] text-xs font-semibold tracking-wide">
              {pageContent.text[25]}
            </span>{" "}
            <span className="px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-['JetBrains_Mono'] text-xs font-semibold tracking-wide">
              {pageContent.text[26]}
            </span>{" "}
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-['JetBrains_Mono'] text-xs font-semibold tracking-wide">
              {pageContent.text[27]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-7 flex flex-col gap-2">
          {" "}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-3 shadow-md">
            {" "}
            <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100 aspect-[16/9] flex items-center justify-center">
              {" "}
              <img
                alt="Disconnected data silos and operational friction"
                className="w-full h-full object-cover"
                src="/gemini-assets/gemini-6787ce93a9eeec00.jpg"
              />{" "}
            </div>{" "}
          </div>{" "}
          <p className="font-['JetBrains_Mono'] text-xs text-slate-500 pl-1">
            {" "}
            {pageContent.text[28]}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function FromFrictionToDeterministicFlowSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 md:px-10 lg:px-12 bg-[#F8F9FA] border-b border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-3xl">
          {" "}
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-blue-600 uppercase tracking-widest">
            {pageContent.text[29]}
          </span>{" "}
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[30]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="w-full rounded-2xl bg-white border border-[#E2E8F0] p-4 md:p-6 shadow-lg flex flex-col gap-4">
          {" "}
          <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100 aspect-[16/10] md:aspect-[21/11] flex items-center justify-center">
            {" "}
            <img
              alt="Transformation from fragmented cubes to unified blue ribbon pipeline"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UPVMd_9taGELaOR8aN9WrUsbVlzrdeQr_Ryda_hpDQvHT3zk7L8gnc8_Re43-wHzBxUlIcZYKMoszXLR9UPSRDcmb57pYoC49bR6iVUn5JVDJNGZrlmUGDNNXI8DQQUuXEtAWXqSNXcDG8Fo5RunjpH5YcgAAjOep1nHvAZHG0iZqKevzRbqXqiVAbDKcH8j81ADJC2ib7NNGKMjLsR7rt2I40a9Brd6qZg6AyYOVgwwl6SZzauqgcGQ"
            />{" "}
          </div>{" "}
          <div className="pt-2 px-2 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm font-['JetBrains_Mono'] font-semibold text-slate-700">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
              <span>{pageContent.text[31]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300">{pageContent.text[32]}</span>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
              <span>{pageContent.text[33]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300">{pageContent.text[34]}</span>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
              <span>{pageContent.text[35]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300">{pageContent.text[36]}</span>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
              <span>{pageContent.text[37]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300">{pageContent.text[38]}</span>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
              <span>{pageContent.text[39]}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function SystemFlowSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="w-full py-20 px-6 md:px-10 lg:px-12 bg-white border-b border-[#E2E8F0]"
      id="system-flow"
    >
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {" "}
        <div className="flex flex-col gap-2 max-w-3xl">
          {" "}
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-blue-600 uppercase tracking-widest">
            {pageContent.text[40]}
          </span>{" "}
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[41]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {" "}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3 text-slate-400">
                {" "}
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-blue-600">
                  {pageContent.text[42]}
                </span>{" "}
                <GeminiIcon name="database" className="text-[18px] text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[43]}
              </h3>{" "}
              <p className="font-['JetBrains_Mono'] text-[11px] text-slate-500 mt-2 leading-tight">
                {pageContent.text[44]}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-['JetBrains_Mono'] text-emerald-600 font-medium">
              {pageContent.text[45]}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3 text-slate-400">
                {" "}
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-blue-600">
                  {pageContent.text[46]}
                </span>{" "}
                <GeminiIcon name="sensors" className="text-[18px] text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[47]}
              </h3>{" "}
              <p className="font-['JetBrains_Mono'] text-[11px] text-slate-500 mt-2 leading-tight">
                {pageContent.text[48]}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-['JetBrains_Mono'] text-emerald-600 font-medium">
              {pageContent.text[49]}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3 text-slate-400">
                {" "}
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-blue-600">
                  {pageContent.text[50]}
                </span>{" "}
                <GeminiIcon name="verified_user" className="text-[18px] text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[51]}
              </h3>{" "}
              <p className="font-['JetBrains_Mono'] text-[11px] text-slate-500 mt-2 leading-tight">
                {pageContent.text[52]}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-['JetBrains_Mono'] text-emerald-600 font-medium">
              {pageContent.text[53]}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3 text-blue-400">
                {" "}
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-blue-700">
                  {pageContent.text[54]}
                </span>{" "}
                <GeminiIcon name="psychology" className="text-[18px] text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[55]}
              </h3>{" "}
              <p className="font-['JetBrains_Mono'] text-[11px] text-blue-900 mt-2 leading-tight">
                {pageContent.text[56]}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-2 border-t border-blue-100 text-[10px] font-['JetBrains_Mono'] text-blue-700 font-semibold">
              {pageContent.text[57]}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3 text-slate-400">
                {" "}
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-blue-600">
                  {pageContent.text[58]}
                </span>{" "}
                <GeminiIcon name="outgoing_mail" className="text-[18px] text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[59]}
              </h3>{" "}
              <p className="font-['JetBrains_Mono'] text-[11px] text-slate-500 mt-2 leading-tight">
                {pageContent.text[60]}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-['JetBrains_Mono'] text-emerald-600 font-medium">
              {pageContent.text[61]}
            </div>{" "}
          </div>{" "}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3 text-slate-400">
                {" "}
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-blue-600">
                  {pageContent.text[62]}
                </span>{" "}
                <GeminiIcon name="query_stats" className="text-[18px] text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[63]}
              </h3>{" "}
              <p className="font-['JetBrains_Mono'] text-[11px] text-slate-500 mt-2 leading-tight">
                {pageContent.text[64]}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] font-['JetBrains_Mono'] text-emerald-600 font-medium">
              {pageContent.text[65]}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function LookingUnderTheHoodLayeredRevenueArchitectureSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="w-full py-20 px-6 md:px-10 lg:px-12 bg-[#FAFAFC] border-b border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {" "}
        <div className="flex flex-col gap-2 max-w-3xl">
          {" "}
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-blue-600 uppercase tracking-widest">
            {pageContent.text[66]}
          </span>{" "}
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[67]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {" "}
          <div className="lg:col-span-8 rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-lg">
            {" "}
            <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100 aspect-[16/9] flex items-center justify-center">
              {" "}
              <img
                alt="High-end editorial technical diagram of layered system stack"
                className="w-full h-full object-cover"
                src="/gemini-assets/gemini-e5c855bc5862c5e9.jpg"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {" "}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
              {" "}
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-blue-600 uppercase">
                {pageContent.text[68]}
              </span>{" "}
              <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19] mt-0.5">
                {pageContent.text[69]}
              </h4>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[70]}</p>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white border border-blue-200 bg-blue-50/20 shadow-sm">
              {" "}
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-blue-600 uppercase">
                {pageContent.text[71]}
              </span>{" "}
              <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19] mt-0.5">
                {pageContent.text[72]}
              </h4>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[73]}</p>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
              {" "}
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-blue-600 uppercase">
                {pageContent.text[74]}
              </span>{" "}
              <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19] mt-0.5">
                {pageContent.text[75]}
              </h4>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[76]}</p>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
              {" "}
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-blue-600 uppercase">
                {pageContent.text[77]}
              </span>{" "}
              <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19] mt-0.5">
                {pageContent.text[78]}
              </h4>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[79]}</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function WhatChangedAfterTheBuildSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 md:px-10 lg:px-12 bg-white border-b border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {" "}
        <div className="flex flex-col gap-2 max-w-3xl">
          {" "}
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-blue-600 uppercase tracking-widest">
            {pageContent.text[80]}
          </span>{" "}
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[81]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            {" "}
            <span className="font-['Plus_Jakarta_Sans'] text-5xl font-extrabold text-blue-600 tracking-tight">
              {pageContent.text[82]}
            </span>{" "}
            <div className="mt-4">
              {" "}
              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[83]}
              </p>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[84]}</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            {" "}
            <span className="font-['Plus_Jakarta_Sans'] text-5xl font-extrabold text-[#0B0F19] tracking-tight">
              {pageContent.text[85]}
            </span>{" "}
            <div className="mt-4">
              {" "}
              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[86]}
              </p>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[87]}</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            {" "}
            <span className="font-['Plus_Jakarta_Sans'] text-5xl font-extrabold text-blue-600 tracking-tight">
              {pageContent.text[88]}
            </span>{" "}
            <div className="mt-4">
              {" "}
              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[89]}
              </p>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[90]}</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            {" "}
            <span className="font-['Plus_Jakarta_Sans'] text-5xl font-extrabold text-[#0B0F19] tracking-tight">
              {pageContent.text[91]}
            </span>{" "}
            <div className="mt-4">
              {" "}
              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0B0F19]">
                {pageContent.text[92]}
              </p>{" "}
              <p className="text-xs text-slate-500 mt-1">{pageContent.text[93]}</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100 max-w-4xl">
          {" "}
          <p className="text-base text-slate-800 leading-relaxed font-normal">
            {" "}
            {pageContent.text[94]}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function MoreSystemsWeVeEngineeredSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 md:px-10 lg:px-12 bg-[#F8F9FA] border-b border-[#E2E8F0]">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {" "}
          <div className="flex flex-col gap-2">
            {" "}
            <span className="font-['JetBrains_Mono'] text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {pageContent.text[95]}
            </span>{" "}
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-[#0B0F19] tracking-tight">
              {" "}
              {pageContent.text[96]}{" "}
            </h2>{" "}
          </div>{" "}
          <a
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <span>{pageContent.text[97]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {" "}
          <a
            className="lg:col-span-6 p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <div className="flex flex-col gap-3">
              {" "}
              <span className="font-['JetBrains_Mono'] text-xs text-blue-600 font-semibold uppercase tracking-wider">
                {pageContent.text[98]}
              </span>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0B0F19] group-hover:text-blue-600 transition-colors">
                {" "}
                {pageContent.text[99]}{" "}
              </h3>{" "}
              <p className="text-sm text-slate-600 leading-relaxed">
                {" "}
                {pageContent.text[100]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-6 flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              {" "}
              <span>{pageContent.text[101]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="lg:col-span-3 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <div className="flex flex-col gap-2.5">
              {" "}
              <span className="font-['JetBrains_Mono'] text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                {pageContent.text[102]}
              </span>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0B0F19] group-hover:text-blue-600 transition-colors">
                {" "}
                {pageContent.text[103]}{" "}
              </h3>{" "}
              <p className="text-xs text-slate-600 leading-relaxed">
                {" "}
                {pageContent.text[104]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-5 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              {" "}
              <span>{pageContent.text[105]}</span>{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="lg:col-span-3 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <div className="flex flex-col gap-2.5">
              {" "}
              <span className="font-['JetBrains_Mono'] text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                {pageContent.text[106]}
              </span>{" "}
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0B0F19] group-hover:text-blue-600 transition-colors">
                {" "}
                {pageContent.text[107]}{" "}
              </h3>{" "}
              <p className="text-xs text-slate-600 leading-relaxed">
                {" "}
                {pageContent.text[108]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-5 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              {" "}
              <span>{pageContent.text[109]}</span>{" "}
            </div>{" "}
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveAProblemWorthEngineeringSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 md:px-10 lg:px-12 bg-[#F8F9FA]">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <div className="w-full rounded-3xl bg-[#0B0F19] text-white p-10 md:p-16 relative overflow-hidden shadow-2xl flex flex-col items-center text-center gap-8 border border-slate-800">
          {" "}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>{" "}
          <div className="flex flex-col gap-3 max-w-2xl relative z-10">
            {" "}
            <span className="font-['JetBrains_Mono'] text-xs text-blue-400 uppercase tracking-widest font-semibold">
              {pageContent.text[110]}
            </span>{" "}
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {" "}
              {pageContent.text[111]}{" "}
            </h2>{" "}
            <p className="text-base text-slate-400 max-w-xl mx-auto pt-1 font-normal">
              {" "}
              {pageContent.text[112]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            {" "}
            <a
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 shadow-[0_0_24px_-4px_rgba(37,99,235,0.5)] transition-all"
              data-path="book-a-discovery"
              href={localePath(locale, "/build-system")}
            >
              {" "}
              <span>{pageContent.text[113]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-colors"
              data-path="work"
              href={localePath(locale, "/case-study")}
            >
              {" "}
              <span>{pageContent.text[114]}</span>{" "}
            </a>{" "}
          </div>{" "}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-slate-400 text-xs font-['JetBrains_Mono'] relative z-10">
            {" "}
            <span>{pageContent.text[115]}</span>{" "}
            <span className="text-slate-600">{pageContent.text[116]}</span>{" "}
            <span>{pageContent.text[117]}</span>{" "}
            <span className="text-slate-600">{pageContent.text[118]}</span>{" "}
            <span>{pageContent.text[119]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
