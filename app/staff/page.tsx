import type { Metadata } from "next"

import { StaffDashboard } from "@/components/staff-dashboard"
import { SiteShell } from "@/components/site-shell"
import { isStaffPortalConfigured } from "@/lib/staff-auth"

export const metadata: Metadata = {
  title: "Staff dashboard",
  description: "Parish staff area for events and wedding requests.",
  robots: { index: false, follow: false },
}

export default function StaffPage() {
  const configured = isStaffPortalConfigured()

  return (
    <SiteShell hideVisitCta>
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {!configured ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
              <h1 className="text-lg font-semibold text-amber-950">
                Staff dashboard unavailable
              </h1>
              <p className="mt-2 text-sm text-amber-900/80">
                Set <code className="text-xs">DATABASE_URL</code> and{" "}
                <code className="text-xs">STAFF_EVENTS_PASSWORD</code> in{" "}
                <code className="text-xs">.env.local</code>, then run{" "}
                <code className="text-xs">pnpm db:migrate</code>.
              </p>
            </div>
          ) : (
            <StaffDashboard />
          )}
        </div>
      </section>
    </SiteShell>
  )
}
