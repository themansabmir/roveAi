import { pageContent } from "@/content/gemini/what-we-build"
import type { Locale } from "@rove/cms/constants"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function SystemsBuiltAroundHowYourBusinessActuallyGrowsSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden bg-[#FAFAFD] border-b border-slate-200/60">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {" "}
          <div className="lg:col-span-6 space-y-6">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-mono font-medium tracking-wide">
              {" "}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>{" "}
              {pageContent.text[10]}{" "}
            </div>{" "}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-slate-950 tracking-tight leading-[1.1]">
              {" "}
              {pageContent.text[11]}{" "}
              <span className="italic text-blue-600 font-serif font-normal">
                {pageContent.text[12]}
              </span>{" "}
            </h1>{" "}
            <p className="font-sans text-lg text-slate-600 max-w-lg leading-relaxed">
              {" "}
              {pageContent.text[13]}{" "}
            </p>{" "}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {" "}
              <a
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
                href="#contact"
              >
                {" "}
                <span>{pageContent.text[14]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-base" />{" "}
              </a>{" "}
              <a
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-800 border border-slate-200 font-medium text-sm hover:bg-slate-50 transition-all shadow-sm"
                href="#what-we-build"
              >
                {" "}
                <span>{pageContent.text[15]}</span>{" "}
              </a>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-6">
            {" "}
            <div className="relative bg-white rounded-3xl p-8 lg:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50">
              {" "}
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
                {" "}
                <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">
                  {pageContent.text[16]}
                </span>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                  <span className="font-mono text-xs text-slate-700 font-medium">
                    {pageContent.text[17]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-4">
                {" "}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-700 shadow-sm">
                      {" "}
                      {pageContent.text[18]}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-display text-sm font-bold text-slate-900">
                        {pageContent.text[19]}
                      </div>{" "}
                      <div className="font-mono text-xs text-slate-500">
                        {pageContent.text[20]}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-xs text-slate-400 group-hover:text-blue-600 transition-colors">
                    {pageContent.text[21]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-2">
                  {" "}
                  <div className="w-px h-5 bg-gradient-to-b from-blue-300 to-blue-500"></div>{" "}
                </div>{" "}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-700 shadow-sm">
                      {" "}
                      {pageContent.text[22]}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-display text-sm font-bold text-slate-900">
                        {pageContent.text[23]}
                      </div>{" "}
                      <div className="font-mono text-xs text-slate-500">
                        {pageContent.text[24]}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    {pageContent.text[25]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-2">
                  {" "}
                  <div className="w-px h-5 bg-gradient-to-b from-blue-500 to-indigo-500"></div>{" "}
                </div>{" "}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono text-xs font-bold text-indigo-700 shadow-sm">
                      {" "}
                      {pageContent.text[26]}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-display text-sm font-bold text-slate-900">
                        {pageContent.text[27]}
                      </div>{" "}
                      <div className="font-mono text-xs text-slate-500">
                        {pageContent.text[28]}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-xs text-indigo-600 font-medium">
                    {pageContent.text[29]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-2">
                  {" "}
                  <div className="w-px h-5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>{" "}
                </div>{" "}
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center font-mono text-xs font-bold text-purple-700 shadow-sm">
                      {" "}
                      {pageContent.text[30]}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-display text-sm font-bold text-slate-900">
                        {pageContent.text[31]}
                      </div>{" "}
                      <div className="font-mono text-xs text-slate-500">
                        {pageContent.text[32]}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">
                    {pageContent.text[33]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-center -my-2">
                  {" "}
                  <div className="w-px h-5 bg-gradient-to-b from-purple-500 to-emerald-500"></div>{" "}
                </div>{" "}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-mono text-xs font-bold text-white">
                      {" "}
                      {pageContent.text[34]}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-display text-sm font-bold">
                        {pageContent.text[35]}
                      </div>{" "}
                      <div className="font-mono text-xs text-blue-100">
                        {pageContent.text[36]}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white text-blue-800">
                    {" "}
                    {pageContent.text[37]}{" "}
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

export function WhatWeBuildSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-white" id="what-we-build">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="max-w-2xl mb-16">
          {" "}
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold mb-2">
            {pageContent.text[38]}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[39]}{" "}
            <span className="italic font-serif font-normal text-blue-600">
              {pageContent.text[40]}
            </span>{" "}
          </h2>{" "}
          <p className="text-slate-600 mt-3 text-base"> {pageContent.text[41]} </p>{" "}
        </div>{" "}
        <div className="space-y-12">
          {" "}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FAFAFD] border border-slate-200/90 shadow-sm">
            {" "}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {" "}
              <div className="lg:col-span-4 space-y-2">
                {" "}
                <span className="text-xs font-mono text-blue-600 font-semibold">
                  {pageContent.text[42]}
                </span>{" "}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                  {pageContent.text[43]}
                </h3>{" "}
                <p className="text-sm text-slate-600">{pageContent.text[44]}</p>{" "}
              </div>{" "}
              <div className="lg:col-span-8">
                {" "}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {" "}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                    {" "}
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {pageContent.text[45]}
                    </span>{" "}
                    <div className="font-display text-xs font-bold text-slate-900">
                      {pageContent.text[46]}
                    </div>{" "}
                    <div className="font-mono text-[11px] text-blue-600">
                      {pageContent.text[47]}
                    </div>{" "}
                  </div>{" "}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                    {" "}
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {pageContent.text[48]}
                    </span>{" "}
                    <div className="font-display text-xs font-bold text-slate-900">
                      {pageContent.text[49]}
                    </div>{" "}
                    <div className="font-mono text-[11px] text-indigo-600">
                      {pageContent.text[50]}
                    </div>{" "}
                  </div>{" "}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                    {" "}
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {pageContent.text[51]}
                    </span>{" "}
                    <div className="font-display text-xs font-bold text-slate-900">
                      {pageContent.text[52]}
                    </div>{" "}
                    <div className="font-mono text-[11px] text-purple-600">
                      {pageContent.text[53]}
                    </div>{" "}
                  </div>{" "}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                    {" "}
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {pageContent.text[54]}
                    </span>{" "}
                    <div className="font-display text-xs font-bold text-slate-900">
                      {pageContent.text[55]}
                    </div>{" "}
                    <div className="font-mono text-[11px] text-blue-600">
                      {pageContent.text[56]}
                    </div>{" "}
                  </div>{" "}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm col-span-2 sm:col-span-1">
                    {" "}
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {pageContent.text[57]}
                    </span>{" "}
                    <div className="font-display text-xs font-bold text-slate-900">
                      {pageContent.text[58]}
                    </div>{" "}
                    <div className="font-mono text-[11px] text-emerald-600">
                      {pageContent.text[59]}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FAFAFD] border border-slate-200/90 shadow-sm">
            {" "}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {" "}
              <div className="lg:col-span-5 space-y-2">
                {" "}
                <span className="text-xs font-mono text-indigo-600 font-semibold">
                  {pageContent.text[60]}
                </span>{" "}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                  {pageContent.text[61]}
                </h3>{" "}
                <p className="text-sm text-slate-600">{pageContent.text[62]}</p>{" "}
              </div>{" "}
              <div className="lg:col-span-7">
                {" "}
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
                  {" "}
                  <div className="grid grid-cols-2 gap-4">
                    {" "}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      {" "}
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        {pageContent.text[63]}
                      </div>{" "}
                      <div className="font-display text-xs font-bold text-slate-900 mt-0.5">
                        {pageContent.text[64]}
                      </div>{" "}
                      <p className="text-[11px] text-slate-500 mt-1">{pageContent.text[65]}</p>{" "}
                    </div>{" "}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      {" "}
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        {pageContent.text[66]}
                      </div>{" "}
                      <div className="font-display text-xs font-bold text-slate-900 mt-0.5">
                        {pageContent.text[67]}
                      </div>{" "}
                      <p className="text-[11px] text-slate-500 mt-1">{pageContent.text[68]}</p>{" "}
                    </div>{" "}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      {" "}
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        {pageContent.text[69]}
                      </div>{" "}
                      <div className="font-display text-xs font-bold text-slate-900 mt-0.5">
                        {pageContent.text[70]}
                      </div>{" "}
                      <p className="text-[11px] text-slate-500 mt-1">{pageContent.text[71]}</p>{" "}
                    </div>{" "}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      {" "}
                      <div className="text-[11px] font-mono text-slate-400 uppercase">
                        {pageContent.text[72]}
                      </div>{" "}
                      <div className="font-display text-xs font-bold text-slate-900 mt-0.5">
                        {pageContent.text[73]}
                      </div>{" "}
                      <p className="text-[11px] text-slate-500 mt-1">{pageContent.text[74]}</p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                    {" "}
                    <span>{pageContent.text[75]}</span>{" "}
                    <span className="text-emerald-600 font-semibold">
                      {pageContent.text[76]}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FAFAFD] border border-slate-200/90 shadow-sm">
            {" "}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {" "}
              <div className="lg:col-span-5 space-y-2">
                {" "}
                <span className="text-xs font-mono text-purple-600 font-semibold">
                  {pageContent.text[77]}
                </span>{" "}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                  {pageContent.text[78]}
                </h3>{" "}
                <p className="text-sm text-slate-600">{pageContent.text[79]}</p>{" "}
              </div>{" "}
              <div className="lg:col-span-7">
                {" "}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  {" "}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                    {" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                      <span className="font-display font-semibold text-slate-900">
                        {pageContent.text[80]}
                      </span>{" "}
                    </div>{" "}
                    <span className="font-mono text-slate-400">{pageContent.text[81]}</span>{" "}
                  </div>{" "}
                  <div className="py-4 space-y-3">
                    {" "}
                    <div className="flex items-center justify-between text-xs">
                      {" "}
                      <span className="text-slate-600">{pageContent.text[82]}</span>{" "}
                      <span className="font-mono text-emerald-600 font-semibold">
                        {pageContent.text[83]}
                      </span>{" "}
                    </div>{" "}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      {" "}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-4/5"></div>{" "}
                    </div>{" "}
                    <div className="flex items-center justify-between text-xs pt-1 font-mono text-slate-500">
                      {" "}
                      <span>{pageContent.text[84]}</span> <span>{pageContent.text[85]}</span>{" "}
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

export function ConnectedSystemSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section
      className="py-24 lg:py-32 bg-[#0A0E18] text-white relative overflow-hidden"
      id="connected-system"
    >
      {" "}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none"></div>{" "}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {" "}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-mono">
            {" "}
            {pageContent.text[86]}{" "}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {" "}
            {pageContent.text[87]}{" "}
            <span className="italic font-serif font-normal text-blue-400">
              {pageContent.text[88]}
            </span>{" "}
          </h2>{" "}
          <p className="text-slate-400 text-base max-w-xl mx-auto"> {pageContent.text[89]} </p>{" "}
        </div>{" "}
        <div className="max-w-5xl mx-auto bg-[#111726]/80 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl backdrop-blur-sm">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center text-center">
            {" "}
            <div className="p-6 rounded-2xl bg-[#172033] border border-slate-700/60 flex flex-col items-center">
              {" "}
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
                {pageContent.text[90]}
              </span>{" "}
              <div className="font-display text-base font-bold text-white">
                {pageContent.text[91]}
              </div>{" "}
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                {pageContent.text[92]}
              </p>{" "}
            </div>{" "}
            <div className="hidden md:flex justify-center text-slate-600 text-xl font-mono">
              {pageContent.text[93]}
            </div>{" "}
            <div className="p-6 rounded-2xl bg-[#172033] border border-slate-700/60 flex flex-col items-center">
              {" "}
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
                {pageContent.text[94]}
              </span>{" "}
              <div className="font-display text-base font-bold text-white">
                {pageContent.text[95]}
              </div>{" "}
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                {pageContent.text[96]}
              </p>{" "}
            </div>{" "}
            <div className="hidden md:flex justify-center text-slate-600 text-xl font-mono">
              {pageContent.text[97]}
            </div>{" "}
            <div className="p-6 rounded-2xl bg-[#172033] border border-slate-700/60 flex flex-col items-center ring-1 ring-blue-500/30">
              {" "}
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
                {pageContent.text[98]}
              </span>{" "}
              <div className="font-display text-base font-bold text-white">
                {pageContent.text[99]}
              </div>{" "}
              <p className="font-mono text-[11px] text-slate-400 mt-1">
                {pageContent.text[100]}
              </p>{" "}
            </div>{" "}
            <div className="hidden md:flex justify-center text-slate-600 text-xl font-mono">
              {pageContent.text[101]}
            </div>{" "}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-600/30 to-blue-800/40 border border-blue-500/40 flex flex-col items-center col-span-1 md:col-span-6 lg:col-span-1">
              {" "}
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
                {pageContent.text[102]}
              </span>{" "}
              <div className="font-display text-base font-bold text-white">
                {pageContent.text[103]}
              </div>{" "}
              <p className="font-mono text-[11px] text-emerald-400 mt-1">
                {pageContent.text[104]}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
            {" "}
            <span>{pageContent.text[105]}</span>{" "}
            <span className="text-blue-400">{pageContent.text[106]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function TurnSignalsIntoPipelineSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-[#FAFAFD] border-b border-slate-200/60">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {" "}
          <div className="lg:col-span-4 space-y-3">
            {" "}
            <div className="text-xs font-mono text-blue-600 font-semibold uppercase tracking-wider">
              {pageContent.text[107]}
            </div>{" "}
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              {" "}
              {pageContent.text[108]}{" "}
            </h2>{" "}
            <p className="text-slate-600 text-base leading-relaxed">
              {" "}
              {pageContent.text[109]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="lg:col-span-8">
            {" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {" "}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                {" "}
                <div className="font-mono text-xs font-bold text-blue-600">
                  {pageContent.text[110]}
                </div>{" "}
                <h4 className="font-display text-base font-bold text-slate-900">
                  {pageContent.text[111]}
                </h4>{" "}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pageContent.text[112]}
                </p>{" "}
              </div>{" "}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                {" "}
                <div className="font-mono text-xs font-bold text-indigo-600">
                  {pageContent.text[113]}
                </div>{" "}
                <h4 className="font-display text-base font-bold text-slate-900">
                  {pageContent.text[114]}
                </h4>{" "}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pageContent.text[115]}
                </p>{" "}
              </div>{" "}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                {" "}
                <div className="font-mono text-xs font-bold text-purple-600">
                  {pageContent.text[116]}
                </div>{" "}
                <h4 className="font-display text-base font-bold text-slate-900">
                  {pageContent.text[117]}
                </h4>{" "}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pageContent.text[118]}
                </p>{" "}
              </div>{" "}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
                {" "}
                <div className="font-mono text-xs font-bold text-emerald-600">
                  {pageContent.text[119]}
                </div>{" "}
                <h4 className="font-display text-base font-bold text-slate-900">
                  {pageContent.text[120]}
                </h4>{" "}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pageContent.text[121]}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function AiComparisonSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-white border-b border-slate-200/60" id="ai-comparison">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          {" "}
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
            {pageContent.text[122]}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[123]}{" "}
            <span className="italic font-serif font-normal text-blue-600">
              {pageContent.text[124]}
            </span>{" "}
          </h2>{" "}
          <p className="text-slate-600 text-sm"> {pageContent.text[125]} </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {" "}
          <div className="p-8 rounded-3xl bg-rose-50/30 border border-rose-100/80 space-y-6">
            {" "}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              {" "}
              <span className="font-mono text-xs text-rose-600 font-semibold">
                {pageContent.text[126]}
              </span>{" "}
              <GeminiIcon name="close" className="text-rose-400 text-lg" />{" "}
            </div>{" "}
            <div className="space-y-4 font-mono text-xs">
              {" "}
              <div className="p-3 bg-white rounded-xl border border-rose-100 text-slate-700 flex justify-between">
                {" "}
                <span>{pageContent.text[127]}</span>{" "}
                <span className="text-rose-500 font-medium">{pageContent.text[128]}</span>{" "}
              </div>{" "}
              <div className="text-center text-rose-300">{pageContent.text[129]}</div>{" "}
              <div className="p-3 bg-white rounded-xl border border-rose-100 text-slate-700 flex justify-between">
                {" "}
                <span>{pageContent.text[130]}</span>{" "}
                <span className="text-rose-500 font-medium">{pageContent.text[131]}</span>{" "}
              </div>{" "}
              <div className="text-center text-rose-300">{pageContent.text[132]}</div>{" "}
              <div className="p-3 bg-white rounded-xl border border-rose-100 text-slate-700 flex justify-between">
                {" "}
                <span>{pageContent.text[133]}</span>{" "}
                <span className="text-rose-500 font-medium">{pageContent.text[134]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-8 rounded-3xl bg-blue-50/30 border border-blue-100/80 space-y-6 shadow-sm">
            {" "}
            <div className="flex items-center justify-between pb-4 border-b border-blue-100">
              {" "}
              <span className="font-mono text-xs text-blue-600 font-semibold">
                {pageContent.text[135]}
              </span>{" "}
              <GeminiIcon name="check_circle" className="text-emerald-500 text-lg" />{" "}
            </div>{" "}
            <div className="space-y-4 font-mono text-xs">
              {" "}
              <div className="p-3 bg-white rounded-xl border border-blue-100 text-slate-800 flex justify-between shadow-xs">
                {" "}
                <span>{pageContent.text[136]}</span>{" "}
                <span className="text-blue-600 font-medium">{pageContent.text[137]}</span>{" "}
              </div>{" "}
              <div className="text-center text-blue-400">{pageContent.text[138]}</div>{" "}
              <div className="p-3 bg-white rounded-xl border border-blue-100 text-slate-800 flex justify-between shadow-xs">
                {" "}
                <span>{pageContent.text[139]}</span>{" "}
                <span className="text-blue-600 font-medium">{pageContent.text[140]}</span>{" "}
              </div>{" "}
              <div className="text-center text-blue-400">{pageContent.text[141]}</div>{" "}
              <div className="p-3 bg-white rounded-xl border border-blue-100 text-slate-800 flex justify-between shadow-xs">
                {" "}
                <span>{pageContent.text[142]}</span>{" "}
                <span className="text-emerald-600 font-medium">{pageContent.text[143]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ProductsSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-[#FAFAFD] border-b border-slate-200/60" id="products">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="max-w-2xl mb-16 space-y-2">
          {" "}
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
            {pageContent.text[144]}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[145]}{" "}
            <span className="italic font-serif font-normal text-blue-600">
              {pageContent.text[146]}
            </span>{" "}
          </h2>{" "}
          <p className="text-slate-600 text-sm"> {pageContent.text[147]} </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {" "}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-semibold">
                  {pageContent.text[148]}
                </span>{" "}
                <span className="font-mono text-xs text-slate-400">
                  {pageContent.text[149]}
                </span>{" "}
              </div>{" "}
              <h3 className="font-display text-2xl font-bold text-slate-950">
                {pageContent.text[150]}
              </h3>{" "}
              <p className="text-sm text-slate-600 mt-1 mb-6">{pageContent.text[151]}</p>{" "}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 font-mono text-xs space-y-3">
                {" "}
                <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200/60">
                  {" "}
                  <span>{pageContent.text[152]}</span>{" "}
                  <span className="text-emerald-600 font-semibold">
                    {pageContent.text[153]}
                  </span>{" "}
                </div>{" "}
                <div className="flex justify-between items-center text-slate-800">
                  {" "}
                  <span>{pageContent.text[154]}</span>{" "}
                  <span className="font-semibold text-blue-600">{pageContent.text[155]}</span>{" "}
                </div>{" "}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  {" "}
                  <div className="bg-blue-600 h-full w-4/5"></div>{" "}
                </div>{" "}
                <div className="text-[11px] text-slate-500 pt-1">
                  {" "}
                  {pageContent.text[156]}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              {" "}
              <span>{pageContent.text[157]}</span>{" "}
              <span className="text-blue-600 font-semibold">{pageContent.text[158]}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {" "}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex-1 flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  {" "}
                  <span>{pageContent.text[159]}</span>{" "}
                  <span className="text-indigo-600">{pageContent.text[160]}</span>{" "}
                </div>{" "}
                <h4 className="font-display text-lg font-bold text-slate-950">
                  {pageContent.text[161]}
                </h4>{" "}
                <p className="text-xs text-slate-600 mt-1">{pageContent.text[162]}</p>{" "}
              </div>{" "}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-700 border border-slate-100 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[163]}</span>{" "}
                <span className="text-blue-600 text-[11px]">{pageContent.text[164]}</span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex-1 flex flex-col justify-between">
              {" "}
              <div>
                {" "}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  {" "}
                  <span>{pageContent.text[165]}</span>{" "}
                  <span className="text-emerald-600">{pageContent.text[166]}</span>{" "}
                </div>{" "}
                <h4 className="font-display text-lg font-bold text-slate-950">
                  {pageContent.text[167]}
                </h4>{" "}
                <p className="text-xs text-slate-600 mt-1">{pageContent.text[168]}</p>{" "}
              </div>{" "}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-700 border border-slate-100 flex justify-between items-center">
                {" "}
                <span>{pageContent.text[169]}</span>{" "}
                <span className="text-emerald-600 text-[11px]">{pageContent.text[170]}</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function FromBottleneckToProductionIn14DaysSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-white border-b border-slate-200/60">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          {" "}
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
            {pageContent.text[171]}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[172]}{" "}
            <span className="italic font-serif font-normal text-blue-600">
              {pageContent.text[173]}
            </span>{" "}
          </h2>{" "}
          <p className="text-slate-600 text-sm"> {pageContent.text[174]} </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFD] border border-slate-200/80 space-y-2">
            {" "}
            <span className="font-mono text-xs font-bold text-blue-600">
              {pageContent.text[175]}
            </span>{" "}
            <h4 className="font-display text-sm font-bold text-slate-900">
              {pageContent.text[176]}
            </h4>{" "}
            <p className="text-xs text-slate-500">{pageContent.text[177]}</p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFD] border border-slate-200/80 space-y-2">
            {" "}
            <span className="font-mono text-xs font-bold text-blue-600">
              {pageContent.text[178]}
            </span>{" "}
            <h4 className="font-display text-sm font-bold text-slate-900">
              {pageContent.text[179]}
            </h4>{" "}
            <p className="text-xs text-slate-500">{pageContent.text[180]}</p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFD] border border-slate-200/80 space-y-2">
            {" "}
            <span className="font-mono text-xs font-bold text-blue-600">
              {pageContent.text[181]}
            </span>{" "}
            <h4 className="font-display text-sm font-bold text-slate-900">
              {pageContent.text[182]}
            </h4>{" "}
            <p className="text-xs text-slate-500">{pageContent.text[183]}</p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFD] border border-slate-200/80 space-y-2">
            {" "}
            <span className="font-mono text-xs font-bold text-blue-600">
              {pageContent.text[184]}
            </span>{" "}
            <h4 className="font-display text-sm font-bold text-slate-900">
              {pageContent.text[185]}
            </h4>{" "}
            <p className="text-xs text-slate-500">{pageContent.text[186]}</p>{" "}
          </div>{" "}
          <div className="p-6 rounded-2xl bg-[#FAFAFD] border border-slate-200/80 space-y-2">
            {" "}
            <span className="font-mono text-xs font-bold text-emerald-600">
              {pageContent.text[187]}
            </span>{" "}
            <h4 className="font-display text-sm font-bold text-slate-900">
              {pageContent.text[188]}
            </h4>{" "}
            <p className="text-xs text-slate-500">{pageContent.text[189]}</p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function SovereigntySection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-[#FAFAFD] border-b border-slate-200/60" id="sovereignty">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          {" "}
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
            {pageContent.text[190]}
          </div>{" "}
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            {" "}
            {pageContent.text[191]}{" "}
            <span className="italic font-serif font-normal text-blue-600">
              {pageContent.text[192]}
            </span>{" "}
          </h2>{" "}
          <p className="text-slate-600 text-sm"> {pageContent.text[193]} </p>{" "}
        </div>{" "}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-8">
          {" "}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {" "}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              {" "}
              <span className="font-mono text-[10px] text-slate-400 block mb-1">
                {pageContent.text[194]}
              </span>{" "}
              <div className="font-display text-xs font-bold text-slate-900">
                {pageContent.text[195]}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              {" "}
              <span className="font-mono text-[10px] text-slate-400 block mb-1">
                {pageContent.text[196]}
              </span>{" "}
              <div className="font-display text-xs font-bold text-slate-900">
                {pageContent.text[197]}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              {" "}
              <span className="font-mono text-[10px] text-slate-400 block mb-1">
                {pageContent.text[198]}
              </span>{" "}
              <div className="font-display text-xs font-bold text-slate-900">
                {pageContent.text[199]}
              </div>{" "}
            </div>{" "}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              {" "}
              <span className="font-mono text-[10px] text-slate-400 block mb-1">
                {pageContent.text[200]}
              </span>{" "}
              <div className="font-display text-xs font-bold text-slate-900">
                {pageContent.text[201]}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
            {" "}
            <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              {pageContent.text[202]}
            </span>{" "}
            <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              {pageContent.text[203]}
            </span>{" "}
            <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              {pageContent.text[204]}
            </span>{" "}
            <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              {pageContent.text[205]}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section9Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-16 bg-white border-b border-slate-200/60">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {" "}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-600 bg-slate-50 px-6 py-3 rounded-full border border-slate-200">
          {" "}
          <span className="font-semibold text-slate-900">{pageContent.text[206]}</span>{" "}
          <span className="text-slate-300">{pageContent.text[207]}</span>{" "}
          <span className="font-semibold text-slate-900">{pageContent.text[208]}</span>{" "}
          <span className="text-slate-300">{pageContent.text[209]}</span>{" "}
          <span className="font-semibold text-slate-900">{pageContent.text[210]}</span>{" "}
          <span className="text-slate-300">{pageContent.text[211]}</span>{" "}
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {pageContent.text[212]}
          </span>{" "}
          <span className="text-slate-300">{pageContent.text[213]}</span>{" "}
          <span className="font-semibold text-slate-900">{pageContent.text[214]}</span>{" "}
          <span className="text-slate-300">{pageContent.text[215]}</span>{" "}
          <span className="font-semibold text-slate-900">{pageContent.text[216]}</span>{" "}
          <span className="text-slate-300">{pageContent.text[217]}</span>{" "}
          <span className="font-semibold text-slate-900">{pageContent.text[218]}</span>{" "}
        </div>{" "}
        <p className="font-sans text-xs text-slate-500"> {pageContent.text[219]} </p>{" "}
      </div>{" "}
    </section>
  )
}

