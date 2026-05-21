"use server"

import { createWeddingAppointment } from "@/lib/wedding-appointment"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitWeddingAppointment(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const partnerName = String(formData.get("partnerName") ?? "").trim()
  const intendedDate = String(formData.get("intendedDate") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (!name) {
    return { ok: false as const, error: "Please enter your name." }
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false as const, error: "Please enter a valid email address." }
  }
  if (!partnerName) {
    return {
      ok: false as const,
      error: "Please enter your fiancé(e)'s name.",
    }
  }

  if (intendedDate && !/^\d{4}-\d{2}-\d{2}$/.test(intendedDate)) {
    return { ok: false as const, error: "Please enter a valid intended date." }
  }

  return createWeddingAppointment({
    name,
    email,
    phone: phone || undefined,
    partnerName,
    intendedDate: intendedDate || undefined,
    message: message || undefined,
  })
}
