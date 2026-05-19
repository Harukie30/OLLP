import { CalendarRange } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  confessionSchedule,
  massScheduleMeta,
  weeklyMassSchedule,
} from "@/lib/services-schedule"
import { cn } from "@/lib/utils"

export function MassScheduleWeek() {
  return (
    <section
      className="rounded-2xl border border-blue-100 bg-gradient-to-b from-sky-50/40 to-white p-6 shadow-sm sm:p-8"
      aria-labelledby="mass-schedule-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarRange className="size-5" aria-hidden />
          </span>
          <div>
            <h2
              id="mass-schedule-heading"
              className="text-xl font-semibold tracking-tight text-blue-950 sm:text-2xl"
            >
              Weekly Mass schedule
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-base">
              Doors open before each Mass for quiet prayer. Times below are the
              parish’s regular rhythm; special feasts may vary.
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="w-fit shrink-0 border-sky-200 bg-white/90 px-3 py-1"
        >
          {massScheduleMeta.effectivePeriod}
        </Badge>
      </div>

      <ol className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {weeklyMassSchedule.map((day) => (
          <li
            key={day.weekday}
            className={cn(
              "flex min-h-[7.5rem] flex-col rounded-xl border border-sky-100 bg-white/90 p-4 shadow-sm ring-1 ring-sky-50",
              day.weekday === "Sunday" &&
                "sm:col-span-2 lg:col-span-4 lg:flex-row lg:items-stretch lg:gap-6 lg:p-5"
            )}
          >
            <div
              className={cn(
                "mb-3 flex items-center gap-2",
                day.weekday === "Sunday" &&
                  "lg:mb-0 lg:min-w-[8rem] lg:flex-col lg:items-start lg:justify-center lg:gap-1"
              )}
            >
              <span
                className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                aria-hidden
              >
                {day.shortLabel}
              </span>
              <span className="font-semibold text-blue-950">{day.weekday}</span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {day.masses.length > 0 ? (
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label={`Mass times on ${day.weekday}`}
                >
                  {day.masses.map((m) => (
                    <li
                      key={`${day.weekday}-${m.time}-${m.name ?? ""}`}
                      className="inline-flex flex-col rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 text-left"
                    >
                      <span className="text-sm font-semibold tabular-nums text-blue-950">
                        {m.time}
                      </span>
                      {m.name ? (
                        <span className="text-xs text-blue-800/80">{m.name}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {day.closedNote ?? "No public Mass scheduled."}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-primary/15 bg-primary/[0.06] px-4 py-3 text-sm text-blue-950">
        <span className="font-semibold text-primary">Confession</span>
        <span className="mx-2 text-blue-800/40" aria-hidden>
          ·
        </span>
        {confessionSchedule}
      </div>

      <p className="mt-6 border-t border-sky-100 pt-5 text-sm text-muted-foreground">
        {massScheduleMeta.footnote}
      </p>
    </section>
  )
}
