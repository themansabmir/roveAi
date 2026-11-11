"use client"

import { useState, type FormEvent } from "react"

const crmOptions = ["HubSpot", "Pipedrive", "Another CRM", "No CRM yet"]
const problemOptions = [
  "Not enough qualified meetings",
  "Our CRM data isn't reliable",
  "Follow-up and reactivation leak revenue",
  "Not sure yet",
]

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string }

const field =
  "mt-2 block w-full rounded-lg border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-quiet/60 focus:border-brand focus:shadow-[0_0_0_4px_rgb(11_122_90/0.12)]"

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus({ state: "sending" })
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        setStatus({ state: "error", message: result.error ?? "Something went wrong. Try again." })
        return
      }
      form.reset()
      setStatus({ state: "sent" })
    } catch {
      setStatus({ state: "error", message: "Check your connection and try again." })
    }
  }

  if (status.state === "sent") {
    return (
      <div
        aria-live="polite"
        className="rounded-3xl border border-brand/30 bg-brand-tint p-10"
        role="status"
      >
        <h2 className="rv-heading text-3xl">Request received.</h2>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-quiet">
          We&apos;ll be in touch to confirm a time for your 30-minute review.
        </p>
      </div>
    )
  }

  return (
    <form
      className="relative rounded-3xl border border-line bg-surface p-6 shadow-[0_30px_70px_-40px_rgb(11_19_36/0.3)] sm:p-10"
      onSubmit={onSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Name
          <input autoComplete="name" className={field} maxLength={120} name="name" required />
        </label>
        <label className="block text-sm font-semibold">
          Work email
          <input
            autoComplete="email"
            className={field}
            maxLength={200}
            name="email"
            required
            type="email"
          />
        </label>
        <label className="block text-sm font-semibold">
          Company
          <input
            autoComplete="organization"
            className={field}
            maxLength={160}
            name="company"
            required
          />
        </label>
        <label className="block text-sm font-semibold">
          Website <span className="font-normal text-quiet">(optional)</span>
          <input
            autoComplete="url"
            className={field}
            maxLength={200}
            name="website"
            placeholder="https://"
            type="url"
          />
        </label>
        <label className="block text-sm font-semibold">
          CRM
          <select className={field} defaultValue="" name="crm">
            <option disabled value="">
              Select one
            </option>
            {crmOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Biggest problem right now
          <select className={field} defaultValue="" name="problem">
            <option disabled value="">
              Select one
            </option>
            {problemOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Anything else? <span className="font-normal text-quiet">(optional)</span>
          <textarea className={`${field} min-h-[120px] resize-y`} maxLength={2000} name="message" />
        </label>
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Leave this empty
            <input autoComplete="off" name="company_url" tabIndex={-1} />
          </label>
        </div>
      </div>

      {status.state === "error" && (
        <p
          className="mt-6 rounded-lg bg-[#fdecec] px-4 py-3 text-sm font-medium text-[#9b1c1c]"
          role="alert"
        >
          {status.message}
        </p>
      )}

      <button
        className="rv-btn-primary mt-8 min-h-14 w-full px-8 text-base disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        disabled={status.state === "sending"}
        type="submit"
      >
        {status.state === "sending" ? "Sending…" : "Book my 30-minute review"}
      </button>
    </form>
  )
}
