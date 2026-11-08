import { pageContent } from "@/content/gemini/why-us"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function AIShouldChangeHowYourBusinessWorksNotJustWhatYourSoftwareCanDoSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="relative w-full pt-14 md:pt-20 pb-16 md:pb-24 border-b border-slate-200/80 overflow-hidden">
      {" "}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none"></div>{" "}
      <div className="relative max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {" "}
          <div className="lg:col-span-6 flex flex-col items-start">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-6">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>{" "}
              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
                {pageContent.text[9]}
              </span>{" "}
            </div>{" "}
            <h1 className="font-headline-lg md:font-display-lg text-3xl sm:text-4xl lg:text-[50px] lg:leading-[58px] font-extrabold tracking-tight text-[#0B0F19] text-balance">
              {" "}
              {pageContent.text[10]}{" "}
              <span className="block mt-2 font-editorial-italic font-normal italic text-blue-600">
                {pageContent.text[11]}
              </span>{" "}
            </h1>{" "}
            <p className="mt-5 font-body-lg text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
              {" "}
              {pageContent.text[12]}{" "}
            </p>{" "}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {" "}
              <a
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-label-ui text-xs md:text-sm font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:shadow-[0_4px_20px_rgba(37,99,235,0.35)] transition-all"
                data-path="book-a-discovery"
                href={localePath(locale, "/contact")}
              >
                {" "}
                {pageContent.text[13]}{" "}
                <span className="ml-1.5 text-base leading-none">{pageContent.text[14]}</span>{" "}
              </a>{" "}
              <a
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white border border-slate-200/90 text-slate-800 font-label-ui text-xs md:text-sm font-semibold shadow-xs hover:bg-slate-50 transition-all"
                data-path="what-we-build"
                href={localePath(locale, "/what-we-build")}
              >
                {" "}
                {pageContent.text[15]}{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-6">
            {" "}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 md:p-7 relative overflow-hidden">
              {" "}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                  <span className="font-label-mono-sm text-[11px] text-slate-600 font-semibold tracking-wider uppercase">
                    {pageContent.text[16]}
                  </span>{" "}
                </div>{" "}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 font-label-mono-sm text-[11px] font-medium">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                  {pageContent.text[17]}{" "}
                </span>{" "}
              </div>{" "}
              <div className="relative py-4">
                {" "}
                <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-slate-200 via-blue-200 to-emerald-200 -translate-y-1/2 z-0"></div>{" "}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
                  {" "}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col items-center text-center">
                    {" "}
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
                      {" "}
                      <GeminiIcon name="domain" className="text-[16px]" />{" "}
                    </span>{" "}
                    <span className="font-label-mono-sm text-[10px] text-slate-400 font-bold uppercase">
                      {pageContent.text[18]}
                    </span>{" "}
                    <span className="font-headline-sm text-xs font-bold text-slate-900 mt-0.5">
                      {pageContent.text[19]}
                    </span>{" "}
                    <span className="font-body-sm text-[10px] text-slate-500 mt-1">
                      {pageContent.text[20]}
                    </span>{" "}
                  </div>{" "}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col items-center text-center">
                    {" "}
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                      {" "}
                      <GeminiIcon name="sensors" className="text-[16px]" />{" "}
                    </span>{" "}
                    <span className="font-label-mono-sm text-[10px] text-blue-600 font-bold uppercase">
                      {pageContent.text[21]}
                    </span>{" "}
                    <span className="font-headline-sm text-xs font-bold text-slate-900 mt-0.5">
                      {pageContent.text[22]}
                    </span>{" "}
                    <span className="font-body-sm text-[10px] text-slate-500 mt-1">
                      {pageContent.text[23]}
                    </span>{" "}
                  </div>{" "}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col items-center text-center">
                    {" "}
                    <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                      {" "}
                      <GeminiIcon name="psychology" className="text-[16px]" />{" "}
                    </span>{" "}
                    <span className="font-label-mono-sm text-[10px] text-purple-600 font-bold uppercase">
                      {pageContent.text[24]}
                    </span>{" "}
                    <span className="font-headline-sm text-xs font-bold text-slate-900 mt-0.5">
                      {pageContent.text[25]}
                    </span>{" "}
                    <span className="font-body-sm text-[10px] text-slate-500 mt-1">
                      {pageContent.text[26]}
                    </span>{" "}
                  </div>{" "}
                  <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-xs flex flex-col items-center text-center bg-blue-50/20">
                    {" "}
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs">
                      {" "}
                      <GeminiIcon name="hub" className="text-[16px]" />{" "}
                    </span>{" "}
                    <span className="font-label-mono-sm text-[10px] text-blue-700 font-bold uppercase">
                      {pageContent.text[27]}
                    </span>{" "}
                    <span className="font-headline-sm text-xs font-bold text-blue-950 mt-0.5">
                      {pageContent.text[28]}
                    </span>{" "}
                    <span className="font-body-sm text-[10px] text-blue-600 mt-1">
                      {pageContent.text[29]}
                    </span>{" "}
                  </div>{" "}
                  <div className="bg-white border border-emerald-200 rounded-xl p-3 shadow-xs flex flex-col items-center text-center col-span-2 sm:col-span-1">
                    {" "}
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                      {" "}
                      <GeminiIcon name="trending_up" className="text-[16px]" />{" "}
                    </span>{" "}
                    <span className="font-label-mono-sm text-[10px] text-emerald-600 font-bold uppercase">
                      {pageContent.text[30]}
                    </span>{" "}
                    <span className="font-headline-sm text-xs font-bold text-slate-900 mt-0.5">
                      {pageContent.text[31]}
                    </span>{" "}
                    <span className="font-body-sm text-[10px] text-emerald-700 mt-1">
                      {pageContent.text[32]}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between font-label-mono-sm text-[11px] text-slate-500">
                {" "}
                <span className="flex items-center gap-1.5">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                  {pageContent.text[33]}{" "}
                </span>{" "}
                <span className="text-blue-600 font-semibold">{pageContent.text[34]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function MostBusinessesDonTNeedAnotherToolTheyNeedTheirSystemsToWorkTogetherSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {" "}
          <div className="lg:col-span-5">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-4">
              {" "}
              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
                {pageContent.text[35]}
              </span>{" "}
            </div>{" "}
            <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight leading-snug">
              {" "}
              {pageContent.text[36]} <br />{" "}
              <span className="font-editorial-italic font-normal italic text-slate-500">
                {pageContent.text[37]}
              </span>{" "}
            </h2>{" "}
            <p className="mt-4 font-body-md text-sm md:text-base text-slate-600 leading-relaxed">
              {" "}
              {pageContent.text[38]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="lg:col-span-7">
            {" "}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md shadow-slate-200/40">
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {" "}
                <div className="md:col-span-5 bg-rose-50/50 border border-rose-200/60 rounded-xl p-4">
                  {" "}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-100">
                    {" "}
                    <span className="font-label-mono-sm text-[10px] uppercase font-bold text-rose-700">
                      {pageContent.text[39]}
                    </span>{" "}
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-rose-100 text-xs">
                      {" "}
                      <span className="font-medium text-slate-700">
                        {pageContent.text[40]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {pageContent.text[41]}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-rose-100 text-xs">
                      {" "}
                      <span className="font-medium text-slate-700">
                        {pageContent.text[42]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {pageContent.text[43]}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-rose-100 text-xs">
                      {" "}
                      <span className="font-medium text-slate-700">
                        {pageContent.text[44]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {pageContent.text[45]}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-rose-100 text-xs">
                      {" "}
                      <span className="font-medium text-slate-700">
                        {pageContent.text[46]}
                      </span>{" "}
                      <span className="font-label-mono-sm text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {pageContent.text[47]}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                  {" "}
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                    {" "}
                    <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="md:col-span-5 bg-blue-50/50 border border-blue-200/80 rounded-xl p-4">
                  {" "}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-100">
                    {" "}
                    <span className="font-label-mono-sm text-[10px] uppercase font-bold text-blue-700">
                      {pageContent.text[48]}
                    </span>{" "}
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <div className="p-2.5 rounded bg-white border border-blue-100 shadow-2xs">
                      {" "}
                      <div className="font-headline-sm text-xs font-bold text-slate-900">
                        {pageContent.text[49]}
                      </div>{" "}
                      <span className="font-label-mono-sm text-[10px] text-blue-600 block mt-0.5">
                        {pageContent.text[50]}
                      </span>{" "}
                    </div>{" "}
                    <div className="p-2.5 rounded bg-white border border-blue-100 shadow-2xs">
                      {" "}
                      <div className="font-headline-sm text-xs font-bold text-slate-900">
                        {pageContent.text[51]}
                      </div>{" "}
                      <span className="font-label-mono-sm text-[10px] text-blue-600 block mt-0.5">
                        {pageContent.text[52]}
                      </span>{" "}
                    </div>{" "}
                    <div className="p-2.5 rounded bg-white border border-blue-100 shadow-2xs">
                      {" "}
                      <div className="font-headline-sm text-xs font-bold text-slate-900">
                        {pageContent.text[53]}
                      </div>{" "}
                      <span className="font-label-mono-sm text-[10px] text-emerald-600 font-medium block mt-0.5">
                        {pageContent.text[54]}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HowWeThinkAboutRevenueArchitectureSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="max-w-2xl mb-12">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-3">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
              {pageContent.text[55]}
            </span>{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[56]}{" "}
            <span className="font-editorial-italic font-normal italic text-blue-600">
              {pageContent.text[57]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {" "}
          <div className="md:col-span-7 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <span className="font-label-mono-sm text-[11px] text-blue-600 font-bold uppercase tracking-wider">
                  {pageContent.text[58]}
                </span>{" "}
                <GeminiIcon name="developer_board" className="text-blue-600 text-[22px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-md text-xl md:text-2xl font-bold text-slate-950 mb-3">
                {" "}
                {pageContent.text[59]}{" "}
              </h3>{" "}
              <p className="font-body-md text-slate-600 leading-relaxed text-sm md:text-base">
                {" "}
                {pageContent.text[60]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-label-mono-sm text-[11px] text-slate-500">
              {" "}
              <span>{pageContent.text[61]}</span>{" "}
              <span className="text-blue-600 font-semibold">{pageContent.text[62]}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="md:col-span-5 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <span className="font-label-mono-sm text-[11px] text-purple-600 font-bold uppercase tracking-wider">
                  {pageContent.text[63]}
                </span>{" "}
                <GeminiIcon
                  name="precision_manufacturing"
                  className="text-purple-600 text-[22px]"
                />{" "}
              </div>{" "}
              <h3 className="font-headline-md text-xl md:text-2xl font-bold text-slate-950 mb-3">
                {" "}
                {pageContent.text[64]}{" "}
              </h3>{" "}
              <p className="font-body-md text-slate-600 leading-relaxed text-sm md:text-base">
                {" "}
                {pageContent.text[65]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-label-mono-sm text-[11px] text-slate-500">
              {" "}
              <span>{pageContent.text[66]}</span>{" "}
              <span className="text-purple-600 font-semibold">{pageContent.text[67]}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="md:col-span-6 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <span className="font-label-mono-sm text-[11px] text-emerald-600 font-bold uppercase tracking-wider">
                  {pageContent.text[68]}
                </span>{" "}
                <GeminiIcon name="analytics" className="text-emerald-600 text-[20px]" />{" "}
              </div>{" "}
              <h4 className="font-headline-sm text-base md:text-lg font-bold text-slate-900 mb-2">
                {pageContent.text[69]}
              </h4>{" "}
              <p className="font-body-sm text-xs md:text-sm text-slate-600 leading-relaxed">
                {" "}
                {pageContent.text[70]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-3 border-t border-slate-100 font-label-mono-sm text-[11px] text-emerald-700 font-medium">
              {" "}
              {pageContent.text[71]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="md:col-span-6 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <span className="font-label-mono-sm text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                  {pageContent.text[72]}
                </span>{" "}
                <GeminiIcon name="lock_open" className="text-slate-700 text-[20px]" />{" "}
              </div>{" "}
              <h4 className="font-headline-sm text-base md:text-lg font-bold text-slate-900 mb-2">
                {pageContent.text[73]}
              </h4>{" "}
              <p className="font-body-sm text-xs md:text-sm text-slate-600 leading-relaxed">
                {" "}
                {pageContent.text[74]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="mt-4 pt-3 border-t border-slate-100 font-label-mono-sm text-[11px] text-slate-700 font-medium">
              {" "}
              {pageContent.text[75]}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function TechnologyFollowsTheBusinessNotTheOtherWayAroundSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-3">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
              {pageContent.text[76]}
            </span>{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[77]} <br className="hidden sm:inline" />{" "}
            <span className="font-editorial-italic font-normal italic text-slate-600">
              {pageContent.text[78]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
          {" "}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {" "}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              {" "}
              <span className="font-label-mono-sm text-[10px] text-blue-600 font-bold block mb-1">
                {pageContent.text[79]}
              </span>{" "}
              <div className="font-headline-sm text-xs font-bold text-slate-900">
                {pageContent.text[80]}
              </div>{" "}
              <span className="font-body-sm text-[10px] text-slate-500">
                {pageContent.text[81]}
              </span>{" "}
            </div>{" "}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              {" "}
              <span className="font-label-mono-sm text-[10px] text-indigo-600 font-bold block mb-1">
                {pageContent.text[82]}
              </span>{" "}
              <div className="font-headline-sm text-xs font-bold text-slate-900">
                {pageContent.text[83]}
              </div>{" "}
              <span className="font-body-sm text-[10px] text-slate-500">
                {pageContent.text[84]}
              </span>{" "}
            </div>{" "}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              {" "}
              <span className="font-label-mono-sm text-[10px] text-purple-600 font-bold block mb-1">
                {pageContent.text[85]}
              </span>{" "}
              <div className="font-headline-sm text-xs font-bold text-slate-900">
                {pageContent.text[86]}
              </div>{" "}
              <span className="font-body-sm text-[10px] text-slate-500">
                {pageContent.text[87]}
              </span>{" "}
            </div>{" "}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              {" "}
              <span className="font-label-mono-sm text-[10px] text-sky-600 font-bold block mb-1">
                {pageContent.text[88]}
              </span>{" "}
              <div className="font-headline-sm text-xs font-bold text-slate-900">
                {pageContent.text[89]}
              </div>{" "}
              <span className="font-body-sm text-[10px] text-slate-500">
                {pageContent.text[90]}
              </span>{" "}
            </div>{" "}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
              {" "}
              <span className="font-label-mono-sm text-[10px] text-emerald-600 font-bold block mb-1">
                {pageContent.text[91]}
              </span>{" "}
              <div className="font-headline-sm text-xs font-bold text-slate-900">
                {pageContent.text[92]}
              </div>{" "}
              <span className="font-body-sm text-[10px] text-slate-500">
                {pageContent.text[93]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center justify-center my-3 text-slate-400">
            {" "}
            <GeminiIcon name="expand_more" className="text-[24px]" />{" "}
          </div>{" "}
          <div className="bg-[#0B0F19] text-white rounded-xl p-5 text-center shadow-lg my-2">
            {" "}
            <div className="inline-block px-3 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-label-mono-sm text-[10px] uppercase font-bold mb-1">
              {" "}
              {pageContent.text[94]}{" "}
            </div>{" "}
            <h3 className="font-headline-md text-lg md:text-xl font-bold tracking-tight">
              {pageContent.text[95]}
            </h3>{" "}
            <p className="font-label-mono-sm text-[11px] text-slate-400 mt-1">
              {pageContent.text[96]}
            </p>{" "}
          </div>{" "}
          <div className="flex items-center justify-center my-3 text-blue-600">
            {" "}
            <GeminiIcon name="expand_more" className="text-[24px]" />{" "}
          </div>{" "}
          <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-4 text-center">
            {" "}
            <div className="font-headline-sm text-sm font-bold text-blue-950 uppercase tracking-wider mb-1">
              {" "}
              {pageContent.text[97]}{" "}
            </div>{" "}
            <div className="flex flex-wrap items-center justify-center gap-3 font-label-mono-sm text-[11px] text-blue-700">
              {" "}
              <span>{pageContent.text[98]}</span> {pageContent.text[99]}{" "}
              <span>{pageContent.text[100]}</span> {pageContent.text[101]}{" "}
              <span>{pageContent.text[102]}</span> {pageContent.text[103]}{" "}
              <span>{pageContent.text[104]}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function AutomationHandlesTheRepeatablePeopleHandleWhatMattersSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="max-w-2xl mb-12">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-3">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
              {pageContent.text[105]}
            </span>{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[106]} <br className="hidden sm:inline" />{" "}
            <span className="font-editorial-italic font-normal italic text-blue-600">
              {pageContent.text[107]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {" "}
          <div className="bg-white rounded-2xl p-6 border border-blue-200/80 shadow-xs flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                  <span className="font-label-mono-sm text-xs uppercase font-bold text-blue-700 tracking-wider">
                    {pageContent.text[108]}
                  </span>{" "}
                </div>{" "}
                <span className="font-label-mono-sm text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                  {pageContent.text[109]}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  {" "}
                  <GeminiIcon
                    name="sensors"
                    className="text-blue-600 text-[18px] shrink-0 mt-0.5"
                  />{" "}
                  <div>
                    {" "}
                    <div className="font-headline-sm text-xs font-bold text-slate-900">
                      {pageContent.text[110]}
                    </div>{" "}
                    <p className="font-body-sm text-[11px] text-slate-500 mt-0.5">
                      {pageContent.text[111]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  {" "}
                  <GeminiIcon
                    name="neurology"
                    className="text-blue-600 text-[18px] shrink-0 mt-0.5"
                  />{" "}
                  <div>
                    {" "}
                    <div className="font-headline-sm text-xs font-bold text-slate-900">
                      {pageContent.text[112]}
                    </div>{" "}
                    <p className="font-body-sm text-[11px] text-slate-500 mt-0.5">
                      {pageContent.text[113]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  {" "}
                  <GeminiIcon
                    name="send"
                    className="text-blue-600 text-[18px] shrink-0 mt-0.5"
                  />{" "}
                  <div>
                    {" "}
                    <div className="font-headline-sm text-xs font-bold text-slate-900">
                      {pageContent.text[114]}
                    </div>{" "}
                    <p className="font-body-sm text-[11px] text-slate-500 mt-0.5">
                      {pageContent.text[115]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-5 pt-3 border-t border-slate-100 font-label-mono-sm text-[11px] text-slate-500">
              {" "}
              {pageContent.text[116]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-6 border border-purple-200/80 shadow-xs flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>{" "}
                  <span className="font-label-mono-sm text-xs uppercase font-bold text-purple-700 tracking-wider">
                    {pageContent.text[117]}
                  </span>{" "}
                </div>{" "}
                <span className="font-label-mono-sm text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-semibold">
                  {pageContent.text[118]}
                </span>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  {" "}
                  <GeminiIcon
                    name="policy"
                    className="text-purple-600 text-[18px] shrink-0 mt-0.5"
                  />{" "}
                  <div>
                    {" "}
                    <div className="font-headline-sm text-xs font-bold text-slate-900">
                      {pageContent.text[119]}
                    </div>{" "}
                    <p className="font-body-sm text-[11px] text-slate-500 mt-0.5">
                      {pageContent.text[120]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  {" "}
                  <GeminiIcon
                    name="verified_user"
                    className="text-purple-600 text-[18px] shrink-0 mt-0.5"
                  />{" "}
                  <div>
                    {" "}
                    <div className="font-headline-sm text-xs font-bold text-slate-900">
                      {pageContent.text[121]}
                    </div>{" "}
                    <p className="font-body-sm text-[11px] text-slate-500 mt-0.5">
                      {pageContent.text[122]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  {" "}
                  <GeminiIcon
                    name="handshake"
                    className="text-purple-600 text-[18px] shrink-0 mt-0.5"
                  />{" "}
                  <div>
                    {" "}
                    <div className="font-headline-sm text-xs font-bold text-slate-900">
                      {pageContent.text[123]}
                    </div>{" "}
                    <p className="font-body-sm text-[11px] text-slate-500 mt-0.5">
                      {pageContent.text[124]}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-5 pt-3 border-t border-slate-100 font-label-mono-sm text-[11px] text-slate-500">
              {" "}
              {pageContent.text[125]}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {" "}
          <div className="flex items-center gap-2.5">
            {" "}
            <GeminiIcon name="sync_alt" className="text-emerald-400 text-[20px]" />{" "}
            <span className="font-headline-sm text-xs md:text-sm font-bold uppercase tracking-wider">
              {pageContent.text[126]}
            </span>{" "}
          </div>{" "}
          <div className="font-label-mono-sm text-xs text-slate-300">
            {" "}
            {pageContent.text[127]}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function FromFrictionToProductionIn14DaysSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="max-w-2xl mb-12">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-3">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
              {pageContent.text[128]}
            </span>{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[129]}{" "}
            <span className="font-editorial-italic font-normal italic text-blue-600">
              {pageContent.text[130]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="relative">
          {" "}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {" "}
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-label-mono-sm text-xs font-bold flex items-center justify-center">
                    {pageContent.text[131]}
                  </span>{" "}
                  <GeminiIcon name="search" className="text-slate-400 text-[18px]" />{" "}
                </div>{" "}
                <div className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[132]}
                </div>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[133]}
                </p>{" "}
              </div>{" "}
              <div className="mt-4 pt-2 border-t border-slate-100 font-label-mono-sm text-[10px] text-slate-400">
                {pageContent.text[134]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-label-mono-sm text-xs font-bold flex items-center justify-center">
                    {pageContent.text[135]}
                  </span>{" "}
                  <GeminiIcon name="schema" className="text-slate-400 text-[18px]" />{" "}
                </div>{" "}
                <div className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[136]}
                </div>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[137]}
                </p>{" "}
              </div>{" "}
              <div className="mt-4 pt-2 border-t border-slate-100 font-label-mono-sm text-[10px] text-slate-400">
                {pageContent.text[138]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-label-mono-sm text-xs font-bold flex items-center justify-center">
                    {pageContent.text[139]}
                  </span>{" "}
                  <GeminiIcon name="code" className="text-blue-600 text-[18px]" />{" "}
                </div>{" "}
                <div className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[140]}
                </div>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[141]}
                </p>{" "}
              </div>{" "}
              <div className="mt-4 pt-2 border-t border-slate-100 font-label-mono-sm text-[10px] text-blue-600 font-semibold">
                {pageContent.text[142]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-label-mono-sm text-xs font-bold flex items-center justify-center">
                    {pageContent.text[143]}
                  </span>{" "}
                  <GeminiIcon name="cloud_sync" className="text-slate-400 text-[18px]" />{" "}
                </div>{" "}
                <div className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[144]}
                </div>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[145]}
                </p>{" "}
              </div>{" "}
              <div className="mt-4 pt-2 border-t border-slate-100 font-label-mono-sm text-[10px] text-slate-400">
                {pageContent.text[146]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-label-mono-sm text-xs font-bold flex items-center justify-center">
                    {pageContent.text[147]}
                  </span>{" "}
                  <GeminiIcon name="check_circle" className="text-emerald-600 text-[18px]" />{" "}
                </div>{" "}
                <div className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[148]}
                </div>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[149]}
                </p>{" "}
              </div>{" "}
              <div className="mt-4 pt-2 border-t border-slate-100 font-label-mono-sm text-[10px] text-emerald-600 font-semibold">
                {pageContent.text[150]}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function EngineeredNotPromptedSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#070A12] text-white py-20 md:py-28 relative overflow-hidden border-y border-slate-800">
      {" "}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>{" "}
      <div className="absolute -top-32 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>{" "}
      <div className="relative max-w-5xl mx-auto px-margin md:px-margin-md lg:px-margin-lg text-center">
        {" "}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 shadow-inner mb-6">
          {" "}
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>{" "}
          <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
            {pageContent.text[151]}
          </span>{" "}
        </div>{" "}
        <h2 className="font-headline-lg md:font-display-lg text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          {" "}
          {pageContent.text[152]}{" "}
        </h2>{" "}
        <p className="mt-4 font-body-lg text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
          {" "}
          {pageContent.text[153]}{" "}
        </p>{" "}
        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 md:gap-10 font-label-mono-sm text-xs md:text-sm text-slate-400">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <GeminiIcon name="domain" className="text-blue-400 text-[18px]" />{" "}
            <span>{pageContent.text[154]}</span>{" "}
          </div>{" "}
          <span className="hidden sm:inline text-slate-700">{pageContent.text[155]}</span>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <GeminiIcon name="lock_open" className="text-blue-400 text-[18px]" />{" "}
            <span>{pageContent.text[156]}</span>{" "}
          </div>{" "}
          <span className="hidden sm:inline text-slate-700">{pageContent.text[157]}</span>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <GeminiIcon name="verified" className="text-emerald-400 text-[18px]" />{" "}
            <span>{pageContent.text[158]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function BuiltWithYourTeamOwnedByYourBusinessSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="max-w-2xl mb-12">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-3">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-slate-700 font-semibold">
              {pageContent.text[159]}
            </span>{" "}
          </div>{" "}
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            {" "}
            {pageContent.text[160]} <br className="hidden sm:inline" />{" "}
            <span className="font-editorial-italic font-normal italic text-slate-600">
              {pageContent.text[161]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {" "}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            {" "}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              {" "}
              <span className="font-label-mono-sm text-xs uppercase font-bold text-slate-500">
                {pageContent.text[162]}
              </span>{" "}
              <GeminiIcon name="close" className="text-rose-500 text-[18px]" />{" "}
            </div>{" "}
            <div className="space-y-3 font-body-sm text-xs md:text-sm text-slate-600">
              {" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                <span>{pageContent.text[163]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                <span>{pageContent.text[164]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                <span>{pageContent.text[165]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>{" "}
                <span>{pageContent.text[166]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-6 border border-blue-200/90 shadow-xs">
            {" "}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              {" "}
              <span className="font-label-mono-sm text-xs uppercase font-bold text-blue-600">
                {pageContent.text[167]}
              </span>{" "}
              <GeminiIcon name="check" className="text-emerald-600 text-[18px]" />{" "}
            </div>{" "}
            <div className="space-y-3 font-body-sm text-xs md:text-sm text-slate-800 font-medium">
              {" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                <span>{pageContent.text[168]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                <span>{pageContent.text[169]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                <span>{pageContent.text[170]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2.5">
                {" "}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>{" "}
                <span>{pageContent.text[171]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function SmallTeamDeepSystemsThinkingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-14 md:py-20 border-b border-slate-200/80">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg text-center">
        {" "}
        <h2 className="font-headline-lg md:font-display-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F19] tracking-tight">
          {" "}
          {pageContent.text[172]}{" "}
          <span className="font-editorial-italic font-normal italic text-slate-500">
            {pageContent.text[173]}
          </span>{" "}
        </h2>{" "}
        <div className="mt-8 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {" "}
          <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-label-mono-sm text-xs font-semibold shadow-xs">
            {" "}
            {pageContent.text[174]}{" "}
          </span>{" "}
          <span className="text-slate-400 font-mono text-sm">{pageContent.text[175]}</span>{" "}
          <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-label-mono-sm text-xs font-semibold shadow-xs">
            {" "}
            {pageContent.text[176]}{" "}
          </span>{" "}
          <span className="text-slate-400 font-mono text-sm">{pageContent.text[177]}</span>{" "}
          <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-label-mono-sm text-xs font-semibold shadow-xs">
            {" "}
            {pageContent.text[178]}{" "}
          </span>{" "}
          <span className="text-slate-400 font-mono text-sm">{pageContent.text[179]}</span>{" "}
          <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-label-mono-sm text-xs font-semibold shadow-xs">
            {" "}
            {pageContent.text[180]}{" "}
          </span>{" "}
          <span className="text-blue-600 font-mono text-sm">{pageContent.text[181]}</span>{" "}
          <span className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-label-mono-sm text-xs font-bold shadow-xs">
            {" "}
            {pageContent.text[182]}{" "}
          </span>{" "}
        </div>{" "}
        <p className="mt-6 font-body-md text-sm md:text-base text-slate-600 max-w-lg mx-auto">
          {" "}
          {pageContent.text[183]}{" "}
        </p>{" "}
      </div>{" "}
    </section>
  )
}

export function Section10Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-16 md:py-24">
      {" "}
      <div className="max-w-4xl mx-auto px-margin md:px-margin-md lg:px-margin-lg text-center">
        {" "}
        <GeminiIcon name="format_quote" className="text-slate-300 text-3xl mb-4" />{" "}
        <blockquote className="font-headline-lg md:font-headline-lg text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#0B0F19] leading-snug">
          {" "}
          {pageContent.text[184]} <br className="hidden sm:inline" /> {pageContent.text[185]}{" "}
          <span className="font-editorial-italic font-normal italic text-blue-600">
            {pageContent.text[186]}
          </span>{" "}
          {pageContent.text[187]}{" "}
        </blockquote>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveASystemWorthBuildingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="pb-16 md:pb-24 bg-[#F8F9FA]">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="relative bg-[#070A12] text-white rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl border border-slate-800/80">
          {" "}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>{" "}
          <div className="relative z-10 max-w-3xl">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 shadow-inner mb-5">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>{" "}
              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-blue-400 font-semibold">
                {pageContent.text[188]}
              </span>{" "}
            </div>{" "}
            <h2 className="font-headline-lg md:font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {" "}
              {pageContent.text[189]}{" "}
            </h2>{" "}
            <p className="mt-4 font-body-lg text-base md:text-lg text-slate-300 max-w-xl">
              {" "}
              {pageContent.text[190]}{" "}
            </p>{" "}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {" "}
              <a
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-blue-600 text-white font-label-ui text-xs md:text-sm font-semibold shadow-[0_4px_24px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all"
                data-path="book-a-discovery"
                href={localePath(locale, "/contact")}
              >
                {" "}
                {pageContent.text[191]}{" "}
                <span className="ml-1 text-base leading-none">{pageContent.text[192]}</span>{" "}
              </a>{" "}
              <a
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-label-ui text-xs md:text-sm font-semibold hover:bg-slate-800 hover:text-white transition-all"
                data-path="what-we-build"
                href={localePath(locale, "/what-we-build")}
              >
                {" "}
                {pageContent.text[193]}{" "}
                <span className="ml-1 text-base leading-none">{pageContent.text[194]}</span>{" "}
              </a>{" "}
            </div>{" "}
            <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 font-label-mono-sm text-xs text-slate-400">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <GeminiIcon name="verified_user" className="text-blue-400 text-[18px]" />{" "}
                <span>{pageContent.text[195]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <GeminiIcon name="timer" className="text-blue-400 text-[18px]" />{" "}
                <span>{pageContent.text[196]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                {" "}
                <GeminiIcon name="block" className="text-emerald-400 text-[18px]" />{" "}
                <span>{pageContent.text[197]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
