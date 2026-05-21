/** Google Sheet / SheetDB time format: "6:00 PM" (12-hour, 2-digit minutes). */

export type SheetTimeParts = {
  hour: number
  minute: number
  meridiem: "AM" | "PM"
}

function partsFrom24Hour(hours24: number, minute: number): SheetTimeParts | null {
  if (hours24 < 0 || hours24 > 23 || minute < 0 || minute > 59) return null

  const meridiem: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM"
  let hour = hours24 % 12
  if (hour === 0) hour = 12

  return { hour, minute, meridiem }
}

/** Google Sheets time cells often come back as day-fractions (0.25 = 6:00 AM). */
function parseSheetTimeFraction(value: string): SheetTimeParts | null {
  const num = Number(value)
  if (!Number.isFinite(num)) return null

  const fraction = num >= 1 ? num % 1 : num
  if (fraction <= 0 || fraction >= 1) return null

  const totalMinutes = Math.round(fraction * 24 * 60) % (24 * 60)
  const hours24 = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60

  return partsFrom24Hour(hours24, minute)
}

export function parseSheetTimeString(value: string): SheetTimeParts | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const fromFraction = parseSheetTimeFraction(trimmed)
  if (fromFraction) return fromFraction

  const twelveHour = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
  )
  if (twelveHour) {
    const hour = Number(twelveHour[1])
    const minute = Number(twelveHour[2])
    const meridiem = twelveHour[3].toUpperCase() as "AM" | "PM"
    if (hour < 1 || hour > 12) return null
    return { hour, minute, meridiem }
  }

  const twelveHourNoSpace = trimmed.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i)
  if (twelveHourNoSpace) {
    const hour = Number(twelveHourNoSpace[1])
    const minute = Number(twelveHourNoSpace[2])
    const meridiem = twelveHourNoSpace[3].toUpperCase() as "AM" | "PM"
    if (hour < 1 || hour > 12) return null
    return { hour, minute, meridiem }
  }

  const hourOnly = trimmed.match(/^(\d{1,2})\s*(AM|PM)$/i)
  if (hourOnly) {
    const hour = Number(hourOnly[1])
    const meridiem = hourOnly[2].toUpperCase() as "AM" | "PM"
    if (hour < 1 || hour > 12) return null
    return { hour, minute: 0, meridiem }
  }

  const twentyFourHour = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (twentyFourHour) {
    return partsFrom24Hour(Number(twentyFourHour[1]), Number(twentyFourHour[2]))
  }

  return null
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

/**
 * Normalize a wedding/event date cell from SheetDB.
 * Sheets often return ISO dates as serial numbers (e.g. 45321) or locale strings.
 */
export function sheetDateFromCell(
  value: string | number | undefined | null
): string | null {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  if (!trimmed) return null

  const dashed = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (dashed) {
    const [, year, month, day] = dashed
    const datePart = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    return parseLocalDateOnly(datePart) ? datePart : null
  }

  const slash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slash) {
    const [, month, day, year] = slash
    const datePart = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    return parseLocalDateOnly(datePart) ? datePart : null
  }

  const num = Number(trimmed)
  if (Number.isFinite(num) && num >= 1) {
    const wholeDays = Math.floor(num)
    if (wholeDays >= 1) {
      const epoch = Date.UTC(1899, 11, 30)
      const d = new Date(epoch + wholeDays * 86400000)
      if (!Number.isNaN(d.getTime())) {
        const y = d.getUTCFullYear()
        const m = String(d.getUTCMonth() + 1).padStart(2, "0")
        const day = String(d.getUTCDate()).padStart(2, "0")
        const datePart = `${y}-${m}-${day}`
        if (parseLocalDateOnly(datePart)) return datePart
      }
    }
  }

  const parsed = Date.parse(trimmed)
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const datePart = `${y}-${m}-${day}`
    return parseLocalDateOnly(datePart) ? datePart : null
  }

  return null
}

/** Human-readable date for Google Sheets so cells stay readable (not serial numbers). */
export function formatIntendedDateForSheet(isoDate: string): string {
  const datePart = sheetDateFromCell(isoDate)
  const d = datePart ? parseLocalDateOnly(datePart) : null
  if (!d) return isoDate
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
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

/** Short range for cards, e.g. "6:00 PM – 7:00 PM". */
export function formatEventTimeRange(
  start: Date,
  end?: Date,
  allDay = false
): string | null {
  if (allDay) return null
  if (!isValidDate(start)) return null

  const startLabel = formatTimeFromDate(start)
  if (!startLabel) return null

  if (end && isValidDate(end)) {
    const endLabel = formatTimeFromDate(end)
    if (endLabel && endLabel !== startLabel) {
      return `${startLabel} – ${endLabel}`
    }
  }

  return startLabel
}
