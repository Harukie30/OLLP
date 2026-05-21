import "server-only"

import type { ParishEvent } from "@/lib/parish-events"
import { isDatabaseConfigured } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import {
  combineDateAndTime,
  parseLocalDateOnly,
} from "@/lib/sheet-time-format"
import type { ParishEvent as DbParishEvent } from "@prisma/client"

function rowToParishEvent(row: DbParishEvent): ParishEvent | null {
  const datePart = row.date.trim()
  if (!parseLocalDateOnly(datePart)) return null

  const timeRaw = row.time.trim()
  const endTimeRaw = row.endTime.trim()
  const allDay = !timeRaw

  const start = timeRaw
    ? combineDateAndTime(datePart, timeRaw)
    : parseLocalDateOnly(datePart)
  if (!start) return null

  const endCandidate = endTimeRaw
    ? combineDateAndTime(datePart, endTimeRaw)
    : undefined

  return {
    id: row.id,
    title: row.title,
    description: row.description.trim() || undefined,
    location: row.location.trim() || undefined,
    start,
    end: endCandidate ?? undefined,
    allDay,
  }
}

/** All-day events use midnight; treat the whole calendar day as still upcoming. */
function isUpcomingEvent(event: ParishEvent, now: Date): boolean {
  if (event.allDay) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const eventDay = new Date(
      event.start.getFullYear(),
      event.start.getMonth(),
      event.start.getDate()
    )
    return eventDay >= today
  }

  return (event.end ?? event.start) >= now
}

export async function getUpcomingParishEventsFromDb(
  limit?: number
): Promise<ParishEvent[]> {
  if (!isDatabaseConfigured()) return []

  const rows = await prisma.parishEvent.findMany({
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  })

  const now = new Date()
  const events = rows
    .map(rowToParishEvent)
    .filter((e): e is ParishEvent => e !== null)
    .filter((e) => isUpcomingEvent(e, now))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  return limit ? events.slice(0, limit) : events
}

export async function getAllParishEventsFromDb(): Promise<ParishEvent[]> {
  if (!isDatabaseConfigured()) return []

  const rows = await prisma.parishEvent.findMany({
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  })

  return rows
    .map(rowToParishEvent)
    .filter((e): e is ParishEvent => e !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

export async function createParishEventInDb(input: {
  title: string
  date: string
  time?: string
  endTime?: string
  location?: string
  description?: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.parishEvent.create({
      data: {
        title: input.title,
        date: input.date,
        time: input.time ?? "",
        endTime: input.endTime ?? "",
        location: input.location ?? "",
        description: input.description ?? "",
      },
    })
    return { ok: true }
  } catch (err) {
    console.error("Create parish event failed:", err)
    return { ok: false, error: "Could not save the event." }
  }
}

export async function deleteParishEventInDb(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.parishEvent.delete({ where: { id } })
    return { ok: true }
  } catch (err) {
    console.error("Delete parish event failed:", err)
    return { ok: false, error: "Could not delete the event." }
  }
}
