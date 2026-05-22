import "server-only"

import { isDatabaseConfigured } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import type {
  BaptismAppointmentDto,
  BaptismAppointmentInput,
  BaptismAppointmentStatus,
} from "@/lib/baptism-appointment-types"

export type { BaptismAppointmentDto, BaptismAppointmentInput }

function parseStatus(raw: string): BaptismAppointmentStatus {
  const value = raw.trim().toLowerCase()
  if (value === "accepted") return "accepted"
  if (value === "rejected") return "rejected"
  return "pending"
}

function rowToDto(row: {
  idUser: string
  name: string
  email: string
  phone: string | null
  childName: string
  intendedDate: string | null
  message: string | null
  submittedAt: Date
  status: string
  acceptedAt: Date | null
}): BaptismAppointmentDto {
  return {
    idUser: row.idUser,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    childName: row.childName,
    intendedDate: row.intendedDate ?? undefined,
    message: row.message ?? undefined,
    submittedAt: row.submittedAt.toISOString(),
    status: parseStatus(row.status),
    acceptedAt: row.acceptedAt?.toISOString(),
  }
}

export async function fetchBaptismAppointments(): Promise<BaptismAppointmentDto[]> {
  if (!isDatabaseConfigured()) return []

  const rows = await prisma.baptismAppointment.findMany({
    orderBy: { submittedAt: "desc" },
  })

  return rows.map(rowToDto)
}

export async function createBaptismAppointment(
  input: BaptismAppointmentInput
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error:
        "Appointment requests are not connected yet. Please call the parish office.",
    }
  }

  try {
    await prisma.baptismAppointment.create({
      data: {
        idUser: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        childName: input.childName,
        intendedDate: input.intendedDate ?? null,
        message: input.message ?? null,
        status: "pending",
      },
    })
    return { ok: true }
  } catch (err) {
    console.error("Create baptism appointment failed:", err)
    return {
      ok: false,
      error:
        "Could not send your request. Please try again or contact the parish office.",
    }
  }
}

export async function deleteBaptismAppointment(
  idUser: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.baptismAppointment.delete({
      where: { idUser: idUser.trim() },
    })
    return { ok: true }
  } catch (err) {
    console.error("Delete baptism appointment failed:", err)
    return { ok: false, error: "Could not delete this request." }
  }
}

export async function acceptBaptismAppointment(
  idUser: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.baptismAppointment.update({
      where: { idUser: idUser.trim() },
      data: { status: "accepted", acceptedAt: new Date() },
    })
    return { ok: true }
  } catch (err) {
    console.error("Accept baptism appointment failed:", err)
    return { ok: false, error: "Could not mark this request as accepted." }
  }
}

export async function rejectBaptismAppointment(
  idUser: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.baptismAppointment.update({
      where: { idUser: idUser.trim() },
      data: { status: "rejected", acceptedAt: null },
    })
    return { ok: true }
  } catch (err) {
    console.error("Reject baptism appointment failed:", err)
    return { ok: false, error: "Could not reject this request." }
  }
}
