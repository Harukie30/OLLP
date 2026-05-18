import type { Metadata } from "next"
import Link from "next/link"

import { FaqSection } from "@/components/faq-section"
import { PageIntro } from "@/components/page-intro"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import { churchName } from "@/lib/site"

export const metadata: Metadata = {
  title: "FAQ",
  description: `Common questions for first-time visitors to ${churchName}.`,
}

export default function FaqPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="First time?"
        title="Questions visitors ask"
        description="Answers to what people often wonder before their first Sunday with us."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection />
          <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-blue-100 bg-sky-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Ready to visit? Let our welcome team know you&apos;re coming.
            </p>
            <Button asChild>
              <Link href="/plan-a-visit">Plan a visit</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
