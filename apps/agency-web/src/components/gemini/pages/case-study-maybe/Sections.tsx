import { pageContent } from "@/content/gemini/case-study-maybe"
import type { Locale } from "@rove/cms/constants"
import { localePath } from "@/lib/i18n"
import { GeminiIcon } from "@/components/gemini/GeminiIcon"

export function HowAISystemsAreChangingTheWayModernRevenueTeamsOperateSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="w-full bg-[#F8F9FB] py-space-xl">
      {" "}
      <div className="max-w-6xl mx-auto px-margin lg:px-margin-lg">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {" "}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {" "}
            <div className="inline-flex items-center gap-space-xs">
              {" "}
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>{" "}
              <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
                {pageContent.text[10]}
              </span>{" "}
            </div>{" "}
            <h1 className="font-headline-lg text-headline-lg lg:text-display-lg text-[#0F172A] font-semibold tracking-tight leading-tight">
              {" "}
              {pageContent.text[11]}{" "}
              <span className="text-[#2563EB] italic font-editorial-italic">
                {pageContent.text[12]}
              </span>{" "}
              {pageContent.text[13]}{" "}
            </h1>{" "}
            <p className="font-body-lg text-body-lg text-[#475569] max-w-xl">
              {" "}
              {pageContent.text[14]}{" "}
            </p>{" "}
            <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-sm mt-space-xs border-t border-[#E2E8F0]">
              {" "}
              <div className="flex items-center gap-space-sm">
                {" "}
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] font-bold font-label-mono-md text-label-mono-md shadow-sm">
                  {" "}
                  {pageContent.text[15]}{" "}
                </div>{" "}
                <div className="flex flex-col">
                  {" "}
                  <span className="font-body-sm text-body-sm text-[#0F172A] font-semibold">
                    {pageContent.text[16]}
                  </span>{" "}
                  <span className="font-label-mono-sm text-label-mono-sm text-[#64748B]">
                    {pageContent.text[17]}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center gap-space-md font-label-mono-sm text-label-mono-sm text-[#64748B]">
                {" "}
                <span className="flex items-center gap-1">
                  {" "}
                  <GeminiIcon name="calendar_today" className="text-[16px] text-[#94A3B8]" />{" "}
                  {pageContent.text[18]}{" "}
                </span>{" "}
                <span>{pageContent.text[19]}</span>{" "}
                <span className="flex items-center gap-1">
                  {" "}
                  <GeminiIcon name="schedule" className="text-[16px] text-[#94A3B8]" />{" "}
                  {pageContent.text[20]}{" "}
                </span>{" "}
                <button
                  aria-label="Share Dispatch"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#64748B] transition-colors shadow-sm"
                  title="Share Dispatch"
                >
                  {" "}
                  <GeminiIcon name="share" className="text-[18px]" />{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-5 flex flex-col gap-space-xs">
            {" "}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-[#E2E8F0] transition-transform duration-500 hover:-translate-y-1 p-2">
              {" "}
              <img
                alt="Abstract revenue telemetry orchestration substrate"
                className="w-full h-auto object-cover aspect-[4/3] rounded-lg"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WsQiIj1AwoAngxLW_UQZzndDIZNWiwXIdPfXEqzgmgEaIQgRi3EUQEbDCzi0ytsxy1cZAmiP3h9axlxNQoUUvmR6bSr_ePUeascaguB86-M7Rc_mo4YO2KnyaZwy7qgfy2BS1auSehWP98yRKTlhdfsRmB5zwW3E5YL2GoZdTOa4jhQHWzXVRVm3bquV6iI9l-MOE99P50XhTT4Rs1YjyX6Wmo4u97vREQtWfqWZ-qL-jYuWsubIAqIiA"
              />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-label-mono-sm text-[#64748B] pl-space-xs">
              {" "}
              {pageContent.text[21]}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function EnterpriseRevenueDoesnTNeedMoreDisconnectedToolsItNeedsAConnectedSystemSection({
  locale,
}: {
  locale: Locale
}) {
  void locale
  return (
    <section className="w-full bg-[#F8F9FB] py-space-2xl border-t border-[#E2E8F0]">
      {" "}
      <div className="max-w-6xl mx-auto px-margin lg:px-margin-lg">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {" "}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
              {" "}
              {pageContent.text[22]}{" "}
            </span>{" "}
            <h2 className="font-headline-md text-headline-md text-[#0F172A] font-semibold tracking-tight leading-snug">
              {" "}
              {pageContent.text[23]}{" "}
              <span className="text-[#2563EB] italic font-editorial-italic">
                {pageContent.text[24]}
              </span>
              {pageContent.text[25]}{" "}
            </h2>{" "}
            <p className="font-body-md text-body-md text-[#475569]"> {pageContent.text[26]} </p>{" "}
            <div className="inline-flex items-center gap-space-sm bg-white border border-[#E2E8F0] px-space-md py-space-sm rounded-lg max-w-fit shadow-sm">
              {" "}
              <GeminiIcon name="sync_alt" className="text-[#2563EB] text-[20px]" />{" "}
              <span className="font-label-mono-sm text-label-mono-sm text-[#0F172A] font-medium">
                {" "}
                {pageContent.text[27]}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-7 flex flex-col gap-space-xs">
            {" "}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-[#E2E8F0] transition-transform duration-500 hover:-translate-y-1 p-2">
              {" "}
              <img
                alt="Transformation from fragmented tools to unified telemetry"
                className="w-full h-auto object-cover aspect-[16/10] rounded-lg"
                src="https://lh3.googleusercontent.com/aida/AEtjO1V0mnO7647rR0j4aT3DgbD_M4E0WvYf6PWwtpJlj6dplCmAOm4U5mmtvSr2NlohvV3gatcnhEmfj9fSn82XVDUiRcsYV6TDvJdpme7Qd07D5ksEchl_itDiw3EUerXEOI5LjasKIYscp4ubfzByAIrApu_9yjXbMiWl0enRH4dco22QeOVydfUHAN_nWFNbvNSn5JNtgbMeIAOjT_oIpi2IkjCOHmji0pWMpQf5N4kDl7a6c5444qvOCA"
              />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-label-mono-sm text-[#64748B] pl-space-xs">
              {" "}
              {pageContent.text[28]}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function WhereAICreatesOperationalLeverageSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-space-2xl border-t border-[#E2E8F0]">
      {" "}
      <div className="max-w-6xl mx-auto px-margin lg:px-margin-lg">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
          {" "}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col gap-space-xs">
            {" "}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-[#E2E8F0] transition-transform duration-500 hover:-translate-y-1 p-2">
              {" "}
              <img
                alt="The five interconnected revenue leverage nodes"
                className="w-full h-auto object-cover aspect-[16/10] rounded-lg"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VrwG36VilqpCgCKPNnRyt2h4gxIRMbPexgexZi6-Ahe_LH0HGj-tPhNx3lhTj7Cy3GX-DGMx6CrLoDgY_9-IomGem5wsZvdC3ShMwAcMLHavSvjVEq4xTrEUt66zwkTBaTHgptI1Eyz__tWpQb0ObSlH_Bvmz-Y0ba2Awk1WtGTx4_Ay0AhacyIgMfd4KH-xaFWGLSRspRcw1YrHzZyxt_Lbygh9xhvp-eKfwzHepCDcShAJ3L5OgiTA"
              />{" "}
            </div>{" "}
            <span className="font-label-mono-sm text-label-mono-sm text-[#64748B] pl-space-xs">
              {" "}
              {pageContent.text[29]}{" "}
            </span>{" "}
          </div>{" "}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-space-md">
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
              {" "}
              {pageContent.text[30]}{" "}
            </span>{" "}
            <h2 className="font-headline-md text-headline-md text-[#0F172A] font-semibold tracking-tight leading-snug">
              {" "}
              {pageContent.text[31]}{" "}
            </h2>{" "}
            <p className="font-body-md text-body-md text-[#475569]"> {pageContent.text[32]} </p>{" "}
            <div className="w-full bg-[#F8F9FB] border border-[#E2E8F0] p-space-md rounded-xl mt-space-xs shadow-sm">
              {" "}
              <span className="font-label-mono-sm text-label-mono-sm text-[#64748B] block mb-space-sm uppercase tracking-wider font-semibold">
                {pageContent.text[33]}
              </span>{" "}
              <div className="flex items-center flex-wrap gap-2">
                {" "}
                <span className="bg-white border border-[#E2E8F0] text-[#0F172A] px-space-sm py-1 rounded-full font-label-mono-sm text-label-mono-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  {pageContent.text[34]}{" "}
                </span>{" "}
                <GeminiIcon name="arrow_forward" className="text-[#94A3B8]  text-[16px]" />{" "}
                <span className="bg-white border border-[#E2E8F0] text-[#0F172A] px-space-sm py-1 rounded-full font-label-mono-sm text-label-mono-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  {pageContent.text[35]}{" "}
                </span>{" "}
                <GeminiIcon name="arrow_forward" className="text-[#94A3B8]  text-[16px]" />{" "}
                <span className="bg-white border border-[#E2E8F0] text-[#0F172A] px-space-sm py-1 rounded-full font-label-mono-sm text-label-mono-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  {pageContent.text[36]}{" "}
                </span>{" "}
                <GeminiIcon name="arrow_forward" className="text-[#94A3B8]  text-[16px]" />{" "}
                <span className="bg-white border border-[#E2E8F0] text-[#0F172A] px-space-sm py-1 rounded-full font-label-mono-sm text-label-mono-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  {pageContent.text[37]}{" "}
                </span>{" "}
                <GeminiIcon name="arrow_forward" className="text-[#94A3B8]  text-[16px]" />{" "}
                <span className="bg-white border border-[#E2E8F0] text-[#0F172A] px-space-sm py-1 rounded-full font-label-mono-sm text-label-mono-sm font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
                  {" "}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                  {pageContent.text[38]}{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function Section4Section({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#F8F9FB] py-space-3xl border-t border-[#E2E8F0] relative overflow-hidden">
      {" "}
      <div className="max-w-4xl mx-auto px-margin text-center flex flex-col items-center gap-space-lg">
        {" "}
        <span className="w-12 h-1 bg-[#2563EB] rounded-full mb-space-xs"></span>{" "}
        <blockquote className="font-display-lg-mobile lg:font-display-lg text-display-lg-mobile lg:text-display-lg font-normal text-[#0F172A] leading-tight tracking-tight">
          {" "}
          {pageContent.text[39]}{" "}
          <span className="text-[#2563EB] italic font-editorial-italic font-normal">
            {pageContent.text[40]}
          </span>
          {pageContent.text[41]}{" "}
        </blockquote>{" "}
        <cite className="font-label-mono-sm text-label-mono-sm text-[#64748B] uppercase tracking-widest not-italic font-medium">
          {" "}
          {pageContent.text[42]}{" "}
        </cite>{" "}
      </div>{" "}
    </section>
  )
}

export function StartWithTheWorkflowNotTheModelSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#F8F9FB] py-space-2xl border-t border-[#E2E8F0]">
      {" "}
      <div className="max-w-6xl mx-auto px-margin lg:px-margin-lg flex flex-col gap-space-xl">
        {" "}
        <div className="flex flex-col gap-space-xs max-w-3xl">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
            {" "}
            {pageContent.text[43]}{" "}
          </span>{" "}
          <h2 className="font-headline-lg text-headline-lg text-[#0F172A] font-semibold tracking-tight">
            {" "}
            {pageContent.text[44]}{" "}
          </h2>{" "}
          <p className="font-body-md text-body-md text-[#475569]"> {pageContent.text[45]} </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {" "}
          <div className="bg-white border border-[#E2E8F0] p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm relative group hover:border-[#2563EB]/40 transition-colors">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-md text-label-mono-md font-bold text-[#2563EB]">
                {pageContent.text[46]}
              </span>{" "}
              <GeminiIcon name="timeline" className="text-[#2563EB] text-[20px]" />{" "}
            </div>{" "}
            <span className="font-headline-sm text-headline-sm text-[#0F172A] font-bold tracking-tight">
              {pageContent.text[47]}
            </span>{" "}
            <p className="font-body-sm text-body-sm text-[#475569]">
              {" "}
              {pageContent.text[48]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="bg-white border border-[#E2E8F0] p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm relative group hover:border-[#2563EB]/40 transition-colors">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-md text-label-mono-md font-bold text-[#2563EB]">
                {pageContent.text[49]}
              </span>{" "}
              <GeminiIcon name="troubleshoot" className="text-[#2563EB] text-[20px]" />{" "}
            </div>{" "}
            <span className="font-headline-sm text-headline-sm text-[#0F172A] font-bold tracking-tight">
              {pageContent.text[50]}
            </span>{" "}
            <p className="font-body-sm text-body-sm text-[#475569]">
              {" "}
              {pageContent.text[51]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="bg-white border border-[#E2E8F0] p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm relative group hover:border-[#2563EB]/40 transition-colors">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-md text-label-mono-md font-bold text-[#2563EB]">
                {pageContent.text[52]}
              </span>{" "}
              <GeminiIcon name="memory" className="text-[#2563EB] text-[20px]" />{" "}
            </div>{" "}
            <span className="font-headline-sm text-headline-sm text-[#0F172A] font-bold tracking-tight">
              {pageContent.text[53]}
            </span>{" "}
            <p className="font-body-sm text-body-sm text-[#475569]">
              {" "}
              {pageContent.text[54]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="bg-white border border-[#E2E8F0] p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm relative group hover:border-[#2563EB]/40 transition-colors">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <span className="font-label-mono-md text-label-mono-md font-bold text-[#2563EB]">
                {pageContent.text[55]}
              </span>{" "}
              <GeminiIcon name="tune" className="text-[#2563EB] text-[20px]" />{" "}
            </div>{" "}
            <span className="font-headline-sm text-headline-sm text-[#0F172A] font-bold tracking-tight">
              {pageContent.text[56]}
            </span>{" "}
            <p className="font-body-sm text-body-sm text-[#475569]">
              {" "}
              {pageContent.text[57]}{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="w-full bg-white border border-[#E2E8F0] p-space-md rounded-xl flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm">
          {" "}
          <div className="flex items-center gap-space-sm">
            {" "}
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>{" "}
            <span className="font-label-mono-sm text-label-mono-sm text-[#0F172A] uppercase tracking-wider font-semibold">
              {" "}
              {pageContent.text[58]}{" "}
            </span>{" "}
            <span className="font-label-mono-sm text-label-mono-sm text-[#2563EB] font-medium">
              {" "}
              {pageContent.text[59]}{" "}
            </span>{" "}
          </div>{" "}
          <div className="font-label-mono-sm text-label-mono-sm text-[#64748B] flex items-center gap-space-xs font-medium">
            {" "}
            <GeminiIcon name="verified_user" className="text-[16px] text-[#2563EB]" />{" "}
            {pageContent.text[60]}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function KeyArchitecturalTakeawaysSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-white py-space-2xl border-t border-[#E2E8F0]">
      {" "}
      <div className="max-w-4xl mx-auto px-margin lg:px-margin-lg flex flex-col gap-space-xl">
        {" "}
        <div className="flex flex-col gap-space-xs">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
            {" "}
            {pageContent.text[61]}{" "}
          </span>{" "}
          <h2 className="font-headline-lg text-headline-lg text-[#0F172A] font-semibold tracking-tight">
            {" "}
            {pageContent.text[62]}{" "}
          </h2>{" "}
        </div>{" "}
        <div className="flex flex-col divide-y divide-[#E2E8F0]">
          {" "}
          <div className="py-space-lg flex flex-col md:flex-row md:items-baseline gap-space-sm md:gap-space-lg group">
            {" "}
            <span className="font-label-mono-md text-label-mono-md text-[#2563EB] font-bold shrink-0">
              {pageContent.text[63]}
            </span>{" "}
            <div className="flex flex-col gap-1">
              {" "}
              <span className="font-headline-sm text-headline-sm text-[#0F172A] font-semibold">
                {pageContent.text[64]}
              </span>{" "}
              <p className="font-body-md text-body-md text-[#475569]">
                {pageContent.text[65]}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="py-space-lg flex flex-col md:flex-row md:items-baseline gap-space-sm md:gap-space-lg group">
            {" "}
            <span className="font-label-mono-md text-label-mono-md text-[#2563EB] font-bold shrink-0">
              {pageContent.text[66]}
            </span>{" "}
            <div className="flex flex-col gap-1">
              {" "}
              <span className="font-headline-sm text-headline-sm text-[#0F172A] font-semibold">
                {pageContent.text[67]}
              </span>{" "}
              <p className="font-body-md text-body-md text-[#475569]">
                {pageContent.text[68]}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="py-space-lg flex flex-col md:flex-row md:items-baseline gap-space-sm md:gap-space-lg group">
            {" "}
            <span className="font-label-mono-md text-label-mono-md text-[#2563EB] font-bold shrink-0">
              {pageContent.text[69]}
            </span>{" "}
            <div className="flex flex-col gap-1">
              {" "}
              <span className="font-headline-sm text-headline-sm text-[#0F172A] font-semibold">
                {pageContent.text[70]}
              </span>{" "}
              <p className="font-body-md text-body-md text-[#475569]">
                {pageContent.text[71]}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="py-space-lg flex flex-col md:flex-row md:items-baseline gap-space-sm md:gap-space-lg group">
            {" "}
            <span className="font-label-mono-md text-label-mono-md text-[#2563EB] font-bold shrink-0">
              {pageContent.text[72]}
            </span>{" "}
            <div className="flex flex-col gap-1">
              {" "}
              <span className="font-headline-sm text-headline-sm text-[#0F172A] font-semibold">
                {pageContent.text[73]}
              </span>{" "}
              <p className="font-body-md text-body-md text-[#475569]">
                {pageContent.text[74]}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-[#F8F9FB] border border-[#E2E8F0] p-space-lg rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-sm">
          {" "}
          <div className="flex items-center gap-space-md">
            {" "}
            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] font-bold font-label-mono-md text-label-mono-md shadow-sm shrink-0">
              {" "}
              {pageContent.text[75]}{" "}
            </div>{" "}
            <div className="flex flex-col">
              {" "}
              <span className="font-body-md text-body-md text-[#0F172A] font-semibold">
                {pageContent.text[76]}
              </span>{" "}
              <span className="font-label-mono-sm text-label-mono-sm text-[#64748B]">
                {pageContent.text[77]}
              </span>{" "}
              <p className="font-body-sm text-body-sm text-[#64748B] mt-1 max-w-md">
                {pageContent.text[78]}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <a
            className="inline-flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-[#2563EB] hover:text-[#1D4ED8] font-semibold shrink-0 transition-colors"
            href={localePath(locale, "/insight-resource")}
          >
            {" "}
            {pageContent.text[79]} <GeminiIcon name="arrow_forward" className="text-[16px]" />{" "}
          </a>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function HaveSomethingWorthBuildingSection({ locale }: { locale: Locale }) {
  void locale
  return (
    <section className="w-full bg-[#F8F9FB] py-space-2xl border-t border-[#E2E8F0]">
      {" "}
      <div className="max-w-6xl mx-auto px-margin lg:px-margin-lg flex flex-col gap-space-3xl">
        {" "}
        <div className="flex flex-col gap-space-lg">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
              {" "}
              {pageContent.text[80]}{" "}
            </span>{" "}
            <a
              className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
              href={localePath(locale, "/insight-resource")}
            >
              {" "}
              {pageContent.text[81]} <GeminiIcon name="east" className="text-[16px]" />{" "}
            </a>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {" "}
            <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-space-lg flex flex-col justify-between gap-space-md shadow-sm hover:border-[#2563EB]/40 transition-colors group">
              {" "}
              <div className="flex flex-col gap-space-xs">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-[#2563EB] uppercase font-semibold">
                  {pageContent.text[82]}
                </span>{" "}
                <h3 className="font-headline-md text-headline-md text-[#0F172A] font-semibold group-hover:text-[#2563EB] transition-colors">
                  {" "}
                  {pageContent.text[83]}{" "}
                </h3>{" "}
                <p className="font-body-md text-body-md text-[#475569]">
                  {" "}
                  {pageContent.text[84]}{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex items-center justify-between pt-space-sm border-t border-[#E2E8F0] font-label-mono-sm text-label-mono-sm text-[#64748B]">
                {" "}
                <span>{pageContent.text[85]}</span>{" "}
                <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
                  {pageContent.text[86]} <GeminiIcon name="arrow_forward" className="text-[14px]" />
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="lg:col-span-5 flex flex-col gap-gutter">
              {" "}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm hover:border-[#2563EB]/40 transition-colors group">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-[#64748B] font-medium">
                  {pageContent.text[87]}
                </span>{" "}
                <h4 className="font-headline-sm text-headline-sm text-[#0F172A] font-semibold group-hover:text-[#2563EB] transition-colors">
                  {" "}
                  {pageContent.text[88]}{" "}
                </h4>{" "}
                <p className="font-body-sm text-body-sm text-[#475569] line-clamp-2">
                  {" "}
                  {pageContent.text[89]}{" "}
                </p>{" "}
              </div>{" "}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-space-md flex flex-col gap-space-xs shadow-sm hover:border-[#2563EB]/40 transition-colors group">
                {" "}
                <span className="font-label-mono-sm text-label-mono-sm text-[#64748B] font-medium">
                  {pageContent.text[90]}
                </span>{" "}
                <h4 className="font-headline-sm text-headline-sm text-[#0F172A] font-semibold group-hover:text-[#2563EB] transition-colors">
                  {" "}
                  {pageContent.text[91]}{" "}
                </h4>{" "}
                <p className="font-body-sm text-body-sm text-[#475569] line-clamp-2">
                  {" "}
                  {pageContent.text[92]}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="bg-white border border-[#E2E8F0] p-space-xl rounded-2xl flex flex-col items-center text-center gap-space-md shadow-sm max-w-3xl mx-auto w-full">
          {" "}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#2563EB] font-semibold">
            {" "}
            {pageContent.text[93]}{" "}
          </span>{" "}
          <h3 className="font-headline-md text-headline-md text-[#0F172A] font-semibold tracking-tight">
            {" "}
            {pageContent.text[94]}{" "}
          </h3>{" "}
          <p className="font-body-md text-body-md text-[#475569] max-w-xl">
            {" "}
            {pageContent.text[95]}{" "}
          </p>{" "}
          <form className="flex flex-col sm:flex-row w-full max-w-md gap-space-sm mt-space-xs">
            {" "}
            <input
              className="flex-1 bg-[#F8F9FB] border border-[#CBD5E1] px-space-md py-space-sm rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-sm"
              placeholder={pageContent.text[96]}
              required={true}
              type="email"
            />{" "}
            <button
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-label-ui text-label-ui font-semibold px-space-lg py-space-sm rounded-lg transition-colors shadow-sm"
              type="submit"
            >
              {" "}
              {pageContent.text[97]}{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
        <div className="bg-[#0B0F19] p-space-xl lg:p-space-2xl rounded-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-space-xl shadow-2xl border border-[#1E293B]">
          {" "}
          <div className="flex flex-col gap-space-sm max-w-2xl z-10">
            {" "}
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-[#60A5FA] font-semibold">
              {" "}
              {pageContent.text[98]}{" "}
            </span>{" "}
            <h2 className="font-headline-lg lg:font-display-lg text-headline-lg lg:text-display-lg text-white font-bold tracking-tight">
              {" "}
              {pageContent.text[99]}{" "}
            </h2>{" "}
            <p className="font-body-lg text-body-lg text-[#94A3B8]">
              {" "}
              {pageContent.text[100]}{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex flex-col sm:flex-row items-center gap-space-md z-10 shrink-0 w-full lg:w-auto">
            {" "}
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-label-ui text-label-ui font-semibold px-space-lg py-space-md rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all text-center"
              href={localePath(locale, "/build-system")}
            >
              {" "}
              {pageContent.text[101]}{" "}
            </a>{" "}
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#1E293B] hover:bg-[#334155] text-white font-label-ui text-label-ui font-semibold px-space-lg py-space-md rounded-lg transition-colors text-center border border-[#334155]"
              href={localePath(locale, "/what-we-build")}
            >
              {" "}
              {pageContent.text[102]}{" "}
            </a>{" "}
          </div>{" "}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none"></div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
