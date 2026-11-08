import { pageContent } from "@/content/gemini/cta-page"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function LetSBuildTheSystemYourBusinessNeedsNextSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="relative w-full bg-[#f8f9fa] border-b border-[#e2e8f0] py-20 lg:py-28 overflow-hidden">
      {" "}
      <div className="absolute inset-0 grid-pattern pointer-events-none"></div>{" "}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl pointer-events-none opacity-[0.035] hidden md:flex items-center justify-between font-mono text-xs tracking-widest uppercase select-none">
        {" "}
        <span>{pageContent.text[9]}</span> <span className="w-24 h-px bg-slate-900"></span>{" "}
        <span>{pageContent.text[10]}</span> <span className="w-24 h-px bg-slate-900"></span>{" "}
        <span>{pageContent.text[11]}</span>{" "}
      </div>{" "}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 text-center flex flex-col items-center gap-6">
        {" "}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase shadow-xs">
          {" "}
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>{" "}
          {pageContent.text[12]}{" "}
        </div>{" "}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b0f19] tracking-tight leading-[1.1] max-w-3xl">
          {" "}
          {pageContent.text[13]}{" "}
          <span className="italic text-blue-600 font-serif font-normal">
            {pageContent.text[14]}
          </span>{" "}
        </h1>{" "}
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
          {" "}
          {pageContent.text[15]}{" "}
        </p>{" "}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {" "}
          <a
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all"
            href="#intake-form"
          >
            {" "}
            {pageContent.text[16]} <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
          </a>{" "}
          <a
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#e2e8f0] text-slate-800 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm"
            href="#direct-call"
          >
            {" "}
            {pageContent.text[17]} <GeminiIcon name="calendar_today" className="text-[18px]" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-slate-500">
          {" "}
          <span className="flex items-center gap-1.5">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
            {pageContent.text[18]}{" "}
          </span>{" "}
          <span className="text-slate-300">{pageContent.text[19]}</span>{" "}
          <span className="flex items-center gap-1.5">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
            {pageContent.text[20]}{" "}
          </span>{" "}
          <span className="text-slate-300">{pageContent.text[21]}</span>{" "}
          <span className="flex items-center gap-1.5">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
            {pageContent.text[22]}{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function SystemSelectionSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-20 border-b border-[#e2e8f0]" id="system-selection">
      {" "}
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {" "}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {" "}
            <div className="flex flex-col gap-2">
              {" "}
              <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
                {" "}
                {pageContent.text[23]}{" "}
              </div>{" "}
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
                {" "}
                {pageContent.text[24]}{" "}
              </h2>{" "}
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                {" "}
                {pageContent.text[25]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex flex-col gap-2.5" id="spec-picker">
              {" "}
              <button
                className="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-spec="gtm"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={true}
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
                  <div>
                    {" "}
                    <div className="font-display font-bold text-sm text-[#0b0f19]">
                      {pageContent.text[26]}
                    </div>{" "}
                    <div className="text-xs text-slate-500">{pageContent.text[27]}</div>{" "}
                  </div>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-lg gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-lg gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                data-spec="agents"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                  <div>
                    {" "}
                    <div className="font-display font-semibold text-sm text-slate-800">
                      {pageContent.text[28]}
                    </div>{" "}
                    <div className="text-xs text-slate-500">{pageContent.text[29]}</div>{" "}
                  </div>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-lg gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-lg gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                data-spec="revops"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                  <div>
                    {" "}
                    <div className="font-display font-semibold text-sm text-slate-800">
                      {pageContent.text[30]}
                    </div>{" "}
                    <div className="text-xs text-slate-500">{pageContent.text[31]}</div>{" "}
                  </div>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-lg gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-lg gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                data-spec="products"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                  <div>
                    {" "}
                    <div className="font-display font-semibold text-sm text-slate-800">
                      {pageContent.text[32]}
                    </div>{" "}
                    <div className="text-xs text-slate-500">{pageContent.text[33]}</div>{" "}
                  </div>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-lg gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-lg gemini-choice-active"
                />{" "}
              </button>{" "}
              <button
                className="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                data-spec="custom"
                type="button"
                data-gemini-choice="spec"
                data-gemini-variant="simple"
                data-gemini-active-class="spec-btn w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 shadow-sm transition-all flex items-center justify-between"
                data-gemini-inactive-class="spec-btn w-full text-left p-4 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between"
                aria-pressed={false}
              >
                {" "}
                <div className="flex items-center gap-3">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                  <div>
                    {" "}
                    <div className="font-display font-semibold text-sm text-slate-800">
                      {pageContent.text[34]}
                    </div>{" "}
                    <div className="text-xs text-slate-500">{pageContent.text[35]}</div>{" "}
                  </div>{" "}
                </div>{" "}
                <GeminiIcon
                  name="radio_button_unchecked"
                  className="text-slate-400 text-lg gemini-choice-inactive"
                />
                <GeminiIcon
                  name="check_circle"
                  className="text-blue-600 text-lg gemini-choice-active"
                />{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-7">
            {" "}
            <div className="bg-[#0b0f19] text-white rounded-2xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
              {" "}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>{" "}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold uppercase tracking-wider">
                    {" "}
                    {pageContent.text[36]}{" "}
                  </span>{" "}
                  <span className="text-slate-500 hidden sm:inline">
                    {pageContent.text[37]}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
                  {pageContent.text[38]}{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {" "}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/20 flex flex-col gap-1">
                  {" "}
                  <span className="font-mono text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    {" "}
                    <GeminiIcon name="warning" className="text-[13px]" />{" "}
                    {pageContent.text[39]}{" "}
                  </span>{" "}
                  <p className="text-slate-300 leading-snug">{pageContent.text[40]}</p>{" "}
                </div>{" "}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col gap-1">
                  {" "}
                  <span className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    {" "}
                    <GeminiIcon name="auto_awesome" className="text-[13px]" />{" "}
                    {pageContent.text[41]}{" "}
                  </span>{" "}
                  <p className="text-slate-300 leading-snug">{pageContent.text[42]}</p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex flex-col gap-2 relative">
                {" "}
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 pb-1">
                  {" "}
                  <span className="uppercase tracking-wider">{pageContent.text[43]}</span>{" "}
                  <span className="text-blue-400">{pageContent.text[44]}</span>{" "}
                </div>{" "}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between gap-3">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-[11px] font-bold">
                      {pageContent.text[45]}
                    </span>{" "}
                    <div className="font-mono text-xs text-white font-medium">
                      {pageContent.text[46]}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-[10px] text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                    {pageContent.text[47]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1 text-slate-600">
                  {" "}
                  <GeminiIcon name="south" className="text-sm" />{" "}
                </div>{" "}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between gap-3">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px] font-bold">
                      {pageContent.text[48]}
                    </span>{" "}
                    <div className="font-mono text-xs text-white font-medium">
                      {pageContent.text[49]}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                    {pageContent.text[50]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1 text-slate-600">
                  {" "}
                  <GeminiIcon name="south" className="text-sm" />{" "}
                </div>{" "}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between gap-3">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono text-[11px] font-bold">
                      {pageContent.text[51]}
                    </span>{" "}
                    <div className="font-mono text-xs text-white font-medium">
                      {pageContent.text[52]}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-[10px] text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                    {pageContent.text[53]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-1 text-slate-600">
                  {" "}
                  <GeminiIcon name="south" className="text-sm" />{" "}
                </div>{" "}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between gap-3">
                  {" "}
                  <div className="flex items-center gap-2.5">
                    {" "}
                    <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px] font-bold">
                      {pageContent.text[54]}
                    </span>{" "}
                    <div className="font-mono text-xs text-white font-medium">
                      {pageContent.text[55]}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {pageContent.text[56]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-500">
                {" "}
                <span className="flex items-center gap-1.5">
                  {" "}
                  <GeminiIcon name="shield" className="text-[14px] text-blue-400" />{" "}
                  {pageContent.text[57]}{" "}
                </span>{" "}
                <span className="text-blue-400 font-semibold">{pageContent.text[58]}</span>{" "}
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
    <section className="w-full bg-[#f8f9fa] py-20 border-b border-[#e2e8f0]" id="intake-form">
      {" "}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[59]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[60]}{" "}
          </h2>{" "}
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {" "}
            {pageContent.text[61]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-10 shadow-sm flex flex-col gap-8">
          {" "}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            {" "}
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              {pageContent.text[62]}
            </span>{" "}
            <div className="font-mono text-[11px] px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold self-start sm:self-auto">
              {" "}
              {pageContent.text[63]} <span className="text-blue-400">{pageContent.text[64]}</span>{" "}
              {pageContent.text[65]} <span className="text-blue-400">{pageContent.text[66]}</span>{" "}
              {pageContent.text[67]} <span className="text-blue-400">{pageContent.text[68]}</span>{" "}
              {pageContent.text[69]}{" "}
            </div>{" "}
          </div>{" "}
          <form className="flex flex-col gap-6">
            {" "}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {" "}
              <div className="flex flex-col gap-1.5">
                {" "}
                <label className="font-mono text-xs font-semibold text-slate-700 uppercase">
                  {" "}
                  {pageContent.text[70]}{" "}
                  <span className="text-blue-600">{pageContent.text[71]}</span>{" "}
                </label>{" "}
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-[#f8f9fa] text-sm text-[#0b0f19] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  placeholder={pageContent.text[72]}
                  required={true}
                  type="text"
                />{" "}
              </div>{" "}
              <div className="flex flex-col gap-1.5">
                {" "}
                <label className="font-mono text-xs font-semibold text-slate-700 uppercase">
                  {" "}
                  {pageContent.text[73]}{" "}
                  <span className="text-blue-600">{pageContent.text[74]}</span>{" "}
                </label>{" "}
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-[#f8f9fa] text-sm text-[#0b0f19] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  placeholder={pageContent.text[75]}
                  required={true}
                  type="email"
                />{" "}
              </div>{" "}
              <div className="flex flex-col gap-1.5">
                {" "}
                <label className="font-mono text-xs font-semibold text-slate-700 uppercase">
                  {" "}
                  {pageContent.text[76]}{" "}
                  <span className="text-blue-600">{pageContent.text[77]}</span>{" "}
                </label>{" "}
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-[#f8f9fa] text-sm text-[#0b0f19] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  placeholder={pageContent.text[78]}
                  required={true}
                  type="text"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <label className="font-mono text-xs font-semibold text-slate-700 uppercase">
                  {" "}
                  {pageContent.text[79]}{" "}
                  <span className="text-blue-600">{pageContent.text[80]}</span>{" "}
                </label>{" "}
                <span className="font-mono text-[11px] text-slate-400">
                  {pageContent.text[81]}
                </span>{" "}
              </div>{" "}
              <textarea
                className="w-full px-3.5 py-3 rounded-lg border border-slate-200 bg-[#f8f9fa] text-sm text-[#0b0f19] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                placeholder={pageContent.text[82]}
                required={true}
                rows={4}
              ></textarea>{" "}
            </div>{" "}
            <div className="flex flex-col gap-2 pt-1">
              {" "}
              <span className="font-mono text-xs font-semibold text-slate-700 uppercase">
                {" "}
                {pageContent.text[83]}{" "}
              </span>{" "}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="stage-picker">
                {" "}
                <button
                  className="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  data-stage="1"
                  type="button"
                  data-gemini-choice="stage"
                  data-gemini-variant="simple"
                  data-gemini-active-class="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-gemini-inactive-class="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  aria-pressed={false}
                >
                  {" "}
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 font-semibold">
                    {" "}
                    <span>{pageContent.text[84]}</span>{" "}
                    <GeminiIcon
                      name="radio_button_unchecked"
                      className="text-[16px] text-slate-400 gemini-choice-inactive"
                    />
                    <GeminiIcon
                      name="check_circle"
                      className="text-[16px] text-blue-600 gemini-choice-active"
                    />{" "}
                  </div>{" "}
                  <div className="font-display font-bold text-xs text-[#0b0f19]">
                    {pageContent.text[85]}
                  </div>{" "}
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {pageContent.text[86]}
                  </p>{" "}
                </button>{" "}
                <button
                  className="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  data-stage="2"
                  type="button"
                  data-gemini-choice="stage"
                  data-gemini-variant="simple"
                  data-gemini-active-class="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-gemini-inactive-class="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  aria-pressed={false}
                >
                  {" "}
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 font-semibold">
                    {" "}
                    <span>{pageContent.text[87]}</span>{" "}
                    <GeminiIcon
                      name="radio_button_unchecked"
                      className="text-[16px] text-slate-400 gemini-choice-inactive"
                    />
                    <GeminiIcon
                      name="check_circle"
                      className="text-[16px] text-blue-600 gemini-choice-active"
                    />{" "}
                  </div>{" "}
                  <div className="font-display font-bold text-xs text-[#0b0f19]">
                    {pageContent.text[88]}
                  </div>{" "}
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {pageContent.text[89]}
                  </p>{" "}
                </button>{" "}
                <button
                  className="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-stage="3"
                  type="button"
                  data-gemini-choice="stage"
                  data-gemini-variant="simple"
                  data-gemini-active-class="stage-btn p-3 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left shadow-xs transition-all flex flex-col gap-1"
                  data-gemini-inactive-class="stage-btn p-3 rounded-xl border border-slate-200 bg-[#f8f9fa] hover:bg-slate-100 text-left transition-all flex flex-col gap-1"
                  aria-pressed={true}
                >
                  {" "}
                  <div className="flex items-center justify-between font-mono text-[11px] text-blue-700 font-bold">
                    {" "}
                    <span>{pageContent.text[90]}</span>{" "}
                    <GeminiIcon
                      name="radio_button_unchecked"
                      className="text-[16px] text-slate-400 gemini-choice-inactive"
                    />
                    <GeminiIcon
                      name="check_circle"
                      className="text-[16px] text-blue-600 gemini-choice-active"
                    />{" "}
                  </div>{" "}
                  <div className="font-display font-bold text-xs text-[#0b0f19]">
                    {pageContent.text[91]}
                  </div>{" "}
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {pageContent.text[92]}
                  </p>{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              {" "}
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all"
                type="submit"
              >
                {" "}
                {pageContent.text[93]} <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </button>{" "}
              <p className="text-xs text-slate-500 text-center sm:text-right max-w-xs font-mono">
                {" "}
                {pageContent.text[94]}{" "}
              </p>{" "}
            </div>{" "}
            <div
              className="hidden p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2"
              id="intake-toast"
            >
              {" "}
              <GeminiIcon name="task_alt" className="text-emerald-600 text-base" />{" "}
              <span>{pageContent.text[95]}</span>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function DirectCallSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-16 border-b border-[#e2e8f0]" id="direct-call">
      {" "}
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {" "}
        <div className="bg-[#f8f9fa] rounded-2xl border border-[#e2e8f0] p-8 sm:p-10 text-center flex flex-col items-center gap-4 shadow-xs">
          {" "}
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            {" "}
            <GeminiIcon name="calendar_today" className="text-xl" />{" "}
          </div>{" "}
          <div className="flex flex-col gap-1 max-w-lg">
            {" "}
            <div className="font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {" "}
              {pageContent.text[96]}{" "}
            </div>{" "}
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0b0f19] tracking-tight">
              {" "}
              {pageContent.text[97]}{" "}
            </h3>{" "}
            <p className="text-sm text-slate-600 font-medium"> {pageContent.text[98]} </p>{" "}
          </div>{" "}
          <div className="pt-1">
            {" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0b0f19] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm"
              href={localePath(locale, "/cta-page")}
            >
              {" "}
              {pageContent.text[99]} <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
            </a>{" "}
          </div>{" "}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-slate-500">
            {" "}
            <span>{pageContent.text[100]}</span>{" "}
            <span className="text-slate-300">{pageContent.text[101]}</span>{" "}
            <span>{pageContent.text[102]}</span>{" "}
            <span className="text-slate-300">{pageContent.text[103]}</span>{" "}
            <span>{pageContent.text[104]}</span>{" "}
            <span className="text-slate-300">{pageContent.text[105]}</span>{" "}
            <span>{pageContent.text[106]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ProcessSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] py-20 border-b border-[#e2e8f0]" id="process">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-10">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[107]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[108]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-600 font-medium"> {pageContent.text[109]} </p>{" "}
        </div>{" "}
        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-10 shadow-sm relative">
          {" "}
          <div className="relative py-2">
            {" "}
            <div className="hidden md:block absolute top-4 left-10 right-10 h-px bg-slate-200 z-0"></div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {" "}
              <div className="flex flex-col gap-2">
                {" "}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-1 shadow-xs">
                  {pageContent.text[110]}
                </div>{" "}
                <div className="font-mono text-xs font-bold text-blue-600 uppercase">
                  {pageContent.text[111]}
                </div>{" "}
                <h4 className="font-display font-bold text-base text-[#0b0f19]">
                  {pageContent.text[112]}
                </h4>{" "}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {" "}
                  {pageContent.text[113]}{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex flex-col gap-2">
                {" "}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-1 shadow-xs">
                  {pageContent.text[114]}
                </div>{" "}
                <div className="font-mono text-xs font-bold text-blue-600 uppercase">
                  {pageContent.text[115]}
                </div>{" "}
                <h4 className="font-display font-bold text-base text-[#0b0f19]">
                  {pageContent.text[116]}
                </h4>{" "}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {" "}
                  {pageContent.text[117]}{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex flex-col gap-2">
                {" "}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-1 shadow-xs">
                  {pageContent.text[118]}
                </div>{" "}
                <div className="font-mono text-xs font-bold text-blue-600 uppercase">
                  {pageContent.text[119]}
                </div>{" "}
                <h4 className="font-display font-bold text-base text-[#0b0f19]">
                  {pageContent.text[120]}
                </h4>{" "}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {" "}
                  {pageContent.text[121]}{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex flex-col gap-2">
                {" "}
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mb-1 shadow-xs">
                  {pageContent.text[122]}
                </div>{" "}
                <div className="font-mono text-xs font-bold text-emerald-600 uppercase">
                  {pageContent.text[123]}
                </div>{" "}
                <h4 className="font-display font-bold text-base text-[#0b0f19]">
                  {pageContent.text[124]}
                </h4>{" "}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {" "}
                  {pageContent.text[125]}{" "}
                </p>{" "}
              </div>{" "}
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
    <section className="w-full bg-white py-12 border-b border-[#e2e8f0]">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {" "}
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          {" "}
          <div className="flex items-start gap-3">
            {" "}
            <GeminiIcon name="lock" className="text-blue-600 text-xl pt-0.5" />{" "}
            <div className="flex flex-col gap-0.5">
              {" "}
              <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
                {" "}
                {pageContent.text[126]}{" "}
              </span>{" "}
              <p className="text-xs text-slate-600 font-medium"> {pageContent.text[127]} </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
            {" "}
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-xs">
              {pageContent.text[128]}
            </span>{" "}
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-xs">
              {pageContent.text[129]}
            </span>{" "}
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-xs">
              {pageContent.text[130]}
            </span>{" "}
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-xs">
              {pageContent.text[131]}
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
    <section className="w-full bg-[#f8f9fa] py-20 px-6 lg:px-12">
      {" "}
      <div className="max-w-5xl mx-auto">
        {" "}
        <div className="relative w-full rounded-3xl bg-[#0b0f19] text-white p-10 md:p-14 border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center text-center gap-6">
          {" "}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-60 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>{" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono text-xs tracking-wider uppercase">
            {" "}
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>{" "}
            {pageContent.text[132]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-xl">
            {" "}
            {pageContent.text[133]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-300 font-medium max-w-md"> {pageContent.text[134]} </p>{" "}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-[0_0_24px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all"
              href="#intake-form"
            >
              {" "}
              {pageContent.text[135]}{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              data-path="what-we-build"
              href={localePath(locale, "/what-we-build")}
            >
              {" "}
              {pageContent.text[136]} <GeminiIcon name="north_east" className="text-[18px]" />{" "}
            </a>{" "}
          </div>{" "}
          <div className="mt-4 pt-6 border-t border-slate-800 w-full flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-400">
            {" "}
            <span className="flex items-center gap-1.5">
              {" "}
              <GeminiIcon name="verified" className="text-blue-400 text-base" />{" "}
              {pageContent.text[137]}{" "}
            </span>{" "}
            <span className="text-slate-700 hidden sm:inline">{pageContent.text[138]}</span>{" "}
            <span className="flex items-center gap-1.5">
              {" "}
              <GeminiIcon name="timer" className="text-blue-400 text-base" />{" "}
              {pageContent.text[139]}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
