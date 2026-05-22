"use client"

import {
  APPOINTMENT_STATUS_FILTER_OPTIONS,
  type AppointmentStatusFilter,
} from "@/lib/appointment-status-filter"
import { cn } from "@/lib/utils"

type StaffAppointmentStatusFilterProps = {
  value: AppointmentStatusFilter
  onChange: (value: AppointmentStatusFilter) => void
  counts: Record<AppointmentStatusFilter, number>
  disabled?: boolean
  id?: string
}

export function StaffAppointmentStatusFilter({
  value,
  onChange,
  counts,
  disabled,
  id = "appointment-status-filter",
}: StaffAppointmentStatusFilterProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">Show</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value as AppointmentStatusFilter)
        }
        className={cn(
          "h-9 min-w-[11rem] cursor-pointer rounded-lg border border-sky-100 bg-white px-3 text-sm font-medium text-blue-950",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {APPOINTMENT_STATUS_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({counts[opt.value]})
          </option>
        ))}
      </select>
    </label>
  )
}
