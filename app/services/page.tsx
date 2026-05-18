import type { Metadata } from "next"
import { CalendarDays } from "lucide-react"

import { PageIntro } from "@/components/page-intro"
import { SiteShell } from "@/components/site-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { services } from "@/lib/church-content"
import { churchName } from "@/lib/site"

export const metadata: Metadata = {
  title: "Mass and Prayer times",
  description: `Sunday worship and midweek gatherings at ${churchName}.`,
}

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Gather with us"
        title="Mass and Prayer times"
        description="Join us for the celebration of the Holy Mass, prayer, and fellowship throughout the week. Our doors open 30 minutes before each Mass, and everyone is warmly welcome."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="h-full">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <service.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-base font-medium text-foreground">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {service.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
