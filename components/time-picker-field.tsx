"use client"

import { useMemo, useState } from "react"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  formatSheetTimeString,
  parseSheetTimeString,
} from "@/lib/sheet-time-format"
import { inputClassName } from "@/lib/site"
import { cn } from "@/lib/utils"

const QUICK_TIMES = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "12:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
] as const

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = ["00", "15", "30", "45"]

export function TimePickerField({
  name,
  label,
  optional = false,
  defaultValue = "",
  placeholder = "Pick a time",
}: {
  name: string
  label: string
  optional?: boolean
  defaultValue?: string
  placeholder?: string
}) {
  const parsed = defaultValue ? parseSheetTimeString(defaultValue) : null
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState(parsed?.hour ?? 6)
  const [minute, setMinute] = useState(parsed?.minute ?? 0)
  const [meridiem, setMeridiem] = useState<"AM" | "PM">(parsed?.meridiem ?? "PM")
  const [cleared, setCleared] = useState(!defaultValue)

  const displayValue = useMemo(() => {
    if (cleared) return ""
    return formatSheetTimeString({ hour, minute, meridiem })
  }, [cleared, hour, minute, meridiem])

  return (
    <div className="block text-sm">
      <span className="font-medium text-blue-950">{label}</span>
      <input type="hidden" name={name} value={displayValue} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "mt-1.5 h-9 w-full justify-start gap-2 font-normal",
              !displayValue && "text-muted-foreground"
            )}
          >
            <Clock className="size-4 shrink-0 text-primary" aria-hidden />
            {displayValue || (optional ? "All day / none" : placeholder)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(100vw-2rem,20rem)] p-3" align="start">
          <p className="mb-2 text-xs text-muted-foreground">
            Saved as sheet format (e.g. 6:00 PM)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TIMES.map((time) => {
              const parts = parseSheetTimeString(time)
              if (!parts) return null
              return (
                <Button
                  key={time}
                  type="button"
                  size="sm"
                  variant={displayValue === time ? "default" : "secondary"}
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setHour(parts.hour)
                    setMinute(parts.minute)
                    setMeridiem(parts.meridiem)
                    setCleared(false)
                    setOpen(false)
                  }}
                >
                  {time}
                </Button>
              )
            })}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <label className="text-xs text-muted-foreground">
              Hour
              <select
                value={hour}
                onChange={(e) => {
                  setHour(Number(e.target.value))
                  setCleared(false)
                }}
                className={cn(inputClassName, "mt-1")}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Min
              <select
                value={minute}
                onChange={(e) => {
                  setMinute(Number(e.target.value))
                  setCleared(false)
                }}
                className={cn(inputClassName, "mt-1")}
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              AM/PM
              <select
                value={meridiem}
                onChange={(e) => {
                  setMeridiem(e.target.value as "AM" | "PM")
                  setCleared(false)
                }}
                className={cn(inputClassName, "mt-1")}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <Button type="button" size="sm" className="flex-1" onClick={() => setOpen(false)}>
              Done
            </Button>
            {optional ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setCleared(true)
                  setOpen(false)
                }}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
