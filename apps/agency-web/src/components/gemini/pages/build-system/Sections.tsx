import { pageContent } from "@/content/gemini/build-system"
import type { Locale } from "@rove/cms/constants"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function LetSBuildTheSystemYourBusinessNeedsSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="relative w-full py-16 lg:py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      {" "}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {" "}
        <div className="lg:col-span-7 flex flex-col items-start">
          {" "}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-mono text-[11px] font-semibold tracking-wider uppercase mb-6">
            {" "}
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> {pageContent.text[9]}{" "}
          </div>{" "}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 font-display">
            {" "}
            {pageContent.text[10]}{" "}
            <span className="font-serif italic text-blue-600 font-normal">
              {pageContent.text[11]}
            </span>{" "}
          </h1>{" "}
          <p className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
            {" "}
            {pageContent.text[12]}{" "}
          </p>{" "}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
            {" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-all"
              href="#intake-card"
            >
              {" "}
              <span>{pageContent.text[13]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all"
              href="#direct-call"
            >
              {" "}
              <span>{pageContent.text[14]}</span>{" "}
            </a>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="verified" className="text-[16px] text-blue-600" />{" "}
              <span>{pageContent.text[15]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300">{pageContent.text[16]}</span>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="schedule" className="text-[16px] text-blue-600" />{" "}
              <span>{pageContent.text[17]}</span>{" "}
            </div>{" "}
            <span className="text-slate-300">{pageContent.text[18]}</span>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <GeminiIcon name="favorite" className="text-[16px] text-blue-600" />{" "}
              <span>{pageContent.text[19]}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-5 w-full">
          {" "}
          <div className="relative rounded-3xl bg-white p-8 border border-slate-200/80 shadow-[0_20px_50px_rgba(37,99,235,0.06)] overflow-hidden">
            {" "}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>{" "}
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-50/60 rounded-full blur-2xl pointer-events-none"></div>{" "}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{" "}
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-700 uppercase">
                  {pageContent.text[20]}
                </span>{" "}
              </div>{" "}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                {pageContent.text[21]}
              </span>{" "}
            </div>{" "}
            <div className="flex flex-col gap-3 relative">
              {" "}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all flex items-start gap-3.5">
                {" "}
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                  {" "}
                  <GeminiIcon name="help_outline" className="text-[18px]" />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    {pageContent.text[22]}
                  </span>{" "}
                  <span className="text-sm font-semibold text-slate-800">
                    {pageContent.text[23]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex justify-center -my-1 text-blue-500">
                {" "}
                <GeminiIcon name="arrow_downward" className="text-[18px]" />{" "}
              </div>{" "}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 transition-all flex items-start gap-3.5">
                {" "}
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  {" "}
                  <GeminiIcon name="smart_toy" className="text-[18px]" />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 font-semibold">
                    {pageContent.text[24]}
                  </span>{" "}
                  <span className="text-sm font-semibold text-blue-950">
                    {pageContent.text[25]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex justify-center -my-1 text-blue-500">
                {" "}
                <GeminiIcon name="arrow_downward" className="text-[18px]" />{" "}
              </div>{" "}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all flex items-start gap-3.5">
                {" "}
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                  {" "}
                  <GeminiIcon name="sync_alt" className="text-[18px]" />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    {pageContent.text[26]}
                  </span>{" "}
                  <span className="text-sm font-semibold text-slate-800">
                    {pageContent.text[27]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex justify-center -my-1 text-emerald-500">
                {" "}
                <GeminiIcon name="arrow_downward" className="text-[18px]" />{" "}
              </div>{" "}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 transition-all flex items-start gap-3.5">
                {" "}
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  {" "}
                  <GeminiIcon name="trending_up" className="text-[18px]" />{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                    {pageContent.text[28]}
                  </span>{" "}
                  <span className="text-sm font-semibold text-emerald-950">
                    {pageContent.text[29]}
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

export function WhatAreYouLookingToImproveSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/60">
      {" "}
      <div className="text-center max-w-2xl mx-auto mb-10">
        {" "}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display mb-2">
          {pageContent.text[30]}
        </h2>{" "}
        <p className="text-slate-600 text-base">{pageContent.text[31]}</p>{" "}
      </div>{" "}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8"
        id="service-tiles"
      >
        {" "}
        <div className="p-5 rounded-2xl border-2 border-blue-600 bg-white shadow-sm flex flex-col justify-between transition-all cursor-pointer">
          {" "}
          <div>
            {" "}
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              {" "}
              <GeminiIcon name="hub" className="text-[18px]" />{" "}
            </div>{" "}
            <h3 className="text-sm font-bold text-slate-900 mb-1">{pageContent.text[32]}</h3>{" "}
            <p className="text-xs text-slate-500 leading-relaxed">{pageContent.text[33]}</p>{" "}
          </div>{" "}
          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
            {" "}
            <span>{pageContent.text[34]}</span>{" "}
            <GeminiIcon name="check" className="text-[14px]" />{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm flex flex-col justify-between transition-all cursor-pointer">
          {" "}
          <div>
            {" "}
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-3">
              {" "}
              <GeminiIcon name="smart_toy" className="text-[18px]" />{" "}
            </div>{" "}
            <h3 className="text-sm font-bold text-slate-900 mb-1">{pageContent.text[35]}</h3>{" "}
            <p className="text-xs text-slate-500 leading-relaxed">{pageContent.text[36]}</p>{" "}
          </div>{" "}
          <span className="mt-4 text-[11px] text-slate-400 font-medium">
            {pageContent.text[37]}
          </span>{" "}
        </div>{" "}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm flex flex-col justify-between transition-all cursor-pointer">
          {" "}
          <div>
            {" "}
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-3">
              {" "}
              <GeminiIcon name="alt_route" className="text-[18px]" />{" "}
            </div>{" "}
            <h3 className="text-sm font-bold text-slate-900 mb-1">{pageContent.text[38]}</h3>{" "}
            <p className="text-xs text-slate-500 leading-relaxed">{pageContent.text[39]}</p>{" "}
          </div>{" "}
          <span className="mt-4 text-[11px] text-slate-400 font-medium">
            {pageContent.text[40]}
          </span>{" "}
        </div>{" "}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm flex flex-col justify-between transition-all cursor-pointer">
          {" "}
          <div>
            {" "}
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-3">
              {" "}
              <GeminiIcon name="web" className="text-[18px]" />{" "}
            </div>{" "}
            <h3 className="text-sm font-bold text-slate-900 mb-1">{pageContent.text[41]}</h3>{" "}
            <p className="text-xs text-slate-500 leading-relaxed">{pageContent.text[42]}</p>{" "}
          </div>{" "}
          <span className="mt-4 text-[11px] text-slate-400 font-medium">
            {pageContent.text[43]}
          </span>{" "}
        </div>{" "}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm flex flex-col justify-between transition-all cursor-pointer">
          {" "}
          <div>
            {" "}
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-3">
              {" "}
              <GeminiIcon name="architecture" className="text-[18px]" />{" "}
            </div>{" "}
            <h3 className="text-sm font-bold text-slate-900 mb-1">{pageContent.text[44]}</h3>{" "}
            <p className="text-xs text-slate-500 leading-relaxed">{pageContent.text[45]}</p>{" "}
          </div>{" "}
          <span className="mt-4 text-[11px] text-slate-400 font-medium">
            {pageContent.text[46]}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto">
        {" "}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
            {pageContent.text[47]}
          </span>{" "}
          <span className="text-xs text-blue-600 font-semibold">{pageContent.text[48]}</span>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {" "}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            {" "}
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              {pageContent.text[49]}
            </span>{" "}
            <span className="text-xs font-semibold text-slate-800">
              {pageContent.text[50]}
            </span>{" "}
          </div>{" "}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            {" "}
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              {pageContent.text[51]}
            </span>{" "}
            <span className="text-xs font-semibold text-slate-800">
              {pageContent.text[52]}
            </span>{" "}
          </div>{" "}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            {" "}
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              {pageContent.text[53]}
            </span>{" "}
            <span className="text-xs font-semibold text-slate-800">
              {pageContent.text[54]}
            </span>{" "}
          </div>{" "}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
            {" "}
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {pageContent.text[55]}
            </span>{" "}
            <span className="text-xs font-semibold text-blue-900">{pageContent.text[56]}</span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function IntakeCardSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 max-w-3xl mx-auto" id="intake-card">
      {" "}
      <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl relative overflow-hidden">
        {" "}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>{" "}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono font-medium text-slate-400 mb-8">
          {" "}
          <span className="text-blue-600 font-semibold">{pageContent.text[57]}</span>{" "}
          <span>{pageContent.text[58]}</span>{" "}
          <span className="text-blue-600 font-semibold">{pageContent.text[59]}</span>{" "}
          <span>{pageContent.text[60]}</span>{" "}
          <span className="text-blue-600 font-semibold">{pageContent.text[61]}</span>{" "}
          <span>{pageContent.text[62]}</span>{" "}
          <span className="text-slate-600">{pageContent.text[63]}</span>{" "}
        </div>{" "}
        <div className="text-center mb-8">
          {" "}
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-semibold block mb-2">
            {pageContent.text[64]}
          </span>{" "}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display mb-2">
            {pageContent.text[65]}
          </h2>{" "}
          <p className="text-sm text-slate-500">{pageContent.text[66]}</p>{" "}
        </div>{" "}
        <form className="flex flex-col gap-6">
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {" "}
            <div className="flex flex-col gap-1.5">
              {" "}
              <label className="text-xs font-semibold text-slate-700" htmlFor="brief-name">
                {pageContent.text[67]}
              </label>{" "}
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                id="brief-name"
                placeholder={pageContent.text[68]}
                required={true}
                type="text"
              />{" "}
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              {" "}
              <label className="text-xs font-semibold text-slate-700" htmlFor="brief-email">
                {pageContent.text[69]}
              </label>{" "}
              <input
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                id="brief-email"
                placeholder={pageContent.text[70]}
                required={true}
                type="email"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex flex-col gap-1.5">
            {" "}
            <label className="text-xs font-semibold text-slate-700" htmlFor="brief-site">
              {pageContent.text[71]}
            </label>{" "}
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              id="brief-site"
              placeholder={pageContent.text[72]}
              required={true}
              type="url"
            />{" "}
          </div>{" "}
          <div className="flex flex-col gap-1.5">
            {" "}
            <label className="text-xs font-semibold text-slate-700" htmlFor="brief-problem">
              {pageContent.text[73]}
            </label>{" "}
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all leading-relaxed"
              id="brief-problem"
              placeholder={pageContent.text[74]}
              required={true}
              rows={4}
            ></textarea>{" "}
          </div>{" "}
          <div className="flex flex-col gap-2">
            {" "}
            <label className="text-xs font-semibold text-slate-700">
              {pageContent.text[75]}
            </label>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {" "}
              <button
                className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-slate-300 transition-all flex flex-col gap-1 cursor-pointer"
                type="button"
              >
                {" "}
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  {" "}
                  <span>{pageContent.text[76]}</span>{" "}
                  <GeminiIcon
                    name="radio_button_unchecked"
                    className="text-[16px] text-slate-400"
                  />{" "}
                </div>{" "}
                <p className="text-xs text-slate-500 leading-normal">{pageContent.text[77]}</p>{" "}
              </button>{" "}
              <button
                className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:border-slate-300 transition-all flex flex-col gap-1 cursor-pointer"
                type="button"
              >
                {" "}
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  {" "}
                  <span>{pageContent.text[78]}</span>{" "}
                  <GeminiIcon
                    name="radio_button_unchecked"
                    className="text-[16px] text-slate-400"
                  />{" "}
                </div>{" "}
                <p className="text-xs text-slate-500 leading-normal">{pageContent.text[79]}</p>{" "}
              </button>{" "}
              <button
                className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left transition-all flex flex-col gap-1 cursor-pointer shadow-xs"
                type="button"
              >
                {" "}
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  {" "}
                  <span>{pageContent.text[80]}</span>{" "}
                  <GeminiIcon name="check_circle" className="text-[16px] text-blue-600" />{" "}
                </div>{" "}
                <p className="text-xs text-blue-700 leading-normal">{pageContent.text[81]}</p>{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="pt-3 flex flex-col items-center gap-3.5">
            {" "}
            <button
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              type="submit"
            >
              {" "}
              <span>{pageContent.text[82]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </button>{" "}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 text-center">
              {" "}
              <GeminiIcon name="lock" className="text-[15px] text-blue-600" />{" "}
              <span>{pageContent.text[83]}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div
            className="hidden p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium text-center"
            id="brief-sent-msg"
          >
            {" "}
            {pageContent.text[84]}{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </section>
  )
}

export function DirectCallSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-8 px-6 lg:px-12 max-w-3xl mx-auto" id="direct-call">
      {" "}
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center flex flex-col items-center shadow-sm">
        {" "}
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          {" "}
          <GeminiIcon name="chat" className="text-[20px]" />{" "}
        </div>{" "}
        <h3 className="text-xl font-bold text-slate-900 font-display mb-1.5">
          {pageContent.text[85]}
        </h3>{" "}
        <p className="text-sm text-slate-500 max-w-md mb-5 leading-relaxed">
          {" "}
          {pageContent.text[86]}{" "}
        </p>{" "}
        <div className="mb-4">
          {" "}
          <a
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b0f19] text-white text-sm font-semibold hover:bg-slate-800 transition-all"
            href="mailto:partners@syntropic.ai"
          >
            {" "}
            <span>{pageContent.text[87]}</span>{" "}
            <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
          </a>{" "}
        </div>{" "}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          {" "}
          <span>{pageContent.text[88]}</span> <span>{pageContent.text[89]}</span>{" "}
          <span>{pageContent.text[90]}</span> <span>{pageContent.text[91]}</span>{" "}
          <span>{pageContent.text[92]}</span>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function ASimplePathFromProblemToBuildSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200/60">
      {" "}
      <div className="text-center max-w-2xl mx-auto mb-16">
        {" "}
        <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-semibold block mb-2">
          {pageContent.text[93]}
        </span>{" "}
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
          {pageContent.text[94]}
        </h2>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {" "}
        <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-blue-100 -z-0"></div>{" "}
        <div className="flex flex-col items-start relative z-10">
          {" "}
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-mono font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
            {" "}
            {pageContent.text[95]}{" "}
          </div>{" "}
          <span className="text-xs font-mono font-bold tracking-wider text-blue-600 uppercase mb-1.5">
            {pageContent.text[96]}
          </span>{" "}
          <p className="text-sm text-slate-600 leading-relaxed"> {pageContent.text[97]} </p>{" "}
        </div>{" "}
        <div className="flex flex-col items-start relative z-10">
          {" "}
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-mono font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
            {" "}
            {pageContent.text[98]}{" "}
          </div>{" "}
          <span className="text-xs font-mono font-bold tracking-wider text-blue-600 uppercase mb-1.5">
            {pageContent.text[99]}
          </span>{" "}
          <p className="text-sm text-slate-600 leading-relaxed"> {pageContent.text[100]} </p>{" "}
        </div>{" "}
        <div className="flex flex-col items-start relative z-10">
          {" "}
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-mono font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
            {" "}
            {pageContent.text[101]}{" "}
          </div>{" "}
          <span className="text-xs font-mono font-bold tracking-wider text-blue-600 uppercase mb-1.5">
            {pageContent.text[102]}
          </span>{" "}
          <p className="text-sm text-slate-600 leading-relaxed"> {pageContent.text[103]} </p>{" "}
        </div>{" "}
        <div className="flex flex-col items-start relative z-10">
          {" "}
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
            {" "}
            {pageContent.text[104]}{" "}
          </div>{" "}
          <span className="text-xs font-mono font-bold tracking-wider text-blue-600 uppercase mb-1.5">
            {pageContent.text[105]}
          </span>{" "}
          <p className="text-sm text-slate-600 leading-relaxed"> {pageContent.text[106]} </p>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section6Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-6 px-6 lg:px-12 max-w-5xl mx-auto">
      {" "}
      <div className="rounded-2xl bg-slate-100/80 border border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        {" "}
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          {" "}
          <GeminiIcon name="lock" className="text-[17px] text-blue-600" />{" "}
          <span>{pageContent.text[107]}</span>{" "}
        </div>{" "}
        <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
          {" "}
          <span className="flex items-center gap-1">
            {" "}
            <GeminiIcon name="check" className="text-[14px] text-blue-600" />{" "}
            {pageContent.text[108]}{" "}
          </span>{" "}
          <span>{pageContent.text[109]}</span>{" "}
          <span className="flex items-center gap-1">
            {" "}
            <GeminiIcon name="check" className="text-[14px] text-blue-600" />{" "}
            {pageContent.text[110]}{" "}
          </span>{" "}
          <span>{pageContent.text[111]}</span>{" "}
          <span className="flex items-center gap-1">
            {" "}
            <GeminiIcon name="check" className="text-[14px] text-blue-600" />{" "}
            {pageContent.text[112]}{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveASystemWorthBuildingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full py-16 px-6 lg:px-12 max-w-7xl mx-auto mb-16">
      {" "}
      <div className="relative rounded-3xl bg-[#0b0f19] p-10 sm:p-14 text-center overflow-hidden shadow-2xl">
        {" "}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>{" "}
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>{" "}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {" "}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-3">
            {" "}
            {pageContent.text[113]}{" "}
          </h2>{" "}
          <p className="text-base text-slate-400 max-w-lg mb-8 leading-relaxed">
            {" "}
            {pageContent.text[114]}{" "}
          </p>{" "}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mb-6">
            {" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all"
              href="#intake-card"
            >
              {" "}
              <span>{pageContent.text[115]}</span>{" "}
              <GeminiIcon name="arrow_forward" className="text-[18px]" />{" "}
            </a>{" "}
            <a
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-transparent border border-slate-700 text-white font-medium hover:bg-slate-800/80 transition-all"
              href="#direct-call"
            >
              {" "}
              <span>{pageContent.text[116]}</span>{" "}
            </a>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
