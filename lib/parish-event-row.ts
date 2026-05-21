import type { ParishEvent } from "@/lib/parish-events"
import {
  combineDateAndTime,
  formatSheetTimeString,
  formatTimeFromDate,
  isValidDate,
  normalizeSheetTimeInput,
  parseLocalDateOnly,
  parseSheetTimeString,
} from "@/lib/sheet-time-format"

function sheetTimeFromCell(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const normalized = normalizeSheetTimeInput(trimmed)
  if (normalized) return normalized
  const parts = parseSheetTimeString(trimmed)
  return parts ? formatSheetTimeString(parts) : ""
}

export type EventRow = Record<string, string>

export function parseDatePart(raw: string): string | null {
  const value = raw.trim()

  const dashed = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (dashed) {
    const [, year, month, day] = dashed
    const datePart = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    return parseLocalDateOnly(datePart) ? datePart : null
  }

  const slash = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slash) {
    const [, month, day, year] = slash
    const datePart = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    return parseLocalDateOnly(datePart) ? datePart : null
  }

  return null
}

export function normalizeRowKeys(row: EventRow): EventRow {
  const normalized: EventRow = {}
  for (const [key, value] of Object.entries(row)) {
    const k = key.trim().toLowerCase().replace(/\s+/g, "_")
    if (k === "event" || k === "event_title" || k === "title") {
      normalized.title = value
    } else if (k === "end" || k === "endtime") {
      normalized.end_time = value
    } else if (k === "start_time" || k === "starttime") {
      normalized.time = value
    } else {
      normalized[k] = value
    }
  }
  return normalized
}

export function parishEventFromRow(
  row: EventRow,
  index: number
): ParishEvent | null {
  const data = normalizeRowKeys(row)
  const eventId = data.id?.trim()
  const title = data.title?.trim()
  const datePart = parseDatePart(data.date ?? "")

  // Wedding rows use id_user + name; skip them on the events sheet/tab.
  if (data.id_user?.trim()) return null
  if (!eventId || !title || !datePart) return null

  const timeRaw = sheetTimeFromCell(data.time ?? "")
  const endTimeRaw = sheetTimeFromCell(data.end_time ?? "")
  const allDay = !timeRaw

  const start = timeRaw
    ? combineDateAndTime(datePart, timeRaw)
    : parseLocalDateOnly(datePart)
  if (!start || !isValidDate(start)) return null

  const endCandidate = endTimeRaw
    ? combineDateAndTime(datePart, endTimeRaw)
    : undefined
  const end =
    endCandidate && isValidDate(endCandidate) ? endCandidate : undefined

  return {
    id: eventId,
    title,
    description: data.description?.trim() || undefined,
    location: data.location?.trim() || undefined,
    start,
    end,
    allDay,
  }
}

export function parishEventToRow(event: {
  id: string
  title: string
  date: string
  time?: string
  endTime?: string
  location?: string
  description?: string
}): EventRow {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time ? normalizeSheetTimeInput(event.time) : "",
    end_time: event.endTime ? normalizeSheetTimeInput(event.endTime) : "",
    location: event.location ?? "",
    description: event.description ?? "",
  }
}

export function parishEventToDto(event: ParishEvent) {
  if (!isValidDate(event.start)) return null

  const datePart = `${event.start.getFullYear()}-${String(event.start.getMonth() + 1).padStart(2, "0")}-${String(event.start.getDate()).padStart(2, "0")}`

  return {
    id: event.id,
    title: event.title,
    date: datePart,
    time: event.allDay ? "" : formatTimeFromDate(event.start),
    endTime:
      event.end && isValidDate(event.end) ? formatTimeFromDate(event.end) : "",
    location: event.location ?? "",
    description: event.description ?? "",
    allDay: event.allDay,
  }
}
