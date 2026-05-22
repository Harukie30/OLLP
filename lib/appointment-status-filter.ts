import type { BaptismAppointmentDto } from "@/lib/baptism-appointment-types"
import type { WeddingAppointmentDto } from "@/lib/wedding-appointment-types"

export type AppointmentStatus = "pending" | "accepted" | "rejected"

export type AppointmentStatusFilter = "all" | AppointmentStatus

export type AppointmentKind = "wedding" | "baptism"

export type AppointmentKindFilter = "all" | AppointmentKind

export const APPOINTMENT_KIND_FILTER_OPTIONS: {
  value: AppointmentKindFilter
  label: string
}[] = [
  { value: "all", label: "All sacraments" },
  { value: "wedding", label: "Weddings only" },
  { value: "baptism", label: "Baptisms only" },
]

export type StaffAppointmentRow = {
  kind: AppointmentKind
  idUser: string
  name: string
  email: string
  phone?: string
  submittedAt?: string
  intendedDate?: string
  message?: string
  status: AppointmentStatus
  primaryLabel: string
  secondaryLabel: string
}

export function weddingToStaffRow(item: WeddingAppointmentDto): StaffAppointmentRow {
  return {
    kind: "wedding",
    idUser: item.idUser,
    name: item.name,
    email: item.email,
    phone: item.phone,
    submittedAt: item.submittedAt,
    intendedDate: item.intendedDate,
    message: item.message,
    status: item.status,
    primaryLabel: item.name,
    secondaryLabel: item.partnerName,
  }
}

export function baptismToStaffRow(item: BaptismAppointmentDto): StaffAppointmentRow {
  return {
    kind: "baptism",
    idUser: item.idUser,
    name: item.name,
    email: item.email,
    phone: item.phone,
    submittedAt: item.submittedAt,
    intendedDate: item.intendedDate,
    message: item.message,
    status: item.status,
    primaryLabel: item.childName,
    secondaryLabel: item.name,
  }
}

export function mergeStaffAppointments(
  weddings: WeddingAppointmentDto[],
  baptisms: BaptismAppointmentDto[]
): StaffAppointmentRow[] {
  const rows = [
    ...weddings.map(weddingToStaffRow),
    ...baptisms.map(baptismToStaffRow),
  ]
  return rows.sort((a, b) => {
    const ta = a.submittedAt ? Date.parse(a.submittedAt) : 0
    const tb = b.submittedAt ? Date.parse(b.submittedAt) : 0
    return tb - ta
  })
}

export type ActiveAppointmentStatusFilter = "all" | "pending" | "accepted"

export const APPOINTMENT_STATUS_FILTER_OPTIONS: {
  value: AppointmentStatusFilter
  label: string
}[] = [
  { value: "all", label: "All requests" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

/** Main staff table — rejected rows live in the separate rejected table */
export const ACTIVE_APPOINTMENT_STATUS_FILTER_OPTIONS: {
  value: ActiveAppointmentStatusFilter
  label: string
}[] = [
  { value: "all", label: "All active" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
]

export function splitStaffAppointmentsByStatus(items: StaffAppointmentRow[]): {
  active: StaffAppointmentRow[]
  rejected: StaffAppointmentRow[]
} {
  const active: StaffAppointmentRow[] = []
  const rejected: StaffAppointmentRow[] = []
  for (const item of items) {
    if (item.status === "rejected") rejected.push(item)
    else active.push(item)
  }
  return { active, rejected }
}

export function filterActiveStaffAppointments(
  items: StaffAppointmentRow[],
  kindFilter: AppointmentKindFilter,
  statusFilter: ActiveAppointmentStatusFilter
): StaffAppointmentRow[] {
  return items.filter((item) => {
    if (item.status === "rejected") return false
    if (kindFilter !== "all" && item.kind !== kindFilter) return false
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    return true
  })
}

export function filterRejectedStaffAppointments(
  items: StaffAppointmentRow[],
  kindFilter: AppointmentKindFilter
): StaffAppointmentRow[] {
  return items.filter((item) => {
    if (item.status !== "rejected") return false
    if (kindFilter !== "all" && item.kind !== kindFilter) return false
    return true
  })
}

export function countActiveAppointmentsByStatus(
  items: StaffAppointmentRow[]
): Record<ActiveAppointmentStatusFilter, number> {
  const active = items.filter((i) => i.status !== "rejected")
  return {
    all: active.length,
    pending: active.filter((i) => i.status === "pending").length,
    accepted: active.filter((i) => i.status === "accepted").length,
  }
}

export function filterStaffAppointments(
  items: StaffAppointmentRow[],
  kindFilter: AppointmentKindFilter,
  statusFilter: AppointmentStatusFilter
): StaffAppointmentRow[] {
  return items.filter((item) => {
    if (kindFilter !== "all" && item.kind !== kindFilter) return false
    if (statusFilter !== "all" && item.status !== statusFilter) return false
    return true
  })
}

export function countStaffAppointmentsByKind(
  items: StaffAppointmentRow[]
): Record<AppointmentKindFilter, number> {
  return {
    all: items.length,
    wedding: items.filter((i) => i.kind === "wedding").length,
    baptism: items.filter((i) => i.kind === "baptism").length,
  }
}

export function countAppointmentsByStatus<T extends { status: AppointmentStatus }>(
  items: T[]
): Record<AppointmentStatusFilter, number> {
  return {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    accepted: items.filter((i) => i.status === "accepted").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  }
}

/** @deprecated Use filterStaffAppointments; kept for legacy per-sacrament panels */
export function filterAppointmentsByStatus<T extends { status: AppointmentStatus }>(
  items: T[],
  filter: AppointmentStatusFilter
): T[] {
  if (filter === "all") return items
  return items.filter((item) => item.status === filter)
}

export function appointmentFilterEmptyMessage(
  filter: AppointmentStatusFilter,
  kind: "wedding" | "baptism"
): string {
  return staffAppointmentFilterEmptyMessage(
    kind,
    filter === "all" ? "all" : filter
  )
}

export function staffAppointmentFilterEmptyMessage(
  kindFilter: AppointmentKindFilter,
  statusFilter: AppointmentStatusFilter
): string {
  const kindLabel =
    kindFilter === "wedding"
      ? "wedding"
      : kindFilter === "baptism"
        ? "baptism"
        : ""
  const statusLabel =
    statusFilter === "pending"
      ? "pending"
      : statusFilter === "accepted"
        ? "accepted"
      : statusFilter === "rejected"
        ? "rejected"
        : ""

  if (!kindLabel && !statusLabel) return "No appointment requests yet"
  if (kindLabel && statusLabel) {
    return `No ${statusLabel} ${kindLabel} requests`
  }
  if (kindLabel) return `No ${kindLabel} requests`
  return `No ${statusLabel} requests`
}
