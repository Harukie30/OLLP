import { Heart, Music, Users, type LucideIcon } from "lucide-react"

export type Ministry = {
  title: string
  description: string
  icon: LucideIcon
}

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
