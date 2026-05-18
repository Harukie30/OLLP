"use client"

import { useState } from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function isSunday(date: Date) {
  return date.getDay() === 0
}

function nextSunday(from = new Date()) {
  const date = startOfDay(from)
  const day = date.getDay()
  if (day === 0) return date
  date.setDate(date.getDate() + (7 - day))
  return date
}

export function VisitDatePicker({
  id,
  name = "visitDate",
}: {
  id: string
  name?: string
}) {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-9 w-full justify-start gap-2 px-2.5 font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-60" />
            {date ? format(date, "EEEE, MMM d, yyyy") : "Pick a Sunday"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              setDate(selected)
              setOpen(false)
            }}
            disabled={(day) =>
              isBefore(startOfDay(day), startOfDay(new Date())) || !isSunday(day)
            }
            defaultMonth={date ?? nextSunday()}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
