import type { ComponentType, ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react"

import { SiteLogo } from "@/components/site-logo"
import { Button } from "@/components/ui/button"
import {
  address,
  churchName,
  churchShortName,
  contactEmail,
  navLinks,
  officeHours,
  serviceSummary,
} from "@/lib/site"

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/plan-a-visit", label: "Plan a visit" },
  ...navLinks.filter((link) => link.href !== "#contact"),
]

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-blue-50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,rgb(56_189_248/0.2),transparent_55%),radial-gradient(ellipse_60%_50%_at_0%_100%,rgb(255_255_255/0.06),transparent_50%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <SiteLogo
                size="md"
                className="bg-white ring-2 ring-white/25"
              />
              <span>
                <span className="block font-semibold text-white">
                  {churchShortName}
                </span>
                <span className="block text-sm text-blue-100/80">Church</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100/90 text-pretty">
              A welcoming church, family worship, build community, and grow in faith in
              Jesus. We&apos;d love to meet you.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-100 ring-1 ring-white/10">
              <Clock className="size-3.5 text-sky-300" />
              {serviceSummary}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="lg:col-span-2"
          >
            <FooterHeading>Explore</FooterHeading>
            <ul className="mt-4 flex flex-col gap-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-4 flex flex-col gap-3">
              <ContactItem icon={MapPin} label="Address">
                {address.line}
              </ContactItem>
              <ContactItem icon={Clock} label="Office hours">
                {officeHours}
              </ContactItem>
              <ContactItem
                icon={Mail}
                label="Email"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </ContactItem>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm sm:p-6">
              <FooterHeading className="text-sky-200">
                First time visiting?
              </FooterHeading>
              <p className="mt-2 text-sm leading-relaxed text-blue-100/90">
                Tell us you&apos;re coming and our welcome team will be ready
                for you.
              </p>
              <Button
                size="lg"
                className="mt-5 w-full sm:w-auto"
                asChild
              >
                <Link href="/plan-a-visit">
                  Plan a visit
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-blue-100/70">
            © {new Date().getFullYear()} {churchName}. All rights reserved.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="text-sm text-sky-200 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            {contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}

function FooterHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-xs font-semibold tracking-widest text-sky-300 uppercase ${className ?? ""}`}
    >
      {children}
    </p>
  )
}

const footerLinkClass =
  "text-sm text-blue-50/90 transition-colors hover:text-white hover:underline hover:underline-offset-4"

function ContactItem({
  icon: Icon,
  label,
  children,
  href,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  children: ReactNode
  href?: string
}) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300 ring-1 ring-white/10">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-sky-200/90">
          {label}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-blue-50/95">
          {children}
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <li>
        <a
          href={href}
          className="group flex gap-3 rounded-lg p-1 -m-1 transition-colors hover:bg-white/5"
        >
          {content}
        </a>
      </li>
    )
  }

  return (
    <li className="flex gap-3">
      {content}
    </li>
  )
}
