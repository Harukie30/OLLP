import "server-only"

import type { ParishEvent } from "@/lib/parish-events"

/** Preview cards on the home page when the database is not configured (dev only). */
export function getSampleParishEvents(): ParishEvent[] {
  const now = new Date()
  const inDays = (n: number, hour = 10) => {
    const d = new Date(now)
    d.setDate(d.getDate() + n)
    d.setHours(hour, 0, 0, 0)
    return d
  }

  return [
    {
      id: "sample-youth",
      title: "Youth Ministry gathering",
      description:
        "Sample event — set DATABASE_URL in .env.local for real events.",
      location: "Parish hall",
      start: inDays(7, 18),
      end: inDays(7, 20),
      allDay: false,
    },
    {
      id: "sample-fiesta",
      title: "Parish feast day",
      description: "Sample event for layout preview only.",
      location: "Our Lady of Lourdes Church",
      start: inDays(14),
      allDay: true,
    },
  ]
}
