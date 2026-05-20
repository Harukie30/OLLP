"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  confessionSchedule,
  massScheduleMeta,
  massSchedulePanels,
} from "@/lib/services-schedule"
import { cn } from "@/lib/utils"

const count = massSchedulePanels.length

export function MassScheduleWeek() {
  const [active, setActive] = useState(0)
  const panel = massSchedulePanels[active]

  const go = useCallback((dir: -1 | 1) => {
    setActive((i) => (i + dir + count) % count)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1)
      if (e.key === "ArrowRight") go(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

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
              Doors open before each Mass for quiet prayer. Choose a day type
              below to view times.
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

      <div
        className="mt-8 overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-sm ring-1 ring-sky-50"
        role="region"
        aria-label="Mass schedule by day type"
      >
        <div className="flex flex-col gap-3 border-b border-sky-100 bg-sky-50/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div
            className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-1 sm:gap-2"
            role="tablist"
            aria-label="Schedule type"
          >
            {massSchedulePanels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls={`mass-panel-${p.id}`}
                id={`mass-tab-${p.id}`}
                className={cn(
                  "rounded-lg px-2 py-2.5 text-center text-sm font-medium transition-colors duration-200 motion-reduce:transition-none sm:px-3 sm:text-left",
                  active === i
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white/80 text-blue-950 ring-1 ring-sky-100 hover:bg-sky-50"
                )}
                onClick={() => setActive(i)}
              >
                <span className="block leading-tight">{p.title}</span>
                <span
                  className={cn(
                    "mt-0.5 hidden text-xs font-normal sm:block",
                    active === i
                      ? "text-primary-foreground/90"
                      : "text-muted-foreground"
                  )}
                >
                  {p.subtitle}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1 sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Previous schedule"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[5.5rem] text-center text-xs font-medium text-muted-foreground tabular-nums">
              {active + 1} / {count}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9"
              aria-label="Next schedule"
              onClick={() => go(1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div
          key={panel.id}
          id={`mass-panel-${panel.id}`}
          role="tabpanel"
          aria-labelledby={`mass-tab-${panel.id}`}
          className="px-4 py-5 motion-safe:animate-[mass-panel-slide_0.4s_ease-out_both] sm:px-6 sm:py-6"
        >
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-950">{panel.title}</h3>
              <p className="text-sm text-muted-foreground">{panel.subtitle}</p>
            </div>
            {panel.id === "weekday" ? (
              <p className="text-xs text-primary/90 sm:text-right">
                Same times Monday through Friday
              </p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-xl border border-sky-100/80 bg-gradient-to-b from-white to-sky-50/30">
            <div
              className="grid grid-cols-[minmax(5.5rem,7rem)_1fr] gap-x-4 border-b border-sky-100 bg-sky-50/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-blue-900/70 sm:px-5"
              aria-hidden
            >
              <span>Time</span>
              <span className="text-right sm:text-left">Language / type</span>
            </div>
            <ul aria-label={`${panel.title} times`}>
              {panel.masses.map((m, idx) => (
                <li
                  key={`${panel.id}-${m.time}-${m.name ?? ""}-${idx}`}
                  className={cn(
                    "grid grid-cols-[minmax(5.5rem,7rem)_1fr] items-center gap-x-4 border-b border-sky-100/90 px-4 py-3 last:border-b-0 sm:px-5 sm:py-3.5",
                    "motion-safe:animate-[mass-row-in_0.4s_ease-out_both]"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <span className="text-sm font-semibold tabular-nums text-blue-950 sm:text-base">
                    {m.time}
                  </span>
                  <span className="text-right text-sm text-blue-900/90 sm:text-left sm:text-base">
                    {m.name ?? "Mass"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

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
