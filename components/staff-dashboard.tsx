"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { CalendarDays, Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  staffCheckSession,
  staffLogin,
  staffLogout,
} from "@/app/actions/staff-events"
import { usePageLoading } from "@/components/page-loading-provider"
import { FailedModal } from "@/components/result-modal"
import { StaffEventsPanel } from "@/components/staff-events-panel"
import { StaffSignInScreen } from "@/components/staff-sign-in-screen"
import { StaffWeddingAppointmentsPanel } from "@/components/staff-wedding-appointments-panel"
import { Button } from "@/components/ui/button"
import { churchFormalName } from "@/lib/site"
import { cn } from "@/lib/utils"

type StaffTab = "events" | "weddings"

type ResultModalState = {
  variant: "error"
  title: string
  description?: string
} | null

export function StaffDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [tab, setTab] = useState<StaffTab>("events")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginResult, setLoginResult] = useState<ResultModalState>(null)
  const [pending, startTransition] = useTransition()
  const { startLoading, stopLoading } = usePageLoading()

  useEffect(() => {
    void (async () => {
      const { authenticated: ok } = await staffCheckSession()
      setAuthenticated(ok)
    })()
  }, [])

  const handleLogin = () => {
    startTransition(async () => {
      setLoginError(null)
      setLoginResult(null)
      startLoading({
        title: "Signing you in",
        description: "Verifying parish staff access…",
        minMs: 700,
      })

      try {
        const result = await staffLogin(password)

        if (!result.ok) {
          setLoginError(result.error)
          setLoginResult({
            variant: "error",
            title: "Sign-in failed",
            description: result.error,
          })
          await stopLoading()
          toast.error(result.error)
          return
        }

        await stopLoading()
        toast.success("Signed in", {
          description: "Welcome to the staff dashboard.",
        })
        setPassword("")
        setAuthenticated(true)
      } catch {
        await stopLoading()
        const message = "Something went wrong. Please try again."
        setLoginError(message)
        toast.error(message)
        setLoginResult({
          variant: "error",
          title: "Sign-in failed",
          description: message,
        })
      }
    })
  }

  const handleLogout = () => {
    startTransition(async () => {
      await staffLogout()
      setAuthenticated(false)
      toast.success("Signed out")
    })
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <>
        <StaffSignInScreen
          password={password}
          onPasswordChange={setPassword}
          onSubmit={() => void handleLogin()}
          error={loginError}
          pending={pending}
        />
        <FailedModal
          open={loginResult?.variant === "error"}
          onOpenChange={(open) => !open && setLoginResult(null)}
          title={loginResult?.title ?? "Sign-in failed"}
          description={loginResult?.description}
        />
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-sky-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Staff dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl">
            {churchFormalName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Manage upcoming events and review wedding appointment requests.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back to site</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
            onClick={handleLogout}
            disabled={pending}
          >
            Sign out
          </Button>
        </div>
      </div>

      <div
        className="inline-flex w-full max-w-md gap-1.5 rounded-xl border border-sky-100 bg-sky-50/50 p-1"
        role="tablist"
        aria-label="Staff sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "events"}
          className={cn(
            "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            tab === "events"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-blue-950/80 hover:bg-white"
          )}
          onClick={() => setTab("events")}
        >
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          Events
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "weddings"}
          className={cn(
            "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            tab === "weddings"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-blue-950/80 hover:bg-white"
          )}
          onClick={() => setTab("weddings")}
        >
          <Heart className="size-4 shrink-0" aria-hidden />
          Weddings
        </button>
      </div>

      <div
        className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-8"
        role="tabpanel"
      >
        {tab === "events" ? (
          <StaffEventsPanel
            pending={pending}
            startTransition={startTransition}
          />
        ) : (
          <StaffWeddingAppointmentsPanel
            pending={pending}
            startTransition={startTransition}
          />
        )}
      </div>
    </div>
  )
}
