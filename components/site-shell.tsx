import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StaffEventsPortalLoader } from "@/components/staff-events-portal-loader"

export function SiteShell({
  children,
  hideVisitCta = false,
}: {
  children: React.ReactNode
  hideVisitCta?: boolean
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader hideVisitCta={hideVisitCta} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <StaffEventsPortalLoader />
    </div>
  )
}
