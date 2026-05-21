import Link from "next/link"

export function StaffFooterLink() {
  return (
    <Link
      href="/staff"
      className="text-xs text-blue-100/50 underline-offset-2 transition-colors hover:text-blue-100 hover:underline"
    >
      Parish staff
    </Link>
  )
}
