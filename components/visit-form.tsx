import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { VisitDatePicker } from "@/components/visit-date-picker"
import { VisitFormDropdown } from "@/components/visit-form-dropdown"
import { inputClassName } from "@/lib/site"

const partySizeOptions = [
  { value: "1", label: "Just me" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5+", label: "5 or more" },
] as const

const kidsOptions = [
  { value: "no", label: "No kids this visit" },
  { value: "yes", label: "Yes — we'll need kids check-in" },
  { value: "unsure", label: "Not sure yet" },
] as const

export function VisitForm() {
  return (
    <Card className="border-blue-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Tell us you&apos;re coming</CardTitle>
        <CardDescription>
          Fill this out and our welcome team will reach out with anything
          helpful for your first Sunday.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action="#" method="post">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="visit-name" required>
              <input
                id="visit-name"
                name="name"
                type="text"
                placeholder="Your name"
                className={inputClassName}
                autoComplete="name"
                required
              />
            </Field>
            <Field label="Email" htmlFor="visit-email" required>
              <input
                id="visit-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={inputClassName}
                autoComplete="email"
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone (optional)" htmlFor="visit-phone">
              <input
                id="visit-phone"
                name="phone"
                type="tel"
                placeholder="(555) 000-0000"
                className={inputClassName}
                autoComplete="tel"
              />
            </Field>
            <Field label="Which Sunday?" htmlFor="visit-date">
              <VisitDatePicker id="visit-date" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="How many are coming?" htmlFor="visit-party">
              <VisitFormDropdown
                id="visit-party"
                name="partySize"
                options={[...partySizeOptions]}
              />
            </Field>
            <Field label="Kids joining you?" htmlFor="visit-kids">
              <VisitFormDropdown
                id="visit-kids"
                name="kids"
                options={[...kidsOptions]}
              />
            </Field>
          </div>

          <Field
            label="Anything we should know?"
            htmlFor="visit-notes"
            hint="Accessibility needs, questions, or how you heard about us."
          >
            <Textarea
              id="visit-notes"
              name="notes"
              placeholder="We're visiting from out of town..."
              rows={4}
            />
          </Field>

          <Button type="submit" className="w-full sm:w-auto">
            Submit visit request
          </Button>
        </form>
      </CardContent>
    </Card>
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
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
