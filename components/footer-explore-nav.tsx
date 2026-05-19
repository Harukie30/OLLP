"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type ExploreLink = { href: string; label: string }

export function FooterExploreNav({
  links,
  linkClassName,
}: {
  links: readonly ExploreLink[]
  linkClassName: string
}) {
  const [open, setOpen] = useState(false)
  const lastIndex = Math.max(0, links.length - 1)

  return (
    <nav aria-label="Footer navigation" className="footer-explore-nav">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg py-0.5 text-left transition-colors",
            "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
          )}
        >
          <span className="text-xs font-semibold tracking-widest text-sky-300 uppercase">
            Explore
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-sky-300 transition-transform duration-500 ease-out",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </CollapsibleTrigger>

        <CollapsibleContent
          className={cn(
            "mt-2 origin-top overflow-hidden",
            "data-[state=open]:!animate-footer-panel-down",
            "data-[state=closed]:!animate-footer-panel-up"
          )}
        >
          <ul className="relative flex flex-col pt-1 pb-0.5">
            {links.map((link, index) => (
              <li
                key={link.href}
                style={
                  {
                    "--stack-i": index,
                    "--stack-last": lastIndex,
                    zIndex: links.length - index,
                  } as React.CSSProperties
                }
                className={cn(
                  "relative rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2",
                  "shadow-sm shadow-blue-950/20",
                  index > 0 && "-mt-2",
                  open
                    ? "footer-explore-link-enter"
                    : "footer-explore-link-exit"
                )}
              >
                <Link href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </nav>
  )
}
