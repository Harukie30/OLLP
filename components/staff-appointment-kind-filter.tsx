"use client"

import {
  APPOINTMENT_KIND_FILTER_OPTIONS,
  type AppointmentKindFilter,
} from "@/lib/appointment-status-filter"
import { cn } from "@/lib/utils"

const selectClassName = cn(
  "h-9 min-w-[10.5rem] cursor-pointer rounded-lg border border-sky-100 bg-white px-3 text-sm font-medium text-blue-950",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

type StaffAppointmentKindFilterProps = {
  value: AppointmentKindFilter
  onChange: (value: AppointmentKindFilter) => void
  counts: Record<AppointmentKindFilter, number>
  disabled?: boolean
  id?: string
}

export function StaffAppointmentKindFilter({
  value,
  onChange,
  counts,
  disabled,
  id = "appointment-kind-filter",
}: StaffAppointmentKindFilterProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">Sacrament</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as AppointmentKindFilter)}
        className={selectClassName}
      >
        {APPOINTMENT_KIND_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({counts[opt.value]})
          </option>
        ))}
      </select>
    </label>
  )
}
