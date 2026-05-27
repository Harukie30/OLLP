import Image from "next/image"
import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MinistryAccent } from "@/lib/church-content"
import { cn } from "@/lib/utils"

const accentStyles: Record<
  MinistryAccent,
  { banner: string; icon: string; chip: string; ring: string }
> = {
  sky: {
    banner: "bg-gradient-to-br from-sky-100/90 via-sky-50 to-white",
    icon: "bg-sky-500/15 text-sky-700 ring-sky-200/70",
    chip: "border-sky-200/80 bg-sky-50 text-sky-900",
    ring: "ring-sky-100/90 hover:ring-sky-200/90",
  },
  amber: {
    banner: "bg-gradient-to-br from-amber-100/80 via-amber-50/90 to-white",
    icon: "bg-amber-500/15 text-amber-800 ring-amber-200/70",
    chip: "border-amber-200/80 bg-amber-50 text-amber-950",
    ring: "ring-amber-100/90 hover:ring-amber-200/80",
  },
  slate: {
    banner: "bg-gradient-to-br from-slate-200/70 via-slate-50 to-white",
    icon: "bg-slate-600/10 text-slate-800 ring-slate-200/70",
    chip: "border-slate-200/80 bg-slate-50 text-slate-900",
    ring: "ring-slate-100 hover:ring-slate-200/80",
  },
  rose: {
    banner: "bg-gradient-to-br from-rose-100/70 via-rose-50/80 to-white",
    icon: "bg-rose-500/12 text-rose-800 ring-rose-200/60",
    chip: "border-rose-200/80 bg-rose-50/90 text-rose-950",
    ring: "ring-rose-100/90 hover:ring-rose-200/80",
  },
}

type MinistryCardProps = {
  title: string
  description: string
  icon: LucideIcon
  image: { src: string; alt: string }
  schedule?: string
  joinLabel?: string
  accent: MinistryAccent
}

export function MinistryCard({
  title,
  description,
  icon: Icon,
  image,
  schedule,
  joinLabel,
  accent,
}: MinistryCardProps) {
  const styles = accentStyles[accent]

  return (
    <Card
      className={cn(
        "h-full overflow-hidden border-0 bg-white/90 py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        styles.ring
      )}
    >
      <div
        className={cn(
          "flex h-36 items-center justify-center border-b border-blue-100/60 px-6 sm:h-40",
          styles.banner
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={200}
          height={120}
          className="max-h-24 w-auto max-w-[85%] object-contain drop-shadow-sm sm:max-h-28"
        />
      </div>
      <CardHeader className="gap-2 pt-5">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg ring-1",
              styles.icon
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg text-blue-950">{title}</CardTitle>
            {schedule ? (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {schedule}
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed text-blue-950/75">
          {description}
        </CardDescription>
      </CardContent>
      {joinLabel ? (
        <CardFooter className="border-t border-blue-50 bg-sky-50/30 py-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
              styles.chip
            )}
          >
            {joinLabel}
          </span>
        </CardFooter>
      ) : null}
    </Card>
  )
}
