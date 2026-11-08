import { pageContent } from "@/content/gemini/system-selection"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function LetSBuildTheSystemYourBusinessNeedsNextSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8fafc] text-slate-900 py-space-3xl relative overflow-hidden">
      {" "}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] gemini-inline-01"></div>{" "}
      <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>{" "}
      <div className="max-w-[1440px] mx-auto px-gutter relative z-10">
        {" "}
        <div className="max-w-4xl mx-auto text-center space-y-space-lg">
          {" "}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/80 text-slate-800 shadow-sm">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>{" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-slate-700">
              {pageContent.text[10]}
            </span>{" "}
          </div>{" "}
          <h1 className="font-display-xl text-display-xl text-slate-950 tracking-tight leading-tight">
            {" "}
            {pageContent.text[11]}{" "}
            <span className="font-editorial-italic text-editorial-italic italic font-normal text-blue-600">
              {pageContent.text[12]}
            </span>{" "}
          </h1>{" "}
          <p className="font-body-lg text-body-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {" "}
            {pageContent.text[13]}{" "}
          </p>{" "}
          <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-center gap-space-md">
            {" "}
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-blue-600 text-white font-label-ui text-label-ui uppercase tracking-wider font-semibold shadow-[0_12px_24px_-8px_rgba(37,99,235,0.35)] hover:bg-blue-700 hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.45)] transition-all transform hover:-translate-y-0.5"
              href="#intake-form"
            >
              {" "}
              {pageContent.text[14]}{" "}
              <span className="ml-2 font-mono">{pageContent.text[15]}</span>{" "}
            </a>{" "}
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-slate-800 font-label-ui text-label-ui uppercase tracking-wider font-semibold shadow-sm hover:bg-slate-100 hover:text-slate-950 transition-all"
              href="#direct-schedule"
            >
              {" "}
              {pageContent.text[16]}{" "}
              <span className="ml-2 font-mono">{pageContent.text[17]}</span>{" "}
            </a>{" "}
          </div>{" "}
          <div className="pt-space-md flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-label-mono-sm text-label-mono-sm text-slate-500 uppercase tracking-wide">
            {" "}
            <span className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="verified_user" className="text-[16px] text-blue-600" />{" "}
              {pageContent.text[18]}{" "}
            </span>{" "}
            <span className="text-slate-300">{pageContent.text[19]}</span>{" "}
            <span className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="bolt" className="text-[16px] text-blue-600" />{" "}
              {pageContent.text[20]}{" "}
            </span>{" "}
            <span className="text-slate-300">{pageContent.text[21]}</span>{" "}
            <span className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="terminal" className="text-[16px] text-blue-600" />{" "}
              {pageContent.text[22]}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function WhatAreYouLookingToImproveSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-space-3xl relative">
      {" "}
      <div className="max-w-[1440px] mx-auto px-gutter">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {" "}
          <div className="lg:col-span-5 space-y-space-lg">
            {" "}
            <div className="space-y-space-xs">
              {" "}
              <div className="font-label-mono-sm text-label-mono-sm text-blue-600 uppercase tracking-widest">
                {" "}
                {pageContent.text[23]}{" "}
              </div>{" "}
              <h2 className="font-headline-lg text-headline-lg font-bold text-slate-950 tracking-tight">
                {" "}
                {pageContent.text[24]}{" "}
              </h2>{" "}
              <p className="font-body-md text-body-md text-slate-600">
                {" "}
                {pageContent.text[25]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="space-y-3 pt-2" id="spec-picker">
              {" "}
              <button
                className="spec-btn w-full text-left p-space-md rounded-xl transition-all flex items-start justify-between bg-blue-50/70 shadow-sm"
                data-spec="gtm"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={true}
              >
                {" "}
                <div className="space-y-1">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                    <span className="font-headline-sm text-headline-sm text-slate-950 text-base">
                      {pageContent.text[26]}
                    </span>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600 pl-5">
                    {" "}
                    {pageContent.text[27]}{" "}
                  </p>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-[20px] pt-0.5 gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-[20px] pt-0.5 gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-space-md rounded-xl transition-all flex items-start justify-between bg-slate-50 hover:bg-slate-100 shadow-sm"
                data-spec="ai-agents"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="space-y-1">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>{" "}
                    <span className="font-headline-sm text-headline-sm text-slate-800 text-base">
                      {pageContent.text[28]}
                    </span>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600 pl-5">
                    {" "}
                    {pageContent.text[29]}{" "}
                  </p>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-[20px] pt-0.5 gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-[20px] pt-0.5 gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-space-md rounded-xl transition-all flex items-start justify-between bg-slate-50 hover:bg-slate-100 shadow-sm"
                data-spec="revops"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="space-y-1">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>{" "}
                    <span className="font-headline-sm text-headline-sm text-slate-800 text-base">
                      {pageContent.text[30]}
                    </span>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600 pl-5">
                    {" "}
                    {pageContent.text[31]}{" "}
                  </p>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-[20px] pt-0.5 gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-[20px] pt-0.5 gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-space-md rounded-xl transition-all flex items-start justify-between bg-slate-50 hover:bg-slate-100 shadow-sm"
                data-spec="products"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="space-y-1">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>{" "}
                    <span className="font-headline-sm text-headline-sm text-slate-800 text-base">
                      {pageContent.text[32]}
                    </span>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600 pl-5">
                    {" "}
                    {pageContent.text[33]}{" "}
                  </p>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-[20px] pt-0.5 gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-[20px] pt-0.5 gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-space-md rounded-xl transition-all flex items-start justify-between bg-slate-50 hover:bg-slate-100 shadow-sm"
                data-spec="custom"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="space-y-1">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>{" "}
                    <span className="font-headline-sm text-headline-sm text-slate-800 text-base">
                      {pageContent.text[34]}
                    </span>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600 pl-5">
                    {" "}
                    {pageContent.text[35]}{" "}
                  </p>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-[20px] pt-0.5 gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-[20px] pt-0.5 gemini-choice-active"
                />{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-7">
            {" "}
            <div className="bg-surface-container-lowest text-on-surface rounded-2xl p-space-lg md:p-space-xl shadow-2xl relative overflow-hidden">
              {" "}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>{" "}
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md mb-space-md bg-surface-container-low/50 p-space-sm rounded-lg">
                {" "}
                <div className="flex items-center gap-space-sm">
                  {" "}
                  <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
                    {" "}
                    {pageContent.text[36]}{" "}
                  </span>{" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant hidden sm:inline">
                    {" "}
                    {pageContent.text[37]}{" "}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center gap-1.5 font-label-mono-sm text-label-mono-sm text-emerald-400">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
                  {pageContent.text[38]}{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
                {" "}
                <div className="bg-surface-container-low p-space-md rounded-xl space-y-1">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-error uppercase tracking-wider flex items-center gap-1.5">
                    {" "}
                    <GeminiIcon name="warning" className="text-[14px]" />{" "}
                    {pageContent.text[39]}{" "}
                  </span>{" "}
                  <p className="font-body-sm text-body-sm text-on-surface">
                    {" "}
                    {pageContent.text[40]}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="bg-surface-container-low p-space-md rounded-xl space-y-1">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
                    {" "}
                    <GeminiIcon name="auto_graph" className="text-[14px]" />{" "}
                    {pageContent.text[41]}{" "}
                  </span>{" "}
                  <p className="font-body-sm text-body-sm text-on-surface">
                    {" "}
                    {pageContent.text[42]}{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-3 relative">
                {" "}
                <div className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider mb-2 flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[43]}</span>{" "}
                  <span className="text-primary font-mono text-[11px]">
                    {pageContent.text[44]}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center gap-space-md bg-surface-container p-space-sm px-space-md rounded-xl group hover:bg-surface-container-high transition-all">
                  {" "}
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    {" "}
                    <GeminiIcon name="sensors" className="text-[18px]" />{" "}
                  </div>{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                        {pageContent.text[45]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-label-mono-sm text-primary">
                        {pageContent.text[46]}
                      </span>{" "}
                    </div>{" "}
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {pageContent.text[47]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1">
                  {" "}
                  <GeminiIcon name="south" className="text-primary/40 text-[18px]" />{" "}
                </div>{" "}
                <div className="flex items-center gap-space-md bg-surface-container p-space-sm px-space-md rounded-xl group hover:bg-surface-container-high transition-all">
                  {" "}
                  <div className="w-8 h-8 rounded-lg bg-tertiary-container/30 text-tertiary flex items-center justify-center shrink-0">
                    {" "}
                    <GeminiIcon name="psychology" className="text-[18px]" />{" "}
                  </div>{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                        {pageContent.text[48]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                        {pageContent.text[49]}
                      </span>{" "}
                    </div>{" "}
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {pageContent.text[50]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1">
                  {" "}
                  <GeminiIcon name="south" className="text-primary/40 text-[18px]" />{" "}
                </div>{" "}
                <div className="flex items-center gap-space-md bg-surface-container p-space-sm px-space-md rounded-xl group hover:bg-surface-container-high transition-all">
                  {" "}
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    {" "}
                    <GeminiIcon name="filter_alt" className="text-[18px]" />{" "}
                  </div>{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                        {pageContent.text[51]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-label-mono-sm text-emerald-400">
                        {pageContent.text[52]}
                      </span>{" "}
                    </div>{" "}
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {pageContent.text[53]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1">
                  {" "}
                  <GeminiIcon name="south" className="text-primary/40 text-[18px]" />{" "}
                </div>{" "}
                <div className="flex items-center gap-space-md bg-surface-container p-space-sm px-space-md rounded-xl group hover:bg-surface-container-high transition-all">
                  {" "}
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    {" "}
                    <GeminiIcon name="magic_button" className="text-[18px]" />{" "}
                  </div>{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                        {pageContent.text[54]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-label-mono-sm text-blue-400">
                        {pageContent.text[55]}
                      </span>{" "}
                    </div>{" "}
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {pageContent.text[56]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1">
                  {" "}
                  <GeminiIcon name="south" className="text-primary/40 text-[18px]" />{" "}
                </div>{" "}
                <div className="flex items-center gap-space-md bg-surface-container p-space-sm px-space-md rounded-xl group hover:bg-surface-container-high transition-all">
                  {" "}
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    {" "}
                    <GeminiIcon name="sync_alt" className="text-[18px]" />{" "}
                  </div>{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                        {pageContent.text[57]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-label-mono-sm text-primary">
                        {pageContent.text[58]}
                      </span>{" "}
                    </div>{" "}
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {pageContent.text[59]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                {" "}
                <span className="flex items-center gap-1.5">
                  {" "}
                  <GeminiIcon name="lock" className="text-primary text-[14px]" />{" "}
                  {pageContent.text[60]}{" "}
                </span>{" "}
                <span>{pageContent.text[61]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function IntakeFormSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8fafc] text-slate-900 py-space-3xl relative" id="intake-form">
      {" "}
      <div className="max-w-[1440px] mx-auto px-gutter">
        {" "}
        <div className="max-w-2xl mx-auto text-center space-y-space-xs mb-space-xl">
          {" "}
          <div className="font-label-mono-sm text-label-mono-sm text-blue-600 uppercase tracking-widest">
            {" "}
            {pageContent.text[62]}{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-headline-lg font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[63]}{" "}
          </h2>{" "}
          <p className="font-body-md text-body-md text-slate-600"> {pageContent.text[64]} </p>{" "}
        </div>{" "}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-space-lg md:p-space-2xl space-y-space-xl">
          {" "}
          <form className="space-y-space-xl">
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {" "}
              <div className="space-y-1.5">
                {" "}
                <label className="block font-label-ui text-label-ui text-slate-700 uppercase tracking-wider font-semibold">
                  {" "}
                  {pageContent.text[65]}{" "}
                  <span className="text-blue-600">{pageContent.text[66]}</span>{" "}
                </label>{" "}
                <input
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-body-md text-body-md shadow-inner"
                  placeholder={pageContent.text[67]}
                  required={true}
                  type="text"
                />{" "}
              </div>{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="block font-label-ui text-label-ui text-slate-700 uppercase tracking-wider font-semibold">
                  {" "}
                  {pageContent.text[68]}{" "}
                  <span className="text-blue-600">{pageContent.text[69]}</span>{" "}
                </label>{" "}
                <input
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-body-md text-body-md shadow-inner"
                  placeholder={pageContent.text[70]}
                  required={true}
                  type="email"
                />{" "}
              </div>{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="block font-label-ui text-label-ui text-slate-700 uppercase tracking-wider font-semibold">
                  {" "}
                  {pageContent.text[71]}{" "}
                  <span className="text-blue-600">{pageContent.text[72]}</span>{" "}
                </label>{" "}
                <input
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-body-md text-body-md shadow-inner"
                  placeholder={pageContent.text[73]}
                  required={true}
                  type="text"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <label className="block font-label-ui text-label-ui text-slate-700 uppercase tracking-wider font-semibold">
                  {" "}
                  {pageContent.text[74]}{" "}
                  <span className="text-blue-600">{pageContent.text[75]}</span>{" "}
                </label>{" "}
                <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                  {pageContent.text[76]}
                </span>{" "}
              </div>{" "}
              <textarea
                className="w-full px-4 py-3.5 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-body-md text-body-md shadow-inner"
                placeholder={pageContent.text[77]}
                required={true}
                rows={4}
              ></textarea>{" "}
            </div>{" "}
            <div className="space-y-3 pt-2">
              {" "}
              <label className="block font-label-ui text-label-ui text-slate-700 uppercase tracking-wider font-semibold">
                {" "}
                {pageContent.text[78]}{" "}
              </label>{" "}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md" id="stage-toggle-group">
                {" "}
                <button
                  className="stage-btn text-left p-space-md rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex flex-col justify-between h-full space-y-2"
                  data-stage="exploring"
                  type="button"
                  data-gemini-choice="stage"
                  data-gemini-variant="simple"
                  data-gemini-active-class="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-gemini-inactive-class="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  aria-pressed={false}
                >
                  {" "}
                  <div>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-label-mono-sm text-label-mono-sm uppercase text-slate-500 font-semibold tracking-wider">
                        {pageContent.text[79]}
                      </span>{" "}
                      <GeminiIcon
                        name="radio_button_unchecked"
                        className="text-slate-400 text-[18px] gemini-choice-inactive"
                      />
                      <GeminiIcon
                        name="check_circle"
                        className="text-blue-600 text-[18px] gemini-choice-active"
                      />{" "}
                    </div>{" "}
                    <div className="font-headline-sm text-headline-sm text-slate-900 text-base font-semibold mt-1">
                      {pageContent.text[80]}
                    </div>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600">
                    {" "}
                    {pageContent.text[81]}{" "}
                  </p>{" "}
                </button>{" "}
                <button
                  className="stage-btn text-left p-space-md rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex flex-col justify-between h-full space-y-2"
                  data-stage="planning"
                  type="button"
                  data-gemini-choice="stage"
                  data-gemini-variant="simple"
                  data-gemini-active-class="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-gemini-inactive-class="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  aria-pressed={false}
                >
                  {" "}
                  <div>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-label-mono-sm text-label-mono-sm uppercase text-slate-500 font-semibold tracking-wider">
                        {pageContent.text[82]}
                      </span>{" "}
                      <GeminiIcon
                        name="radio_button_unchecked"
                        className="text-slate-400 text-[18px] gemini-choice-inactive"
                      />
                      <GeminiIcon
                        name="check_circle"
                        className="text-blue-600 text-[18px] gemini-choice-active"
                      />{" "}
                    </div>{" "}
                    <div className="font-headline-sm text-headline-sm text-slate-900 text-base font-semibold mt-1">
                      {pageContent.text[83]}
                    </div>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600">
                    {" "}
                    {pageContent.text[84]}{" "}
                  </p>{" "}
                </button>{" "}
                <button
                  className="stage-btn text-left p-space-md rounded-xl bg-blue-50/70 shadow-sm transition-all flex flex-col justify-between h-full space-y-2"
                  data-stage="ready"
                  type="button"
                  data-gemini-choice="stage"
                  data-gemini-variant="simple"
                  data-gemini-active-class="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-gemini-inactive-class="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  aria-pressed={true}
                >
                  {" "}
                  <div>
                    {" "}
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="font-label-mono-sm text-label-mono-sm uppercase text-blue-600 font-semibold tracking-wider">
                        {pageContent.text[85]}
                      </span>{" "}
                      <GeminiIcon
                        name="radio_button_unchecked"
                        className="text-slate-400 text-[18px] gemini-choice-inactive"
                      />
                      <GeminiIcon
                        name="check_circle"
                        className="text-blue-600 text-[18px] gemini-choice-active"
                      />{" "}
                    </div>{" "}
                    <div className="font-headline-sm text-headline-sm text-slate-950 text-base font-semibold mt-1">
                      {pageContent.text[86]}
                    </div>{" "}
                  </div>{" "}
                  <p className="font-body-sm text-body-sm text-slate-600">
                    {" "}
                    {pageContent.text[87]}{" "}
                  </p>{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
              {" "}
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-full bg-blue-600 text-white font-label-ui text-label-ui uppercase tracking-wider font-semibold shadow-[0_12px_24px_-8px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.5)] transition-all"
                type="submit"
              >
                {" "}
                {pageContent.text[88]}{" "}
                <span className="ml-2 font-mono">{pageContent.text[89]}</span>{" "}
              </button>{" "}
              <p className="font-body-sm text-body-sm text-slate-500 text-center sm:text-right max-w-xs">
                {" "}
                {pageContent.text[90]}{" "}
              </p>{" "}
            </div>{" "}
            <div
              className="hidden p-space-md rounded-xl bg-emerald-50 text-emerald-900 flex items-center gap-space-sm"
              id="form-feedback"
            >
              {" "}
              <GeminiIcon name="task_alt" className="text-emerald-600" />{" "}
              <div className="font-body-sm text-body-sm">
                {" "}
                <span className="font-semibold">{pageContent.text[91]}</span>{" "}
                {pageContent.text[92]}{" "}
              </div>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function DirectScheduleSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-space-2xl" id="direct-schedule">
      {" "}
      <div className="max-w-[1440px] mx-auto px-gutter">
        {" "}
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl p-space-xl text-center space-y-space-md shadow-sm">
          {" "}
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            {" "}
            <GeminiIcon name="calendar_month" className="text-[24px]" />{" "}
          </div>{" "}
          <div className="space-y-1">
            {" "}
            <div className="font-label-mono-sm text-label-mono-sm text-blue-600 uppercase tracking-widest">
              {" "}
              {pageContent.text[93]}{" "}
            </div>{" "}
            <h3 className="font-headline-lg text-headline-lg font-bold text-slate-950 tracking-tight">
              {" "}
              {pageContent.text[94]}{" "}
            </h3>{" "}
            <p className="font-body-md text-body-md text-slate-600 max-w-lg mx-auto">
              {" "}
              {pageContent.text[95]}{" "}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <a
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-slate-900 text-white font-label-ui text-label-ui uppercase tracking-wider font-semibold hover:bg-slate-800 transition-all shadow-md"
              href={localePath(locale, "/cta-page")}
            >
              {" "}
              {pageContent.text[96]}{" "}
              <span className="ml-2 font-mono">{pageContent.text[97]}</span>{" "}
            </a>{" "}
          </div>{" "}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 font-label-mono-sm text-label-mono-sm text-slate-500">
            {" "}
            <span>{pageContent.text[98]}</span> <span>{pageContent.text[99]}</span>{" "}
            <span>{pageContent.text[100]}</span> <span>{pageContent.text[101]}</span>{" "}
            <span>{pageContent.text[102]}</span> <span>{pageContent.text[103]}</span>{" "}
            <span>{pageContent.text[104]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ASimplePathFromProblemToBuildSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8fafc] text-slate-900 py-space-3xl">
      {" "}
      <div className="max-w-[1440px] mx-auto px-gutter space-y-space-2xl">
        {" "}
        <div className="max-w-2xl mx-auto text-center space-y-space-xs">
          {" "}
          <div className="font-label-mono-sm text-label-mono-sm text-blue-600 uppercase tracking-widest">
            {" "}
            {pageContent.text[105]}{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-headline-lg font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[106]}{" "}
          </h2>{" "}
          <p className="font-body-md text-body-md text-slate-600"> {pageContent.text[107]} </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {" "}
          <div className="bg-white rounded-2xl p-space-lg shadow-sm flex flex-col justify-between space-y-space-md relative">
            {" "}
            <div className="space-y-space-sm">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-blue-600 font-bold">
                  {pageContent.text[108]}
                </span>{" "}
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-label-mono-sm text-[10px]">
                  {pageContent.text[109]}
                </span>{" "}
              </div>{" "}
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                {" "}
                <GeminiIcon name="quickreply" className="text-[20px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-950 text-lg font-bold">
                {pageContent.text[110]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600">
                {" "}
                {pageContent.text[111]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-2 font-label-mono-sm text-label-mono-sm text-slate-400">
              {" "}
              {pageContent.text[112]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-space-lg shadow-sm flex flex-col justify-between space-y-space-md relative">
            {" "}
            <div className="space-y-space-sm">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-blue-600 font-bold">
                  {pageContent.text[113]}
                </span>{" "}
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-label-mono-sm text-[10px]">
                  {pageContent.text[114]}
                </span>{" "}
              </div>{" "}
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                {" "}
                <GeminiIcon name="troubleshoot" className="text-[20px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-950 text-lg font-bold">
                {pageContent.text[115]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600">
                {" "}
                {pageContent.text[116]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-2 font-label-mono-sm text-label-mono-sm text-slate-400">
              {" "}
              {pageContent.text[117]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-space-lg shadow-sm flex flex-col justify-between space-y-space-md relative">
            {" "}
            <div className="space-y-space-sm">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-blue-600 font-bold">
                  {pageContent.text[118]}
                </span>{" "}
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-label-mono-sm text-[10px]">
                  {pageContent.text[119]}
                </span>{" "}
              </div>{" "}
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                {" "}
                <GeminiIcon name="architecture" className="text-[20px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-950 text-lg font-bold">
                {pageContent.text[120]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600">
                {" "}
                {pageContent.text[121]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-2 font-label-mono-sm text-label-mono-sm text-slate-400">
              {" "}
              {pageContent.text[122]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-space-lg shadow-sm flex flex-col justify-between space-y-space-md relative">
            {" "}
            <div className="space-y-space-sm">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-blue-600 font-bold">
                  {pageContent.text[123]}
                </span>{" "}
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-label-mono-sm text-[10px]">
                  {pageContent.text[124]}
                </span>{" "}
              </div>{" "}
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                {" "}
                <GeminiIcon name="code" className="text-[20px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-950 text-lg font-bold">
                {pageContent.text[125]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600">
                {" "}
                {pageContent.text[126]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-2 font-label-mono-sm text-label-mono-sm text-slate-400">
              {" "}
              {pageContent.text[127]}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section6Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-space-xl">
      {" "}
      <div className="max-w-[1440px] mx-auto px-gutter">
        {" "}
        <div className="max-w-4xl mx-auto rounded-xl bg-slate-50 p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
          {" "}
          <div className="space-y-1 text-center md:text-left">
            {" "}
            <div className="font-headline-sm text-headline-sm text-slate-950 text-base font-bold flex items-center justify-center md:justify-start gap-2">
              {" "}
              <GeminiIcon name="security" className="text-blue-600 text-[18px]" />{" "}
              {pageContent.text[128]}{" "}
            </div>{" "}
            <p className="font-body-sm text-body-sm text-slate-600 max-w-xl">
              {" "}
              {pageContent.text[129]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center justify-center gap-2 font-label-mono-sm text-label-mono-sm">
            {" "}
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 shadow-sm">
              {pageContent.text[130]}
            </span>{" "}
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 shadow-sm">
              {pageContent.text[131]}
            </span>{" "}
            <span className="px-3 py-1 rounded-full bg-white text-slate-700 shadow-sm">
              {pageContent.text[132]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveASystemWorthBuildingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8fafc] py-space-3xl">
      {" "}
      <div className="max-w-[1440px] mx-auto px-gutter">
        {" "}
        <div className="w-full rounded-3xl bg-[#0a0e18] text-white p-space-2xl md:p-space-3xl relative overflow-hidden shadow-2xl">
          {" "}
          <div className="absolute -top-32 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>{" "}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>{" "}
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-space-lg">
            {" "}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-primary">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>{" "}
              <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
                {pageContent.text[133]}
              </span>{" "}
            </div>{" "}
            <h2 className="font-display-lg text-display-lg font-bold tracking-tight text-white leading-tight">
              {" "}
              {pageContent.text[134]}{" "}
            </h2>{" "}
            <p className="font-body-lg text-body-lg text-slate-300 max-w-xl mx-auto">
              {" "}
              {pageContent.text[135]}{" "}
            </p>{" "}
            <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-center gap-space-md">
              {" "}
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-on-primary font-label-ui text-label-ui uppercase tracking-wider font-semibold hover:bg-white hover:text-slate-950 transition-all shadow-[0_0_24px_-4px_rgba(173,198,255,0.4)]"
                href="#intake-form"
              >
                {" "}
                {pageContent.text[136]}{" "}
                <span className="ml-2 font-mono">{pageContent.text[137]}</span>{" "}
              </a>{" "}
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/5 text-white font-label-ui text-label-ui uppercase tracking-wider font-semibold hover:bg-white/10 transition-all"
                data-path="what-we-build"
                href={localePath(locale, "/what-we-build")}
              >
                {" "}
                {pageContent.text[138]}{" "}
                <span className="ml-2 font-mono">{pageContent.text[139]}</span>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
