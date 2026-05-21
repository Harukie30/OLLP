"use client"

import { useState, useTransition } from "react"
import { CalendarHeart, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { submitWeddingAppointment } from "@/app/actions/wedding-appointment"
import { FailedModal, SuccessModal } from "@/components/result-modal"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { churchFormalName, inputClassName } from "@/lib/site"
import { cn } from "@/lib/utils"

type ResultState = {
  variant: "success" | "error"
  title: string
  description?: string
} | null

export function WeddingAppointmentModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ResultState>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      setResult(null)
      const response = await submitWeddingAppointment(formData)

      if (!response.ok) {
        setResult({
          variant: "error",
          title: "Could not send request",
          description: response.error,
        })
        toast.error(response.error ?? "Something went wrong.")
        return
      }

      form.reset()
      setResult({
        variant: "success",
        title: "Request sent",
        description:
          "Thank you. The parish office will review your wedding appointment request and contact you by email.",
      })
      toast.success("Wedding appointment request sent")
      onOpenChange(false)
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[min(90vh,720px)] gap-0 overflow-y-auto p-0 sm:max-w-lg">
          <div className="border-b border-sky-100/90 bg-gradient-to-br from-sky-50 via-white to-sky-100/70 px-5 pt-6 pb-5 sm:px-6">
            <DialogHeader className="items-center pr-0 text-center sm:items-start sm:text-left">
              <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mx-0">
                <CalendarHeart className="size-5" aria-hidden />
              </span>
              <DialogTitle className="mt-3 text-xl text-blue-950">
                Wedding appointment request
              </DialogTitle>
              <DialogDescription className="text-pretty">
                Share your details for {churchFormalName}. We recommend contacting
                the parish at least six months before your intended date.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            className="space-y-4 px-5 py-5 sm:px-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="wedding-name" required>
                <input
                  id="wedding-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={inputClassName}
                  disabled={pending}
                />
              </Field>
              <Field label="Email" htmlFor="wedding-email" required>
                <input
                  id="wedding-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClassName}
                  disabled={pending}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone (optional)" htmlFor="wedding-phone">
                <input
                  id="wedding-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClassName}
                  disabled={pending}
                />
              </Field>
              <Field
                label="Intended wedding date"
                htmlFor="wedding-date"
                hint="Approximate date is fine."
              >
                <input
                  id="wedding-date"
                  name="intendedDate"
                  type="date"
                  className={cn(inputClassName, "[color-scheme:light]")}
                  disabled={pending}
                />
              </Field>
            </div>

            <Field label="Fiancé(e)'s name" htmlFor="wedding-partner" required>
              <input
                id="wedding-partner"
                name="partnerName"
                type="text"
                required
                className={inputClassName}
                disabled={pending}
              />
            </Field>

            <Field
              label="Message"
              htmlFor="wedding-message"
              hint="Ceremony preferences, questions, or anything we should know."
            >
              <Textarea
                id="wedding-message"
                name="message"
                rows={4}
                placeholder="Tell us about your plans..."
                disabled={pending}
              />
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-sky-100 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send request"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessModal
        open={result?.variant === "success"}
        onOpenChange={(o) => !o && setResult(null)}
        title={result?.title ?? ""}
        description={result?.description}
      />
      <FailedModal
        open={result?.variant === "error"}
        onOpenChange={(o) => !o && setResult(null)}
        title={result?.title ?? "Something went wrong"}
        description={result?.description}
      />
    </>
  )
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-blue-950">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
