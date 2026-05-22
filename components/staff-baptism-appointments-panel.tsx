"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { format, parseISO } from "date-fns"
import {
  Baby,
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
  staffAcceptBaptismAppointment,
  staffDeleteBaptismAppointment,
  staffListBaptismAppointments,
  staffRejectBaptismAppointment,
} from "@/app/actions/staff-events"
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog"
import { StaffAppointmentStatusFilter } from "@/components/staff-appointment-status-filter"
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
import {
  appointmentFilterEmptyMessage,
  countAppointmentsByStatus,
  filterAppointmentsByStatus,
  type AppointmentStatusFilter,
} from "@/lib/appointment-status-filter"
import type { BaptismAppointmentDto } from "@/lib/baptism-appointment-types"
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

export function StaffBaptismAppointmentsPanel({
  pending,
  startTransition,
}: {
  pending: boolean
  startTransition: (fn: () => void | Promise<void>) => void
}) {
  const [appointments, setAppointments] = useState<BaptismAppointmentDto[]>([])
  const [statusFilter, setStatusFilter] =
    useState<AppointmentStatusFilter>("all")
  const [loading, setLoading] = useState(true)
  const [, startLoad] = useTransition()
  const [deleteConfirm, setDeleteConfirm] =
    useState<BaptismAppointmentDto | null>(null)
  const [rejectConfirm, setRejectConfirm] =
    useState<BaptismAppointmentDto | null>(null)

  const loadAppointments = useCallback(() => {
    startLoad(async () => {
      setLoading(true)
      const result = await staffListBaptismAppointments()
      setLoading(false)
      if (!result.ok) {
        toast.error(result.error ?? "Could not load baptism requests.")
        return
      }
      setAppointments(result.appointments)
    })
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const statusCounts = useMemo(
    () => countAppointmentsByStatus(appointments),
    [appointments]
  )

  const filteredAppointments = useMemo(
    () => filterAppointmentsByStatus(appointments, statusFilter),
    [appointments, statusFilter]
  )

  const handleRefresh = () => {
    startTransition(() => {
      loadAppointments()
    })
  }

  const handleAccept = (item: BaptismAppointmentDto) => {
    if (item.status !== "pending") return
    startTransition(async () => {
      const result = await staffAcceptBaptismAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not accept request.")
        return
      }
      toast.success("Request accepted", {
        description: `${item.childName} · ${item.name}`,
      })
      loadAppointments()
    })
  }

  const runDeleteRequest = () => {
    if (!deleteConfirm) return
    const item = deleteConfirm
    startTransition(async () => {
      const result = await staffDeleteBaptismAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not delete request.")
        return
      }
      toast.success("Request removed", {
        description: `${item.childName} · ${item.name}`,
      })
      setDeleteConfirm(null)
      loadAppointments()
    })
  }

  const runRejectRequest = () => {
    if (!rejectConfirm) return
    const item = rejectConfirm
    startTransition(async () => {
      const result = await staffRejectBaptismAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not reject request.")
        return
      }
      toast.success("Request rejected", {
        description: `${item.childName} · ${item.name}`,
      })
      setRejectConfirm(null)
      loadAppointments()
    })
  }

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          One list for all baptism requests. Rejected and accepted stay here—use
          the filter to focus on pending, accepted, or rejected.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <StaffAppointmentStatusFilter
            id="baptism-status-filter"
            value={statusFilter}
            onChange={setStatusFilter}
            counts={statusCounts}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleRefresh}
            disabled={pending || loading}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-sky-100 bg-white px-3 text-sm font-medium text-blue-950 transition-colors hover:bg-sky-50 disabled:opacity-50"
          >
            <RefreshCw
              className={cn("size-4", (pending || loading) && "animate-spin")}
              aria-hidden
            />
            Refresh
          </button>
        </div>
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
          <Baby className="mx-auto size-10 text-primary/60" aria-hidden />
          <p className="mt-3 font-medium text-blue-950">No baptism requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When families submit the form on the Services page, they will appear
            here.
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-12 text-center">
          <Baby className="mx-auto size-10 text-primary/60" aria-hidden />
          <p className="mt-3 font-medium text-blue-950">
            {appointmentFilterEmptyMessage(statusFilter, "baptism")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another filter, or choose &ldquo;All requests&rdquo; to see
            every record.
          </p>
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-sky-100 bg-white">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-sky-50/95 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Preferred date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="min-w-[10rem] whitespace-normal">
                  Message
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((item) => {
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
                        {item.childName}
                      </span>
                      <span className="text-muted-foreground">
                        Parent: {item.name}
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
                          <span className="text-xs text-muted-foreground">—</span>
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
                        >
                          <HeartOff className="size-4" aria-hidden />
                          Reject
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-destructive hover:bg-red-50"
                          disabled={pending}
                          onClick={() => setDeleteConfirm(item)}
                        >
                          <Trash2 className="size-4" aria-hidden />
                          Delete
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
            ? `Permanently remove the baptism request for ${deleteConfirm.childName} (submitted by ${deleteConfirm.name}). This cannot be undone.`
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
            ? `Mark the baptism request for ${rejectConfirm.childName} as rejected. The record stays in the list but will no longer be pending.`
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
