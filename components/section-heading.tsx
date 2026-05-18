export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as = "h2",
}: {
  eyebrow: string
  title: string
  description: string
  className?: string
  as?: "h1" | "h2"
}) {
  const TitleTag = as

  return (
    <div className={className}>
      <p className="text-sm font-medium tracking-wide text-primary uppercase">
        {eyebrow}
      </p>
      <TitleTag className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </TitleTag>
      <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
        {description}
      </p>
    </div>
  )
}
