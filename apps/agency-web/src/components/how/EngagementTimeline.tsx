const rows = [
  { name: "Diagnose", start: 0, end: 6, note: "30-minute review", style: "ink" },
  { name: "Scope", start: 5, end: 15, note: "Signed by you", style: "gate" },
  { name: "Build", start: 14, end: 46, note: "In your accounts", style: "brand" },
  { name: "Domain warm-up", start: 15, end: 46, note: "Outbound only", style: "dashed" },
  { name: "Run", start: 44, end: 100, note: "Weekly review with your operator", style: "brand" },
  { name: "Hand over", start: 72, end: 100, note: "Final 30 days", style: "bright" },
] as const

const markers = [
  { at: 0, label: "Review" },
  { at: 15, label: "Scope signed" },
  { at: 46, label: "Go live" },
  { at: 72, label: "Handover starts" },
  { at: 100, label: "Your team runs it" },
]

const barStyles: Record<(typeof rows)[number]["style"], string> = {
  ink: "bg-ink text-white",
  gate: "bg-gate text-ink",
  brand: "bg-brand text-white",
  bright: "bg-brand-bright text-ink",
  dashed: "border-2 border-dashed border-brand/60 bg-brand-tint text-brand-deep",
}

/** Gantt-style view of a typical engagement; bars grow in once the chart is revealed. */
export function EngagementTimeline() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8" data-reveal>
      <div className="hidden pl-[11rem] sm:block">
        <div className="relative h-10">
          {markers.map((marker) => (
            <span
              className={`absolute top-0 whitespace-nowrap text-xs font-semibold text-quiet ${
                marker.at === 0 ? "" : marker.at === 100 ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              key={marker.label}
              style={{ left: `${marker.at}%` }}
            >
              {marker.label}
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
          <div className="relative ml-[11rem] h-full">
            {markers.map((marker) => (
              <span
                className="absolute inset-y-0 w-px bg-line"
                key={marker.label}
                style={{ left: `${marker.at}%` }}
              />
            ))}
          </div>
        </div>
        <ol className="relative space-y-3">
          {rows.map((row, index) => {
            const narrow = row.end - row.start < 20
            return (
              <li
                className="relative grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-4"
                key={row.name}
              >
                <span className="text-sm font-semibold">{row.name}</span>
                <div className="relative h-11 rounded-lg bg-paper/70">
                  <div
                    className={`rv-grow absolute inset-y-1 flex items-center overflow-hidden rounded-md px-3 text-xs font-semibold ${barStyles[row.style]}`}
                    style={{
                      left: `${row.start}%`,
                      width: `${row.end - row.start}%`,
                      ["--rv-g" as string]: index,
                    }}
                  >
                    {!narrow && <span className="truncate">{row.note}</span>}
                  </div>
                  {narrow && (
                    <span
                      className="absolute inset-y-0 ml-2 flex items-center whitespace-nowrap text-xs font-semibold text-quiet"
                      style={{ left: `${row.end}%` }}
                    >
                      {row.note}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
      <p className="mt-6 text-sm text-quiet sm:pl-[11rem]">
        A typical shape, not a promise. Your written scope sets the actual dates.
      </p>
    </div>
  )
}
