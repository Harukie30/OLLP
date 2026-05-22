import { SACRAMENT_COLUMN_CLASS } from "@/components/staff-appointment-sacrament-cell"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const skeletonCell = "bg-sky-100/90"

export function StaffAppointmentsTableSkeleton({
  rowCount = 5,
  showStatusColumn = true,
}: {
  rowCount?: number
  showStatusColumn?: boolean
}) {
  return (
    <div
      className="overflow-auto rounded-xl border border-sky-100 bg-white"
      aria-busy="true"
      aria-label="Loading appointments"
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-sky-50/95 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className={SACRAMENT_COLUMN_CLASS}>Sacrament</TableHead>
            {showStatusColumn ? <TableHead>Status</TableHead> : null}
            <TableHead>Submitted</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Preferred date</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="min-w-[10rem]">Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }, (_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className={SACRAMENT_COLUMN_CLASS}>
                <Skeleton
                  className={cn(skeletonCell, "h-[3.25rem] w-full max-w-[9rem] rounded-xl")}
                />
              </TableCell>
              {showStatusColumn ? (
                <TableCell>
                  <Skeleton className={cn(skeletonCell, "h-6 w-16 rounded-full")} />
                </TableCell>
              ) : null}
              <TableCell>
                <Skeleton className={cn(skeletonCell, "h-4 w-24")} />
              </TableCell>
              <TableCell>
                <Skeleton className={cn(skeletonCell, "h-4 w-28")} />
              </TableCell>
              <TableCell>
                <Skeleton className={cn(skeletonCell, "h-4 w-24")} />
              </TableCell>
              <TableCell>
                <Skeleton className={cn(skeletonCell, "h-4 w-32")} />
              </TableCell>
              <TableCell>
                <Skeleton className={cn(skeletonCell, "h-4 w-full max-w-xs")} />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className={cn(skeletonCell, "ml-auto h-8 w-20 rounded-md")} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
