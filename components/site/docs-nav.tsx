"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Box, Droplet, Feather, Layers, Rocket, Wrench } from "lucide-react"

/** Docs sub-nav — ported from the CD `aurora-site` DocsView sidebar. */

export const DOC_PAGES = [
  { id: "start", label: "Getting started", href: "/docs", icon: Rocket },
  { id: "install", label: "Installation", href: "/docs/install", icon: Box },
  { id: "foundations", label: "Foundations", href: "/docs/foundations", icon: Layers },
  { id: "theming", label: "Theming", href: "/docs/theming", icon: Droplet },
  { id: "voice", label: "Voice & content", href: "/docs/voice", icon: Feather },
  { id: "contribute", label: "Contributing", href: "/docs/contribute", icon: Wrench },
] as const

export function DocsNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-[3px] md:sticky md:top-[78px]">
      <span className="aurora-text-eyebrow px-[11px] pb-2" style={{ fontSize: 10 }}>
        Documentation
      </span>
      {DOC_PAGES.map((p) => {
        const active = pathname === p.href
        const Ic = p.icon
        return (
          <Link
            key={p.id}
            href={p.href}
            className="aurora-text-control flex items-center gap-2 rounded-[9px] px-[11px] py-[7px] transition-colors hover:bg-[var(--aurora-hover-bg)]"
            style={{
              color: active ? "var(--aurora-accent-strong)" : "var(--aurora-text-muted)",
              background: active
                ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-control-surface))"
                : undefined,
              boxShadow: active ? "var(--aurora-active-glow)" : undefined,
            }}
          >
            <Ic size={15} strokeWidth={1.6} />
            {p.label}
          </Link>
        )
      })}
    </nav>
  )
}
