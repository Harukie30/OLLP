import type { LucideIcon } from "lucide-react"
import { Baby, Church, Heart } from "lucide-react"

/**
 * Edit this file when Mass times change. Keeps the Services page truthful
 * without touching layout code.
 */

export type MassSlot = {
  /** e.g. "6:30 AM" */
  time: string
  /** Optional label, e.g. "anticipated", "Solemnity" */
  name?: string
}

export type DayMassSchedule = {
  /** Full day name for screen readers and headings */
  weekday: string
  /** Short label for compact layouts */
  shortLabel: string
  masses: MassSlot[]
  /** Shown under the times when there is no Mass */
  closedNote?: string
}

export const massScheduleMeta = {
  /** Human-readable period this grid applies to (updates weekly if you like) */
  effectivePeriod: "Regular weekly schedule",
  /** Shown below the grid — holy days, special Masses, etc. */
  footnote:
    "On holy days of obligation and parish feasts, times may change. Check the parish bulletin or social pages for the latest updates.",
} as const

/** Sacrament of Reconciliation — edit or remove if you surface it elsewhere */
export const confessionSchedule =
  "Confession is typically offered before the Saturday vigil Mass (about one hour prior). Call the office to confirm priest availability."

/** Seven rows: one per weekday. Replace times with your parish’s real schedule. */
export const weeklyMassSchedule: DayMassSchedule[] = [
  {
    weekday: "Sunday",
    shortLabel: "Sun",
    masses: [
      { time: "6:00 AM" },
      { time: "7:30 AM" },
      { time: "9:00 AM" },
      { time: "5:00 PM", name: "Evening Mass" },
    ],
  },
  {
    weekday: "Monday",
    shortLabel: "Mon",
    masses: [{ time: "6:30 AM" }, { time: "12:00 PM", name: "Noon Mass" }],
  },
  {
    weekday: "Tuesday",
    shortLabel: "Tue",
    masses: [{ time: "6:30 AM" }],
  },
  {
    weekday: "Wednesday",
    shortLabel: "Wed",
    masses: [{ time: "6:30 AM" }, { time: "5:30 PM" }],
  },
  {
    weekday: "Thursday",
    shortLabel: "Thu",
    masses: [{ time: "6:30 AM" }],
  },
  {
    weekday: "Friday",
    shortLabel: "Fri",
    masses: [{ time: "6:30 AM" }, { time: "12:00 PM", name: "Noon Mass" }],
  },
  {
    weekday: "Saturday",
    shortLabel: "Sat",
    masses: [
      { time: "6:30 AM" },
      { time: "5:00 PM", name: "anticipated Sunday" },
    ],
  },
]

export type SacramentalBooking = {
  title: string
  description: string
  /** Planning detail, e.g. how far ahead to book */
  leadTime: string
  icon: LucideIcon
  cta: { label: string; href: string }
}

export const sacramentalBookings: SacramentalBooking[] = [
  {
    title: "Weddings",
    description:
      "Prepare for the Sacrament of Matrimony with our parish team. We’ll walk you through requirements, paperwork, and marriage preparation.",
    leadTime: "Contact the parish office at least 6 months before your intended date.",
    icon: Heart,
    cta: { label: "Request wedding information", href: "/plan-a-visit" },
  },
  {
    title: "Baptisms",
    description:
      "Welcome children (and adults, through RCIA) into the Church. We’ll schedule preparation sessions and set a baptism date.",
    leadTime: "Schedule early so formation and paperwork can be completed ahead of time.",
    icon: Baby,
    cta: { label: "Ask about baptism", href: "/plan-a-visit" },
  },
  {
    title: "Other sacraments & intentions",
    description:
      "Confession schedules, funeral Masses, Mass intentions, and pastoral visits — our clergy and staff are here to support your family.",
    leadTime: "Call or email the office for availability and guidelines.",
    icon: Church,
    cta: { label: "Contact the parish", href: "#contact" },
  },
]
