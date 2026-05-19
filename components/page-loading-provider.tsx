"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"
import { siteLogo } from "@/lib/site"

const NAV_MIN_LOAD_MS = 2500
const MAX_LOAD_MS = 8000
const DEFAULT_MANUAL_MIN_MS = 700

type PageLoadingOptions = {
  title?: string
  description?: string
  /** Minimum time the overlay stays visible (defaults to 700ms for manual loads). */
  minMs?: number
}

type PageLoadingContextValue = {
  isLoading: boolean
  startLoading: (options?: PageLoadingOptions) => void
  /** Waits for the minimum display time, then hides the overlay. */
  stopLoading: () => Promise<void>
}

const PageLoadingContext = createContext<PageLoadingContextValue | null>(null)

export function usePageLoading() {
  const context = useContext(PageLoadingContext)
  if (!context) {
    throw new Error("usePageLoading must be used within PageLoadingProvider")
  }
  return context
}

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

const defaultOverlay = {
  title: "Just a moment",
  description: "Preparing the next page for you…",
}

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [overlay, setOverlay] = useState(defaultOverlay)

  const isPending = useRef(false)
  const isManual = useRef(false)
  const startedAt = useRef(0)
  const minLoadMs = useRef(NAV_MIN_LOAD_MS)
  const lastPathname = useRef(pathname)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (maxTimer.current) clearTimeout(maxTimer.current)
    hideTimer.current = null
    maxTimer.current = null
  }, [])

  const resetOverlay = useCallback(() => {
    setOverlay(defaultOverlay)
    isManual.current = false
    minLoadMs.current = NAV_MIN_LOAD_MS
  }, [])

  const stopLoading = useCallback(() => {
    clearTimers()
    setIsLoading(false)
    isPending.current = false
    startedAt.current = 0
    resetOverlay()
  }, [clearTimers, resetOverlay])

  const scheduleStop = useCallback((): Promise<void> => {
    clearTimers()

    const elapsed = Date.now() - startedAt.current
    const remaining = Math.max(0, minLoadMs.current - elapsed)

    return new Promise((resolve) => {
      hideTimer.current = setTimeout(() => {
        stopLoading()
        resolve()
      }, remaining)
    })
  }, [clearTimers, stopLoading])

  const startLoading = useCallback((options?: PageLoadingOptions) => {
    clearTimers()
    isPending.current = true
    isManual.current = true
    startedAt.current = Date.now()
    minLoadMs.current = options?.minMs ?? DEFAULT_MANUAL_MIN_MS
    setOverlay({
      title: options?.title ?? "Just a moment",
      description: options?.description ?? "Please wait…",
    })
    setIsLoading(true)
    maxTimer.current = setTimeout(stopLoading, MAX_LOAD_MS)
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
      isManual.current = false
      startedAt.current = Date.now()
      minLoadMs.current = NAV_MIN_LOAD_MS
      setOverlay(defaultOverlay)
      setIsLoading(true)

      maxTimer.current = setTimeout(stopLoading, MAX_LOAD_MS)
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [pathname, stopLoading])

  useEffect(() => {
    if (!isPending.current || isManual.current) {
      lastPathname.current = pathname
      return
    }

    if (pathname === lastPathname.current) return

    lastPathname.current = pathname
    void scheduleStop()
  }, [pathname, scheduleStop])

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoading])

  const value = useMemo(
    () => ({ isLoading, startLoading, stopLoading: scheduleStop }),
    [isLoading, startLoading, scheduleStop]
  )

  return (
    <PageLoadingContext.Provider value={value}>
      {children}
      <PageLoadingOverlay
        open={isLoading}
        title={overlay.title}
        description={overlay.description}
      />
    </PageLoadingContext.Provider>
  )
}

function PageLoadingOverlay({
  open,
  title,
  description,
}: {
  open: boolean
  title: string
  description: string
}) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-busy={open}
      aria-label={title}
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

        <p className="mt-6 text-lg font-semibold text-blue-950">{title}</p>
        <p className="mt-2 text-sm text-blue-800/75">{description}</p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-sky-100">
          <span className="block h-full w-full origin-left animate-[loading-bar_2.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
        </div>
      </div>
    </div>
  )
}
