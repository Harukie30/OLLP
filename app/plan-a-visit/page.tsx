import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Clock,
  Coffee,
  MapPin,
  Users,
} from "lucide-react"

import { SiteShell } from "@/components/site-shell"
import { VisitForm } from "@/components/visit-form"
import { BeforeArriveSection } from "@/components/before-arrive-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  address,
  churchName,
  churchShortName,
  serviceSummary,
  visitPageBackground,
} from "@/lib/site"

export const metadata: Metadata = {
  title: "Plan a visit",
  description: `Let ${churchName} know you're coming. We'll help you feel at home before your first Mass.`,
}

const visitSteps = [
  {
    title: "Tell us you're coming",
    description:
      "Share your name and the Sunday Mass you plan to attend. We'll send a quick note so you know what to expect.",
    icon: CalendarDays,
  },
  {
    title: "We'll greet you",
    description:
      "Look for the welcome team near the main doors. They can help with seating and any questions.",
    icon: Users,
  },
  {
    title: "Pray with us",
    description:
      "Stay afterward if you'd like — it's an easy way to meet parishioners at your own pace.",
    icon: Coffee,
  },
]

const practicalInfo = [
  {
    icon: Clock,
    label: "Mass schedule",
    value: serviceSummary,
  },
  {
    icon: MapPin,
    label: "Address",
    value: address.line,
  },
  {
    icon: Car,
    label: "Parking",
    value: "Parking is available near the parish entrance on Celestino Gallares Street.",
  },
]

function VisitPageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Image
        src={visitPageBackground}
        alt=""
        fill
        sizes="100vw"
        className="scale-105 object-cover object-center blur-[3px] sm:blur-[4px]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/75 to-sky-50/85" />
    </div>
  )
}

export default function PlanAVisitPage() {
  return (
    <SiteShell hideVisitCta>
      <div className="relative isolate min-h-full">
        <VisitPageBackdrop />

        <section className="relative border-b border-blue-100/80">
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Button variant="ghost" size="sm" className="-ml-2 mb-6" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </Button>

            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4">
                First time visiting
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-balance text-blue-950 sm:text-5xl">
                Plan your visit
              </h1>
              <p className="mt-4 text-lg text-blue-900/80 text-pretty">
                We&apos;re glad you&apos;re considering {churchShortName}. Let
                us know when you&apos;re coming and we&apos;ll make sure someone
                is ready to welcome you.
              </p>
            </div>
          </div>
        </section>

        <section className="relative py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-sm font-medium tracking-wide text-primary uppercase">
              What to expect
            </h2>
            <p className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-blue-950">
              Your first visit, step by step
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {visitSteps.map((step, index) => (
                <Card
                  key={step.title}
                  className="border-blue-100/80 bg-white/85 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <step.icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <BeforeArriveSection>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-blue-950">
                  Before you arrive
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Modest dress is appreciated. Mass typically lasts about an
                  hour. All are welcome to receive a blessing at Communion if
                  you are not Catholic.
                </p>
              </div>

              <Card size="sm" className="border-blue-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Practical details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm">
                  {practicalInfo.map((item) => (
                    <p
                      key={item.label}
                      className="flex gap-3 text-muted-foreground"
                    >
                      <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        <br />
                        {item.value}
                      </span>
                    </p>
                  ))}
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground">
                More questions?{" "}
                <Link
                  href="/faq"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Read our visitor FAQ
                </Link>
                .
              </p>
            </div>

            <div className="lg:col-span-3">
              <VisitForm />
            </div>
          </div>
        </BeforeArriveSection>

        <section className="relative border-t border-blue-100 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
            <p className="text-muted-foreground">
              Prefer to just show up? You&apos;re welcome anytime —{" "}
              {serviceSummary}.
            </p>
            <Button variant="outline" asChild>
              <Link href="/services">View Mass times</Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
