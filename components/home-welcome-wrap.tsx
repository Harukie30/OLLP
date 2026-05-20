"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import { SiteLogo } from "@/components/site-logo"
import { Button } from "@/components/ui/button"
import {
  aboutPageBackground,
  aboutPageBackgroundPosition,
  churchEyebrow,
  churchFormalName,
} from "@/lib/site"

const SESSION_KEY = "ollp-home-welcome-dismissed"

type Phase = "checking" | "welcome" | "done"

function WelcomeBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image
        src={aboutPageBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-[1.02] object-cover blur-[0.70px]"
        style={{ objectPosition: aboutPageBackgroundPosition }}
      />
      <div className="absolute inset-0 bg-white/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-sky-50/65 to-white/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_42%,rgb(255_255_255/0.82),transparent_62%)]" />
    </div>
  )
}

export function HomeWelcomeWrap({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("checking")

  useEffect(() => {
    try {
      if (
        process.env.NODE_ENV === "development" &&
        window.location.hash === "#welcome"
      ) {
        sessionStorage.removeItem(SESSION_KEY)
        setPhase("welcome")
        return
      }

      const dismissed = sessionStorage.getItem(SESSION_KEY) === "1"
      setPhase(dismissed ? "done" : "welcome")
    } catch {
      setPhase("done")
    }
  }, [])

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* private browsing */
    }
    setPhase("done")
  }, [])

  useEffect(() => {
    if (phase !== "welcome") return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [phase, dismiss])

  if (phase === "checking") {
    return (
      <div
        className="fixed inset-0 z-[100] overflow-hidden"
        aria-busy="true"
        aria-label="Loading"
      >
        <WelcomeBackdrop />
        <div className="absolute inset-0 bg-white/40" />
      </div>
    )
  }

  if (phase === "welcome") {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-welcome-title"
      >
        <WelcomeBackdrop />

        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          <div className="rounded-full bg-white/90 p-2 shadow-lg shadow-sky-900/10 ring-1 ring-sky-100">
            <SiteLogo size="lg" priority className="ring-2 ring-white" />
          </div>
          <p className="mt-6 text-sm font-medium tracking-wide text-primary uppercase">
            {churchEyebrow}
          </p>
          <h1
            id="home-welcome-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-balance text-blue-950 sm:text-3xl"
          >
            Welcome
          </h1>
          <p className="mt-3 text-lg text-blue-900/85 text-pretty">
            {churchFormalName}
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            A welcoming Catholic community in Tagbilaran, Bohol.
          </p>
          <Button
            size="lg"
            className="mt-8 min-w-[12rem] motion-safe:transition-opacity"
            onClick={dismiss}
            autoFocus
          >
            Enter site
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Press Escape to continue
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
