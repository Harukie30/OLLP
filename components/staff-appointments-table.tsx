"use client"

import { format, parseISO } from "date-fns"
import { Check, HeartOff, Mail, Phone, Trash2 } from "lucide-react"

import {
  SACRAMENT_COLUMN_CLASS,
  StaffAppointmentSacramentCell,
} from "@/components/staff-appointment-sacrament-cell"
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
import type { StaffAppointmentRow } from "@/lib/appointment-status-filter"
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

type StaffAppointmentsTableProps = {
  rows: StaffAppointmentRow[]
  variant: "active" | "rejected"
  pending: boolean
  onAccept?: (item: StaffAppointmentRow) => void
  onReject?: (item: StaffAppointmentRow) => void
  onDelete: (item: StaffAppointmentRow) => void
}

export function StaffAppointmentsTable({
  rows,
  variant,
  pending,
  onAccept,
  onReject,
  onDelete,
}: StaffAppointmentsTableProps) {
  const isRejectedTable = variant === "rejected"

  return (
    <div className="overflow-auto rounded-xl border border-sky-100 bg-white">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-sky-50/95 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className={SACRAMENT_COLUMN_CLASS}>Sacrament</TableHead>
            {!isRejectedTable ? <TableHead>Status</TableHead> : null}
            <TableHead>Submitted</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Preferred date</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="min-w-[10rem] whitespace-normal">
              Message
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const isAccepted = item.status === "accepted"
            const isPending = item.status === "pending"
            return (
              <TableRow
                key={`${item.kind}-${item.idUser}`}
                className={cn(
                  isRejectedTable && "bg-red-50/30",
                  !isRejectedTable && isAccepted && "bg-emerald-50/40"
                )}
              >
                <TableCell className={cn("align-top", SACRAMENT_COLUMN_CLASS)}>
                  <StaffAppointmentSacramentCell kind={item.kind} />
                </TableCell>
                {!isRejectedTable ? (
                  <TableCell className="align-top">
                    <Badge
                      variant={isAccepted ? "default" : "secondary"}
                      className={cn(
                        "shrink-0",
                        isAccepted &&
                          "border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
                        isPending &&
                          "border-amber-200 bg-amber-50 text-amber-950"
                      )}
                    >
                      {isAccepted ? "Accepted" : "Pending"}
                    </Badge>
                  </TableCell>
                ) : null}
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
                    {item.primaryLabel}
                  </span>
                      <span className="text-muted-foreground">
                        {item.kind === "wedding"
                          ? `& ${item.secondaryLabel}`
                          : `Parent: ${item.secondaryLabel}`}
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
                    {!isRejectedTable ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="cursor-pointer border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                          disabled={pending || !isPending}
                          onClick={() => onAccept?.(item)}
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
                          onClick={() => onReject?.(item)}
                        >
                          <HeartOff className="size-4" aria-hidden />
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer text-destructive hover:bg-red-50"
                      disabled={pending}
                      onClick={() => onDelete(item)}
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
  )
}
