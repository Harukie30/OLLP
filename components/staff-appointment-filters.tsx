"use client"

import {
  ACTIVE_APPOINTMENT_STATUS_FILTER_OPTIONS,
  APPOINTMENT_KIND_FILTER_OPTIONS,
  type ActiveAppointmentStatusFilter,
  type AppointmentKindFilter,
} from "@/lib/appointment-status-filter"
import { cn } from "@/lib/utils"

const selectClassName = cn(
  "h-9 min-w-[10.5rem] cursor-pointer rounded-lg border border-sky-100 bg-white px-3 text-sm font-medium text-blue-950",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

type StaffAppointmentFiltersProps = {
  kindFilter: AppointmentKindFilter
  statusFilter: ActiveAppointmentStatusFilter
  onKindChange: (value: AppointmentKindFilter) => void
  onStatusChange: (value: ActiveAppointmentStatusFilter) => void
  kindCounts: Record<AppointmentKindFilter, number>
  statusCounts: Record<ActiveAppointmentStatusFilter, number>
  disabled?: boolean
}

export function StaffAppointmentFilters({
  kindFilter,
  statusFilter,
  onKindChange,
  onStatusChange,
  kindCounts,
  statusCounts,
  disabled,
}: StaffAppointmentFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          Sacrament
        </span>
        <select
          id="appointment-kind-filter"
          value={kindFilter}
          disabled={disabled}
          onChange={(e) =>
            onKindChange(e.target.value as AppointmentKindFilter)
          }
          className={selectClassName}
        >
          {APPOINTMENT_KIND_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({kindCounts[opt.value]})
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <select
          id="appointment-status-filter"
          value={statusFilter}
          disabled={disabled}
          onChange={(e) =>
            onStatusChange(e.target.value as ActiveAppointmentStatusFilter)
          }
          className={selectClassName}
        >
          {ACTIVE_APPOINTMENT_STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({statusCounts[opt.value]})
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
