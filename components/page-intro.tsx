import Image from "next/image"

export function PageIntro({
  eyebrow,
  title,
  description,
  backgroundImage,
  backgroundImagePosition = "68% center",
}: {
  eyebrow: string
  title: string
  description: string
  backgroundImage?: string
  /** CSS object-position, e.g. "right center" or "75% 25%". */
  backgroundImagePosition?: string
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-blue-100">
      {backgroundImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.02] object-cover blur-[0.70px]"
            style={{ objectPosition: backgroundImagePosition }}
          />
          <div className="absolute inset-0 bg-white/5" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-sky-50/88 to-white/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_90%_at_12%_45%,rgb(255_255_255/0.97),transparent_58%)]" />
        </div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgb(59_130_246/0.12),rgb(224_242_254/0.35)_50%,transparent)]"
        />
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
        <h1
          className={
            backgroundImage
              ? "mt-2 text-4xl font-semibold tracking-tight text-balance text-blue-950 sm:text-5xl"
              : "mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          }
        >
          {title}
        </h1>
        <p
          className={
            backgroundImage
              ? "mt-4 max-w-2xl text-lg text-blue-900/75 text-pretty"
              : "mt-4 max-w-2xl text-lg text-muted-foreground text-pretty"
          }
        >
          {description}
        </p>
      </div>
    </section>
  )
}
