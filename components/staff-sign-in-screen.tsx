"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays, CalendarHeart, LayoutDashboard } from "lucide-react"

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
        className="scale-[1.03] object-cover opacity-[0.38]"
        style={{ objectPosition: aboutPageBackgroundPosition }}
      />
      <div className="absolute inset-0 bg-sky-950/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200/55 via-sky-100/50 to-sky-300/35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_35%,rgb(255_255_255/0.28),rgb(30_58_138/0.08)_72%)]" />
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
    <div className="relative isolate overflow-hidden rounded-3xl border border-sky-200/80 bg-sky-100/45 shadow-xl shadow-sky-950/10 ring-1 ring-sky-200/70">
      <StaffSignInBackdrop />

      <div className="relative mx-auto grid max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        <div className="hidden flex-col justify-between gap-8 border-r border-sky-200/60 bg-white/40 px-8 py-10 backdrop-blur-md lg:flex lg:px-10 lg:py-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {churchEyebrow}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-blue-950 drop-shadow-sm xl:text-3xl">
              Parish staff portal
            </h1>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-blue-950/75 sm:text-base">
              A secure workspace for {churchFormalName} to manage what
              visitors see on the website.
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex gap-3 rounded-xl border border-white/40 bg-white/75 p-4 shadow-md shadow-sky-950/5 backdrop-blur-sm">
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
            <li className="flex gap-3 rounded-xl border border-white/40 bg-white/75 p-4 shadow-md shadow-sky-950/5 backdrop-blur-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarHeart className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium text-blue-950">Appointments</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Active and rejected tables—switch between them on the
                  Appointments tab.
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

        <div className="flex flex-col justify-center bg-sky-950/5 px-4 py-10 backdrop-blur-[2px] sm:px-8 lg:px-8 lg:py-12">
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
