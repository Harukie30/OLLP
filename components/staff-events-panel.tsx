"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { format } from "date-fns"
import { CalendarX2, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  staffCreateEvent,
  staffDeleteEvent,
  staffListEvents,
} from "@/app/actions/staff-events"
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog"
import { FailedModal, SuccessModal } from "@/components/result-modal"
import { TimePickerField } from "@/components/time-picker-field"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { parseLocalDateOnly } from "@/lib/sheet-time-format"
import { inputClassName } from "@/lib/site"
import { cn } from "@/lib/utils"

type EventDto = {
  id: string
  title: string
  date: string
  time: string
  endTime: string
  location: string
  description: string
}

type ResultModalState = {
  variant: "success" | "error"
  title: string
  description?: string
} | null

type DeleteEventConfirm = {
  id: string
  title: string
}

export function StaffEventsPanel({
  pending,
  startTransition,
}: {
  pending: boolean
  startTransition: (fn: () => void | Promise<void>) => void
}) {
  const [events, setEvents] = useState<EventDto[]>([])
  const [selected, setSelected] = useState<Date | undefined>()
  const [calendarReady, setCalendarReady] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [resultModal, setResultModal] = useState<ResultModalState>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteEventConfirm | null>(
    null
  )

  useEffect(() => {
    setSelected(new Date())
    setCalendarReady(true)
  }, [])

  const loadEvents = useCallback(() => {
    startTransition(async () => {
      const result = await staffListEvents()
      if (!result.ok) {
        toast.error(result.error ?? "Could not load events.")
        return
      }
      setEvents(result.events)
    })
  }, [startTransition])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const daysWithEvents = useMemo(() => {
    return events
      .map((e) => parseLocalDateOnly(e.date))
      .filter((d): d is Date => d !== null)
  }, [events])

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : ""

  const eventsOnDay = selectedKey
    ? events.filter((e) => e.date === selectedKey)
    : []

  const handleCreate = (formData: FormData) => {
    formData.set("date", selectedKey)
    const title = String(formData.get("title") ?? "").trim()
    startTransition(async () => {
      const result = await staffCreateEvent(formData)
      if (!result.ok) {
        const message = result.error ?? "Could not save the event."
        toast.error(message)
        setResultModal({
          variant: "error",
          title: "Could not save event",
          description: message,
        })
        return
      }
      const dateLabel = format(selected ?? new Date(), "MMM d, yyyy")
      const description = title ? `${title} · ${dateLabel}` : dateLabel
      toast.success("Event added", { description })
      setResultModal({
        variant: "success",
        title: "Event added",
        description,
      })
      loadEvents()
      setFormKey((k) => k + 1)
    })
  }

  const runDeleteEvent = () => {
    if (!deleteConfirm) return
    const { id, title } = deleteConfirm
    startTransition(async () => {
      const result = await staffDeleteEvent(id)
      if (!result.ok) {
        const message = result.error ?? "Could not delete the event."
        toast.error(message)
        setResultModal({
          variant: "error",
          title: "Could not delete event",
          description: message,
        })
        return
      }
      toast.success("Event deleted", { description: title })
      setResultModal({
        variant: "success",
        title: "Event deleted",
        description: title,
      })
      setDeleteConfirm(null)
      loadEvents()
    })
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Pick a day on the calendar, then add or remove events. Changes appear on
        the home page.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-2">
          {calendarReady ? (
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              defaultMonth={selected}
              modifiers={{ hasEvent: daysWithEvents }}
              modifiersClassNames={{
                hasEvent:
                  "relative font-semibold after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
              }}
            />
          ) : (
            <div
              className="flex h-[280px] items-center justify-center"
              aria-hidden
            >
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <h3 className="font-semibold text-blue-950">
              {selected
                ? format(selected, "EEEE, MMMM d, yyyy")
                : "Select a date"}
            </h3>
            {eventsOnDay.length === 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                No events on this day yet.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {eventsOnDay.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start justify-between gap-2 rounded-lg border border-sky-100 bg-white p-3"
                  >
                    <div className="min-w-0 text-sm">
                      <p className="font-medium text-blue-950">{event.title}</p>
                      {event.time ? (
                        <p className="text-muted-foreground">
                          {event.time}
                          {event.endTime ? ` – ${event.endTime}` : ""}
                        </p>
                      ) : null}
                      {event.location ? (
                        <p className="text-muted-foreground">{event.location}</p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 cursor-pointer text-destructive"
                      onClick={() =>
                        setDeleteConfirm({ id: event.id, title: event.title })
                      }
                      disabled={pending}
                      aria-label={`Delete ${event.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            key={formKey}
            id="staff-event-form"
            className="space-y-3 rounded-xl border border-sky-100 bg-sky-50/30 p-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate(new FormData(e.currentTarget))
            }}
          >
            <p className="text-sm font-medium text-blue-950">
              Add event on this day
            </p>
            <p className="text-xs text-muted-foreground">
              Pick a start time for timed events. Leave times empty only for
              all-day events.
            </p>
            <label className="block text-sm">
              Title
              <input
                name="title"
                required
                className={cn(inputClassName, "mt-1")}
                placeholder="Youth night"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <TimePickerField
                name="time"
                label="Start time"
                optional
                placeholder="Pick a time"
              />
              <TimePickerField
                name="endTime"
                label="End time"
                optional
                placeholder="Pick a time"
              />
            </div>
            <label className="block text-sm">
              Location
              <input
                name="location"
                className={cn(inputClassName, "mt-1")}
                placeholder="Parish hall"
              />
            </label>
            <label className="block text-sm">
              Description
              <textarea
                name="description"
                rows={2}
                className={cn(inputClassName, "mt-1 min-h-16 resize-y")}
                placeholder="Optional details"
              />
            </label>
            <Button type="submit" className="cursor-pointer" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save event"
              )}
            </Button>
          </form>
        </div>
      </div>

      <SuccessModal
        open={resultModal?.variant === "success"}
        onOpenChange={(open) => !open && setResultModal(null)}
        title={resultModal?.title ?? ""}
        description={resultModal?.description}
      />
      <FailedModal
        open={resultModal?.variant === "error"}
        onOpenChange={(open) => !open && setResultModal(null)}
        title={resultModal?.title ?? "Something went wrong"}
        description={resultModal?.description}
      />

      <ConfirmAlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete this event?"
        description={
          deleteConfirm
            ? `“${deleteConfirm.title}” will be removed from the home page. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete event"
        icon={<CalendarX2 className="text-destructive" aria-hidden />}
        onConfirm={runDeleteEvent}
        pending={pending}
      />
    </>
  )
}
