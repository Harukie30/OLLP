"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react"
import { toast } from "sonner"

import {
  staffListBaptismAppointments,
  staffListWeddingAppointments,
} from "@/app/actions/staff-events"
import {
  mergeStaffAppointments,
  splitStaffAppointmentsByStatus,
  type StaffAppointmentRow,
} from "@/lib/appointment-status-filter"

const APPOINTMENTS_LOAD_MIN_MS = 2500

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type StaffAppointmentsDataContextValue = {
  appointments: StaffAppointmentRow[]
  activePool: StaffAppointmentRow[]
  rejectedPool: StaffAppointmentRow[]
  loading: boolean
  loadAppointments: () => void
}

const StaffAppointmentsDataContext =
  createContext<StaffAppointmentsDataContextValue | null>(null)

export function StaffAppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<StaffAppointmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [, startLoad] = useTransition()

  const loadAppointments = useCallback(() => {
    setLoading(true)

    startLoad(async () => {
      try {
        const [weddingResult, baptismResult] = await Promise.all([
          staffListWeddingAppointments(),
          staffListBaptismAppointments(),
          delay(APPOINTMENTS_LOAD_MIN_MS),
        ])

        if (!weddingResult.ok || !baptismResult.ok) {
          toast.error(
            weddingResult.ok
              ? (baptismResult.error ?? "Could not load baptism requests.")
              : (weddingResult.error ?? "Could not load wedding requests.")
          )
          return
        }

        setAppointments(
          mergeStaffAppointments(
            weddingResult.appointments,
            baptismResult.appointments
          )
        )
      } finally {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const { active: activePool, rejected: rejectedPool } = useMemo(
    () => splitStaffAppointmentsByStatus(appointments),
    [appointments]
  )

  const value = useMemo(
    () => ({
      appointments,
      activePool,
      rejectedPool,
      loading,
      loadAppointments,
    }),
    [appointments, activePool, rejectedPool, loading, loadAppointments]
  )

  return (
    <StaffAppointmentsDataContext.Provider value={value}>
      {children}
    </StaffAppointmentsDataContext.Provider>
  )
}

export function useStaffAppointmentsData() {
  const ctx = useContext(StaffAppointmentsDataContext)
  if (!ctx) {
    throw new Error(
      "useStaffAppointmentsData must be used within StaffAppointmentsProvider"
    )
  }
  return ctx
}
