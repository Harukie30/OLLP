import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { MinistryCard } from "@/components/ministry-card"
import { PageIntro } from "@/components/page-intro"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ministries,
  ministriesPageIntro,
  ministryGetInvolvedSteps,
  ministryNextSteps,
} from "@/lib/church-content"
import { churchName, visitPageBackground } from "@/lib/site"

export const metadata: Metadata = {
  title: "Ministries",
  description: `Youth, choir, Knights of Columbus, and more ways to connect at ${churchName}.`,
}

export default function MinistriesPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow={ministriesPageIntro.eyebrow}
        title={ministriesPageIntro.title}
        description={ministriesPageIntro.description}
        backgroundImage={visitPageBackground}
        backgroundImagePosition="center 40%"
      />

      <section className="border-b border-blue-100 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Parish groups
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            Find where you belong
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Each ministry has its own rhythm and leaders. Start with one that fits
            your gifts and schedule—the parish office can introduce you.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ministries.map((ministry) => (
              <MinistryCard key={ministry.title} {...ministry} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-blue-100 bg-sky-50/80 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            New here?
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            How to get involved
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {ministryGetInvolvedSteps.map((step, index) => (
              <Card
                key={step.title}
                size="sm"
                className="border-blue-100/80 bg-white/85"
              >
                <CardHeader className="gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {step.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky-50/60 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Take the next step
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            We would love to meet you
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ministryNextSteps.map((step) => (
              <Card
                key={step.href}
                className="flex flex-col border-blue-100/80 bg-white/80"
              >
                <CardHeader className="flex-1 gap-2">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-4">
                  <Button
                    asChild
                    variant={step.primary ? "default" : "outline"}
                    className="w-full sm:w-auto"
                  >
                    <Link href={step.href}>
                      {step.title}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
