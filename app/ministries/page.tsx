import type { Metadata } from "next"

import { PageIntro } from "@/components/page-intro"
import { SiteShell } from "@/components/site-shell"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ministries } from "@/lib/church-content"
import { churchName } from "@/lib/site"

export const metadata: Metadata = {
  title: "Ministries",
  description: `Kids, worship, outreach, and more ways to connect at ${churchName}.`,
}

export default function MinistriesPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Get connected"
        title="Ministries"
        description="There are many ways to grow in faith, serve others, and build meaningful relationships within our parish community. Take the next step and we’d love to help you find where you belong."
      />
      <section className="bg-sky-50/80 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {ministries.map((ministry) => (
              <Card key={ministry.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-blue-100">
                    <ministry.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{ministry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{ministry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
