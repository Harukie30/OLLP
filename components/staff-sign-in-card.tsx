"use client"

import { Lock, ShieldCheck } from "lucide-react"

import { SiteLogo } from "@/components/site-logo"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { churchEyebrow, churchFormalName, inputClassName } from "@/lib/site"
import { cn } from "@/lib/utils"

type StaffSignInCardProps = {
  password: string
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  error: string | null
  pending: boolean
  /** When true, omits outer chrome (used inside StaffSignInScreen). */
  compact?: boolean
}

export function StaffSignInCard({
  password,
  onPasswordChange,
  onSubmit,
  error,
  pending,
  compact = false,
}: StaffSignInCardProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-white/90 backdrop-blur-md",
        compact
          ? "rounded-2xl border border-white/60 shadow-2xl shadow-sky-950/15"
          : "mx-auto max-w-lg rounded-2xl border border-sky-100 shadow-lg shadow-sky-900/5"
      )}
    >
      <div
        className={cn(
          "border-b border-sky-100/90 px-6 py-7 text-center",
          compact
            ? "bg-gradient-to-br from-sky-100/90 via-sky-50/80 to-white/90"
            : "relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100/70 px-5 pt-7 pb-5 sm:px-6 sm:pt-8 sm:pb-6"
        )}
      >
        {!compact ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(59_130_246/0.12),transparent_55%)]"
          />
        ) : null}
        <div className={cn(compact ? "" : "relative")}>
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-white shadow-md">
            <SiteLogo size="md" className="rounded-lg" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {churchEyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-blue-950">
            Sign in
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-pretty text-sm text-muted-foreground">
            Enter your parish staff password to open the dashboard.
          </p>
        </div>
      </div>

      <form
        className="space-y-4 px-6 py-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (!pending && password.trim()) onSubmit()
        }}
      >
        <div className="space-y-2">
          <label
            htmlFor="staff-password"
            className="text-sm font-medium text-blue-950"
          >
            Staff password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="staff-password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={cn(
                inputClassName,
                "h-11 pl-10 text-base shadow-sm transition-shadow focus-visible:shadow-md"
              )}
              placeholder="Enter password"
              autoComplete="current-password"
              autoFocus
              disabled={pending}
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-base font-medium shadow-md shadow-primary/20"
          disabled={pending || !password.trim()}
        >
          {pending ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : (
            "Continue to dashboard"
          )}
        </Button>

        <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3.5">
          <ShieldCheck
            className="mt-0.5 size-5 shrink-0 text-sky-700"
            aria-hidden
          />
          <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
            For authorized {churchFormalName} staff and volunteers only. Contact
            the parish office if you need access.
          </p>
        </div>
      </form>
    </div>
  )
}
