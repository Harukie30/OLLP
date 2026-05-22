"use server"

import { createBaptismAppointment } from "@/lib/baptism-appointment"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitBaptismAppointment(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const childName = String(formData.get("childName") ?? "").trim()
  const intendedDate = String(formData.get("intendedDate") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (!name) {
    return { ok: false as const, error: "Please enter your name." }
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false as const, error: "Please enter a valid email address." }
  }
  if (!childName) {
    return {
      ok: false as const,
      error: "Please enter the name of the child to be baptized.",
    }
  }

  if (intendedDate && !/^\d{4}-\d{2}-\d{2}$/.test(intendedDate)) {
    return { ok: false as const, error: "Please enter a valid preferred date." }
  }

  return createBaptismAppointment({
    name,
    email,
    phone: phone || undefined,
    childName,
    intendedDate: intendedDate || undefined,
    message: message || undefined,
  })
}
