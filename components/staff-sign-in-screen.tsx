"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Heart, LayoutDashboard } from "lucide-react"

import { StaffSignInCard } from "@/components/staff-sign-in-card"
import {
  aboutPageBackground,
  aboutPageBackgroundPosition,
  churchEyebrow,
  churchFormalName,
} from "@/lib/site"

function StaffSignInBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image
        src={aboutPageBackground}
        alt=""
        fill
        sizes="100vw"
        className="scale-[1.02] object-cover opacity-[0.22]"
        style={{ objectPosition: aboutPageBackgroundPosition }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/92 via-sky-50/88 to-white/94" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_30%_20%,rgb(59_130_246/0.08),transparent_50%)]" />
    </div>
  )
}

type StaffSignInScreenProps = {
  password: string
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  error: string | null
  pending: boolean
}

export function StaffSignInScreen({
  password,
  onPasswordChange,
  onSubmit,
  error,
  pending,
}: StaffSignInScreenProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-sky-100/90 shadow-lg shadow-sky-900/[0.06] ring-1 ring-sky-50">
      <StaffSignInBackdrop />

      <div className="relative mx-auto grid max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        <div className="hidden flex-col justify-between gap-8 border-r border-sky-100/80 bg-white/40 px-8 py-10 backdrop-blur-sm lg:flex lg:px-10 lg:py-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {churchEyebrow}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-blue-950 xl:text-3xl">
              Parish staff portal
            </h1>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              A secure workspace for {churchFormalName} to manage what
              visitors see on the website.
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex gap-3 rounded-xl border border-sky-100/90 bg-white/70 p-4 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium text-blue-950">Parish events</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Add and remove upcoming events shown on the home page.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl border border-sky-100/90 bg-white/70 p-4 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Heart className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium text-blue-950">Wedding requests</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Review, accept, or remove appointment forms from the Services
                  page.
                </p>
              </div>
            </li>
          </ul>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to parish website
          </Link>
        </div>

        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-center gap-2 text-primary lg:hidden">
            <LayoutDashboard className="size-5" aria-hidden />
            <span className="text-sm font-semibold">Staff portal</span>
          </div>
          <StaffSignInCard
            password={password}
            onPasswordChange={onPasswordChange}
            onSubmit={onSubmit}
            error={error}
            pending={pending}
            compact
          />
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
