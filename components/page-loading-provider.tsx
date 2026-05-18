"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { siteLogo } from "@/lib/site"

const MIN_LOAD_MS = 2500
const MAX_LOAD_MS = 8000

function isInternalLink(anchor: HTMLAnchorElement, pathname: string) {
  const href = anchor.getAttribute("href")
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false
  }

  if (anchor.target === "_blank") return false

  let url: URL
  try {
    url = new URL(href, window.location.origin)
  } catch {
    return false
  }

  if (url.origin !== window.location.origin) return false

  const nextPath = `${url.pathname}${url.search}`
  if (url.pathname === pathname && url.hash) return false
  if (nextPath === pathname) return false

  return true
}

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const isPending = useRef(false)
  const startedAt = useRef(0)
  const lastPathname = useRef(pathname)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (maxTimer.current) clearTimeout(maxTimer.current)
    hideTimer.current = null
    maxTimer.current = null
  }, [])

  const stopLoading = useCallback(() => {
    clearTimers()
    setIsLoading(false)
    isPending.current = false
    startedAt.current = 0
  }, [clearTimers])

  const scheduleStop = useCallback(() => {
    clearTimers()

    const elapsed = Date.now() - startedAt.current
    const remaining = Math.max(0, MIN_LOAD_MS - elapsed)

    hideTimer.current = setTimeout(stopLoading, remaining)
  }, [clearTimers, stopLoading])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isPending.current) return
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element).closest("a")
      if (!anchor || !isInternalLink(anchor, pathname)) return

      isPending.current = true
      startedAt.current = Date.now()
      setIsLoading(true)

      maxTimer.current = setTimeout(stopLoading, MAX_LOAD_MS)
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [pathname, stopLoading])

  useEffect(() => {
    if (!isPending.current) {
      lastPathname.current = pathname
      return
    }

    if (pathname === lastPathname.current) return

    lastPathname.current = pathname
    scheduleStop()
  }, [pathname, scheduleStop])

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoading])

  return (
    <>
      {children}
      <PageLoadingOverlay open={isLoading} />
    </>
  )
}

function PageLoadingOverlay({ open }: { open: boolean }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-busy={open}
      aria-label="Loading page"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/45 p-4 backdrop-blur-md transition-opacity duration-300",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white/95 p-8 text-center shadow-xl ring-1 ring-blue-100">
        <div className="relative mx-auto size-20">
          <Image
            src={siteLogo.src}
            alt=""
            width={80}
            height={80}
            className="size-20 rounded-full object-cover ring-2 ring-blue-100"
          />
          <span className="absolute inset-0 animate-ping rounded-full ring-2 ring-sky-400/40" />
        </div>

        <p className="mt-6 text-lg font-semibold text-blue-950">Just a moment</p>
        <p className="mt-2 text-sm text-blue-800/75">
          Preparing the next page for you…
        </p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-sky-100">
          <span className="block h-full w-full origin-left animate-[loading-bar_2.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
        </div>
      </div>
    </div>
  )
}
