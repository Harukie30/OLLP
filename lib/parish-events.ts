import "server-only"

import { getSheetDbParishEvents, isSheetDbConfigured } from "@/lib/sheetdb"

export type ParishEvent = {
  id: string
  title: string
  description?: string
  location?: string
  start: Date
  end?: Date
  allDay: boolean
}

export type ParishEventsSource = "sheetdb" | "none"

const DEFAULT_LIMIT = 4

export async function getUpcomingParishEvents(limit = DEFAULT_LIMIT): Promise<{
  events: ParishEvent[]
  source: ParishEventsSource
}> {
  if (!isSheetDbConfigured()) {
    return { events: [], source: "none" }
  }

  const events = await getSheetDbParishEvents()
  return {
    events: events.slice(0, limit),
    source: "sheetdb",
  }
}
