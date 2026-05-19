import type { Metadata } from "next"

import { MassScheduleWeek } from "@/components/mass-schedule-week"
import { PageIntro } from "@/components/page-intro"
import { SacramentalBookingSection } from "@/components/sacramental-booking-section"
import { SiteShell } from "@/components/site-shell"
import { churchName } from "@/lib/site"

export const metadata: Metadata = {
  title: "Mass schedule & sacraments",
  description: `Weekly Mass times, confession, and sacramental preparation at ${churchName}.`,
}

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="Gather with us"
        title="Mass schedule & sacraments"
        description="Find our weekly Mass times, plan for weddings and baptisms, and reach out for confession, Mass intentions, or pastoral care. Schedules here reflect our ordinary parish rhythm—always confirm special feasts with the bulletin."
      />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-14 px-4 sm:px-6">
          <MassScheduleWeek />
          <SacramentalBookingSection />
        </div>
      </section>
    </SiteShell>
  )
}
