export type BaptismAppointmentStatus = "pending" | "accepted" | "rejected"

export type BaptismAppointmentDto = {
  idUser: string
  name: string
  email: string
  phone?: string
  childName: string
  intendedDate?: string
  message?: string
  submittedAt?: string
  status: BaptismAppointmentStatus
  acceptedAt?: string
}

export type BaptismAppointmentInput = {
  name: string
  email: string
  phone?: string
  childName: string
  intendedDate?: string
  message?: string
}
