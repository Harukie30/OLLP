import type { Metadata } from "next"

import { PageIntro } from "@/components/page-intro"
import { SiteShell } from "@/components/site-shell"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { aboutValues } from "@/lib/church-content"
import { churchName } from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description: `Learn who we are and what we believe at ${churchName}.`,
}

export default function AboutPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Who we are"
        title="Following Jesus together"
        description="Shrine and Parish of Our Lady of Lourdes is a welcoming Catholic community rooted in faith, prayer, and service. We are committed to sharing the Gospel, building authentic relationships, and serving our city with compassion and hope. Whether you are visiting for the first time or searching for a spiritual home, you are always welcome here."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
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
    </SiteShell>
  )
}
