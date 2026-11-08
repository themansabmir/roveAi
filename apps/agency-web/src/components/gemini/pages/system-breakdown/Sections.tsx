import { pageContent } from "@/content/gemini/system-breakdown"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function SystemsThatTurnedMessyRevenueProblemsIntoWorkingInfrastructureSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] text-slate-900 py-16 lg:py-24 relative overflow-hidden">
      {" "}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none gemini-inline-01"></div>{" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg relative z-10">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {" "}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {" "}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-blue-50 text-blue-700 shadow-sm">
              {" "}
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>{" "}
              <span className="font-label-mono-sm text-label-mono-sm tracking-wider font-semibold uppercase">
                {pageContent.text[8]}
              </span>{" "}
            </div>{" "}
            <h1 className="font-headline-lg text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 leading-[1.15]">
              {" "}
              {pageContent.text[9]}{" "}
              <span className="font-editorial-italic italic font-normal text-blue-600">
                {pageContent.text[10]}
              </span>
              {pageContent.text[11]}{" "}
            </h1>{" "}
            <p className="font-body-lg text-body-lg text-slate-600 max-w-xl">
              {" "}
              {pageContent.text[12]}{" "}
            </p>{" "}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-white shadow-sm">
              {" "}
              <div>
                {" "}
                <span className="block font-label-mono-sm text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  {pageContent.text[13]}
                </span>{" "}
                <span className="font-label-mono-md text-label-mono-md text-slate-800 font-semibold">
                  {pageContent.text[14]}
                </span>{" "}
              </div>{" "}
              <div>
                {" "}
                <span className="block font-label-mono-sm text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  {pageContent.text[15]}
                </span>{" "}
                <span className="font-label-mono-md text-label-mono-md text-slate-800 font-semibold">
                  {pageContent.text[16]}
                </span>{" "}
              </div>{" "}
              <div>
                {" "}
                <span className="block font-label-mono-sm text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  {pageContent.text[17]}
                </span>{" "}
                <span className="font-label-mono-md text-label-mono-md text-slate-800 font-semibold">
                  {pageContent.text[18]}
                </span>{" "}
              </div>{" "}
              <div>
                {" "}
                <span className="block font-label-mono-sm text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  {pageContent.text[19]}
                </span>{" "}
                <span className="inline-flex items-center gap-1.5 font-label-mono-md text-label-mono-md text-emerald-600 font-semibold">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                  {pageContent.text[20]}{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {" "}
              <a
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-label-ui text-label-ui hover:bg-blue-700 shadow-sm transition-all"
                href="#system-blueprint"
              >
                {" "}
                <span>{pageContent.text[21]}</span>{" "}
                <GeminiIcon name="arrow_downward" className="text-[16px]" />{" "}
              </a>{" "}
              <a
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-800 hover:text-blue-600 shadow-sm font-label-ui text-label-ui transition-all"
                href="#build-protocol"
              >
                {" "}
                <span>{pageContent.text[22]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-6 relative">
            {" "}
            <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
              {" "}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>{" "}
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>{" "}
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>{" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-slate-400 ml-2">
                    {pageContent.text[23]}
                  </span>{" "}
                </div>{" "}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-label-mono-sm text-[11px] font-semibold">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>{" "}
                  {pageContent.text[24]}{" "}
                </div>{" "}
              </div>{" "}
              <div className="py-5 flex flex-col gap-3">
                {" "}
                <div className="p-3.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      {" "}
                      <GeminiIcon name="sensors" className="text-[18px]" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className="font-label-mono-sm text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        {pageContent.text[25]}
                      </span>{" "}
                      <span className="font-label-mono-md text-label-mono-md text-slate-800 font-semibold">
                        {pageContent.text[26]}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-label-mono-sm text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {pageContent.text[27]}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center justify-center py-0.5 text-blue-500">
                  {" "}
                  <GeminiIcon name="south" className="text-[18px] animate-bounce" />{" "}
                </div>{" "}
                <div className="p-3.5 rounded-xl bg-blue-50/70 shadow-sm flex items-center justify-between">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      {" "}
                      <GeminiIcon name="verified_user" className="text-[18px]" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className="font-label-mono-sm text-[10px] text-blue-600 uppercase tracking-wider block font-semibold">
                        {pageContent.text[28]}
                      </span>{" "}
                      <span className="font-label-mono-md text-label-mono-md text-slate-900 font-semibold">
                        {pageContent.text[29]}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-label-mono-sm text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {pageContent.text[30]}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center justify-center py-0.5 text-blue-500">
                  {" "}
                  <GeminiIcon name="south" className="text-[18px]" />{" "}
                </div>{" "}
                <div className="p-3.5 rounded-xl bg-purple-50/60 flex items-center justify-between">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                      {" "}
                      <GeminiIcon name="psychology" className="text-[18px]" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className="font-label-mono-sm text-[10px] text-purple-600 uppercase tracking-wider block font-semibold">
                        {pageContent.text[31]}
                      </span>{" "}
                      <span className="font-label-mono-md text-label-mono-md text-slate-900 font-semibold">
                        {pageContent.text[32]}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-label-mono-sm text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {pageContent.text[33]}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center justify-center py-0.5 text-emerald-500">
                  {" "}
                  <GeminiIcon name="south" className="text-[18px]" />{" "}
                </div>{" "}
                <div className="p-3.5 rounded-xl bg-emerald-50 flex items-center justify-between">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      {" "}
                      <GeminiIcon name="bolt" className="text-[18px]" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className="font-label-mono-sm text-[10px] text-emerald-700 uppercase tracking-wider block font-semibold">
                        {pageContent.text[34]}
                      </span>{" "}
                      <span className="font-label-mono-md text-label-mono-md text-emerald-950 font-bold">
                        {pageContent.text[35]}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-label-mono-sm text-[11px] font-bold text-emerald-700 bg-white shadow-sm px-2 py-0.5 rounded">
                    {pageContent.text[36]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function TheTeamHadTheDataTheSystemDidnTSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-20 relative">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm tracking-wider uppercase text-red-600 font-bold">
            {" "}
            {pageContent.text[37]}{" "}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
            {" "}
            {pageContent.text[38]}{" "}
            <span className="font-editorial-italic italic font-normal text-blue-600">
              {pageContent.text[39]}
            </span>{" "}
          </h2>{" "}
          <p className="font-body-md text-body-md text-slate-600"> {pageContent.text[40]} </p>{" "}
        </div>{" "}
        <div className="p-8 lg:p-12 rounded-2xl bg-slate-50 relative overflow-hidden mb-12 shadow-inner">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {" "}
            <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2 relative">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-[10px] font-bold text-red-500 uppercase">
                  {pageContent.text[41]}
                </span>{" "}
                <GeminiIcon name="warning" className="text-red-500 text-[18px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-base font-bold text-slate-900">
                {pageContent.text[42]}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500">{pageContent.text[43]}</p>{" "}
              <div className="mt-2 text-center text-xs font-label-mono-sm text-red-600 bg-red-50 py-1 rounded">
                {pageContent.text[44]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2 relative">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-[10px] font-bold text-red-500 uppercase">
                  {pageContent.text[45]}
                </span>{" "}
                <GeminiIcon name="table_view" className="text-amber-500 text-[18px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-base font-bold text-slate-900">
                {pageContent.text[46]}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500">{pageContent.text[47]}</p>{" "}
              <div className="mt-2 text-center text-xs font-label-mono-sm text-amber-700 bg-amber-50 py-1 rounded">
                {pageContent.text[48]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2 relative">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-[10px] font-bold text-red-500 uppercase">
                  {pageContent.text[49]}
                </span>{" "}
                <GeminiIcon name="unsubscribe" className="text-red-500 text-[18px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-base font-bold text-slate-900">
                {pageContent.text[50]}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500">{pageContent.text[51]}</p>{" "}
              <div className="mt-2 text-center text-xs font-label-mono-sm text-red-600 bg-red-50 py-1 rounded">
                {pageContent.text[52]}
              </div>{" "}
            </div>{" "}
            <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2 relative">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <span className="font-label-mono-sm text-[10px] font-bold text-red-500 uppercase">
                  {pageContent.text[53]}
                </span>{" "}
                <GeminiIcon name="link_off" className="text-red-500 text-[18px]" />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-base font-bold text-slate-900">
                {pageContent.text[54]}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500">{pageContent.text[55]}</p>{" "}
              <div className="mt-2 text-center text-xs font-label-mono-sm text-red-600 bg-red-50 py-1 rounded">
                {pageContent.text[56]}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-8 text-center flex items-center justify-center gap-2 font-label-mono-sm text-xs text-slate-500 uppercase">
            {" "}
            <span className="w-2 h-2 rounded-full bg-red-500"></span> {pageContent.text[57]}{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {" "}
          <div className="p-6 rounded-xl bg-slate-50 shadow-sm flex flex-col gap-2">
            {" "}
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-1">
              {" "}
              <GeminiIcon name="dataset" className="" />{" "}
            </div>{" "}
            <h4 className="font-headline-sm text-lg font-bold text-slate-900">
              {pageContent.text[58]}
            </h4>{" "}
            <p className="font-body-md text-sm text-slate-600">{pageContent.text[59]}</p>{" "}
          </div>{" "}
          <div className="p-6 rounded-xl bg-slate-50 shadow-sm flex flex-col gap-2">
            {" "}
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-1">
              {" "}
              <GeminiIcon name="content_paste_go" className="" />{" "}
            </div>{" "}
            <h4 className="font-headline-sm text-lg font-bold text-slate-900">
              {pageContent.text[60]}
            </h4>{" "}
            <p className="font-body-md text-sm text-slate-600">{pageContent.text[61]}</p>{" "}
          </div>{" "}
          <div className="p-6 rounded-xl bg-slate-50 shadow-sm flex flex-col gap-2">
            {" "}
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-1">
              {" "}
              <GeminiIcon name="visibility_off" className="" />{" "}
            </div>{" "}
            <h4 className="font-headline-sm text-lg font-bold text-slate-900">
              {pageContent.text[62]}
            </h4>{" "}
            <p className="font-body-md text-sm text-slate-600">{pageContent.text[63]}</p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function The3SecondEvolutionSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] text-slate-900 py-20 relative">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm tracking-wider uppercase text-blue-600 font-bold block mb-2">
            {pageContent.text[64]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl font-bold tracking-tight text-slate-950">
            {" "}
            {pageContent.text[65]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {" "}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            {" "}
            <div className="flex items-center justify-between mb-4">
              {" "}
              <span className="px-2.5 py-1 rounded bg-red-100 text-red-700 font-label-mono-sm text-xs font-bold uppercase">
                {pageContent.text[66]}
              </span>{" "}
              <GeminiIcon name="error_outline" className="text-red-500 text-[20px]" />{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-xl font-bold text-slate-900 mb-2">
              {pageContent.text[67]}
            </h3>{" "}
            <p className="font-body-sm text-slate-600 text-sm mb-4">{pageContent.text[68]}</p>{" "}
            <ul className="flex flex-col gap-2 text-xs font-label-mono-sm text-slate-500">
              {" "}
              <li className="flex items-center gap-2">
                <span className="text-red-500">{pageContent.text[69]}</span> {pageContent.text[70]}
              </li>{" "}
              <li className="flex items-center gap-2">
                <span className="text-red-500">{pageContent.text[71]}</span> {pageContent.text[72]}
              </li>{" "}
              <li className="flex items-center gap-2">
                <span className="text-red-500">{pageContent.text[73]}</span> {pageContent.text[74]}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          <div className="lg:col-span-4 bg-blue-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            {" "}
            <div className="flex items-center justify-between mb-4">
              {" "}
              <span className="px-2.5 py-1 rounded bg-white/20 text-white font-label-mono-sm text-xs font-bold uppercase">
                {pageContent.text[75]}
              </span>{" "}
              <GeminiIcon name="memory" className="text-white text-[20px]" />{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-xl font-bold text-white mb-2">
              {pageContent.text[76]}
            </h3>{" "}
            <p className="font-body-sm text-blue-100 text-sm mb-4">{pageContent.text[77]}</p>{" "}
            <ul className="flex flex-col gap-2 text-xs font-label-mono-sm text-blue-100">
              {" "}
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">{pageContent.text[78]}</span>{" "}
                {pageContent.text[79]}
              </li>{" "}
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">{pageContent.text[80]}</span>{" "}
                {pageContent.text[81]}
              </li>{" "}
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">{pageContent.text[82]}</span>{" "}
                {pageContent.text[83]}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            {" "}
            <div className="flex items-center justify-between mb-4">
              {" "}
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-label-mono-sm text-xs font-bold uppercase">
                {pageContent.text[84]}
              </span>{" "}
              <GeminiIcon name="check_circle" className="text-emerald-600 text-[20px]" />{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-xl font-bold text-slate-900 mb-2">
              {pageContent.text[85]}
            </h3>{" "}
            <p className="font-body-sm text-slate-600 text-sm mb-4">{pageContent.text[86]}</p>{" "}
            <ul className="flex flex-col gap-2 text-xs font-label-mono-sm text-slate-600">
              {" "}
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">{pageContent.text[87]}</span>{" "}
                {pageContent.text[88]}
              </li>{" "}
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">{pageContent.text[89]}</span>{" "}
                {pageContent.text[90]}
              </li>{" "}
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">{pageContent.text[91]}</span>{" "}
                {pageContent.text[92]}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function SystemBlueprintSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="w-full bg-[#0a0e18] text-on-surface py-24 relative overflow-hidden"
      id="system-blueprint"
    >
      {" "}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>{" "}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>{" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg relative z-10">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16">
          {" "}
          <div>
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest font-semibold block mb-2">
              {" "}
              {pageContent.text[93]}{" "}
            </span>{" "}
            <h2 className="font-headline-lg text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {" "}
              {pageContent.text[94]}{" "}
            </h2>{" "}
            <p className="font-body-lg text-body-lg text-slate-400 mt-2 max-w-xl">
              {" "}
              {pageContent.text[95]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="px-3.5 py-1.5 rounded-lg bg-surface-container-high flex items-center gap-2">
              {" "}
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>{" "}
              <span className="font-label-mono-sm text-xs text-slate-300">
                {pageContent.text[96]}
              </span>{" "}
            </div>{" "}
            <div className="px-3.5 py-1.5 rounded-lg bg-surface-container-high flex items-center gap-2">
              {" "}
              <GeminiIcon name="speed" className="text-[16px] text-primary" />{" "}
              <span className="font-label-mono-sm text-xs text-slate-300">
                {pageContent.text[97]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex flex-col gap-4">
          {" "}
          <div className="p-6 rounded-2xl bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-container-high transition-all">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                {" "}
                <GeminiIcon name="radar" className="text-[24px]" />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="font-label-mono-sm text-xs text-primary font-semibold uppercase">
                    {pageContent.text[98]}
                  </span>{" "}
                  <span className="text-xs text-slate-500">{pageContent.text[99]}</span>{" "}
                  <h3 className="font-headline-sm text-lg font-bold text-white">
                    {pageContent.text[100]}
                  </h3>{" "}
                </div>{" "}
                <p className="font-body-sm text-slate-400 text-sm mt-0.5">
                  {pageContent.text[101]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-2 self-start lg:self-center font-label-mono-sm text-xs">
              {" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[102]}
              </span>{" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[103]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center justify-center text-slate-600 my-[-6px] z-10">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider bg-[#0a0e18] px-3 py-0.5 rounded text-slate-400">
              {pageContent.text[104]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-container-high transition-all">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                {" "}
                <GeminiIcon name="filter_alt" className="text-[24px]" />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="font-label-mono-sm text-xs text-indigo-300 font-semibold uppercase">
                    {pageContent.text[105]}
                  </span>{" "}
                  <span className="text-xs text-slate-500">{pageContent.text[106]}</span>{" "}
                  <h3 className="font-headline-sm text-lg font-bold text-white">
                    {pageContent.text[107]}
                  </h3>{" "}
                </div>{" "}
                <p className="font-body-sm text-slate-400 text-sm mt-0.5">
                  {pageContent.text[108]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-2 self-start lg:self-center font-label-mono-sm text-xs">
              {" "}
              <span className="px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300">
                {pageContent.text[109]}
              </span>{" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[110]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center justify-center text-slate-600 my-[-6px] z-10">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider bg-[#0a0e18] px-3 py-0.5 rounded text-slate-400">
              {pageContent.text[111]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-container-high transition-all">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                {" "}
                <GeminiIcon name="smart_toy" className="text-[24px]" />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="font-label-mono-sm text-xs text-purple-300 font-semibold uppercase">
                    {pageContent.text[112]}
                  </span>{" "}
                  <span className="text-xs text-slate-500">{pageContent.text[113]}</span>{" "}
                  <h3 className="font-headline-sm text-lg font-bold text-white">
                    {pageContent.text[114]}
                  </h3>{" "}
                </div>{" "}
                <p className="font-body-sm text-slate-400 text-sm mt-0.5">
                  {pageContent.text[115]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-2 self-start lg:self-center font-label-mono-sm text-xs">
              {" "}
              <span className="px-2.5 py-1 rounded bg-purple-950/80 text-purple-300">
                {pageContent.text[116]}
              </span>{" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[117]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center justify-center text-slate-600 my-[-6px] z-10">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider bg-[#0a0e18] px-3 py-0.5 rounded text-slate-400">
              {pageContent.text[118]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-container-high transition-all">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                {" "}
                <GeminiIcon name="forward_to_inbox" className="text-[24px]" />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="font-label-mono-sm text-xs text-primary font-semibold uppercase">
                    {pageContent.text[119]}
                  </span>{" "}
                  <span className="text-xs text-slate-500">{pageContent.text[120]}</span>{" "}
                  <h3 className="font-headline-sm text-lg font-bold text-white">
                    {pageContent.text[121]}
                  </h3>{" "}
                </div>{" "}
                <p className="font-body-sm text-slate-400 text-sm mt-0.5">
                  {pageContent.text[122]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-2 self-start lg:self-center font-label-mono-sm text-xs">
              {" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[123]}
              </span>{" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[124]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center justify-center text-slate-600 my-[-6px] z-10">
            {" "}
            <span className="font-label-mono-sm text-[11px] uppercase tracking-wider bg-[#0a0e18] px-3 py-0.5 rounded text-slate-400">
              {pageContent.text[125]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-container-high transition-all">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                {" "}
                <GeminiIcon name="database" className="text-[24px]" />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="font-label-mono-sm text-xs text-emerald-400 font-semibold uppercase">
                    {pageContent.text[126]}
                  </span>{" "}
                  <span className="text-xs text-slate-500">{pageContent.text[127]}</span>{" "}
                  <h3 className="font-headline-sm text-lg font-bold text-white">
                    {pageContent.text[128]}
                  </h3>{" "}
                </div>{" "}
                <p className="font-body-sm text-slate-400 text-sm mt-0.5">
                  {pageContent.text[129]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-2 self-start lg:self-center font-label-mono-sm text-xs">
              {" "}
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300">
                {pageContent.text[130]}
              </span>{" "}
              <span className="px-2.5 py-1 rounded bg-surface-container-highest text-slate-300">
                {pageContent.text[131]}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function EngineeredDirectlyIntoProductionSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-20 relative">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="max-w-2xl mb-12">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-blue-600 font-bold block mb-2">
            {pageContent.text[132]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
            {" "}
            {pageContent.text[133]}{" "}
          </h2>{" "}
          <p className="font-body-md text-body-md text-slate-600 mt-2">
            {" "}
            {pageContent.text[134]}{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          <div className="p-6 rounded-2xl bg-[#f8f9fa] shadow-sm flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                {" "}
                <GeminiIcon name="satellite_alt" className="text-[22px]" />{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                {pageContent.text[135]}
              </span>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 mb-2">
                {pageContent.text[136]}
              </h3>{" "}
              <p className="font-body-sm text-sm text-slate-600">{pageContent.text[137]}</p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-200/60 font-label-mono-sm text-xs text-slate-500">
              {" "}
              {pageContent.text[138]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#f8f9fa] shadow-sm flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                {" "}
                <GeminiIcon name="cognition" className="text-[22px]" />{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                {pageContent.text[139]}
              </span>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 mb-2">
                {pageContent.text[140]}
              </h3>{" "}
              <p className="font-body-sm text-sm text-slate-600">{pageContent.text[141]}</p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-200/60 font-label-mono-sm text-xs text-slate-500">
              {" "}
              {pageContent.text[142]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#f8f9fa] shadow-sm flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                {" "}
                <GeminiIcon name="send_time_extension" className="text-[22px]" />{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                {pageContent.text[143]}
              </span>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 mb-2">
                {pageContent.text[144]}
              </h3>{" "}
              <p className="font-body-sm text-sm text-slate-600">{pageContent.text[145]}</p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-200/60 font-label-mono-sm text-xs text-slate-500">
              {" "}
              {pageContent.text[146]}{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#f8f9fa] shadow-sm flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                {" "}
                <GeminiIcon name="update" className="text-[22px]" />{" "}
              </div>{" "}
              <span className="font-label-mono-sm text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                {pageContent.text[147]}
              </span>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 mb-2">
                {pageContent.text[148]}
              </h3>{" "}
              <p className="font-body-sm text-sm text-slate-600">{pageContent.text[149]}</p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-200/60 font-label-mono-sm text-xs text-slate-500">
              {" "}
              {pageContent.text[150]}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function MeasurableOperationalTransformationSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] text-slate-900 py-20 relative">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-blue-600 font-bold block mb-2">
            {pageContent.text[151]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
            {" "}
            {pageContent.text[152]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {" "}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col">
            {" "}
            <span className="font-display-lg text-4xl lg:text-5xl font-bold text-blue-600 tracking-tight">
              {pageContent.text[153]}
            </span>{" "}
            <span className="font-headline-sm text-sm font-semibold text-slate-900 mt-2">
              {pageContent.text[154]}
            </span>{" "}
            <span className="font-body-sm text-xs text-slate-500 mt-1">
              {pageContent.text[155]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col">
            {" "}
            <span className="font-display-lg text-4xl lg:text-5xl font-bold text-emerald-600 tracking-tight">
              {pageContent.text[156]}
            </span>{" "}
            <span className="font-headline-sm text-sm font-semibold text-slate-900 mt-2">
              {pageContent.text[157]}
            </span>{" "}
            <span className="font-body-sm text-xs text-slate-500 mt-1">
              {pageContent.text[158]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col">
            {" "}
            <span className="font-display-lg text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              {pageContent.text[159]}
            </span>{" "}
            <span className="font-headline-sm text-sm font-semibold text-slate-900 mt-2">
              {pageContent.text[160]}
            </span>{" "}
            <span className="font-body-sm text-xs text-slate-500 mt-1">
              {pageContent.text[161]}
            </span>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col">
            {" "}
            <span className="font-display-lg text-4xl lg:text-5xl font-bold text-purple-600 tracking-tight">
              {pageContent.text[162]}
            </span>{" "}
            <span className="font-headline-sm text-sm font-semibold text-slate-900 mt-2">
              {pageContent.text[163]}
            </span>{" "}
            <span className="font-body-sm text-xs text-slate-500 mt-1">
              {pageContent.text[164]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {" "}
          <div className="grid grid-cols-2 p-5 bg-slate-100/70 border-b border-slate-200 font-label-mono-sm text-xs uppercase tracking-wider font-bold">
            {" "}
            <div className="text-slate-500">{pageContent.text[165]}</div>{" "}
            <div className="text-blue-600">{pageContent.text[166]}</div>{" "}
          </div>{" "}
          <div className="divide-y divide-slate-100">
            {" "}
            <div className="grid grid-cols-2 p-5 items-center">
              {" "}
              <div className="flex items-center gap-3 pr-4">
                {" "}
                <span className="text-red-500 text-sm font-bold">{pageContent.text[167]}</span>{" "}
                <span className="text-slate-600 text-sm">{pageContent.text[168]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 pl-4">
                {" "}
                <span className="text-emerald-600 text-sm font-bold">
                  {pageContent.text[169]}
                </span>{" "}
                <span className="text-slate-900 font-medium text-sm">
                  {pageContent.text[170]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 p-5 items-center">
              {" "}
              <div className="flex items-center gap-3 pr-4">
                {" "}
                <span className="text-red-500 text-sm font-bold">{pageContent.text[171]}</span>{" "}
                <span className="text-slate-600 text-sm">{pageContent.text[172]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 pl-4">
                {" "}
                <span className="text-emerald-600 text-sm font-bold">
                  {pageContent.text[173]}
                </span>{" "}
                <span className="text-slate-900 font-medium text-sm">
                  {pageContent.text[174]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 p-5 items-center">
              {" "}
              <div className="flex items-center gap-3 pr-4">
                {" "}
                <span className="text-red-500 text-sm font-bold">{pageContent.text[175]}</span>{" "}
                <span className="text-slate-600 text-sm">{pageContent.text[176]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 pl-4">
                {" "}
                <span className="text-emerald-600 text-sm font-bold">
                  {pageContent.text[177]}
                </span>{" "}
                <span className="text-slate-900 font-medium text-sm">
                  {pageContent.text[178]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 p-5 items-center">
              {" "}
              <div className="flex items-center gap-3 pr-4">
                {" "}
                <span className="text-red-500 text-sm font-bold">{pageContent.text[179]}</span>{" "}
                <span className="text-slate-600 text-sm">{pageContent.text[180]}</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 pl-4">
                {" "}
                <span className="text-emerald-600 text-sm font-bold">
                  {pageContent.text[181]}
                </span>{" "}
                <span className="text-slate-900 font-medium text-sm">
                  {pageContent.text[182]}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function AutomationDidnTReplaceTheTeamItRemovedTheFrictionAroundThemSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-20 relative">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-blue-600 font-bold block mb-2">
            {pageContent.text[183]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
            {" "}
            {pageContent.text[184]} <br className="hidden sm:inline" />
            <span className="font-editorial-italic italic font-normal text-blue-600">
              {pageContent.text[185]}
            </span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="p-8 lg:p-12 rounded-2xl bg-slate-50 relative shadow-sm">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            {" "}
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="px-2 py-0.5 rounded text-[10px] font-label-mono-sm bg-blue-100 text-blue-800 font-bold uppercase">
                    {pageContent.text[186]}
                  </span>{" "}
                  <GeminiIcon name="person" className="text-blue-600 text-[18px]" />{" "}
                </div>{" "}
                <h4 className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[187]}
                </h4>{" "}
                <p className="font-body-sm text-xs text-slate-500 mt-1">
                  {pageContent.text[188]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="px-2 py-0.5 rounded text-[10px] font-label-mono-sm bg-purple-100 text-purple-800 font-bold uppercase">
                    {pageContent.text[189]}
                  </span>{" "}
                  <GeminiIcon name="smart_toy" className="text-purple-600 text-[18px]" />{" "}
                </div>{" "}
                <h4 className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[190]}
                </h4>{" "}
                <p className="font-body-sm text-xs text-slate-500 mt-1">
                  {pageContent.text[191]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="px-2 py-0.5 rounded text-[10px] font-label-mono-sm bg-purple-100 text-purple-800 font-bold uppercase">
                    {pageContent.text[192]}
                  </span>{" "}
                  <GeminiIcon name="psychology" className="text-purple-600 text-[18px]" />{" "}
                </div>{" "}
                <h4 className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[193]}
                </h4>{" "}
                <p className="font-body-sm text-xs text-slate-500 mt-1">
                  {pageContent.text[194]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-amber-50/60 shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="px-2 py-0.5 rounded text-[10px] font-label-mono-sm bg-amber-200 text-amber-900 font-bold uppercase">
                    {pageContent.text[195]}
                  </span>{" "}
                  <GeminiIcon name="verified" className="text-amber-700 text-[18px]" />{" "}
                </div>{" "}
                <h4 className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[196]}
                </h4>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[197]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="px-2 py-0.5 rounded text-[10px] font-label-mono-sm bg-indigo-100 text-indigo-800 font-bold uppercase">
                    {pageContent.text[198]}
                  </span>{" "}
                  <GeminiIcon name="send" className="text-indigo-600 text-[18px]" />{" "}
                </div>{" "}
                <h4 className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[199]}
                </h4>{" "}
                <p className="font-body-sm text-xs text-slate-500 mt-1">
                  {pageContent.text[200]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-xl bg-emerald-50/60 shadow-sm flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between mb-2">
                  {" "}
                  <span className="px-2 py-0.5 rounded text-[10px] font-label-mono-sm bg-emerald-200 text-emerald-900 font-bold uppercase">
                    {pageContent.text[201]}
                  </span>{" "}
                  <GeminiIcon name="handshake" className="text-emerald-700 text-[18px]" />{" "}
                </div>{" "}
                <h4 className="font-headline-sm text-sm font-bold text-slate-900">
                  {pageContent.text[202]}
                </h4>{" "}
                <p className="font-body-sm text-xs text-slate-600 mt-1">
                  {pageContent.text[203]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function BuildProtocolSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] text-slate-900 py-20 relative" id="build-protocol">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-blue-600 font-bold block mb-2">
            {pageContent.text[204]}
          </span>{" "}
          <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
            {" "}
            {pageContent.text[205]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {" "}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-xs font-bold text-blue-600 uppercase">
                {pageContent.text[206]}
              </span>{" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-base font-bold text-slate-900">
              {pageContent.text[207]}
            </h3>{" "}
            <p className="font-body-sm text-xs text-slate-500">{pageContent.text[208]}</p>{" "}
          </div>{" "}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-xs font-bold text-blue-600 uppercase">
                {pageContent.text[209]}
              </span>{" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-base font-bold text-slate-900">
              {pageContent.text[210]}
            </h3>{" "}
            <p className="font-body-sm text-xs text-slate-500">{pageContent.text[211]}</p>{" "}
          </div>{" "}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-xs font-bold text-blue-600 uppercase">
                {pageContent.text[212]}
              </span>{" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-base font-bold text-slate-900">
              {pageContent.text[213]}
            </h3>{" "}
            <p className="font-body-sm text-xs text-slate-500">{pageContent.text[214]}</p>{" "}
          </div>{" "}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-xs font-bold text-blue-600 uppercase">
                {pageContent.text[215]}
              </span>{" "}
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-base font-bold text-slate-900">
              {pageContent.text[216]}
            </h3>{" "}
            <p className="font-body-sm text-xs text-slate-500">{pageContent.text[217]}</p>{" "}
          </div>{" "}
          <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-2">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-sm text-xs font-bold text-emerald-600 uppercase">
                {pageContent.text[218]}
              </span>{" "}
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
            </div>{" "}
            <h3 className="font-headline-sm text-base font-bold text-slate-900">
              {pageContent.text[219]}
            </h3>{" "}
            <p className="font-body-sm text-xs text-slate-500">{pageContent.text[220]}</p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section9Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white text-slate-900 py-16 relative">
      {" "}
      <div className="max-w-4xl mx-auto px-margin md:px-margin-md text-center">
        {" "}
        <div className="p-8 lg:p-12 rounded-3xl bg-slate-50 relative overflow-hidden shadow-sm">
          {" "}
          <GeminiIcon
            name="format_quote"
            className="text-slate-300 text-5xl mb-4 block mx-auto"
          />{" "}
          <blockquote className="font-editorial-italic text-2xl md:text-3xl text-slate-900 leading-relaxed max-w-2xl mx-auto font-normal">
            {" "}
            {pageContent.text[221]}{" "}
            <span className="italic text-blue-600">{pageContent.text[222]}</span>
            {pageContent.text[223]}{" "}
          </blockquote>{" "}
          <div className="mt-6 flex flex-col items-center">
            {" "}
            <span className="font-headline-sm text-sm font-bold text-slate-900">
              {pageContent.text[224]}
            </span>{" "}
            <span className="font-label-mono-sm text-xs text-slate-500">
              {pageContent.text[225]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function MoreSystemsWeVeEngineeredSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#f8f9fa] text-slate-900 py-20 relative">
      {" "}
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg">
        {" "}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          {" "}
          <div>
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-blue-600 font-bold block mb-1">
              {pageContent.text[226]}
            </span>{" "}
            <h2 className="font-headline-lg text-3xl font-bold tracking-tight text-slate-950">
              {" "}
              {pageContent.text[227]}{" "}
            </h2>{" "}
          </div>{" "}
          <a
            className="inline-flex items-center gap-1.5 font-label-ui text-sm text-blue-600 hover:text-blue-700 font-semibold mt-3 md:mt-0"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <span>{pageContent.text[228]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {" "}
          <a
            className="group p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <span className="px-2.5 py-0.5 rounded text-[11px] font-label-mono-sm bg-slate-100 text-slate-700 font-semibold">
                  {pageContent.text[229]}
                </span>{" "}
                <GeminiIcon
                  name="arrow_outward"
                  className="text-slate-300 group-hover:text-blue-600 transition-colors text-[20px]"
                />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {" "}
                {pageContent.text[230]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500 mt-2">
                {pageContent.text[231]}
              </p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-100 font-label-mono-sm text-xs text-emerald-600 font-semibold">
              {" "}
              {pageContent.text[232]}{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <span className="px-2.5 py-0.5 rounded text-[11px] font-label-mono-sm bg-slate-100 text-slate-700 font-semibold">
                  {pageContent.text[233]}
                </span>{" "}
                <GeminiIcon
                  name="arrow_outward"
                  className="text-slate-300 group-hover:text-blue-600 transition-colors text-[20px]"
                />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {" "}
                {pageContent.text[234]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500 mt-2">
                {pageContent.text[235]}
              </p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-100 font-label-mono-sm text-xs text-emerald-600 font-semibold">
              {" "}
              {pageContent.text[236]}{" "}
            </div>{" "}
          </a>{" "}
          <a
            className="group p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            data-path="work"
            href={localePath(locale, "/case-study")}
          >
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <span className="px-2.5 py-0.5 rounded text-[11px] font-label-mono-sm bg-slate-100 text-slate-700 font-semibold">
                  {pageContent.text[237]}
                </span>{" "}
                <GeminiIcon
                  name="arrow_outward"
                  className="text-slate-300 group-hover:text-blue-600 transition-colors text-[20px]"
                />{" "}
              </div>{" "}
              <h3 className="font-headline-sm text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {" "}
                {pageContent.text[238]}{" "}
              </h3>{" "}
              <p className="font-body-sm text-xs text-slate-500 mt-2">
                {pageContent.text[239]}
              </p>{" "}
            </div>{" "}
            <div className="mt-6 pt-4 border-t border-slate-100 font-label-mono-sm text-xs text-emerald-600 font-semibold">
              {" "}
              {pageContent.text[240]}{" "}
            </div>{" "}
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveARevenueProblemWorthEngineeringSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#0a0e18] text-white py-24 relative overflow-hidden">
      {" "}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {" "}
        <div className="w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>{" "}
      </div>{" "}
      <div className="max-w-4xl mx-auto px-margin md:px-margin-md text-center relative z-10 flex flex-col items-center gap-6">
        {" "}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-primary border-none shadow-sm">
          {" "}
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>{" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider font-semibold">
            {pageContent.text[241]}
          </span>{" "}
        </div>{" "}
        <h2 className="font-headline-lg text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {" "}
          {pageContent.text[242]} <br />{" "}
          <span className="font-editorial-italic italic font-normal text-primary">
            {pageContent.text[243]}
          </span>{" "}
        </h2>{" "}
        <p className="font-body-lg text-body-lg text-slate-400 max-w-xl">
          {" "}
          {pageContent.text[244]}{" "}
        </p>{" "}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {" "}
          <a
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-blue-600 text-white font-label-ui text-label-ui hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all font-semibold"
            data-path="book-a-discovery"
            href={localePath(locale, "/build-system")}
          >
            {" "}
            <span>{pageContent.text[245]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
          </a>{" "}
          <a
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-surface-container-high text-on-surface hover:text-white hover:bg-surface-bright font-label-ui text-label-ui transition-all font-semibold"
            data-path="what-we-build"
            href={localePath(locale, "/what-we-build")}
          >
            {" "}
            <span>{pageContent.text[246]}</span>{" "}
            <GeminiIcon name="terminal" className="text-[18px]" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-slate-500 font-label-mono-sm text-xs">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <GeminiIcon name="engineering" className="text-primary text-[16px]" />{" "}
            <span>{pageContent.text[247]}</span>{" "}
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <GeminiIcon name="schedule" className="text-primary text-[16px]" />{" "}
            <span>{pageContent.text[248]}</span>{" "}
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <GeminiIcon name="security" className="text-primary text-[16px]" />{" "}
            <span>{pageContent.text[249]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
