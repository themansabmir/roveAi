"use client"

import { useEffect, useRef, useState } from "react"
import { engagementProcess } from "@/content/revops"

export function ProcessStory() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = stepRefs.current.indexOf(entry.target as HTMLLIElement)
          if (index >= 0) setActive(index)
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    for (const el of stepRefs.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const steps = engagementProcess.steps
  const progress = (active + 1) / steps.length

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h2 className="rv-heading text-4xl sm:text-5xl" id="process-heading">
            {engagementProcess.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-quiet">
            {engagementProcess.description}
          </p>

          <div aria-hidden="true" className="mt-10 hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className="absolute inset-0 origin-left bg-brand transition-transform duration-700 ease-out"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
              <span className="font-mono text-sm text-quiet">
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>
            <p className="rv-display mt-6 text-[5.5rem] text-ink/10 transition-colors duration-500">
              {steps[active]?.name}
            </p>
          </div>
        </div>
      </div>

      <ol aria-labelledby="process-heading" className="relative lg:col-span-7">
        <span aria-hidden="true" className="absolute bottom-6 left-[15px] top-6 w-px bg-line" />
        {steps.map((step, index) => {
          const isActive = index === active
          return (
            <li
              className="relative grid grid-cols-[32px_1fr] gap-6 pb-14 last:pb-0 lg:min-h-[42vh]"
              key={step.name}
              ref={(node) => {
                stepRefs.current[index] = node
              }}
            >
              <span
                className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border font-mono text-xs transition-colors duration-500 ${
                  isActive || index < active
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-paper text-quiet"
                }`}
              >
                {index + 1}
              </span>
              <div
                className={`transition-opacity duration-500 lg:pt-0.5 ${
                  isActive ? "opacity-100" : "lg:opacity-55"
                }`}
              >
                <h3 className="rv-heading text-3xl">{step.name}</h3>
                <p className="mt-3 max-w-lg text-lg leading-relaxed">{step.description}</p>
                <p className="mt-5 max-w-lg border-l-2 border-brand pl-4 text-[15px] leading-relaxed text-quiet">
                  <span className="font-semibold text-ink">You get: </span>
                  {step.outcome}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
