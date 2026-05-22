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
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-to-br from-sky-200/45 via-sky-100/55 to-sky-50 py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(59_130_246/0.1),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
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
