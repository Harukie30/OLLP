"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type VisitFormDropdownOption = {
  value: string
  label: string
}

export function VisitFormDropdown({
  id,
  name,
  placeholder = "Select",
  options,
}: {
  id: string
  name: string
  placeholder?: string
  options: VisitFormDropdownOption[]
}) {
  const [value, setValue] = useState("")

  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-9 w-full justify-between gap-2 px-2.5 font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate">{selectedLabel ?? placeholder}</span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-(--radix-dropdown-menu-trigger-width)"
        >
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
