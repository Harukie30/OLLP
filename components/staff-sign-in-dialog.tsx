"use client"

import { CalendarDays, Loader2, Lock, Shield } from "lucide-react"

import { SiteLogo } from "@/components/site-logo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { churchEyebrow, churchFormalName, inputClassName } from "@/lib/site"
import { cn } from "@/lib/utils"

type StaffSignInDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  password: string
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  error: string | null
  pending: boolean
}

export function StaffSignInDialog({
  open,
  onOpenChange,
  password,
  onPasswordChange,
  onSubmit,
  error,
  pending,
}: StaffSignInDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="relative overflow-hidden border-b border-sky-100/90 bg-gradient-to-br from-sky-50 via-white to-sky-100/70 px-5 pt-7 pb-5 sm:px-6 sm:pt-8 sm:pb-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgb(59_130_246/0.12),transparent_55%)]"
          />
          <DialogHeader className="relative items-center pr-0 text-center">
            <div className="mx-auto rounded-full bg-white/90 p-1.5 shadow-md shadow-sky-900/10 ring-1 ring-sky-100">
              <SiteLogo size="md" className="ring-2 ring-white" />
            </div>
            <p className="mt-4 text-xs font-medium tracking-wide text-primary uppercase">
              {churchEyebrow}
            </p>
            <DialogTitle className="mt-1 text-center text-lg text-blue-950 sm:text-xl">
              Parish staff sign-in
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-sm text-center text-pretty">
            Authorized staff can update content on the parish website. You’ll stay on this page.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-3.5 px-5 py-4 sm:space-y-4 sm:px-6 sm:py-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (!pending && password) onSubmit()
          }}
        >
          <label className="block text-sm font-medium text-blue-950">
            Parish password
            <div className="relative mt-1.5">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className={cn(inputClassName, "pl-9")}
                placeholder="Enter staff password"
                autoComplete="current-password"
                autoFocus
                disabled={pending}
              />
            </div>
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200/80 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={pending || !password.trim()}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Continue to events"
            )}
          </Button>

          <div className="flex items-start gap-2 rounded-lg border border-sky-100/90 bg-sky-50/60 px-3 py-2.5 text-xs text-muted-foreground">
            <Shield className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
            <p className="text-pretty leading-relaxed">
            Access is limited to Shrine and Parish of Our Lady of Lourdes staff and volunteers with a valid parish-issued password. For access, please contact the parish office
            </p>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden />
            Manage home page upcoming events
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
