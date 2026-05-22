"use client"

import { useMemo, useState } from "react"
import { HeartOff, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  staffAcceptBaptismAppointment,
  staffAcceptWeddingAppointment,
  staffDeleteBaptismAppointment,
  staffDeleteWeddingAppointment,
  staffRejectBaptismAppointment,
  staffRejectWeddingAppointment,
} from "@/app/actions/staff-events"
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog"
import { StaffAppointmentFilters } from "@/components/staff-appointment-filters"
import { StaffAppointmentKindFilter } from "@/components/staff-appointment-kind-filter"
import { useStaffAppointmentsData } from "@/components/staff-appointments-data"
import { StaffAppointmentsTable } from "@/components/staff-appointments-table"
import { StaffAppointmentsTableSkeleton } from "@/components/staff-appointments-table-skeleton"
import {
  countActiveAppointmentsByStatus,
  countStaffAppointmentsByKind,
  filterActiveStaffAppointments,
  filterRejectedStaffAppointments,
  type ActiveAppointmentStatusFilter,
  type AppointmentKindFilter,
  type StaffAppointmentRow,
} from "@/lib/appointment-status-filter"
import { cn } from "@/lib/utils"

type AppointmentsTableView = "active" | "rejected"

function rowSummary(item: StaffAppointmentRow): string {
  if (item.kind === "wedding") {
    return `${item.primaryLabel} & ${item.secondaryLabel}`
  }
  return `${item.primaryLabel} (${item.secondaryLabel})`
}

function AppointmentsEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-10 text-center">
      <p className="font-medium text-blue-950">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function StaffAppointmentsPanel({
  pending,
  startTransition,
}: {
  pending: boolean
  startTransition: (fn: () => void | Promise<void>) => void
}) {
  const { appointments, activePool, rejectedPool, loading, loadAppointments } =
    useStaffAppointmentsData()
  const [tableView, setTableView] = useState<AppointmentsTableView>("active")
  const [kindFilter, setKindFilter] = useState<AppointmentKindFilter>("all")
  const [statusFilter, setStatusFilter] =
    useState<ActiveAppointmentStatusFilter>("all")
  const [deleteConfirm, setDeleteConfirm] =
    useState<StaffAppointmentRow | null>(null)
  const [rejectConfirm, setRejectConfirm] =
    useState<StaffAppointmentRow | null>(null)

  const kindCountsActive = useMemo(
    () => countStaffAppointmentsByKind(activePool),
    [activePool]
  )

  const kindCountsRejected = useMemo(
    () => countStaffAppointmentsByKind(rejectedPool),
    [rejectedPool]
  )

  const statusCountsActive = useMemo(
    () => countActiveAppointmentsByStatus(appointments),
    [appointments]
  )

  const filteredActive = useMemo(
    () => filterActiveStaffAppointments(activePool, kindFilter, statusFilter),
    [activePool, kindFilter, statusFilter]
  )

  const filteredRejected = useMemo(
    () => filterRejectedStaffAppointments(rejectedPool, kindFilter),
    [rejectedPool, kindFilter]
  )

  const handleAccept = (item: StaffAppointmentRow) => {
    if (item.status !== "pending") return
    startTransition(async () => {
      const result =
        item.kind === "wedding"
          ? await staffAcceptWeddingAppointment(item.idUser)
          : await staffAcceptBaptismAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not accept request.")
        return
      }
      toast.success("Request accepted", { description: rowSummary(item) })
      loadAppointments()
    })
  }

  const runDeleteRequest = () => {
    if (!deleteConfirm) return
    const item = deleteConfirm
    startTransition(async () => {
      const result =
        item.kind === "wedding"
          ? await staffDeleteWeddingAppointment(item.idUser)
          : await staffDeleteBaptismAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not delete request.")
        return
      }
      toast.success("Request removed", { description: rowSummary(item) })
      setDeleteConfirm(null)
      loadAppointments()
    })
  }

  const runRejectRequest = () => {
    if (!rejectConfirm) return
    const item = rejectConfirm
    startTransition(async () => {
      const result =
        item.kind === "wedding"
          ? await staffRejectWeddingAppointment(item.idUser)
          : await staffRejectBaptismAppointment(item.idUser)
      if (!result.ok) {
        toast.error(result.error ?? "Could not reject request.")
        return
      }
      toast.success("Request rejected", {
        description: `${rowSummary(item)} — open the Rejected table tab.`,
      })
      setRejectConfirm(null)
      setTableView("rejected")
      loadAppointments()
    })
  }

  const hasAnyAppointments = appointments.length > 0
  const isActiveView = tableView === "active"

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <p className="max-w-xl text-sm text-muted-foreground">
        Switch between the active and rejected tables below. Sacrament filter
        applies to whichever table you are viewing.
      </p>

      <div
        className="inline-flex w-full max-w-md gap-1 rounded-xl border border-sky-100 bg-sky-50/50 p-1"
        role="tablist"
        aria-label="Appointment tables"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isActiveView}
          className={cn(
            "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActiveView
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-blue-950/80 hover:bg-white"
          )}
          onClick={() => setTableView("active")}
        >
          Active
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
              isActiveView
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-sky-100 text-blue-950"
            )}
          >
            {activePool.length}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isActiveView}
          className={cn(
            "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            !isActiveView
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-blue-950/80 hover:bg-white"
          )}
          onClick={() => setTableView("rejected")}
        >
          Rejected
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
              !isActiveView
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-sky-100 text-blue-950"
            )}
          >
            {rejectedPool.length}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-2">
          {isActiveView ? (
            <StaffAppointmentFilters
              kindFilter={kindFilter}
              statusFilter={statusFilter}
              onKindChange={setKindFilter}
              onStatusChange={setStatusFilter}
              kindCounts={kindCountsActive}
              statusCounts={statusCountsActive}
              disabled={loading}
            />
          ) : (
            <StaffAppointmentKindFilter
              id="rejected-kind-filter"
              value={kindFilter}
              onChange={setKindFilter}
              counts={kindCountsRejected}
              disabled={loading}
            />
          )}
          <button
            type="button"
            onClick={loadAppointments}
            disabled={loading}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-sky-100 bg-white px-3 text-sm font-medium text-blue-950 transition-colors hover:bg-sky-50 disabled:opacity-50"
          >
            <RefreshCw
              className={cn("size-4", loading && "animate-spin")}
              aria-hidden
            />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <StaffAppointmentsTableSkeleton showStatusColumn={isActiveView} />
      ) : isActiveView ? (
        !hasAnyAppointments ? (
          <AppointmentsEmptyState
            title="No appointment requests yet"
            description="When couples or families submit forms on the Services page, they will appear in the Active table."
          />
        ) : filteredActive.length === 0 ? (
          <AppointmentsEmptyState
            title="No active requests match these filters"
            description="Try another sacrament or status, or switch to the Rejected table."
          />
        ) : (
          <StaffAppointmentsTable
            rows={filteredActive}
            variant="active"
            pending={pending}
            onAccept={handleAccept}
            onReject={(item) => setRejectConfirm(item)}
            onDelete={(item) => setDeleteConfirm(item)}
          />
        )
      ) : filteredRejected.length === 0 ? (
        <AppointmentsEmptyState
          title={
            rejectedPool.length === 0
              ? "No rejected requests"
              : "No rejected requests for this sacrament"
          }
          description={
            rejectedPool.length === 0
              ? "When you reject a pending request on the Active table, it will appear here."
              : "Choose “All sacraments” to see every rejected request."
          }
        />
      ) : (
        <StaffAppointmentsTable
          rows={filteredRejected}
          variant="rejected"
          pending={pending}
          onDelete={(item) => setDeleteConfirm(item)}
        />
      )}

      <ConfirmAlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete this request?"
        description={
          deleteConfirm
            ? `Permanently remove this ${deleteConfirm.kind} request (${rowSummary(deleteConfirm)}). This cannot be undone.`
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
            ? `Move ${rowSummary(rejectConfirm)} to the Rejected table.`
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
