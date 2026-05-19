"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu } from "lucide-react"

import { SiteLogo } from "@/components/site-logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { churchShortName, navLinks } from "@/lib/site"

type SiteHeaderProps = {
  hideVisitCta?: boolean
}

const navLinkClassName =
  "rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

export function SiteHeader({ hideVisitCta = false }: SiteHeaderProps) {
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY

      if (currentY <= 16) {
        setVisible(true)
      } else if (currentY > lastScrollY.current && currentY > 72) {
        setVisible(false)
      } else if (currentY < lastScrollY.current) {
        setVisible(true)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-blue-100 bg-blue-100/90 backdrop-blur-md transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 font-semibold tracking-tight"
        >
          <SiteLogo size="sm" priority className="ring-blue-100" />
          <span className="truncate sm:inline">{churchShortName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClassName}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {!hideVisitCta && (
            <Button size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/plan-a-visit">Plan a visit</Link>
            </Button>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[min(100%,20rem)] flex-col">
              <SheetHeader>
                <SheetTitle className="text-left text-blue-950">
                  {churchShortName}
                </SheetTitle>
              </SheetHeader>

              <nav
                className="flex flex-col gap-1"
                aria-label="Main"
                onClick={() => setMenuOpen(false)}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={navLinkClassName}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {!hideVisitCta && (
                <Button className="mt-auto w-full" asChild>
                  <Link href="/plan-a-visit">Plan a visit</Link>
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
