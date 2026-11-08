"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import type { Locale } from "@rove/cms/constants"
import { homeContent } from "@/content/home"
import { localePath } from "@/lib/i18n"

type QuestionId = (typeof homeContent.audit.questions)[number]["id"]
type Answers = Partial<Record<QuestionId, string>>
type PathName = "Fix" | "Generate" | "Run"

function getResult(answers: Answers): { path?: PathName; message: string } {
  if (answers.closer === "no") {
    return { message: homeContent.audit.noCloser }
  }

  if (answers.crm === "blocking" || answers.crm === "gaps") {
    return {
      path: "Fix",
      message: homeContent.audit.pathResults.Fix,
    }
  }

  if (
    answers.signals === "unclear" ||
    answers.signals === "partial" ||
    answers.meetings === "few" ||
    answers.meetings === "inconsistent"
  ) {
    return {
      path: "Generate",
      message: homeContent.audit.pathResults.Generate,
    }
  }

  if (answers.followUp === "inconsistent") {
    return {
      path: "Run",
      message: homeContent.audit.pathResults.Run,
    }
  }

  return { message: homeContent.audit.noClearLeak }
}

export function RevenueLeakAudit({ locale }: { locale: Locale }) {
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ReturnType<typeof getResult> | null>(null)

  function submitAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(getResult(answers))
  }

  function resetAudit() {
    setAnswers({})
    setResult(null)
  }

  return (
    <section
      aria-labelledby="audit-title"
      className="w-full border-y border-slate-200/70 bg-white px-4 py-24 sm:px-6 lg:px-8"
      id="revenue-leak-audit"
    >
      <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4 lg:sticky lg:top-24">
          <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-blue-700">
            {homeContent.audit.eyebrow}
          </p>
          <h2
            className="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl"
            id="audit-title"
          >
            {homeContent.audit.title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">
            {homeContent.audit.description}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#FAFAFD] p-5 shadow-xl shadow-slate-200/40 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"
          />
          {result ? (
            <div aria-live="polite" className="space-y-5" role="status">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {homeContent.audit.resultHeading}
                </p>
                {result.path ? (
                  <>
                    <h3 className="mt-3 font-display text-2xl font-bold text-slate-950">
                      {result.path} {homeContent.audit.resultTitleSuffix}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.message}</p>
                    {result.path === "Run" && (
                      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
                        {homeContent.audit.runOfferNote}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-base leading-relaxed text-slate-700">{result.message}</p>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                {homeContent.audit.resultNote}
              </p>
              {result.path !== undefined && (
                <Link
                  className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  href={localePath(locale, "/contact")}
                >
                  {homeContent.labels.discussPath}
                </Link>
              )}
              <div>
                <button
                  className="text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  onClick={resetAudit}
                  type="button"
                >
                  {homeContent.audit.reset}
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={submitAudit}>
              {homeContent.audit.questions.map((question) => (
                <fieldset
                  className="space-y-3 border-b border-slate-200/80 pb-5 last:border-0 last:pb-0"
                  key={question.id}
                >
                  <legend className="font-display text-sm font-bold leading-relaxed text-slate-900">
                    {question.question}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option) => (
                      <label
                        className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition-all focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${
                          answers[question.id] === option.value
                            ? "border-blue-600 bg-blue-50 text-blue-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                        key={option.value}
                      >
                        <input
                          checked={answers[question.id] === option.value}
                          className="sr-only"
                          name={question.id}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: option.value,
                            }))
                          }
                          required
                          type="radio"
                          value={option.value}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <button
                className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
              >
                {homeContent.audit.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
