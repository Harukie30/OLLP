"use server"

import { revalidatePath } from "next/cache"

import { parseDatePart, parishEventToDto } from "@/lib/parish-event-row"
import {
  createParishEventInDb,
  deleteParishEventInDb,
  getAllParishEventsFromDb,
} from "@/lib/parish-events-db"
import {
  acceptWeddingAppointment,
  deleteWeddingAppointment,
  fetchWeddingAppointments,
  rejectWeddingAppointment,
} from "@/lib/wedding-appointment"
import {
  clearStaffSession,
  isStaffAuthenticated,
  setStaffSession,
  verifyStaffPassword,
} from "@/lib/staff-auth"
import { normalizeSheetTimeInput } from "@/lib/sheet-time-format"

export async function staffLogin(password: string) {
  if (!verifyStaffPassword(password)) {
    return { ok: false as const, error: "Incorrect password." }
  }
  await setStaffSession()
  return { ok: true as const }
}

export async function staffLogout() {
  await clearStaffSession()
  return { ok: true as const }
}

export async function staffCheckSession() {
  return { authenticated: await isStaffAuthenticated() }
}

export async function staffListEvents() {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }
  const events = await getAllParishEventsFromDb()
  return {
    ok: true as const,
    events: events
      .map(parishEventToDto)
      .filter((e): e is NonNullable<typeof e> => e !== null),
  }
}

export async function staffCreateEvent(formData: FormData) {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }

  const title = String(formData.get("title") ?? "").trim()
  const dateRaw = String(formData.get("date") ?? "").trim()
  const date = parseDatePart(dateRaw)
  const time = normalizeSheetTimeInput(String(formData.get("time") ?? ""))
  const endTime = normalizeSheetTimeInput(String(formData.get("endTime") ?? ""))
  const location = String(formData.get("location") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!title || !date) {
    return { ok: false as const, error: "Title and a valid date are required." }
  }
  if (endTime && !time) {
    return {
      ok: false as const,
      error: "Add a start time when you set an end time.",
    }
  }

  const result = await createParishEventInDb({
    title,
    date,
    time: time || undefined,
    endTime: endTime || undefined,
    location: location || undefined,
    description: description || undefined,
  })

  if (!result.ok) {
    return { ok: false as const, error: result.error ?? "Could not save." }
  }

  revalidatePath("/", "page")
  return { ok: true as const }
}

export async function staffListWeddingAppointments() {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }

  const appointments = await fetchWeddingAppointments()
  return { ok: true as const, appointments }
}

export async function staffRejectWeddingAppointment(idUser: string) {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }

  if (!idUser.trim()) {
    return { ok: false as const, error: "Invalid request id." }
  }

  const result = await rejectWeddingAppointment(idUser)
  if (!result.ok) {
    return { ok: false as const, error: result.error ?? "Could not reject." }
  }

  return { ok: true as const }
}

export async function staffDeleteWeddingAppointment(idUser: string) {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }

  if (!idUser.trim()) {
    return { ok: false as const, error: "Invalid request id." }
  }

  const result = await deleteWeddingAppointment(idUser)
  if (!result.ok) {
    return { ok: false as const, error: result.error ?? "Could not delete." }
  }

  return { ok: true as const }
}

export async function staffAcceptWeddingAppointment(idUser: string) {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }

  if (!idUser.trim()) {
    return { ok: false as const, error: "Invalid request id." }
  }

  const result = await acceptWeddingAppointment(idUser)
  if (!result.ok) {
    return { ok: false as const, error: result.error ?? "Could not accept." }
  }

  return { ok: true as const }
}

export async function staffDeleteEvent(id: string) {
  if (!(await isStaffAuthenticated())) {
    return { ok: false as const, error: "Not signed in." }
  }

  const result = await deleteParishEventInDb(id)
  if (!result.ok) {
    return { ok: false as const, error: result.error ?? "Could not delete." }
  }

  revalidatePath("/", "page")
  return { ok: true as const }
}
