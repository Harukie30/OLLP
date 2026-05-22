import type { LucideIcon } from "lucide-react"
import { Baby, Church, Heart } from "lucide-react"

/**
 * Edit this file when Mass times change. Keeps the Services page truthful
 * without touching layout code.
 */

export type MassSlot = {
  /** e.g. "6:30 AM" or "12:00 NN" */
  time: string
  /** Optional label, e.g. language or "Anticipated Mass" */
  name?: string
}

/** One slide in the Weekly Mass schedule carousel (Sunday / Saturday / weekdays). */
export type MassSchedulePanel = {
  id: string
  title: string
  subtitle: string
  masses: MassSlot[]
}

export const massScheduleMeta = {
  effectivePeriod: "Regular weekly schedule",
  footnote:
    "On holy days of obligation and parish feasts, times may change. Check the parish bulletin or social pages for the latest updates.",
} as const

export const confessionSchedule =
  "Confession is typically offered before the Saturday vigil Mass (about one hour prior). Call the office to confirm priest availability."

/**
 * Sunday, Saturday, and weekday (Mon–Fri) blocks — matches parish bulletin layout.
 */
export const massSchedulePanels: MassSchedulePanel[] = [
  {
    id: "sunday",
    title: "Sunday Mass",
    subtitle: "Every Sunday",
    masses: [
      { time: "6:00 AM", name: "Bisayan" },
      { time: "7:30 AM", name: "English" },
      { time: "9:00 AM", name: "Bisayan" },
      { time: "10:30 AM", name: "Bisayan" },
      { time: "12:00 NN", name: "English" },
      { time: "1:30 PM", name: "Bisayan" },
      { time: "3:00 PM", name: "Bisayan" },
      { time: "4:30 PM", name: "Bisayan" },
      { time: "6:00 PM", name: "English" },
      { time: "7:30 PM", name: "Bisayan" },
    ],
  },
  {
    id: "saturday",
    title: "Saturday Mass",
    subtitle: "Vigil & morning",
    masses: [
      { time: "6:00 AM", name: "Bisayan" },
      { time: "7:05 AM", name: "English" },
      { time: "12:00 NN", name: "Bisayan" },
      { time: "5:00 PM", name: "Anticipated Mass" },
      { time: "6:30 PM", name: "Anticipated Mass" },
    ],
  },
  {
    id: "weekday",
    title: "Weekday Mass",
    subtitle: "Monday – Friday",
    masses: [
      { time: "6:00 AM", name: "Bisayan" },
      { time: "7:05 AM", name: "English" },
      { time: "12:00 NN", name: "Bisayan" },
      { time: "6:00 PM", name: "English" },
    ],
  },
]

export type SacramentalBooking = {
  title: string
  description: string
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
    cta: { label: "Request wedding appointment", href: "#" },
  },
  {
    title: "Baptisms",
    description:
      "Welcome children (and adults, through RCIA) into the Church. We’ll schedule preparation sessions and set a baptism date.",
    leadTime: "Schedule early so formation and paperwork can be completed ahead of time.",
    icon: Baby,
    cta: { label: "Request baptism appointment", href: "#" },
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
