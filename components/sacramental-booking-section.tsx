import { SacramentalBookingList } from "@/components/sacramental-booking-list"

export function SacramentalBookingSection() {
  return (
    <section
      className="space-y-8"
      aria-labelledby="sacraments-heading"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Sacraments & appointments
        </p>
        <h2
          id="sacraments-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 sm:text-3xl"
        >
          Weddings, baptisms, and pastoral care
        </h2>
        <p className="mt-3 text-muted-foreground">
          These moments matter. Wedding and baptism requests are saved as parish
          appointments for staff to review—use the buttons below to submit your details.
        </p>
      </div>

      <SacramentalBookingList />
    </section>
  )
}
