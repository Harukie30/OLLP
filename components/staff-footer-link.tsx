"use client"

export function StaffFooterLink() {
  return (
    <button
      type="button"
      className="text-xs text-blue-100/50 underline-offset-2 transition-colors hover:text-blue-100 hover:underline"
      onClick={() => window.dispatchEvent(new Event("ollp-staff-open"))}
    >
      Parish staff
    </button>
  )
}
