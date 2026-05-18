import { BookOpen, Heart, Music, Users, type LucideIcon } from "lucide-react"

export type Service = {
  title: string
  time: string
  description: string
  icon: LucideIcon
}

export type Ministry = {
  title: string
  description: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    title: "Sunday Worship",
    time: "6:00 AM - 8:00 PM",
    description: "Main gathering with worship, teaching, and communion.",
    icon: Music,
  },
  {
    title: "Sunday Classes",
    time: "9:00 AM",
    description: "Bible study and groups for all ages before the service.",
    icon: BookOpen,
  },
  {
    title: "Midweek Prayer",
    time: "Wed · 7:00 PM",
    description: "A quieter evening of prayer and encouragement together.",
    icon: Heart,
  },
]

export const ministries: Ministry[] = [
  {
    title: "Kids & Youth",
    description:
      "Safe, fun environments where children and students learn about Jesus.",
    icon: Users,
  },
  {
    title: "Worship",
    description:
      "Musicians and creatives who help our church praise God together.",
    icon: Music,
  },
  {
    title: "Care & Outreach",
    description:
      "Meals, visits, and local partnerships that serve our neighbors in need.",
    icon: Heart,
  },
]

export const aboutValues = [
  { label: "Worship", text: "Centered on Christ, not performance." },
  { label: "Word", text: "Teaching that is clear and life-giving." },
  { label: "Community", text: "People who show up for each other." },
] as const
