import { Baby, Heart } from "lucide-react"

import type { AppointmentKind } from "@/lib/appointment-status-filter"
import { cn } from "@/lib/utils"

const sacramentStyles = {
  wedding: {
    label: "Wedding",
    subtitle: "Matrimony",
    icon: Heart,
    card: "border-rose-200/90 bg-gradient-to-br from-rose-50 via-rose-50/90 to-rose-100/70 shadow-sm shadow-rose-200/40 ring-1 ring-rose-100/80",
    iconWrap: "bg-rose-500/15 text-rose-700 ring-1 ring-rose-200/60",
    title: "text-rose-950",
  },
  baptism: {
    label: "Baptism",
    subtitle: "Sacrament",
    icon: Baby,
    card: "border-sky-200/90 bg-gradient-to-br from-sky-50 via-sky-50/90 to-sky-100/70 shadow-sm shadow-sky-200/40 ring-1 ring-sky-100/80",
    iconWrap: "bg-sky-500/15 text-sky-700 ring-1 ring-sky-200/60",
    title: "text-blue-950",
  },
} as const

export const SACRAMENT_COLUMN_CLASS = "min-w-[9.25rem] w-[9.25rem]"

export function StaffAppointmentSacramentCell({
  kind,
}: {
  kind: AppointmentKind
}) {
  const style = sacramentStyles[kind]
  const Icon = style.icon

  return (
    <div
      className={cn(
        "inline-flex w-full max-w-[9rem] items-center gap-2.5 rounded-xl border px-2.5 py-2",
        style.card
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          style.iconWrap
        )}
        aria-hidden
      >
        <Icon className="size-4 stroke-[2.25]" />
      </span>
      <div className="min-w-0 leading-tight">
        <span className={cn("block text-sm font-semibold", style.title)}>
          {style.label}
        </span>
        <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground/90">
          {style.subtitle}
        </span>
      </div>
    </div>
  )
}
