import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AboutImageBackdrop } from "@/components/about-image-backdrop"
import { AbstractSectionBackdrop } from "@/components/abstract-section-backdrop"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  aboutNextSteps,
  aboutShrineStory,
  aboutValues,
} from "@/lib/church-content"
import {
  aboutPageBackground,
  aboutPageBackgroundPosition,
  churchName,
} from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description: `Learn who we are and what we believe at ${churchName}.`,
}

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden border-b border-blue-100/80">
        <AboutImageBackdrop
          src={aboutPageBackground}
          position={aboutPageBackgroundPosition}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Who we are
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance text-blue-950 sm:text-5xl">
            Following Jesus together
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-900/75 text-pretty">
            Shrine and Parish of Our Lady of Lourdes is a welcoming Catholic
            community rooted in faith, prayer, and service. We are committed to
            sharing the Gospel, building authentic relationships, and serving
            our city with compassion and hope. Whether you are visiting for the
            first time or searching for a spiritual home, you are always welcome
            here.
          </p>
        </div>
      </section>

      <section className="border-b border-blue-100 bg-sky-50/80 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {aboutShrineStory.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-blue-950 sm:text-4xl">
            {aboutShrineStory.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {aboutShrineStory.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-blue-100 py-14 sm:py-16">
        <AbstractSectionBackdrop />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            What guides us
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            Faith lived together
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {aboutValues.map((item) => (
              <Card key={item.label} size="sm">
                <CardHeader className="gap-1">
                  <CardTitle>{item.label}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.text}
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
            We&apos;d love to meet you
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {aboutNextSteps.map((step) => (
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
