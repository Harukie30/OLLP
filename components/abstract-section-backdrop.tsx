/** Soft gradient blobs for section backgrounds (no image assets). */
export function AbstractSectionBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/95 to-sky-100/50" />
      <div className="absolute -top-20 right-[8%] size-72 rounded-full bg-sky-200/45 blur-3xl sm:size-80" />
      <div className="absolute top-1/2 -left-20 size-64 -translate-y-1/2 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="absolute right-[15%] bottom-0 size-56 translate-y-1/3 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_75%_15%,rgb(59_130_246/0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_85%,rgb(14_165_233/0.08),transparent_50%)]" />
    </div>
  )
}
