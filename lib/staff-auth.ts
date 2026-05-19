import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "ollp_staff_events"

function getSessionToken(): string | null {
  const password = process.env.STAFF_EVENTS_PASSWORD?.trim()
  if (!password) return null
  return createHmac("sha256", password).update("ollp-staff-events-v1").digest("hex")
}

export function isStaffPortalConfigured(): boolean {
  return Boolean(
    process.env.STAFF_EVENTS_PASSWORD?.trim() && process.env.SHEETDB_API_URL?.trim()
  )
}

export async function isStaffAuthenticated(): Promise<boolean> {
  const expected = getSessionToken()
  if (!expected) return false

  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIE_NAME)?.value
  if (!value) return false

  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function setStaffSession(): Promise<void> {
  const token = getSessionToken()
  if (!token) return

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  })
}

export async function clearStaffSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function verifyStaffPassword(password: string): boolean {
  const expected = process.env.STAFF_EVENTS_PASSWORD?.trim()
  if (!expected) return false

  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false

  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
