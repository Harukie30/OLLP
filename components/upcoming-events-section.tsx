import "server-only"

import Link from "next/link"
import { format, isValid } from "date-fns"
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatParishEventWhen } from "@/lib/format-event-date"
import { formatEventTimeRange } from "@/lib/sheet-time-format"
import { getUpcomingParishEvents } from "@/lib/parish-events"
import { getSampleParishEvents } from "@/lib/sample-parish-events"
import type { ParishEvent } from "@/lib/parish-events"
export async function UpcomingEventsSection() {
  const result = await getUpcomingParishEvents(4)
  const showDevSamples =
    result.source === "none" && process.env.NODE_ENV === "development"
  const events: ParishEvent[] = showDevSamples
    ? getSampleParishEvents()
    : result.events

  if (result.source === "none" && process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <section
      className="relative overflow-hidden border-t border-blue-100 bg-gradient-to-b from-sky-50/30 via-white to-white py-16 sm:py-20"
      aria-labelledby="upcoming-events-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(59_130_246/0.06),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
              <CalendarDays className="size-6" aria-hidden />
            </span>
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Parish life
              </p>
              <h2
                id="upcoming-events-heading"
                className="mt-1 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl"
              >
                Upcoming events
              </h2>
              <p className="mt-2 text-base text-muted-foreground">
                Gatherings, feasts, and special occasions at the parish.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {events.length > 0 ? (
              <Badge
                variant="secondary"
                className="border-sky-200 bg-white/90 px-3 py-1 text-blue-900"
              >
                {events.length} upcoming
              </Badge>
            ) : null}
            <Button variant="outline" asChild className="gap-1.5 shadow-sm">
              <Link href="/services">
                Mass & sacraments
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10">
          {showDevSamples ? (
            <p className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-center text-sm text-amber-950">
              <Sparkles className="size-4 shrink-0" aria-hidden />
              Sample preview — set{" "}
              <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">
                SHEETDB_API_URL
              </code>{" "}
              in <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">.env.local</code>
            </p>
          ) : null}

          {result.source === "sheetdb" && events.length === 0 ? (
            <EventsEmptyState message="No upcoming events scheduled at this time. Check back soon or ask at the parish office." />
          ) : events.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2">
              {events.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : result.source === "none" ? (
            <EventsEmptyState message="Events will appear here once SheetDB is connected." />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function EventsEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-white/80 px-6 py-14 text-center shadow-sm">
      <span className="flex size-14 items-center justify-center rounded-full bg-sky-100 text-primary">
        <CalendarDays className="size-7" aria-hidden />
      </span>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  )
}

function EventCard({ event }: { event: ParishEvent }) {
  const start = event.start
  const validStart = isValid(start)
  const day = validStart ? format(start, "d") : "—"
  const month = validStart ? format(start, "MMM") : ""
  const weekday = validStart ? format(start, "EEE") : ""
  const timeRange = formatEventTimeRange(event.start, event.end, event.allDay)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm ring-1 ring-sky-50 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-stretch">
      <div
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/80 to-sky-400/60"
        aria-hidden
      />

      <div className="flex shrink-0 flex-col items-center justify-center border-b border-sky-100 bg-gradient-to-br from-sky-50/90 to-primary/5 px-5 py-4 text-center sm:min-w-[5.5rem] sm:border-b-0 sm:border-r sm:py-5">
        {weekday ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {weekday}
          </span>
        ) : null}
        <span className="mt-0.5 text-3xl font-bold tabular-nums leading-none text-blue-950 sm:text-4xl">
          {day}
        </span>
        <span className="mt-1 text-sm font-semibold uppercase tracking-wide text-blue-800/70">
          {month}
        </span>
        {event.allDay ? (
          <Badge
            variant="secondary"
            className="mt-2 border-sky-200 bg-white/90 text-[10px] uppercase"
          >
            All day
          </Badge>
        ) : timeRange ? (
          <span className="mt-2 text-center text-[11px] font-semibold leading-tight text-primary">
            {timeRange}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-5">
        <h3 className="text-lg font-semibold leading-snug text-blue-950 group-hover:text-primary">
          {event.title}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-blue-800/85">
          {formatParishEventWhen(event.start, event.end, event.allDay)}
        </p>

        <div className="mt-4 flex flex-1 flex-col gap-2">
          {event.location ? (
            <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-primary/80"
                aria-hidden
              />
              <span>{event.location}</span>
            </p>
          ) : null}
          {event.description ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
