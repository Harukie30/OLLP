import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { isDatabaseConfigured } from "@/lib/db"
import { getUpcomingParishEventsFromDb } from "@/lib/parish-events-db"

export type ParishEvent = {
  id: string
  title: string
  description?: string
  location?: string
  start: Date
  end?: Date
  allDay: boolean
}

export type ParishEventsSource = "database" | "none"

const DEFAULT_LIMIT = 4

export async function getUpcomingParishEvents(limit = DEFAULT_LIMIT): Promise<{
  events: ParishEvent[]
  source: ParishEventsSource
}> {
  noStore()

  if (!isDatabaseConfigured()) {
    return { events: [], source: "none" }
  }

  const events = await getUpcomingParishEventsFromDb(limit)
  return {
    events,
    source: "database",
  }
}
