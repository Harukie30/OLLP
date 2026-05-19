import Image from "next/image"

export function AboutImageBackdrop({
  src,
  position,
}: {
  src: string
  position: string
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-[1.02] object-cover blur-[0.70px]"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-sky-50/78 to-white/94" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_12%_18%,rgb(255_255_255/0.96),transparent_52%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </div>
  )
}
