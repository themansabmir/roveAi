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
    return { path: "Fix", message: homeContent.audit.pathResults.Fix }
  }

  if (
    answers.signals === "unclear" ||
    answers.signals === "partial" ||
    answers.meetings === "few" ||
    answers.meetings === "inconsistent"
  ) {
    return { path: "Generate", message: homeContent.audit.pathResults.Generate }
  }

  if (answers.followUp === "inconsistent") {
    return { path: "Run", message: homeContent.audit.pathResults.Run }
  }

  return { message: homeContent.audit.noClearLeak }
}

export function RevenueLeakAudit({ locale }: { locale: Locale }) {
  const { audit } = homeContent
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ReturnType<typeof getResult> | null>(null)
  const answered = Object.keys(answers).length
  const total = audit.questions.length

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
      className="bg-surface py-24 lg:py-32"
      id="revenue-leak-audit"
    >
      <div className="rv-container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-5 lg:sticky lg:top-28 lg:col-span-5">
          <p className="rv-kicker">{audit.eyebrow}</p>
          <h2 className="rv-heading text-4xl sm:text-5xl" id="audit-title">
            {audit.title}
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-quiet">{audit.description}</p>
        </div>

        <div className="rounded-[14px] border border-line bg-paper p-5 sm:p-8 lg:col-span-7">
          {result ? (
            <div aria-live="polite" className="space-y-6" role="status">
              <p className="text-sm font-semibold text-brand">{audit.resultHeading}</p>
              {result.path ? (
                <div>
                  <h3 className="rv-heading text-3xl">
                    {result.path} {audit.resultTitleSuffix}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-quiet">{result.message}</p>
                  {result.path === "Run" && (
                    <p className="mt-4 rounded-md bg-gate-tint p-4 text-sm leading-relaxed">
                      {audit.runOfferNote}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-lg leading-relaxed">{result.message}</p>
              )}
              <p className="text-xs leading-relaxed text-quiet">{audit.resultNote}</p>
              <div className="flex flex-wrap items-center gap-4">
                {result.path !== undefined && (
                  <Link className="rv-btn-primary" href={localePath(locale, "/contact")}>
                    {homeContent.labels.discussPath}
                  </Link>
                )}
                <button className="rv-link text-sm" onClick={resetAudit} type="button">
                  {audit.reset}
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={submitAudit}>
              <div aria-hidden="true" className="flex items-center gap-3">
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="absolute inset-0 origin-left bg-brand transition-transform duration-500 ease-out"
                    style={{ transform: `scaleX(${answered / total})` }}
                  />
                </div>
                <span className="font-mono text-xs text-quiet">
                  {answered}/{total}
                </span>
              </div>
              {audit.questions.map((question) => (
                <fieldset
                  className="space-y-3 border-b border-line pb-6 last:border-0 last:pb-0"
                  key={question.id}
                >
                  <legend className="text-[15px] font-semibold leading-relaxed">
                    {question.question}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option) => {
                      const checked = answers[question.id] === option.value
                      return (
                        <label
                          className={`cursor-pointer rounded-md border px-4 py-2.5 text-sm transition-[background-color,border-color,color] duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${
                            checked
                              ? "border-ink bg-ink text-white"
                              : "border-line bg-surface hover:border-ink/40"
                          }`}
                          key={option.value}
                        >
                          <input
                            checked={checked}
                            className="sr-only"
                            name={question.id}
                            onChange={() =>
                              setAnswers((current) => ({ ...current, [question.id]: option.value }))
                            }
                            required
                            type="radio"
                            value={option.value}
                          />
                          {option.label}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
              <button className="rv-btn-primary" type="submit">
                {audit.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
