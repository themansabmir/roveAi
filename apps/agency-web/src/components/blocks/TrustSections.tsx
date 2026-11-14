import Link from "next/link"
import type { Locale } from "@rove/cms/constants"
import { agentRules, hireInstead, services } from "@/content/revops"
import { localePath } from "@/lib/i18n"

/** Two ledgers side by side: what agents are allowed to do, and the lines they never cross. */
export function AgentRules({ locale }: { locale: Locale }) {
  return (
    <section className="py-24 lg:py-32" id="agents">
      <div className="rv-container">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
            {agentRules.title}
          </h2>
          <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
            {agentRules.description}
          </p>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand/20 bg-brand-tint p-7 sm:p-10" data-reveal>
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-deep">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" />
              Agents do
            </p>
            <ol className="mt-6 space-y-3">
              {agentRules.does.map((item, index) => (
                <li
                  className="flex items-center gap-4 rounded-xl bg-surface px-4 py-3.5 text-[15px] transition-transform duration-300 hover:translate-x-1"
                  key={item}
                >
                  <span className="font-mono text-xs text-brand">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div
            className="rounded-3xl bg-ink p-7 text-white sm:p-10"
            data-reveal
            style={{ ["--rv-i" as string]: 1 }}
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-gate">
              <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gate" />
              Agents never
            </p>
            <ul className="mt-6 space-y-3">
              {agentRules.never.map((item) => (
                <li
                  className="group flex items-center gap-4 rounded-xl bg-ink-2 px-4 py-3.5 text-[15px]"
                  key={item}
                >
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-gate transition-transform duration-500 group-hover:rotate-90"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="m4 4 8 8m0-8-8 8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          data-reveal
        >
          <p className="max-w-2xl text-[15px] leading-relaxed text-quiet">{agentRules.note}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {services.items.map((item) => (
              <Link
                className="rv-link"
                href={localePath(locale, `/services/${item.slug}`)}
                key={item.id}
              >
                See agents in {item.name.replace(/^\w/, (c) => c.toLowerCase())}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Each system mapped to the hire it replaces; the role name is struck through on reveal. */
export function HireInstead({ locale }: { locale: Locale }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="rv-container">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 className="rv-heading text-4xl sm:text-5xl lg:col-span-7" data-reveal>
            {hireInstead.title}
          </h2>
          <p className="text-lg leading-relaxed text-quiet lg:col-span-5 lg:pt-2" data-reveal>
            {hireInstead.description}
          </p>
        </div>
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {hireInstead.roles.map((item, index) => {
            const service = services.items.find((s) => s.id === item.serviceId)
            if (!service) return null
            return (
              <li data-reveal key={item.role} style={{ ["--rv-i" as string]: index }}>
                <Link
                  className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-7 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_30px_60px_-35px_rgb(11_19_36/0.35)] sm:p-8"
                  href={localePath(locale, `/services/${service.slug}`)}
                >
                  <p className="text-sm font-medium text-quiet">Instead of hiring</p>
                  <p className="relative mt-2 w-fit">
                    <span className="rv-heading text-3xl text-quiet">{item.role}</span>
                    <span
                      aria-hidden="true"
                      className="rv-grow absolute left-0 right-0 top-[calc(50%-1px)] h-[3px] rounded-full bg-gate"
                      style={{ ["--rv-g" as string]: index + 1 }}
                    />
                  </p>
                  <p className="mt-6 text-sm font-medium text-quiet">You get</p>
                  <p className="rv-heading mt-2 text-3xl text-brand group-hover:text-brand-deep">
                    {service.name}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 border-t border-line pt-5 text-[15px]">
                    {item.work.map((task) => (
                      <li className="flex items-center gap-3" key={task}>
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-xl bg-paper px-4 py-3 text-sm text-quiet">
                    {item.keep}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="mx-auto mt-12 max-w-3xl text-center text-lg leading-relaxed" data-reveal>
          {hireInstead.note}
        </p>
      </div>
    </section>
  )
}
