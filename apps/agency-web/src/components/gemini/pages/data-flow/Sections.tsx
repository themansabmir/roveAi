import { pageContent } from "@/content/gemini/data-flow"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function TheRightSystemDependsOnWhatYourBusinessNeedsNextSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="relative w-full bg-[#f8f9fa] border-b border-[#e2e8f0] py-20 lg:py-28 overflow-hidden">
      {" "}
      <div className="absolute inset-0 grid-pattern pointer-events-none"></div>{" "}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {" "}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> {pageContent.text[9]}{" "}
            </div>{" "}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b0f19] tracking-tight leading-[1.08]">
              {" "}
              {pageContent.text[10]}{" "}
              <span className="italic text-blue-600 font-serif font-normal">
                {pageContent.text[11]}
              </span>{" "}
            </h1>{" "}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl">
              {" "}
              {pageContent.text[12]}{" "}
            </p>{" "}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {" "}
              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all"
                data-path="start-a-build"
                href="#contact"
              >
                {" "}
                {pageContent.text[13]}{" "}
                <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
              </a>{" "}
              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#e2e8f0] text-slate-800 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm"
                data-path="what-we-build"
                href="#bottlenecks"
              >
                {" "}
                {pageContent.text[14]}{" "}
                <GeminiIcon name="expand_more" className="text-[18px]" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-6 flex justify-center">
            {" "}
            <div className="w-full max-w-lg bg-white rounded-2xl border border-[#e2e8f0] p-7 shadow-lg relative overflow-hidden">
              {" "}
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
                {" "}
                <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {pageContent.text[15]}
                </span>{" "}
                <span className="font-mono text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded font-semibold flex items-center gap-1.5">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>{" "}
                  {pageContent.text[16]}{" "}
                </span>{" "}
              </div>{" "}
              <div className="relative w-full h-64 flex items-center justify-between px-2">
                {" "}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                  viewBox="0 0 420 256"
                >
                  {" "}
                  <path
                    d="M 90 42 C 160 42, 175 128, 230 128"
                    fill="none"
                    stroke="#93c5fd"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  ></path>{" "}
                  <path
                    d="M 90 94 C 150 94, 175 128, 230 128"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                  ></path>{" "}
                  <path
                    d="M 90 162 C 150 162, 175 128, 230 128"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                  ></path>{" "}
                  <path
                    d="M 90 214 C 160 214, 175 128, 230 128"
                    fill="none"
                    stroke="#93c5fd"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  ></path>{" "}
                  <line stroke="#10b981" strokeWidth="2" x1="330" x2="385" y1="128" y2="128"></line>{" "}
                  <circle cx="230" cy="128" fill="#2563eb" r="3"></circle>{" "}
                </svg>{" "}
                <div className="flex flex-col justify-between h-full py-1 z-10 w-24">
                  {" "}
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] border border-slate-200 text-slate-800 font-mono text-[11px] font-semibold text-center shadow-xs">
                    {" "}
                    {pageContent.text[17]}{" "}
                  </div>{" "}
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] border border-slate-200 text-slate-800 font-mono text-[11px] font-semibold text-center shadow-xs">
                    {" "}
                    {pageContent.text[18]}{" "}
                  </div>{" "}
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] border border-slate-200 text-slate-800 font-mono text-[11px] font-semibold text-center shadow-xs">
                    {" "}
                    {pageContent.text[19]}{" "}
                  </div>{" "}
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] border border-slate-200 text-slate-800 font-mono text-[11px] font-semibold text-center shadow-xs">
                    {" "}
                    {pageContent.text[20]}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="z-10 flex flex-col items-center">
                  {" "}
                  <div className="w-32 h-32 rounded-2xl bg-[#0b0f19] text-white border-2 border-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.35)] ring-4 ring-blue-500/15 flex flex-col items-center justify-center text-center p-3">
                    {" "}
                    <GeminiIcon name="hub" className="text-blue-400 text-xl mb-1" />{" "}
                    <span className="font-mono text-[9px] text-blue-300 font-semibold uppercase tracking-wider">
                      {pageContent.text[21]}
                    </span>{" "}
                    <span className="font-display text-[11px] font-extrabold text-white leading-tight mt-1">
                      {pageContent.text[22]}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="z-10 flex flex-col justify-center">
                  {" "}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-[11px] font-bold text-center shadow-xs flex flex-col gap-0.5">
                    {" "}
                    <span className="text-[9px] text-emerald-700 tracking-wider">
                      {pageContent.text[23]}
                    </span>{" "}
                    <span>{pageContent.text[24]}</span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                {" "}
                <span>{pageContent.text[25]}</span>{" "}
                <span className="text-blue-600 font-semibold">{pageContent.text[26]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function BottlenecksSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] py-20 border-b border-[#e2e8f0]" id="bottlenecks">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[27]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[28]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm flex flex-col gap-6">
          {" "}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
            {" "}
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-2">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>{" "}
              {pageContent.text[29]}{" "}
            </button>{" "}
            <button className="px-4 py-2 rounded-lg bg-[#f8f9fa] hover:bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200 transition-colors">
              {" "}
              {pageContent.text[30]}{" "}
            </button>{" "}
            <button className="px-4 py-2 rounded-lg bg-[#f8f9fa] hover:bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200 transition-colors">
              {" "}
              {pageContent.text[31]}{" "}
            </button>{" "}
            <button className="px-4 py-2 rounded-lg bg-[#f8f9fa] hover:bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200 transition-colors">
              {" "}
              {pageContent.text[32]}{" "}
            </button>{" "}
            <button className="px-4 py-2 rounded-lg bg-[#f8f9fa] hover:bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200 transition-colors">
              {" "}
              {pageContent.text[33]}{" "}
            </button>{" "}
          </div>{" "}
          <div className="p-6 rounded-xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {" "}
            <div className="md:col-span-8 flex flex-col gap-3">
              {" "}
              <div className="flex items-center gap-2 text-xs font-mono text-rose-600 font-semibold">
                {" "}
                <GeminiIcon name="warning" className="text-sm" /> {pageContent.text[34]}{" "}
              </div>{" "}
              <p className="text-sm sm:text-base text-slate-800 font-medium">
                {" "}
                {pageContent.text[35]}{" "}
              </p>{" "}
              <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold pt-1">
                {" "}
                <GeminiIcon name="precision_manufacturing" className="text-sm" />{" "}
                {pageContent.text[36]}{" "}
                <span className="font-normal text-slate-700">{pageContent.text[37]}</span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="md:col-span-4 flex md:justify-end">
              {" "}
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-[#e2e8f0] text-blue-600 font-mono text-xs font-bold hover:border-blue-400 hover:shadow-xs transition-all"
                href="#pipeline"
              >
                {" "}
                {pageContent.text[38]} <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function YouDonTNeedMoreToolsYouNeedTheMachineBehindThemSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="w-full bg-white py-20 border-b border-[#e2e8f0]">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[39]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-600 font-medium"> {pageContent.text[40]} </p>{" "}
        </div>{" "}
        <div className="w-full bg-[#f8f9fa] rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
          {" "}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {" "}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {" "}
              <div className="flex items-center justify-between pb-1 border-b border-rose-200">
                {" "}
                <span className="font-mono text-[11px] font-bold text-rose-600 uppercase">
                  {pageContent.text[41]}
                </span>{" "}
                <span className="font-mono text-[10px] text-rose-500">
                  {pageContent.text[42]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-wrap gap-2 p-3 bg-white rounded-xl border border-rose-200/60">
                {" "}
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                  {pageContent.text[43]}
                </span>{" "}
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                  {pageContent.text[44]}
                </span>{" "}
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                  {pageContent.text[45]}
                </span>{" "}
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                  {pageContent.text[46]}
                </span>{" "}
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                  {pageContent.text[47]}
                </span>{" "}
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs border border-slate-200">
                  {pageContent.text[48]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="lg:col-span-2 flex justify-center py-2">
              {" "}
              <div className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-1">
                {" "}
                <span>{pageContent.text[49]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </div>{" "}
            </div>{" "}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {" "}
              <div className="flex items-center justify-between pb-1 border-b border-blue-200">
                {" "}
                <span className="font-mono text-[11px] font-bold text-blue-700 uppercase">
                  {pageContent.text[50]}
                </span>{" "}
                <span className="font-mono text-[10px] text-emerald-600 font-bold">
                  {pageContent.text[51]}
                </span>{" "}
              </div>{" "}
              <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between gap-1 overflow-x-auto shadow-xs text-center font-mono text-[11px]">
                {" "}
                <div className="px-2 py-1 bg-blue-50 text-blue-900 font-bold rounded">
                  {pageContent.text[52]}
                </div>{" "}
                <span className="text-blue-400">{pageContent.text[53]}</span>{" "}
                <div className="px-2 py-1 bg-blue-50 text-blue-900 font-bold rounded">
                  {pageContent.text[54]}
                </div>{" "}
                <span className="text-blue-400">{pageContent.text[55]}</span>{" "}
                <div className="px-2 py-1 bg-blue-50 text-blue-900 font-bold rounded">
                  {pageContent.text[56]}
                </div>{" "}
                <span className="text-blue-400">{pageContent.text[57]}</span>{" "}
                <div className="px-2 py-1 bg-blue-50 text-blue-900 font-bold rounded">
                  {pageContent.text[58]}
                </div>{" "}
                <span className="text-blue-400">{pageContent.text[59]}</span>{" "}
                <div className="px-2 py-1 bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 rounded">
                  {pageContent.text[60]}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function PipelineSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="w-full bg-[#0b0f19] text-white py-24 relative overflow-hidden border-b border-slate-800"
      id="pipeline"
    >
      {" "}
      <div className="absolute inset-0 grid-pattern-dark pointer-events-none"></div>{" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col gap-10">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-400 tracking-widest uppercase">
            {" "}
            {pageContent.text[61]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {" "}
            {pageContent.text[62]}{" "}
            <span className="italic text-blue-400 font-serif font-normal">
              {pageContent.text[63]}
            </span>{" "}
          </h2>{" "}
          <p className="text-base text-slate-400 font-medium"> {pageContent.text[64]} </p>{" "}
        </div>{" "}
        <div className="w-full bg-slate-900/90 rounded-2xl border border-white/10 p-6 lg:p-8 backdrop-blur-md">
          {" "}
          <div className="relative w-full py-4">
            {" "}
            <div className="hidden sm:block absolute top-7 left-6 right-6 h-0.5 bg-blue-600/40 -translate-y-1/2 z-0"></div>{" "}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
              {" "}
              <div className="flex flex-col items-center text-center gap-1.5">
                {" "}
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {pageContent.text[65]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-white mt-1">
                  {pageContent.text[66]}
                </span>{" "}
                <span className="text-[10px] font-mono text-blue-300">
                  {pageContent.text[67]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col items-center text-center gap-1.5">
                {" "}
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {pageContent.text[68]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-white mt-1">
                  {pageContent.text[69]}
                </span>{" "}
                <span className="text-[10px] font-mono text-blue-300">
                  {pageContent.text[70]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col items-center text-center gap-1.5">
                {" "}
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {pageContent.text[71]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-white mt-1">
                  {pageContent.text[72]}
                </span>{" "}
                <span className="text-[10px] font-mono text-blue-300">
                  {pageContent.text[73]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col items-center text-center gap-1.5">
                {" "}
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {pageContent.text[74]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-white mt-1">
                  {pageContent.text[75]}
                </span>{" "}
                <span className="text-[10px] font-mono text-blue-300">
                  {pageContent.text[76]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col items-center text-center gap-1.5">
                {" "}
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {pageContent.text[77]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-white mt-1">
                  {pageContent.text[78]}
                </span>{" "}
                <span className="text-[10px] font-mono text-blue-300">
                  {pageContent.text[79]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col items-center text-center gap-1.5">
                {" "}
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.7)]">
                  {pageContent.text[80]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-emerald-400 mt-1">
                  {pageContent.text[81]}
                </span>{" "}
                <span className="text-[10px] font-mono text-emerald-300">
                  {pageContent.text[82]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {" "}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
            {" "}
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>{" "}
            <span className="font-mono text-xs font-bold text-white">
              {pageContent.text[83]}
            </span>{" "}
          </div>{" "}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
            {" "}
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>{" "}
            <span className="font-mono text-xs font-bold text-white">
              {pageContent.text[84]}
            </span>{" "}
          </div>{" "}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
            {" "}
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>{" "}
            <span className="font-mono text-xs font-bold text-white">
              {pageContent.text[85]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function MarketingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-20 border-b border-[#e2e8f0]" id="marketing">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[86]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[87]}{" "}
            <span className="italic text-blue-600 font-serif font-normal">
              {pageContent.text[88]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="w-full bg-[#f8f9fa] rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {" "}
            <div className="md:col-span-4 flex flex-col gap-2">
              {" "}
              <span className="font-mono text-[11px] font-bold text-slate-500 uppercase">
                {pageContent.text[89]}
              </span>{" "}
              <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-700">
                {pageContent.text[90]}
              </div>{" "}
              <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-700">
                {pageContent.text[91]}
              </div>{" "}
              <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-700">
                {pageContent.text[92]}
              </div>{" "}
              <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-700">
                {pageContent.text[93]}
              </div>{" "}
            </div>{" "}
            <div className="md:col-span-1 flex justify-center text-blue-500">
              {" "}
              <GeminiIcon name="arrow_forward" className="text-xl" />{" "}
            </div>{" "}
            <div className="md:col-span-7 flex flex-col gap-4">
              {" "}
              <div className="p-5 rounded-xl bg-white border-2 border-blue-500 shadow-sm flex flex-col gap-2">
                {" "}
                <span className="font-mono text-[10px] text-blue-600 font-bold uppercase">
                  {pageContent.text[94]}
                </span>{" "}
                <p className="text-sm text-slate-800 font-medium">{pageContent.text[95]}</p>{" "}
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs font-semibold flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[96]}</span>{" "}
                  <span className="text-emerald-700">{pageContent.text[97]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs">
                  {pageContent.text[98]}
                </span>{" "}
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs">
                  {pageContent.text[99]}
                </span>{" "}
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs">
                  {pageContent.text[100]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function RevopsSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] py-20 border-b border-[#e2e8f0]" id="revops">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[101]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[102]}{" "}
            <span className="italic text-blue-600 font-serif font-normal">
              {pageContent.text[103]}
            </span>{" "}
          </h2>{" "}
          <p className="text-base text-slate-600 font-medium"> {pageContent.text[104]} </p>{" "}
        </div>{" "}
        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {" "}
            <div className="flex flex-col gap-2">
              {" "}
              <span className="text-slate-400 font-bold uppercase tracking-wider mb-1">
                {pageContent.text[105]}
              </span>{" "}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[106]}</span>{" "}
                <span className="text-blue-600 font-semibold text-[10px]">
                  {pageContent.text[107]}
                </span>{" "}
              </div>{" "}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[108]}</span>{" "}
                <span className="text-blue-600 font-semibold text-[10px]">
                  {pageContent.text[109]}
                </span>{" "}
              </div>{" "}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[110]}</span>{" "}
                <span className="text-blue-600 font-semibold text-[10px]">
                  {pageContent.text[111]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex flex-col gap-2">
              {" "}
              <span className="text-slate-400 font-bold uppercase tracking-wider mb-1">
                {pageContent.text[112]}
              </span>{" "}
              <div className="p-4 bg-blue-50/60 border border-blue-300 rounded-xl flex flex-col justify-center gap-2 h-full text-center">
                {" "}
                <span className="font-bold text-slate-900">{pageContent.text[113]}</span>{" "}
                <span className="text-slate-600 text-[11px]">{pageContent.text[114]}</span>{" "}
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold self-center">
                  {pageContent.text[115]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex flex-col gap-2">
              {" "}
              <span className="text-slate-400 font-bold uppercase tracking-wider mb-1">
                {pageContent.text[116]}
              </span>{" "}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[117]}</span>{" "}
                <span className="text-emerald-600 font-semibold text-[10px]">
                  {pageContent.text[118]}
                </span>{" "}
              </div>{" "}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[119]}</span>{" "}
                <span className="text-emerald-600 font-semibold text-[10px]">
                  {pageContent.text[120]}
                </span>{" "}
              </div>{" "}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[121]}</span>{" "}
                <span className="text-emerald-600 font-semibold text-[10px]">
                  {pageContent.text[122]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function AiSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-20 border-b border-[#e2e8f0]" id="ai">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[123]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[124]}{" "}
            <span className="italic text-blue-600 font-serif font-normal">
              {pageContent.text[125]}
            </span>{" "}
          </h2>{" "}
          <p className="text-base text-slate-600 font-medium"> {pageContent.text[126]} </p>{" "}
        </div>{" "}
        <div className="w-full bg-[#f8f9fa] rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm flex flex-col gap-6">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col gap-1 shadow-xs">
              {" "}
              <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                {pageContent.text[127]}
              </span>{" "}
              <span className="font-display font-bold text-sm text-slate-900">
                {pageContent.text[128]}
              </span>{" "}
              <span className="text-xs text-slate-500">{pageContent.text[129]}</span>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-600 flex flex-col gap-1 shadow-xs">
              {" "}
              <span className="font-mono text-[10px] text-blue-600 font-bold uppercase">
                {pageContent.text[130]}
              </span>{" "}
              <span className="font-display font-bold text-sm text-blue-950">
                {pageContent.text[131]}
              </span>{" "}
              <span className="text-xs text-blue-700">{pageContent.text[132]}</span>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col gap-1 shadow-xs">
              {" "}
              <span className="font-mono text-[10px] text-indigo-600 font-bold uppercase">
                {pageContent.text[133]}
              </span>{" "}
              <span className="font-display font-bold text-sm text-slate-900">
                {pageContent.text[134]}
              </span>{" "}
              <span className="text-xs text-slate-500">{pageContent.text[135]}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 font-mono text-xs">
            {" "}
            <span className="text-slate-500">{pageContent.text[136]}</span>{" "}
            <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
              {pageContent.text[137]}
            </span>{" "}
            <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
              {pageContent.text[138]}
            </span>{" "}
            <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
              {pageContent.text[139]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ApproachSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] py-20 border-b border-[#e2e8f0]" id="approach">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[140]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[141]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-600 font-medium"> {pageContent.text[142]} </p>{" "}
        </div>{" "}
        <div className="w-full bg-white rounded-2xl border border-[#e2e8f0] p-6 lg:p-10 shadow-sm relative">
          {" "}
          <div className="relative py-2">
            {" "}
            <div className="hidden sm:block absolute top-4 left-10 right-10 h-px bg-slate-200 z-0"></div>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
              {" "}
              <div className="flex flex-col gap-1">
                {" "}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
                  {pageContent.text[143]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-blue-600">
                  {pageContent.text[144]}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-900">
                  {pageContent.text[145]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col gap-1">
                {" "}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
                  {pageContent.text[146]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-blue-600">
                  {pageContent.text[147]}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-900">
                  {pageContent.text[148]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col gap-1">
                {" "}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
                  {pageContent.text[149]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-blue-600">
                  {pageContent.text[150]}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-900">
                  {pageContent.text[151]}
                </span>{" "}
              </div>{" "}
              <div className="flex flex-col gap-1">
                {" "}
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center mb-2">
                  {pageContent.text[152]}
                </div>{" "}
                <span className="font-mono text-xs font-bold text-emerald-600">
                  {pageContent.text[153]}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-900">
                  {pageContent.text[154]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function DifferentTeamsOneConnectedSystemSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-20 border-b border-[#e2e8f0]">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2 max-w-2xl">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[155]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[156]}{" "}
            <span className="italic text-blue-600 font-serif font-normal">
              {pageContent.text[157]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="w-full bg-[#f8f9fa] rounded-2xl border border-[#e2e8f0] p-6 lg:p-8 shadow-sm">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {" "}
            <div className="md:col-span-4 flex flex-wrap gap-2 font-mono text-xs">
              {" "}
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                {pageContent.text[158]}
              </span>{" "}
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                {pageContent.text[159]}
              </span>{" "}
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                {pageContent.text[160]}
              </span>{" "}
              <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                {pageContent.text[161]}
              </span>{" "}
            </div>{" "}
            <div className="md:col-span-4 flex justify-center">
              {" "}
              <div className="p-4 rounded-xl bg-[#0b0f19] text-white border-2 border-blue-600 text-center w-full">
                {" "}
                <span className="font-display font-bold text-sm tracking-wide">
                  {pageContent.text[162]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="md:col-span-4 flex flex-col gap-2 font-mono text-xs">
              {" "}
              <div className="px-3 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                {pageContent.text[163]}
              </div>{" "}
              <div className="px-3 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                {pageContent.text[164]}
              </div>{" "}
              <div className="px-3 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                {pageContent.text[165]}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function BeforeVsAfterSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] py-20 border-b border-[#e2e8f0]">
      {" "}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
        {" "}
        <div className="flex flex-col gap-2">
          {" "}
          <div className="font-mono text-xs font-semibold text-blue-600 tracking-widest uppercase">
            {" "}
            {pageContent.text[166]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0b0f19] tracking-tight">
            {" "}
            {pageContent.text[167]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {" "}
          <div className="p-6 rounded-2xl bg-white border border-rose-200 flex flex-col gap-4">
            {" "}
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 font-mono text-xs font-bold text-rose-700">
              {" "}
              <span>{pageContent.text[168]}</span>{" "}
              <span className="text-[10px] bg-rose-50 px-2 py-0.5 rounded text-rose-600">
                {pageContent.text[169]}
              </span>{" "}
            </div>{" "}
            <div className="flex flex-col gap-2.5 font-mono text-xs text-slate-700">
              {" "}
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                {" "}
                <GeminiIcon name="close" className="text-rose-500 text-base" />{" "}
                <span>{pageContent.text[170]}</span>{" "}
              </div>{" "}
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                {" "}
                <GeminiIcon name="close" className="text-rose-500 text-base" />{" "}
                <span>{pageContent.text[171]}</span>{" "}
              </div>{" "}
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center gap-2">
                {" "}
                <GeminiIcon name="close" className="text-rose-500 text-base" />{" "}
                <span>{pageContent.text[172]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-white border-2 border-blue-600 flex flex-col gap-4 shadow-sm">
            {" "}
            <div className="flex items-center justify-between pb-2 border-b border-blue-100 font-mono text-xs font-bold text-blue-900">
              {" "}
              <span>{pageContent.text[173]}</span>{" "}
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                {pageContent.text[174]}
              </span>{" "}
            </div>{" "}
            <div className="flex flex-col gap-2.5 font-mono text-xs text-slate-900">
              {" "}
              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center gap-2">
                {" "}
                <GeminiIcon name="check_circle" className="text-blue-600 text-base" />{" "}
                <span>{pageContent.text[175]}</span>{" "}
              </div>{" "}
              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center gap-2">
                {" "}
                <GeminiIcon name="check_circle" className="text-blue-600 text-base" />{" "}
                <span>{pageContent.text[176]}</span>{" "}
              </div>{" "}
              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center gap-2">
                {" "}
                <GeminiIcon name="check_circle" className="text-blue-600 text-base" />{" "}
                <span>{pageContent.text[177]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ContactSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] py-20 px-6 lg:px-12" id="contact">
      {" "}
      <div className="max-w-5xl mx-auto">
        {" "}
        <div className="relative w-full rounded-3xl bg-[#0b0f19] text-white p-10 md:p-14 border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center text-center gap-6">
          {" "}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-60 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>{" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 font-mono text-xs tracking-wider uppercase">
            {" "}
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> {pageContent.text[178]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-xl">
            {" "}
            {pageContent.text[179]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-300 font-medium max-w-md"> {pageContent.text[180]} </p>{" "}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-[0_0_24px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all"
              data-path="start-a-build"
              href={localePath(locale, "/cta-page")}
            >
              {" "}
              {pageContent.text[181]}{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-transparent border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              data-path="what-we-build"
              href={localePath(locale, "/what-we-build")}
            >
              {" "}
              {pageContent.text[182]}{" "}
            </a>{" "}
          </div>{" "}
          <div className="mt-4 pt-6 border-t border-slate-800 w-full flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-400">
            {" "}
            <span className="flex items-center gap-1.5">
              {" "}
              <GeminiIcon name="verified" className="text-blue-400 text-base" />{" "}
              {pageContent.text[183]}{" "}
            </span>{" "}
            <span className="text-slate-700 hidden sm:inline">{pageContent.text[184]}</span>{" "}
            <span className="flex items-center gap-1.5">
              {" "}
              <GeminiIcon name="timer" className="text-blue-400 text-base" />{" "}
              {pageContent.text[185]}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
