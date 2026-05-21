import "server-only"

import { isDatabaseConfigured } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import type {
  WeddingAppointmentDto,
  WeddingAppointmentInput,
  WeddingAppointmentStatus,
} from "@/lib/wedding-appointment-types"

export type { WeddingAppointmentDto, WeddingAppointmentInput }

function parseWeddingStatus(raw: string): WeddingAppointmentStatus {
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
  partnerName: string
  intendedDate: string | null
  message: string | null
  submittedAt: Date
  status: string
  acceptedAt: Date | null
}): WeddingAppointmentDto {
  return {
    idUser: row.idUser,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    partnerName: row.partnerName,
    intendedDate: row.intendedDate ?? undefined,
    message: row.message ?? undefined,
    submittedAt: row.submittedAt.toISOString(),
    status: parseWeddingStatus(row.status),
    acceptedAt: row.acceptedAt?.toISOString(),
  }
}

export async function fetchWeddingAppointments(): Promise<WeddingAppointmentDto[]> {
  if (!isDatabaseConfigured()) return []

  const rows = await prisma.weddingAppointment.findMany({
    orderBy: { submittedAt: "desc" },
  })

  return rows.map(rowToDto)
}

export async function createWeddingAppointment(
  input: WeddingAppointmentInput
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error:
        "Appointment requests are not connected yet. Please call the parish office.",
    }
  }

  try {
    await prisma.weddingAppointment.create({
      data: {
        idUser: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        partnerName: input.partnerName,
        intendedDate: input.intendedDate ?? null,
        message: input.message ?? null,
        status: "pending",
      },
    })
    return { ok: true }
  } catch (err) {
    console.error("Create wedding appointment failed:", err)
    return {
      ok: false,
      error:
        "Could not send your request. Please try again or contact the parish office.",
    }
  }
}

export async function deleteWeddingAppointment(
  idUser: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.weddingAppointment.delete({
      where: { idUser: idUser.trim() },
    })
    return { ok: true }
  } catch (err) {
    console.error("Delete wedding appointment failed:", err)
    return { ok: false, error: "Could not delete this request." }
  }
}

export async function acceptWeddingAppointment(
  idUser: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.weddingAppointment.update({
      where: { idUser: idUser.trim() },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
      },
    })
    return { ok: true }
  } catch (err) {
    console.error("Accept wedding appointment failed:", err)
    return { ok: false, error: "Could not mark this request as accepted." }
  }
}

export async function rejectWeddingAppointment(
  idUser: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." }
  }

  try {
    await prisma.weddingAppointment.update({
      where: { idUser: idUser.trim() },
      data: {
        status: "rejected",
        acceptedAt: null,
      },
    })
    return { ok: true }
  } catch (err) {
    console.error("Reject wedding appointment failed:", err)
    return { ok: false, error: "Could not reject this request." }
  }
}
