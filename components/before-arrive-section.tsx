"use client"

import type { ReactNode } from "react"
import Image from "next/image"

import { visitMinistryLogos } from "@/lib/site"

export function BeforeArriveSection({ children }: { children: ReactNode }) {
  return (
    <section className="group relative overflow-hidden border-t border-blue-100 bg-white py-14 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-between px-6 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100 sm:px-10 lg:px-16"
      >
        {visitMinistryLogos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt=""
            width={240}
            height={240}
            className="size-40 object-contain opacity-[0.14] sm:size-52 md:size-60"
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  )
}
