type Step = { actor: "agent" | "person"; label: string; detail: string }

function ActorBadge({ actor, tone = "dark" }: { actor: Step["actor"]; tone?: "dark" | "light" }) {
  const person = actor === "person"
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        person
          ? tone === "dark"
            ? "bg-gate/15 text-gate"
            : "bg-gate-tint text-gate-text"
          : tone === "dark"
            ? "bg-brand-bright/10 text-brand-bright"
            : "bg-brand-tint text-brand-deep"
      }`}
    >
      <span
        aria-hidden="true"
        className={
          person
            ? "h-2 w-2 rotate-45 rounded-[1px] bg-gate"
            : "h-2 w-2 rounded-full bg-brand-bright"
        }
      />
      {person ? "Person" : "Agent"}
    </span>
  )
}

/** Pipeline: a vertical run log for one account. */
function RunLog({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative space-y-3" data-reveal>
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-[1.0625rem] top-6 w-px overflow-hidden bg-ink-line"
      >
        <span
          className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-brand-bright to-transparent"
          style={{ animation: "rv-drop 3.4s linear infinite" }}
        />
      </span>
      {steps.map((step, index) => (
        <li className="relative grid grid-cols-[2.25rem_1fr] items-start gap-4" key={step.label}>
          <span
            className={`relative z-10 mt-3 grid h-[2.125rem] w-[2.125rem] place-items-center rounded-full font-mono text-[11px] ${
              step.actor === "person"
                ? "bg-gate text-ink"
                : "border border-ink-line bg-ink text-ink-muted"
            }`}
          >
            {index + 1}
          </span>
          <div className="rounded-xl border border-ink-line bg-ink-2 px-5 py-4 transition-colors duration-300 hover:border-brand-bright/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{step.label}</p>
              <ActorBadge actor={step.actor} />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Sales and CRM: an inbox where each reply shows its classification and route. */
function ReplyInbox({ steps }: { steps: Step[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-line bg-ink-2" data-reveal>
      <div className="flex items-center justify-between border-b border-ink-line px-5 py-3.5 text-xs text-ink-muted">
        <span className="font-semibold text-white">Replies today</span>
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-bright/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
          </span>
          Sorting as they arrive
        </span>
      </div>
      <ul className="divide-y divide-ink-line">
        {steps.map((step) => {
          const [quote, ...rest] = step.detail.split('" ')
          return (
            <li
              className="group grid gap-3 px-5 py-4 transition-colors duration-300 hover:bg-ink sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              key={step.label}
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] text-white">{quote}&quot;</p>
                <p className="mt-1 text-sm text-ink-muted">{rest.join('" ')}</p>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="rounded-md border border-ink-line px-2 py-1 text-xs font-semibold text-white">
                  {step.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-muted transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
                <ActorBadge actor={step.actor} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Revenue operations: the follow-up schedule after a proposal, as a horizontal timeline. */
function FollowUpTrack({ steps }: { steps: Step[] }) {
  return (
    <div data-reveal>
      <div aria-hidden="true" className="relative mb-6 hidden h-px bg-ink-line lg:block">
        <span className="rv-grow absolute inset-0 bg-gradient-to-r from-brand via-brand-bright to-gate" />
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {steps.map((step, index) => (
          <li
            className={`flex flex-col rounded-xl border p-5 transition-transform duration-300 hover:-translate-y-1 ${
              step.actor === "person" ? "border-gate/40 bg-gate/10" : "border-ink-line bg-ink-2"
            } ${index >= 4 ? "lg:mt-8" : ""}`}
            key={step.label}
          >
            <p className="rv-heading text-2xl">{step.label}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
            <div className="mt-4">
              <ActorBadge actor={step.actor} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** A worked example of the system running, laid out differently for each service. */
export function ServiceRun({
  serviceId,
  run,
  label,
}: {
  serviceId: string
  run: { title: string; intro: string; steps: Step[] }
  label?: React.ReactNode
}) {
  const wide = serviceId === "revenue-ops"
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-brand/30 blur-[130px]"
      />
      <div className={`rv-container relative grid gap-12 ${wide ? "" : "lg:grid-cols-12"}`}>
        <div className={wide ? "max-w-3xl" : "lg:col-span-5"}>
          {label}
          <h2 className="rv-heading mt-5 text-4xl sm:text-5xl" data-reveal>
            {run.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted" data-reveal>
            {run.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-ink-muted" data-reveal>
            <span className="flex items-center gap-2">
              <ActorBadge actor="agent" /> repeatable work
            </span>
            <span className="flex items-center gap-2">
              <ActorBadge actor="person" /> a person decides
            </span>
          </div>
          <p className="mt-6 text-xs text-ink-muted/80" data-reveal>
            Illustrative example. Names and details are invented.
          </p>
        </div>
        <div className={wide ? "" : "lg:col-span-7"}>
          {serviceId === "pipeline" && <RunLog steps={run.steps} />}
          {serviceId === "sales-crm" && <ReplyInbox steps={run.steps} />}
          {wide && <FollowUpTrack steps={run.steps} />}
        </div>
      </div>
    </section>
  )
}
