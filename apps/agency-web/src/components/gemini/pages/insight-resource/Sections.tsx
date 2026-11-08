import { pageContent } from "@/content/gemini/insight-resource"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function IdeasForBuildingASmarterRevenueSystemSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="relative w-full bg-[#FBFBFC] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg pt-12 pb-space-2xl overflow-hidden">
      {" "}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>{" "}
      <div className="relative max-w-7xl mx-auto flex flex-col items-start gap-space-lg">
        {" "}
        <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-white shadow-sm border border-slate-200/80">
          {" "}
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>{" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-slate-700 font-semibold">
            {pageContent.text[9]}
          </span>{" "}
        </div>{" "}
        <div className="max-w-4xl flex flex-col gap-space-sm">
          {" "}
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-slate-950 font-bold tracking-tight">
            {" "}
            {pageContent.text[10]}{" "}
            <span className="font-editorial-italic italic font-normal text-slate-800">
              {pageContent.text[11]}
            </span>{" "}
          </h1>{" "}
          <p className="font-body-lg text-body-lg text-slate-600 max-w-2xl leading-relaxed">
            {" "}
            {pageContent.text[12]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
          {" "}
          <a
            className="inline-flex items-center gap-space-xs px-6 py-3 rounded-full bg-[#1746B3] text-white font-label-ui text-label-ui hover:bg-[#123996] transition-all shadow-md shadow-blue-900/10 hover:shadow-lg"
            href="#featured"
          >
            {" "}
            <span>{pageContent.text[13]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
          </a>{" "}
          <a
            className="inline-flex items-center gap-space-xs px-6 py-3 rounded-full bg-white text-slate-700 font-label-ui text-label-ui border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            href="#the-signal"
          >
            {" "}
            <span>{pageContent.text[14]}</span>{" "}
            <GeminiIcon name="notifications" className="text-sm" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="w-full mt-space-md p-space-md rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex flex-col lg:flex-row items-center justify-between gap-space-md">
          {" "}
          <div className="flex items-center gap-space-sm">
            {" "}
            <GeminiIcon name="hub" className="text-primary-container" />{" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest text-slate-500 font-semibold">
              {pageContent.text[15]}
            </span>{" "}
            <span className="font-label-mono-sm text-label-mono-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              {pageContent.text[16]}
            </span>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm font-label-mono-sm text-label-mono-sm text-slate-600">
            {" "}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
              <span className="font-semibold text-slate-800">{pageContent.text[17]}</span>{" "}
              <span className="text-slate-400">{pageContent.text[18]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300 font-bold">{pageContent.text[19]}</span>{" "}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>{" "}
              <span className="font-semibold text-slate-800">{pageContent.text[20]}</span>{" "}
              <span className="text-slate-400">{pageContent.text[21]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300 font-bold">{pageContent.text[22]}</span>{" "}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>{" "}
              <span className="font-semibold text-slate-800">{pageContent.text[23]}</span>{" "}
              <span className="text-emerald-600 font-medium">{pageContent.text[24]}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="hidden xl:flex items-center gap-2 text-slate-400 font-label-mono-sm text-label-mono-sm">
            {" "}
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>{" "}
            <span>{pageContent.text[25]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function FeaturedSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="w-full bg-[#F4F5F8] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg py-space-2xl border-t border-slate-200/70"
      id="featured"
    >
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div className="flex items-center gap-space-xs">
            {" "}
            <span className="px-2.5 py-1 rounded bg-[#070A12] text-white font-label-mono-sm text-label-mono-sm font-semibold tracking-wider">
              {pageContent.text[26]}
            </span>{" "}
            <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-label-mono-sm text-label-mono-sm font-semibold">
              {pageContent.text[27]}
            </span>{" "}
          </div>{" "}
          <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
            {pageContent.text[28]}
          </span>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
          {" "}
          <div className="lg:col-span-5 bg-white p-space-xl rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            {" "}
            <div className="flex flex-col gap-space-md">
              {" "}
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-950 font-bold leading-tight tracking-tight">
                {" "}
                {pageContent.text[29]}{" "}
              </h2>{" "}
              <p className="font-body-md text-body-md text-slate-600 leading-relaxed">
                {" "}
                {pageContent.text[30]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-xl border-t border-slate-100 flex items-center justify-between">
              {" "}
              <div className="flex flex-col">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-slate-400 uppercase">
                  {pageContent.text[31]}
                </span>{" "}
                <span className="font-body-sm text-body-sm font-medium text-slate-700">
                  {pageContent.text[32]}
                </span>{" "}
              </div>{" "}
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white font-label-ui text-label-ui hover:bg-slate-800 transition-colors"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[33]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-7 bg-[#0B0F19] p-space-lg md:p-space-xl rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {" "}
            <div className="flex items-center justify-between pb-space-md border-b border-slate-800/80">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>{" "}
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>{" "}
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm text-slate-400 ml-2">
                  {pageContent.text[34]}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center gap-2 font-label-mono-sm text-label-mono-sm text-primary">
                {" "}
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>{" "}
                <span>{pageContent.text[35]}</span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-space-xl relative">
              {" "}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 relative group hover:border-blue-500/50 transition-colors">
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-blue-400 font-bold tracking-wider">
                    {pageContent.text[36]}
                  </span>{" "}
                  <GeminiIcon name="database" className="text-slate-400 text-sm" />{" "}
                </div>{" "}
                <p className="font-label-mono-sm text-label-mono-sm text-slate-300 font-medium">
                  {pageContent.text[37]}
                </p>{" "}
                <ul className="font-label-mono-sm text-[10px] text-slate-400 space-y-1">
                  {" "}
                  <li>{pageContent.text[38]}</li> <li>{pageContent.text[39]}</li>{" "}
                  <li>{pageContent.text[40]}</li>{" "}
                </ul>{" "}
                <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  {pageContent.text[41]}
                </div>{" "}
              </div>{" "}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 relative group hover:border-indigo-500/50 transition-colors">
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-indigo-400 font-bold tracking-wider">
                    {pageContent.text[42]}
                  </span>{" "}
                  <GeminiIcon name="psychology" className="text-slate-400 text-sm" />{" "}
                </div>{" "}
                <p className="font-label-mono-sm text-label-mono-sm text-slate-300 font-medium">
                  {pageContent.text[43]}
                </p>{" "}
                <ul className="font-label-mono-sm text-[10px] text-slate-400 space-y-1">
                  {" "}
                  <li>{pageContent.text[44]}</li> <li>{pageContent.text[45]}</li>{" "}
                  <li>{pageContent.text[46]}</li>{" "}
                </ul>{" "}
                <div className="mt-2 text-[10px] font-mono text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded">
                  {pageContent.text[47]}
                </div>{" "}
              </div>{" "}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 relative group hover:border-violet-500/50 transition-colors">
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-violet-400 font-bold tracking-wider">
                    {pageContent.text[48]}
                  </span>{" "}
                  <GeminiIcon name="bolt" className="text-slate-400 text-sm" />{" "}
                </div>{" "}
                <p className="font-label-mono-sm text-label-mono-sm text-slate-300 font-medium">
                  {pageContent.text[49]}
                </p>{" "}
                <ul className="font-label-mono-sm text-[10px] text-slate-400 space-y-1">
                  {" "}
                  <li>{pageContent.text[50]}</li> <li>{pageContent.text[51]}</li>{" "}
                  <li>{pageContent.text[52]}</li>{" "}
                </ul>{" "}
                <div className="mt-2 text-[10px] font-mono text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded">
                  {pageContent.text[53]}
                </div>{" "}
              </div>{" "}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 relative group hover:border-emerald-500/50 transition-colors">
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-emerald-400 font-bold tracking-wider">
                    {pageContent.text[54]}
                  </span>{" "}
                  <GeminiIcon name="sync" className="text-slate-400 text-sm" />{" "}
                </div>{" "}
                <p className="font-label-mono-sm text-label-mono-sm text-slate-300 font-medium">
                  {pageContent.text[55]}
                </p>{" "}
                <ul className="font-label-mono-sm text-[10px] text-slate-400 space-y-1">
                  {" "}
                  <li>{pageContent.text[56]}</li> <li>{pageContent.text[57]}</li>{" "}
                  <li>{pageContent.text[58]}</li>{" "}
                </ul>{" "}
                <div className="mt-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                  {pageContent.text[59]}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-black/50 p-space-sm rounded-lg border border-slate-800/80 font-label-mono-sm text-label-mono-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-400">
              {" "}
              <span className="text-xs text-slate-300 font-mono">
                <span className="text-primary-container">{pageContent.text[60]}</span>{" "}
                {pageContent.text[61]}
              </span>{" "}
              <span className="text-[11px] text-slate-500 uppercase">
                {pageContent.text[62]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ExploreWhatYouReSolvingForSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#FBFBFC] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg py-space-2xl border-t border-slate-200">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          {" "}
          <div>
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary-container font-semibold">
              {pageContent.text[63]}
            </span>{" "}
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-950 font-bold tracking-tight">
              {" "}
              {pageContent.text[64]}{" "}
            </h2>{" "}
          </div>{" "}
          <p className="font-body-md text-body-md text-slate-500 max-w-md">
            {" "}
            {pageContent.text[65]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {" "}
          <a
            className="group p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-space-md"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <GeminiIcon name="memory" className="text-primary-container text-2xl" />{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {pageContent.text[66]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 group-hover:text-primary-container transition-colors font-semibold">
                {pageContent.text[67]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-500">
                {pageContent.text[68]}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 font-medium group-hover:text-primary-container">
              {" "}
              <span>{pageContent.text[69]}</span>{" "}
              <GeminiIcon
                name="arrow_forward"
                className="text-xs group-hover:translate-x-1 transition-transform"
              />{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-space-md"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <GeminiIcon name="terminal" className="text-primary-container text-2xl" />{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {pageContent.text[70]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 group-hover:text-primary-container transition-colors font-semibold">
                {pageContent.text[71]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-500">
                {pageContent.text[72]}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 font-medium group-hover:text-primary-container">
              {" "}
              <span>{pageContent.text[73]}</span>{" "}
              <GeminiIcon
                name="arrow_forward"
                className="text-xs group-hover:translate-x-1 transition-transform"
              />{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-space-md"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <GeminiIcon name="account_tree" className="text-primary-container text-2xl" />{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {pageContent.text[74]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 group-hover:text-primary-container transition-colors font-semibold">
                {pageContent.text[75]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-500">
                {pageContent.text[76]}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 font-medium group-hover:text-primary-container">
              {" "}
              <span>{pageContent.text[77]}</span>{" "}
              <GeminiIcon
                name="arrow_forward"
                className="text-xs group-hover:translate-x-1 transition-transform"
              />{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-space-md"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <GeminiIcon name="alt_route" className="text-primary-container text-2xl" />{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {pageContent.text[78]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 group-hover:text-primary-container transition-colors font-semibold">
                {pageContent.text[79]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-500">
                {pageContent.text[80]}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 font-medium group-hover:text-primary-container">
              {" "}
              <span>{pageContent.text[81]}</span>{" "}
              <GeminiIcon
                name="arrow_forward"
                className="text-xs group-hover:translate-x-1 transition-transform"
              />{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-space-md"
            href={localePath(locale, "/cta-page")}
          >
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <GeminiIcon name="insights" className="text-primary-container text-2xl" />{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {pageContent.text[82]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 group-hover:text-primary-container transition-colors font-semibold">
                {pageContent.text[83]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-500">
                {pageContent.text[84]}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 font-medium group-hover:text-primary-container">
              {" "}
              <span>{pageContent.text[85]}</span>{" "}
              <GeminiIcon
                name="arrow_forward"
                className="text-xs group-hover:translate-x-1 transition-transform"
              />{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-space-md"
            href={localePath(locale, "/system-breakdown")}
          >
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <GeminiIcon name="code_blocks" className="text-primary-container text-2xl" />{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {pageContent.text[86]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 group-hover:text-primary-container transition-colors font-semibold">
                {pageContent.text[87]}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-500">
                {pageContent.text[88]}
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 font-medium group-hover:text-primary-container">
              {" "}
              <span>{pageContent.text[89]}</span>{" "}
              <GeminiIcon
                name="arrow_forward"
                className="text-xs group-hover:translate-x-1 transition-transform"
              />{" "}
            </div>{" "}
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function LatestThinkingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#F4F5F8] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg py-space-2xl border-t border-slate-200">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-slate-500 font-semibold">
              {pageContent.text[90]}
            </span>{" "}
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-950 font-bold tracking-tight">
              {" "}
              {pageContent.text[91]}{" "}
            </h2>{" "}
          </div>{" "}
          <a
            className="hidden sm:inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-slate-700 hover:text-primary-container font-semibold"
            href={localePath(locale, "/cta-page")}
          >
            {" "}
            <span>{pageContent.text[92]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-xs" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {" "}
          <article className="p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-space-md">
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between text-slate-500">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {pageContent.text[93]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm">
                  {pageContent.text[94]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold leading-snug">
                {" "}
                {pageContent.text[95]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600 line-clamp-3">
                {" "}
                {pageContent.text[96]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-sm border-t border-slate-100 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[97]}
              </span>{" "}
              <a
                className="font-label-ui text-label-ui text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {pageContent.text[98]}
              </a>{" "}
            </div>{" "}
          </article>{" "}
          <article className="p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-space-md">
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between text-slate-500">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {pageContent.text[99]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm">
                  {pageContent.text[100]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold leading-snug">
                {" "}
                {pageContent.text[101]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600 line-clamp-3">
                {" "}
                {pageContent.text[102]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-sm border-t border-slate-100 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[103]}
              </span>{" "}
              <a
                className="font-label-ui text-label-ui text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {pageContent.text[104]}
              </a>{" "}
            </div>{" "}
          </article>{" "}
          <article className="p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-space-md">
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between text-slate-500">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {pageContent.text[105]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm">
                  {pageContent.text[106]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold leading-snug">
                {" "}
                {pageContent.text[107]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600 line-clamp-3">
                {" "}
                {pageContent.text[108]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-sm border-t border-slate-100 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[109]}
              </span>{" "}
              <a
                className="font-label-ui text-label-ui text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {pageContent.text[110]}
              </a>{" "}
            </div>{" "}
          </article>{" "}
          <article className="p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-space-md">
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between text-slate-500">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {pageContent.text[111]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm">
                  {pageContent.text[112]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold leading-snug">
                {" "}
                {pageContent.text[113]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600 line-clamp-3">
                {" "}
                {pageContent.text[114]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-sm border-t border-slate-100 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[115]}
              </span>{" "}
              <a
                className="font-label-ui text-label-ui text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {pageContent.text[116]}
              </a>{" "}
            </div>{" "}
          </article>{" "}
          <article className="p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-space-md">
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between text-slate-500">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {pageContent.text[117]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm">
                  {pageContent.text[118]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold leading-snug">
                {" "}
                {pageContent.text[119]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600 line-clamp-3">
                {" "}
                {pageContent.text[120]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-sm border-t border-slate-100 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[121]}
              </span>{" "}
              <a
                className="font-label-ui text-label-ui text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {pageContent.text[122]}
              </a>{" "}
            </div>{" "}
          </article>{" "}
          <article className="p-space-lg rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-space-md">
            {" "}
            <div className="flex flex-col gap-space-xs">
              {" "}
              <div className="flex items-center justify-between text-slate-500">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  {pageContent.text[123]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm">
                  {pageContent.text[124]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold leading-snug">
                {" "}
                {pageContent.text[125]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-body-sm text-slate-600 line-clamp-3">
                {" "}
                {pageContent.text[126]}{" "}
              </p>{" "}
            </div>{" "}
            <div className="pt-space-sm border-t border-slate-100 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[127]}
              </span>{" "}
              <a
                className="font-label-ui text-label-ui text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {pageContent.text[128]}
              </a>{" "}
            </div>{" "}
          </article>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function DonTJustReadItBuildItSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#070A12] text-white px-margin md:px-margin-md lg:px-margin-lg py-space-3xl relative overflow-hidden">
      {" "}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>{" "}
      <div className="relative max-w-7xl mx-auto flex flex-col gap-space-2xl">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          {" "}
          <div className="flex flex-col gap-space-xs">
            {" "}
            <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 w-fit">
              {" "}
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>{" "}
              <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-slate-300 font-semibold">
                {pageContent.text[129]}
              </span>{" "}
            </div>{" "}
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight text-white">
              {" "}
              {pageContent.text[130]}{" "}
              <span className="font-editorial-italic italic font-normal text-slate-300">
                {pageContent.text[131]}
              </span>{" "}
            </h2>{" "}
          </div>{" "}
          <p className="font-body-md text-body-md text-slate-400 max-w-md">
            {" "}
            {pageContent.text[132]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {" "}
          <div className="rounded-2xl bg-[#0D121F] border border-slate-800/90 p-space-lg flex flex-col justify-between hover:border-slate-700 transition-all">
            {" "}
            <div className="flex flex-col gap-space-md">
              {" "}
              <div className="flex items-center justify-between pb-space-xs border-b border-slate-800">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold">
                  {pageContent.text[133]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                  {pageContent.text[134]}
                </span>{" "}
              </div>{" "}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 flex flex-col gap-1.5">
                {" "}
                <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-800/60">
                  {" "}
                  <span>{pageContent.text[135]}</span>{" "}
                  <span className="text-emerald-400">{pageContent.text[136]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[137]}</span>{" "}
                  <span className="text-yellow-400 font-bold">{pageContent.text[138]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[139]}</span>{" "}
                  <span className="text-slate-300">{pageContent.text[140]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[141]}</span>{" "}
                  <span className="text-emerald-400">{pageContent.text[142]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="font-headline-sm text-headline-sm text-white font-semibold">
                  {pageContent.text[143]}
                </h3>{" "}
                <p className="font-body-sm text-body-sm text-slate-400 mt-2">
                  {" "}
                  {pageContent.text[144]}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="pt-space-lg mt-space-md border-t border-slate-800/80 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[145]}
              </span>{" "}
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-950 font-label-ui text-label-ui hover:bg-slate-200 transition-colors"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[146]}</span>{" "}
                <GeminiIcon name="download" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-2xl bg-[#0D121F] border border-slate-800/90 p-space-lg flex flex-col justify-between hover:border-slate-700 transition-all">
            {" "}
            <div className="flex flex-col gap-space-md">
              {" "}
              <div className="flex items-center justify-between pb-space-xs border-b border-slate-800">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary-fixed-dim font-bold">
                  {pageContent.text[147]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                  {pageContent.text[148]}
                </span>{" "}
              </div>{" "}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 flex flex-col gap-1.5">
                {" "}
                <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-800/60">
                  {" "}
                  <span>{pageContent.text[149]}</span>{" "}
                  <span className="text-blue-400">{pageContent.text[150]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[151]}</span>{" "}
                  <span className="text-purple-400 font-bold">{pageContent.text[152]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[153]}</span>{" "}
                  <span className="text-slate-300">{pageContent.text[154]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[155]}</span>{" "}
                  <span className="text-emerald-400">{pageContent.text[156]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="font-headline-sm text-headline-sm text-white font-semibold">
                  {pageContent.text[157]}
                </h3>{" "}
                <p className="font-body-sm text-body-sm text-slate-400 mt-2">
                  {" "}
                  {pageContent.text[158]}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="pt-space-lg mt-space-md border-t border-slate-800/80 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[159]}
              </span>{" "}
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-950 font-label-ui text-label-ui hover:bg-slate-200 transition-colors"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[160]}</span>{" "}
                <GeminiIcon name="open_in_new" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-2xl bg-[#0D121F] border border-slate-800/90 p-space-lg flex flex-col justify-between hover:border-slate-700 transition-all">
            {" "}
            <div className="flex flex-col gap-space-md">
              {" "}
              <div className="flex items-center justify-between pb-space-xs border-b border-slate-800">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-secondary-fixed-dim font-bold">
                  {pageContent.text[161]}
                </span>{" "}
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                  {pageContent.text[162]}
                </span>{" "}
              </div>{" "}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 flex flex-col gap-1.5">
                {" "}
                <div className="flex justify-between text-slate-500 pb-1 border-b border-slate-800/60">
                  {" "}
                  <span>{pageContent.text[163]}</span>{" "}
                  <span className="text-cyan-400">{pageContent.text[164]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[165]}</span>{" "}
                  <span className="text-emerald-400 font-bold">{pageContent.text[166]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[167]}</span>{" "}
                  <span className="text-slate-300">{pageContent.text[168]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span>{pageContent.text[169]}</span>{" "}
                  <span className="text-blue-400">{pageContent.text[170]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="font-headline-sm text-headline-sm text-white font-semibold">
                  {pageContent.text[171]}
                </h3>{" "}
                <p className="font-body-sm text-body-sm text-slate-400 mt-2">
                  {" "}
                  {pageContent.text[172]}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="pt-space-lg mt-space-md border-t border-slate-800/80 flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                {pageContent.text[173]}
              </span>{" "}
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-950 font-label-ui text-label-ui hover:bg-slate-200 transition-colors"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[174]}</span>{" "}
                <GeminiIcon name="download" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ResearchWorthKeepingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#FBFBFC] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg py-space-3xl border-t border-slate-200">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          {" "}
          <div>
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-slate-500 font-semibold">
              {pageContent.text[175]}
            </span>{" "}
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-950 font-bold tracking-tight">
              {" "}
              {pageContent.text[176]}{" "}
            </h2>{" "}
          </div>{" "}
          <p className="font-body-md text-body-md text-slate-600 max-w-md">
            {" "}
            {pageContent.text[177]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {" "}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="h-44 bg-gradient-to-br from-slate-900 to-slate-800 p-space-md flex flex-col justify-between text-white relative">
                {" "}
                <div className="flex justify-between items-start">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest text-slate-400">
                    {pageContent.text[178]}
                  </span>{" "}
                  <GeminiIcon name="analytics" className="text-primary text-xl" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="font-label-mono-sm text-[10px] text-slate-400 block font-mono">
                    {pageContent.text[179]}
                  </span>{" "}
                  <span className="font-headline-sm text-white font-bold">
                    {pageContent.text[180]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-space-lg flex flex-col gap-space-sm">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-slate-400">
                  {pageContent.text[181]}
                </span>{" "}
                <p className="font-body-md text-body-md text-slate-700 font-medium">
                  {" "}
                  {pageContent.text[182]}{" "}
                </p>{" "}
                <div className="pt-space-xs space-y-2 border-t border-slate-100">
                  {" "}
                  <div className="flex items-start gap-2 text-slate-600 font-body-sm text-body-sm">
                    {" "}
                    <span className="text-primary-container font-bold">
                      {pageContent.text[183]}
                    </span>{" "}
                    <span>{pageContent.text[184]}</span>{" "}
                  </div>{" "}
                  <div className="flex items-start gap-2 text-slate-600 font-body-sm text-body-sm">
                    {" "}
                    <span className="text-primary-container font-bold">
                      {pageContent.text[185]}
                    </span>{" "}
                    <span>{pageContent.text[186]}</span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-space-lg pt-0 border-t border-slate-50">
              {" "}
              <a
                className="inline-flex items-center justify-between w-full font-label-ui text-label-ui text-slate-900 font-semibold hover:text-blue-600"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[187]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="h-44 bg-gradient-to-br from-[#121E36] to-[#0A1020] p-space-md flex flex-col justify-between text-white relative">
                {" "}
                <div className="flex justify-between items-start">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest text-slate-400">
                    {pageContent.text[188]}
                  </span>{" "}
                  <GeminiIcon name="layers" className="text-indigo-400 text-xl" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="font-label-mono-sm text-[10px] text-slate-400 block font-mono">
                    {pageContent.text[189]}
                  </span>{" "}
                  <span className="font-headline-sm text-white font-bold">
                    {pageContent.text[190]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-space-lg flex flex-col gap-space-sm">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-slate-400">
                  {pageContent.text[191]}
                </span>{" "}
                <p className="font-body-md text-body-md text-slate-700 font-medium">
                  {" "}
                  {pageContent.text[192]}{" "}
                </p>{" "}
                <div className="pt-space-xs space-y-2 border-t border-slate-100">
                  {" "}
                  <div className="flex items-start gap-2 text-slate-600 font-body-sm text-body-sm">
                    {" "}
                    <span className="text-indigo-600 font-bold">{pageContent.text[193]}</span>{" "}
                    <span>{pageContent.text[194]}</span>{" "}
                  </div>{" "}
                  <div className="flex items-start gap-2 text-slate-600 font-body-sm text-body-sm">
                    {" "}
                    <span className="text-indigo-600 font-bold">{pageContent.text[195]}</span>{" "}
                    <span>{pageContent.text[196]}</span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-space-lg pt-0 border-t border-slate-50">
              {" "}
              <a
                className="inline-flex items-center justify-between w-full font-label-ui text-label-ui text-slate-900 font-semibold hover:text-blue-600"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[197]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="h-44 bg-gradient-to-br from-[#1C1636] to-[#0A071E] p-space-md flex flex-col justify-between text-white relative">
                {" "}
                <div className="flex justify-between items-start">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest text-slate-400">
                    {pageContent.text[198]}
                  </span>{" "}
                  <GeminiIcon name="lan" className="text-purple-400 text-xl" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span className="font-label-mono-sm text-[10px] text-slate-400 block font-mono">
                    {pageContent.text[199]}
                  </span>{" "}
                  <span className="font-headline-sm text-white font-bold">
                    {pageContent.text[200]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-space-lg flex flex-col gap-space-sm">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-slate-400">
                  {pageContent.text[201]}
                </span>{" "}
                <p className="font-body-md text-body-md text-slate-700 font-medium">
                  {" "}
                  {pageContent.text[202]}{" "}
                </p>{" "}
                <div className="pt-space-xs space-y-2 border-t border-slate-100">
                  {" "}
                  <div className="flex items-start gap-2 text-slate-600 font-body-sm text-body-sm">
                    {" "}
                    <span className="text-purple-600 font-bold">{pageContent.text[203]}</span>{" "}
                    <span>{pageContent.text[204]}</span>{" "}
                  </div>{" "}
                  <div className="flex items-start gap-2 text-slate-600 font-body-sm text-body-sm">
                    {" "}
                    <span className="text-purple-600 font-bold">{pageContent.text[205]}</span>{" "}
                    <span>{pageContent.text[206]}</span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-space-lg pt-0 border-t border-slate-50">
              {" "}
              <a
                className="inline-flex items-center justify-between w-full font-label-ui text-label-ui text-slate-900 font-semibold hover:text-blue-600"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[207]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function SeeTheSystemsInActionSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#F4F5F8] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg py-space-2xl border-t border-slate-200">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        {" "}
        <div>
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-slate-500 font-semibold">
            {pageContent.text[208]}
          </span>{" "}
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-slate-950 font-bold tracking-tight">
            {" "}
            {pageContent.text[209]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {" "}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
            {" "}
            <div className="relative h-48 bg-slate-900 flex items-center justify-center p-4">
              {" "}
              <div className="w-full h-full rounded bg-slate-950 p-3 font-mono text-[11px] text-slate-400 border border-slate-800 flex flex-col justify-between">
                {" "}
                <div className="flex items-center justify-between text-slate-500">
                  {" "}
                  <span>{pageContent.text[210]}</span>{" "}
                  <span className="text-primary-container">{pageContent.text[211]}</span>{" "}
                </div>{" "}
                <div className="text-xs text-slate-300">
                  {" "}
                  <p className="text-emerald-400">{pageContent.text[212]}</p>{" "}
                  <p>{pageContent.text[213]}</p> <p>{pageContent.text[214]}</p>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 text-slate-500">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
                  <span>{pageContent.text[215]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {" "}
                <span className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-slate-900 shadow-lg">
                  {" "}
                  <GeminiIcon name="play_arrow" className="text-2xl" />{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-space-lg flex flex-col justify-between flex-1 gap-space-sm">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-primary-container font-semibold">
                    {pageContent.text[216]}
                  </span>{" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                    {pageContent.text[217]}
                  </span>{" "}
                </div>{" "}
                <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold mt-1">
                  {pageContent.text[218]}
                </h3>{" "}
                <p className="font-body-sm text-body-sm text-slate-600 mt-1">
                  {" "}
                  {pageContent.text[219]}{" "}
                </p>{" "}
              </div>{" "}
              <a
                className="font-label-ui text-label-ui text-slate-900 hover:text-primary-container font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[220]}</span>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
            {" "}
            <div className="relative h-48 bg-slate-900 flex items-center justify-center p-4">
              {" "}
              <div className="w-full h-full rounded bg-slate-950 p-3 font-mono text-[11px] text-slate-400 border border-slate-800 flex flex-col justify-between">
                {" "}
                <div className="flex items-center justify-between text-slate-500">
                  {" "}
                  <span>{pageContent.text[221]}</span>{" "}
                  <span className="text-primary-container">{pageContent.text[222]}</span>{" "}
                </div>{" "}
                <div className="flex items-center justify-center gap-3 text-xs text-indigo-400">
                  {" "}
                  <div className="border border-indigo-700/60 p-1.5 rounded">
                    {pageContent.text[223]}
                  </div>{" "}
                  <span>{pageContent.text[224]}</span>{" "}
                  <div className="border border-indigo-700/60 p-1.5 rounded">
                    {pageContent.text[225]}
                  </div>{" "}
                  <span>{pageContent.text[226]}</span>{" "}
                  <div className="border border-indigo-700/60 p-1.5 rounded">
                    {pageContent.text[227]}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 text-slate-500">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                  <span>{pageContent.text[228]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {" "}
                <span className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-slate-900 shadow-lg">
                  {" "}
                  <GeminiIcon name="play_arrow" className="text-2xl" />{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-space-lg flex flex-col justify-between flex-1 gap-space-sm">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-indigo-600 font-semibold">
                    {pageContent.text[229]}
                  </span>{" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                    {pageContent.text[230]}
                  </span>{" "}
                </div>{" "}
                <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold mt-1">
                  {pageContent.text[231]}
                </h3>{" "}
                <p className="font-body-sm text-body-sm text-slate-600 mt-1">
                  {" "}
                  {pageContent.text[232]}{" "}
                </p>{" "}
              </div>{" "}
              <a
                className="font-label-ui text-label-ui text-slate-900 hover:text-primary-container font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[233]}</span>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
            {" "}
            <div className="relative h-48 bg-slate-900 flex items-center justify-center p-4">
              {" "}
              <div className="w-full h-full rounded bg-slate-950 p-3 font-mono text-[11px] text-slate-400 border border-slate-800 flex flex-col justify-between">
                {" "}
                <div className="flex items-center justify-between text-slate-500">
                  {" "}
                  <span>{pageContent.text[234]}</span>{" "}
                  <span className="text-primary-container">{pageContent.text[235]}</span>{" "}
                </div>{" "}
                <div className="text-xs text-slate-300">
                  {" "}
                  <p className="text-violet-400">{pageContent.text[236]}</p>{" "}
                  <p>{pageContent.text[237]}</p>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 text-slate-500">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>{" "}
                  <span>{pageContent.text[238]}</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {" "}
                <span className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-slate-900 shadow-lg">
                  {" "}
                  <GeminiIcon name="play_arrow" className="text-2xl" />{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-space-lg flex flex-col justify-between flex-1 gap-space-sm">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between">
                  {" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-purple-600 font-semibold">
                    {pageContent.text[239]}
                  </span>{" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-slate-500">
                    {pageContent.text[240]}
                  </span>{" "}
                </div>{" "}
                <h3 className="font-headline-sm text-headline-sm text-slate-900 font-semibold mt-1">
                  {pageContent.text[241]}
                </h3>{" "}
                <p className="font-body-sm text-body-sm text-slate-600 mt-1">
                  {" "}
                  {pageContent.text[242]}{" "}
                </p>{" "}
              </div>{" "}
              <a
                className="font-label-ui text-label-ui text-slate-900 hover:text-primary-container font-semibold inline-flex items-center gap-1"
                href={localePath(locale, "/cta-page")}
              >
                {" "}
                <span>{pageContent.text[243]}</span>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function TheSignalSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="w-full bg-[#FBFBFC] text-[#070A12] px-margin md:px-margin-md lg:px-margin-lg py-space-2xl border-t border-slate-200"
      id="the-signal"
    >
      {" "}
      <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/90 p-space-xl md:p-space-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-xl">
        {" "}
        <div className="flex flex-col gap-space-xs max-w-lg">
          {" "}
          <div className="inline-flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 w-fit font-label-mono-sm text-label-mono-sm font-semibold">
            {" "}
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>{" "}
            <span>{pageContent.text[244]}</span>{" "}
          </div>{" "}
          <h2 className="font-headline-md text-headline-md text-slate-950 font-bold">
            {" "}
            {pageContent.text[245]}{" "}
          </h2>{" "}
          <p className="font-body-sm text-body-sm text-slate-600"> {pageContent.text[246]} </p>{" "}
        </div>{" "}
        <div className="w-full md:w-auto flex flex-col gap-2">
          {" "}
          <form className="flex flex-col sm:flex-row gap-2">
            {" "}
            <input
              className="px-4 py-2.5 rounded-full bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white w-full sm:w-64 transition-all"
              placeholder={pageContent.text[247]}
              required={true}
              type="email"
            />{" "}
            <button
              className="inline-flex items-center justify-center gap-1 px-6 py-2.5 rounded-full bg-[#1746B3] text-white font-label-ui text-label-ui hover:bg-[#123996] transition-colors shadow-sm"
              type="submit"
            >
              {" "}
              <span>{pageContent.text[248]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
            </button>{" "}
          </form>{" "}
          <div className="flex items-center gap-1.5 text-slate-400 font-label-mono-sm text-[11px] justify-start md:justify-center">
            {" "}
            <GeminiIcon name="lock" className="text-xs text-slate-400" />{" "}
            <span>{pageContent.text[249]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveSomethingWorthBuildingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#FBFBFC] px-margin md:px-margin-md lg:px-margin-lg pb-space-3xl">
      {" "}
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#070A12] text-white p-space-xl md:p-space-3xl relative overflow-hidden flex flex-col items-center text-center gap-space-lg shadow-xl">
        {" "}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>{" "}
        <div className="relative flex flex-col items-center gap-space-xs max-w-2xl">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary font-semibold">
            {pageContent.text[250]}
          </span>{" "}
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-white tracking-tight">
            {" "}
            {pageContent.text[251]}{" "}
          </h2>{" "}
          <p className="font-body-md text-body-md text-slate-400 mt-space-xs leading-relaxed">
            {" "}
            {pageContent.text[252]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="relative flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
          {" "}
          <a
            className="inline-flex items-center gap-space-xs px-8 py-3.5 rounded-full bg-primary-container text-on-primary-container font-label-ui text-label-ui hover:bg-primary hover:text-on-primary transition-all shadow-[0_0_24px_-4px_rgba(77,142,255,0.4)]"
            data-path="book-discovery"
            href={localePath(locale, "/build-system")}
          >
            {" "}
            <span className="tracking-wide">{pageContent.text[253]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-sm" />{" "}
          </a>{" "}
          <a
            className="inline-flex items-center gap-space-xs px-8 py-3.5 rounded-full bg-slate-900 text-slate-200 border border-slate-800 font-label-ui text-label-ui hover:bg-slate-800 transition-all"
            data-path="what-we-build"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <span>{pageContent.text[254]}</span>{" "}
            <GeminiIcon name="north_east" className="text-sm" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="relative pt-space-md flex items-center gap-space-md text-slate-500 font-label-mono-sm text-label-mono-sm border-t border-slate-900 w-full justify-center">
          {" "}
          <span>{pageContent.text[255]}</span> <span>{pageContent.text[256]}</span>{" "}
          <span>{pageContent.text[257]}</span>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
