import { StaffFooterLink } from "@/components/staff-footer-link"
import { isStaffPortalConfigured } from "@/lib/staff-auth"

export function StaffFooterLinkLoader() {
  if (!isStaffPortalConfigured()) return null
  return <StaffFooterLink />
}