export function ContactSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="py-24 bg-white" id="contact">
      {" "}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="relative bg-[#0A0E18] rounded-3xl p-10 sm:p-16 lg:p-20 text-white overflow-hidden shadow-2xl border border-slate-800">
          {" "}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>{" "}
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>{" "}
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-blue-400 font-mono text-xs">
              {" "}
              {pageContent.text[220]}{" "}
            </div>{" "}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {" "}
              {pageContent.text[221]}{" "}
              <span className="italic font-serif font-normal text-blue-400">
                {pageContent.text[222]}
              </span>{" "}
            </h2>{" "}
            <p className="text-slate-400 text-base max-w-lg mx-auto"> {pageContent.text[223]} </p>{" "}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {" "}
              <a
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all"
                href="mailto:build@syntropic.ai"
              >
                {" "}
                <span>{pageContent.text[224]}</span>{" "}
                <GeminiIcon name="arrow_forward" className="text-base" />{" "}
              </a>{" "}
              <a
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-slate-200 border border-slate-700 font-medium text-sm hover:bg-slate-800 transition-all"
                href="#what-we-build"
              >
                {" "}
                <span>{pageContent.text[225]}</span>{" "}
              </a>{" "}
            </div>{" "}
            <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-400">
              {" "}
              <span>{pageContent.text[226]}</span> <span>{pageContent.text[227]}</span>{" "}
              <span>{pageContent.text[228]}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
