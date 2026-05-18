import Image from "next/image"
import { cn } from "@/lib/utils"
import { siteLogo } from "@/lib/site"

const sizeMap = {
  sm: { className: "size-9", px: 36 },
  md: { className: "size-10", px: 40 },
  lg: { className: "size-14", px: 56 },
} as const

export function SiteLogo({
  size = "md",
  className,
  priority = false,
}: {
  size?: keyof typeof sizeMap
  className?: string
  priority?: boolean
}) {
  const { className: sizeClass, px } = sizeMap[size]

  return (
    <Image
      src={siteLogo.src}
      alt={siteLogo.alt}
      width={px}
      height={px}
      priority={priority}
      className={cn(
        "shrink-0 rounded-full object-cover ring-2 ring-blue-100",
        sizeClass,
        className
      )}
    />
  )
}
