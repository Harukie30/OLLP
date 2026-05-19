"use client"

import { CircleCheck, OctagonX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ResultModalBaseProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  actionLabel?: string
}

function ResultModalBase({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = "OK",
  variant,
}: ResultModalBaseProps & { variant: "success" | "error" }) {
  const isSuccess = variant === "success"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        elevated
        className="max-w-sm sm:max-w-sm"
        showCloseButton={false}
      >
        <DialogHeader className="items-center text-center">
          <div
            className={cn(
              "mb-2 flex size-14 items-center justify-center rounded-full",
              isSuccess
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {isSuccess ? (
              <CircleCheck className="size-8" aria-hidden />
            ) : (
              <OctagonX className="size-8" aria-hidden />
            )}
          </div>
          <DialogTitle className="pr-0 text-center">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <Button
          type="button"
          className="w-full"
          variant={isSuccess ? "default" : "destructive"}
          onClick={() => onOpenChange(false)}
        >
          {actionLabel}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export function SuccessModal(props: ResultModalBaseProps) {
  return <ResultModalBase {...props} variant="success" />
}

export function FailedModal(props: ResultModalBaseProps) {
  return <ResultModalBase {...props} variant="error" />
}
