import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin } from "lucide-react"

import { SiteLogo } from "@/components/site-logo"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import { address, heroBackground, serviceSummary } from "@/lib/site"

export default function Home() {
  return (
    <SiteShell>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <Image
            src={heroBackground}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.02] object-cover blur-[0.90px]"
          />
          <div className="absolute inset-0 bg-white/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/80 via-white/75 to-white/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgb(59_130_246/0.08),transparent_60%)]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28 md:min-h-[calc(100vh-4rem)] md:justify-center md:py-32">
          <div className="rounded-full bg-white/85 p-2 shadow-md shadow-sky-900/10 ring-1 ring-sky-200/80 backdrop-blur-sm">
            <SiteLogo
              size="lg"
              priority
              className="size-16 ring-2 ring-white sm:size-20"
            />
          </div>

          <div className="flex max-w-3xl flex-col gap-5">
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-blue-950 sm:text-5xl md:text-6xl">
              A church family rooted in grace, growing in faith
            </h1>
            <p className="text-lg text-blue-900/80 text-pretty sm:text-xl">
              We gather to worship Jesus, study Scripture, and care for one
              another. Whether it&apos;s your first Sunday or your hundredth,
              there&apos;s a place for you.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/plan-a-visit">Plan your first visit</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">See service times</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-800/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 backdrop-blur-sm">
              <MapPin className="size-4 text-primary" />
              {address.short}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 backdrop-blur-sm">
              <Clock className="size-4 text-primary" />
              {serviceSummary}
            </span>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
