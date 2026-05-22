"use client"

import { useState, useTransition } from "react"
import { Baby, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { submitBaptismAppointment } from "@/app/actions/baptism-appointment"
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

export function BaptismAppointmentModal({
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
      const response = await submitBaptismAppointment(formData)

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
          "Thank you. The parish office will review your baptism request and contact you by email.",
      })
      toast.success("Baptism request sent")
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
                <Baby className="size-5" aria-hidden />
              </span>
              <DialogTitle className="mt-3 text-xl text-blue-950">
                Baptism appointment request
              </DialogTitle>
              <DialogDescription className="text-pretty">
                Share your details for {churchFormalName}. Schedule early so
                preparation and paperwork can be completed ahead of time.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            className="space-y-4 px-5 py-5 sm:px-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Parent / guardian name" htmlFor="baptism-name" required>
                <input
                  id="baptism-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={inputClassName}
                  disabled={pending}
                />
              </Field>
              <Field label="Email" htmlFor="baptism-email" required>
                <input
                  id="baptism-email"
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
              <Field label="Phone (optional)" htmlFor="baptism-phone">
                <input
                  id="baptism-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClassName}
                  disabled={pending}
                />
              </Field>
              <Field
                label="Preferred baptism date"
                htmlFor="baptism-date"
                hint="Approximate date is fine."
              >
                <input
                  id="baptism-date"
                  name="intendedDate"
                  type="date"
                  className={cn(inputClassName, "[color-scheme:light]")}
                  disabled={pending}
                />
              </Field>
            </div>

            <Field label="Child's full name" htmlFor="baptism-child" required>
              <input
                id="baptism-child"
                name="childName"
                type="text"
                required
                className={inputClassName}
                disabled={pending}
              />
            </Field>

            <Field
              label="Message"
              htmlFor="baptism-message"
              hint="Godparents, RCIA, session preferences, or questions."
            >
              <Textarea
                id="baptism-message"
                name="message"
                rows={4}
                placeholder="Tell us about your family and plans..."
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
