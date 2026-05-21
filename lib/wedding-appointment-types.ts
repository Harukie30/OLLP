export type WeddingAppointmentStatus = "pending" | "accepted" | "rejected"

export type WeddingAppointmentDto = {
  idUser: string
  name: string
  email: string
  phone?: string
  partnerName: string
  intendedDate?: string
  message?: string
  submittedAt?: string
  status: WeddingAppointmentStatus
  acceptedAt?: string
}

export type WeddingAppointmentInput = {
  name: string
  email: string
  phone?: string
  partnerName: string
  intendedDate?: string
  message?: string
}
