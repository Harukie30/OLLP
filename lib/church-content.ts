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
  { label: "Eucharist", text: "The Mass is the heart of our parish life." },
  { label: "Prayer", text: "Scripture, the rosary, and devotion to Our Lady." },
  { label: "Service", text: "Caring for families, neighbors, and those in need." },
] as const

export const aboutShrineStory = {
  eyebrow: "Our patroness",
  title: "Devotion to Our Lady of Lourdes",
  paragraphs: [
    "In 1858, the Blessed Virgin Mary appeared to Saint Bernadette Soubirous at the grotto in Lourdes, France. Mary asked that people come in procession, do penance, and pray for sinnersand countless pilgrims have found healing and peace there ever since.",
    "As Shrine and Parish of Our Lady of Lourdes in Tagbilaran, we share in that same spirit of prayer, welcome, and trust in God’s mercy. Whether you come to light a candle, pray the rosary, or simply sit in quiet, you are part of this family of faith.",
  ],
} as const

export const aboutNextSteps = [
  {
    title: "Plan a visit",
    description: "Let us know you’re coming so we can greet you.",
    href: "/plan-a-visit",
    primary: true,
  },
  {
    title: "Mass & sacraments",
    description: "Weekly schedule, confession, and sacramental preparation.",
    href: "/services",
    primary: false,
  },
  {
    title: "Ministries",
    description: "Ways to serve, sing, and grow in faith together.",
    href: "/ministries",
    primary: false,
  },
] as const
