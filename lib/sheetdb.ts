import "server-only"

import {
  normalizeRowKeys,
  parishEventFromRow,
  parishEventToRow,
} from "@/lib/parish-event-row"
import type { ParishEvent } from "@/lib/parish-events"

const REVALIDATE_SECONDS = 60

export function isSheetDbConfigured(): boolean {
  return Boolean(process.env.SHEETDB_API_URL?.trim())
}

function buildUrl(path = ""): string {
  const base = process.env.SHEETDB_API_URL!.trim().replace(/\/$/, "")
  const url = `${base}${path}`
  const apiKey = process.env.SHEETDB_API_KEY?.trim()
  if (!apiKey) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}apiKey=${encodeURIComponent(apiKey)}`
}

async function sheetDbFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(buildUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: { revalidate: REVALIDATE_SECONDS },
  })
}

export async function fetchSheetDbRows(): Promise<Record<string, string>[]> {
  if (!isSheetDbConfigured()) return []

  const response = await sheetDbFetch("")
  if (!response.ok) {
    console.error("SheetDB read failed:", response.status)
    return []
  }

  const data = (await response.json()) as Record<string, string>[]
  return Array.isArray(data) ? data : []
}

export async function getSheetDbParishEvents(): Promise<ParishEvent[]> {
  const rows = await fetchSheetDbRows()
  const now = new Date()

  return rows
    .map((row, index) => parishEventFromRow(normalizeRowKeys(row), index))
    .filter((e): e is ParishEvent => e !== null)
    .filter((e) => (e.end ?? e.start) >= now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

export async function getAllSheetDbParishEvents(): Promise<ParishEvent[]> {
  const rows = await fetchSheetDbRows()

  return rows
    .map((row, index) => parishEventFromRow(normalizeRowKeys(row), index))
    .filter((e): e is ParishEvent => e !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

export async function createSheetDbEvent(input: {
  title: string
  date: string
  time?: string
  endTime?: string
  location?: string
  description?: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSheetDbConfigured()) {
    return { ok: false, error: "SheetDB is not configured." }
  }

  const id = crypto.randomUUID()
  const body = parishEventToRow({ id, ...input })

  const response = await sheetDbFetch("", {
    method: "POST",
    body: JSON.stringify({ data: [body] }),
    cache: "no-store",
  })

  if (!response.ok) {
    console.error("SheetDB create failed:", response.status, await response.text())
    return { ok: false, error: "Could not save the event. Check SheetDB settings." }
  }

  return { ok: true }
}

export async function deleteSheetDbEvent(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isSheetDbConfigured()) {
    return { ok: false, error: "SheetDB is not configured." }
  }

  const encodedId = encodeURIComponent(id)
  const response = await sheetDbFetch(`/id/${encodedId}`, {
    method: "DELETE",
    cache: "no-store",
  })

  if (!response.ok) {
    console.error("SheetDB delete failed:", response.status, await response.text())
    return { ok: false, error: "Could not delete the event." }
  }

  return { ok: true }
}
