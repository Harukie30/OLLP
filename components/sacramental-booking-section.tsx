import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { sacramentalBookings } from "@/lib/services-schedule"

export function SacramentalBookingSection() {
  return (
    <section
      className="space-y-8"
      aria-labelledby="sacraments-heading"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Sacraments & appointments
        </p>
        <h2
          id="sacraments-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl"
        >
          Weddings, baptisms, and pastoral care
        </h2>
        <p className="mt-3 text-muted-foreground">
          These moments matter. Start a conversation with the parish office so we can
          plan dates, paperwork, and preparation together.
        </p>
      </div>

      <ul className="grid gap-4 lg:gap-6">
        {sacramentalBookings.map((item, i) => (
          <li
            key={item.title}
            className={`group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm ring-1 ring-sky-50 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 ${i % 2 === 1 ? "lg:bg-sky-50/35" : ""}`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/[0.06] blur-2xl transition-opacity group-hover:opacity-90"
            />
            <div className="relative flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-blue-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
                <p className="mt-3 inline-flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-blue-900/85">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item.leadTime}</span>
                </p>
              </div>
            </div>
            <div className="relative mt-6 flex shrink-0 lg:mt-0 lg:justify-end">
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href={item.cta.href}>{item.cta.label}</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
