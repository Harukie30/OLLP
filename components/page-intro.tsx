export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-blue-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgb(59_130_246/0.12),rgb(224_242_254/0.35)_50%,transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </section>
  )
}
