import { format, isSameDay, isValid } from "date-fns"

export function formatParishEventWhen(
  start: Date,
  end?: Date,
  allDay = false
): string {
  if (!isValid(start)) return "Date to be announced"

  if (allDay) {
    if (end && isValid(end) && !isSameDay(start, end)) {
      return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
    }
    return format(start, "EEEE, MMMM d, yyyy")
  }

  if (end && isValid(end) && !isSameDay(start, end)) {
    return `${format(start, "MMM d, h:mm a")} – ${format(end, "MMM d, h:mm a")}`
  }

  return format(start, "EEE, MMM d · h:mm a")
}
