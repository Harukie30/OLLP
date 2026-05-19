/** Google Sheet / SheetDB time format: "6:00 PM" (12-hour, 2-digit minutes). */

export type SheetTimeParts = {
  hour: number
  minute: number
  meridiem: "AM" | "PM"
}

const SHEET_TIME_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i

export function parseSheetTimeString(value: string): SheetTimeParts | null {
  const match = value.trim().match(SHEET_TIME_RE)
  if (!match) return null

  const hour = Number(match[1])
  const minute = Number(match[2])
  const meridiem = match[3].toUpperCase() as "AM" | "PM"

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null

  return { hour, minute, meridiem }
}

/** Canonical string written to the sheet and hidden form fields. */
export function formatSheetTimeString(parts: SheetTimeParts): string {
  return `${parts.hour}:${String(parts.minute).padStart(2, "0")} ${parts.meridiem}`
}

export function normalizeSheetTimeInput(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const parts = parseSheetTimeString(trimmed)
  return parts ? formatSheetTimeString(parts) : ""
}

export function parseLocalDateOnly(datePart: string): Date | null {
  const match = datePart.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function combineDateAndTime(
  datePart: string,
  time: string
): Date | null {
  const parts = parseSheetTimeString(time)
  if (!parts) return null

  const base = parseLocalDateOnly(datePart)
  if (!base) return null

  let hours = parts.hour
  if (parts.meridiem === "PM" && hours !== 12) hours += 12
  if (parts.meridiem === "AM" && hours === 12) hours = 0

  const combined = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hours,
    parts.minute,
    0,
    0
  )

  return Number.isNaN(combined.getTime()) ? null : combined
}

export function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime())
}

export function formatTimeFromDate(date: Date): string {
  if (!isValidDate(date)) return ""

  const hours24 = date.getHours()
  const minute = date.getMinutes()
  const meridiem: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM"
  let hour12 = hours24 % 12
  if (hour12 === 0) hour12 = 12

  return formatSheetTimeString({ hour: hour12, minute, meridiem })
}
