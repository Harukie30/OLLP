"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { format, parseISO } from "date-fns"
import {
  CalendarHeart,
  Check,
  HeartOff,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import {
  staffAcceptWeddingAppointment,
  staffDeleteWeddingAppointment,
  staffListWeddingAppointments,
  staffRejectWeddingAppointment,
} from "@/app/actions/staff-events"
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { WeddingAppointmentDto } from "@/lib/wedding-appointment-types"
import { cn } from "@/lib/utils"

function formatSubmittedAt(iso?: string): string {
  if (!iso) return "—"
  const parsed = Date.parse(iso)
  if (Number.isNaN(parsed)) return iso
  return format(new Date(parsed), "MMM d, yyyy")
}

function formatSubmittedTime(iso?: string): string {
  if (!iso) return ""
  const parsed = Date.parse(iso)
  if (Number.isNaN(parsed)) return ""
  return format(new Date(parsed), "h:mm a")
}

function formatIntendedDate(date?: string): string {
  if (!date) return "—"
  const parsed = parseISO(date)
  if (Number.isNaN(parsed.getTime())) return date
  return format(parsed, "MMM d, yyyy")
}

export function StaffWeddingAppointmentsPanel({
  pending,
  startTransition,
}: {
  pending: boolean
  startTransition: (fn: () => void | Promise<void>) => void
}) {
  const [appointments, setAppointments] = useState<WeddingAppointmentDto[]>([])
  const [loading, setLoading] = useState(true)
  const [, startLoad] = useTransition()
  const [deleteConfirm, setDeleteConfirm] =
    useState<WeddingAppointmentDto | null>(null)
  const [rejectConfirm, setRejectConfirm] =
    useState<WeddingAppointmentDto | null>(null)

  const loadAppointments = useCallback(() => {
    startLoad(async () => {
      setLoading(true)
      const result = await staffListWeddingAppointments()
      setLoading(false)
      if (!result.ok) {
        toast.error(result.error ?? "Could not load wedding appointments.")
        return
      }
      setAppointments(result.appointments)
    })
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const handleRefresh = () => {
    startTransition(() => {
      loadAppointments()
    })
  }

  const handleAccept = (item: WeddingAppointmentDto) => {
    if (item.status !== "pending") return
    startTransition(async () => {
      const result = await staffAcceptWeddingAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not accept request.")
        return
      }
      toast.success("Request accepted", {
        description: `${item.name} & ${item.partnerName}`,
      })
      loadAppointments()
    })
  }

  const runDeleteRequest = () => {
    if (!deleteConfirm) return
    const item = deleteConfirm
    startTransition(async () => {
      const result = await staffDeleteWeddingAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not delete request.")
        return
      }
      toast.success("Request removed", {
        description: `${item.name} & ${item.partnerName}`,
      })
      setDeleteConfirm(null)
      loadAppointments()
    })
  }

  const runRejectRequest = () => {
    if (!rejectConfirm) return
    const item = rejectConfirm
    startTransition(async () => {
      const result = await staffRejectWeddingAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not reject request.")
        return
      }
      toast.success("Request rejected", {
        description: `${item.name} & ${item.partnerName}`,
      })
      setRejectConfirm(null)
      loadAppointments()
    })
  }

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Requests from the Services page wedding form. Accept or reject
          requests, or delete to remove them permanently.
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={pending || loading}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-100 bg-white px-3 py-1.5 text-sm font-medium text-blue-950 transition-colors hover:bg-sky-50 disabled:opacity-50"
        >
          <RefreshCw
            className={cn("size-4", (pending || loading) && "animate-spin")}
            aria-hidden
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div
          className="flex min-h-[240px] items-center justify-center rounded-xl border border-sky-100 bg-sky-50/30"
          aria-busy
        >
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-12 text-center">
          <CalendarHeart
            className="mx-auto size-10 text-primary/60"
            aria-hidden
          />
          <p className="mt-3 font-medium text-blue-950">
            No wedding requests yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            When couples submit the form on the Services page, they will appear
            here.
          </p>
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-sky-100 bg-white">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-sky-50/95 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Couple</TableHead>
                <TableHead>Intended date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="min-w-[10rem] whitespace-normal">
                  Message
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((item) => {
                const isAccepted = item.status === "accepted"
                const isRejected = item.status === "rejected"
                const isPending = item.status === "pending"
                return (
                  <TableRow
                    key={item.idUser}
                    className={cn(
                      isAccepted && "bg-emerald-50/40",
                      isRejected && "bg-red-50/30"
                    )}
                  >
                    <TableCell className="align-top">
                      <Badge
                        variant={isAccepted ? "default" : "secondary"}
                        className={cn(
                          "shrink-0",
                          isAccepted &&
                            "border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
                          isRejected &&
                            "border-red-200 bg-red-100 text-red-900 hover:bg-red-100",
                          isPending &&
                            "border-amber-200 bg-amber-50 text-amber-950"
                        )}
                      >
                        {isAccepted
                          ? "Accepted"
                          : isRejected
                            ? "Rejected"
                            : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-muted-foreground">
                      <span className="block font-medium text-blue-950">
                        {formatSubmittedAt(item.submittedAt)}
                      </span>
                      {formatSubmittedTime(item.submittedAt) ? (
                        <span className="text-xs">
                          {formatSubmittedTime(item.submittedAt)}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="align-top">
                      <span className="block font-medium text-blue-950">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground">
                        &amp; {item.partnerName}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      {formatIntendedDate(item.intendedDate)}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${encodeURIComponent(item.email)}`}
                          className="inline-flex max-w-[14rem] items-center gap-1 truncate text-primary underline-offset-2 hover:underline"
                          title={item.email}
                        >
                          <Mail className="size-3.5 shrink-0" aria-hidden />
                          {item.email}
                        </a>
                        {item.phone ? (
                          <a
                            href={`tel:${item.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-1 text-blue-950 underline-offset-2 hover:underline"
                          >
                            <Phone className="size-3.5 shrink-0" aria-hidden />
                            {item.phone}
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs align-top whitespace-normal text-blue-950/90">
                      {item.message ? (
                        <span className="line-clamp-3" title={item.message}>
                          {item.message}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="cursor-pointer border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                          disabled={pending || !isPending}
                          onClick={() => handleAccept(item)}
                          title={
                            isPending
                              ? "Mark as accepted"
                              : "Only pending requests can be accepted"
                          }
                        >
                          <Check className="size-4" aria-hidden />
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="cursor-pointer border-red-200 text-red-800 hover:bg-red-50"
                          disabled={pending || !isPending}
                          onClick={() => setRejectConfirm(item)}
                          title={
                            isPending
                              ? "Reject this request"
                              : "Only pending requests can be rejected"
                          }
                        >
                          <HeartOff className="size-4" aria-hidden />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmAlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete this request?"
        description={
          deleteConfirm
            ? `Permanently remove the wedding request from ${deleteConfirm.name} and ${deleteConfirm.partnerName}. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        icon={<Trash2 className="text-destructive" aria-hidden />}
        onConfirm={runDeleteRequest}
        pending={pending}
      />

      <ConfirmAlertDialog
        open={rejectConfirm !== null}
        onOpenChange={(open) => !open && setRejectConfirm(null)}
        title="Reject this request?"
        description={
          rejectConfirm
            ? `Mark the request from ${rejectConfirm.name} and ${rejectConfirm.partnerName} as rejected. The record stays in the list but will no longer be pending.`
            : ""
        }
        confirmLabel="Reject request"
        icon={<HeartOff className="text-red-700" aria-hidden />}
        onConfirm={runRejectRequest}
        pending={pending}
      />
    </div>
  )
}
