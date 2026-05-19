import { StaffEventsPortal } from "@/components/staff-events-portal"
import { isStaffPortalConfigured } from "@/lib/staff-auth"

export function StaffEventsPortalLoader() {
  if (!isStaffPortalConfigured()) return null
  return <StaffEventsPortal />
}
