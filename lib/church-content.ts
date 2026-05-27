import { Heart, Music, Shield, Users, type LucideIcon } from "lucide-react"

export type MinistryAccent = "sky" | "amber" | "slate" | "rose"

export type Ministry = {
  title: string
  description: string
  icon: LucideIcon
  image: { src: string; alt: string }
  schedule?: string
  joinLabel?: string
  accent: MinistryAccent
}

export const ministriesPageIntro = {
  eyebrow: "Get connected",
  title: "Ministries",
  description:
    "From youth and choir to the Knights of Columbus, our parish groups are places to pray, serve, and build friendships. Explore what resonates with you—we will help you take the next step.",
} as const

export const ministries: Ministry[] = [
  {
    title: "Parish Youth Ministry",
    description:
      "A welcoming space for young people to grow in faith, friendship, and service. Activities include prayer, formation, fellowship, and outreach that connect teens to the life of the parish.",
    icon: Users,
    image: {
      src: "/youth.jpg",
      alt: "Our Lady of Lourdes Parish Youth Ministry",
    },
    schedule: "Programs and gatherings vary by season—ask the office for the current calendar.",
    joinLabel: "Open to youth and volunteer mentors",
    accent: "sky",
  },
  {
    title: "Assumpta Choir",
    description:
      "Parish musicians and singers who lead the assembly in worship at Mass and special celebrations. Rehearsals build skill, reverence, and unity in praise.",
    icon: Music,
    image: {
      src: "/logo.jpg",
      alt: "Assumpta Choir",
    },
    schedule: "Serves at Sunday and feast-day liturgies; rehearsal times from the choir coordinator.",
    joinLabel: "New voices welcome—contact the parish office",
    accent: "amber",
  },
  {
    title: "Knights of Columbus",
    description:
      "Catholic men committed to charity, unity, and fraternity. The council supports parish needs, families, and local outreach through service projects and fellowship.",
    icon: Shield,
    image: {
      src: "/k of cc.png",
      alt: "Knights of Columbus",
    },
    schedule: "Regular meetings and service projects throughout the year.",
    joinLabel: "Men 18+—inquire through the parish office",
    accent: "slate",
  },
  {
    title: "Care & Outreach",
    description:
      "Parishioners who visit the sick, support neighbors in need, and coordinate with local partners. It is a quiet but vital way to live the Gospel in Tagbilaran.",
    icon: Heart,
    image: {
      src: "/lourdes.jpg",
      alt: "Shrine of Our Lady of Lourdes",
    },
    schedule: "Opportunities arise through the parish and seasonal drives.",
    joinLabel: "Serve as your schedule allows",
    accent: "rose",
  },
]

export const ministryGetInvolvedSteps = [
  {
    title: "Visit first",
    text: "Come to Mass and introduce yourself. Many groups are happy to welcome visitors before you commit.",
  },
  {
    title: "Talk with us",
    text: "The parish office can connect you with the right coordinator for youth, music, or service.",
  },
  {
    title: "Try a ministry",
    text: "Start with one gathering or project. There is no pressure to join everything at once.",
  },
] as const

export const ministryNextSteps = [
  {
    title: "Contact the parish",
    description: "Questions about a ministry? Send us a message or call the office.",
    href: "#contact",
    primary: true,
  },
  {
    title: "Plan a visit",
    description: "First time here? Let us know you are coming so we can greet you.",
    href: "/plan-a-visit",
    primary: false,
  },
  {
    title: "Mass & sacraments",
    description: "Weekly schedule, confession, and sacramental preparation.",
    href: "/services",
    primary: false,
  },
] as const

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
