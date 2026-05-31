"use client"

import * as React from "react"
import Image from "next/image"
import { Code2, Globe, TerminalSquare, Download, BookText } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Badge } from "@/registry/aurora/ui/badge"
import { SpectrumBar, CopyLine } from "@/components/site/site-ui"
import { panelStrong, tint } from "@/components/site/style-tokens"
import {
  AURORA_THEMES,
  THEME_CATEGORIES,
  themeCounts,
  type AuroraTheme,
  type ThemeCategory,
} from "@/lib/themes"

const CAT_ICON: Record<ThemeCategory, React.ReactNode> = {
  editors: <Code2 size={15} strokeWidth={1.7} />,
  browser: <Globe size={15} strokeWidth={1.7} />,
  shell: <TerminalSquare size={15} strokeWidth={1.7} />,
}

function ThemeCard({ t, i }: { t: AuroraTheme; i: number }) {
  return (
    <div
      className="aurora-reveal aurora-card group flex flex-col overflow-hidden rounded-[var(--aurora-radius-3)] transition-all duration-200 hover:-translate-y-1"
      style={{ ...panelStrong, animationDelay: `${i * 55}ms` }}
    >
      <div
        className="relative aspect-[720/340] w-full overflow-hidden"
        style={{ borderBottom: "1px solid var(--aurora-border-strong)" }}
      >
        <Image
          src={t.preview}
          alt={`${t.name} — ${t.tool}`}
          fill
          sizes="(max-width:760px) 100vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-[18px]">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <h3 className="aurora-text-section" style={{ fontSize: 16 }}>
              {t.name}
            </h3>
            <div className="mt-0.5 text-xs" style={{ color: "var(--aurora-text-muted)" }}>
              {t.tool}
            </div>
          </div>
          {t.badge && (
            <Badge tone={t.badge.tone} dot>
              {t.badge.label}
            </Badge>
          )}
        </div>
        <SpectrumBar colors={t.spectrum} />
        <p className="flex-1 text-[13px]" style={{ color: "var(--aurora-text-muted)" }}>
          {t.description}
        </p>
        <CopyLine cmd={t.install} />
        <div className="flex gap-2">
          <Button variant="aurora" size="sm" className="flex-1" asChild>
            <a href={t.download} target="_blank" rel="noreferrer">
              <Download size={14} strokeWidth={1.75} />
              Download
            </a>
          </Button>
          <Button variant="neutral" size="sm" className="flex-1" asChild>
            <a href={t.readme} target="_blank" rel="noreferrer">
              <BookText size={14} strokeWidth={1.75} />
              README
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ThemesGrid() {
  const [cat, setCat] = React.useState<ThemeCategory>("editors")

  React.useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat")
    if (c === "editors" || c === "browser" || c === "shell") setCat(c)
  }, [])

  const shown = AURORA_THEMES.filter((t) => t.category === cat)

  return (
    <section className="pt-12">
      <div className="aurora-reveal aurora-text-eyebrow mb-2.5">Themes</div>
      <h1 className="aurora-reveal aurora-text-display-2 mb-2" style={{ animationDelay: "50ms" }}>
        Aurora everywhere you work
      </h1>
      <p
        className="aurora-reveal mb-7 max-w-[620px]"
        style={{ animationDelay: "100ms", color: "var(--aurora-text-muted)" }}
      >
        Each theme hand-ports the canonical Aurora palette into a tool&apos;s native format. Source lives in{" "}
        <span className="font-mono text-[13px]" style={{ color: "var(--aurora-text-primary)" }}>
          themes/
        </span>
        ; served copies install straight from{" "}
        <span className="font-mono text-[13px]" style={{ color: "var(--aurora-text-primary)" }}>
          aurora.tootie.tv
        </span>
        .
      </p>

      <div
        className="aurora-reveal mb-7 inline-flex flex-wrap gap-1 rounded-xl p-1"
        style={{
          animationDelay: "150ms",
          background: "var(--aurora-panel-medium)",
          border: "1px solid var(--aurora-border-default)",
          boxShadow: "var(--aurora-highlight-medium)",
        }}
      >
        {THEME_CATEGORIES.map((c) => {
          const active = cat === c.id
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className="inline-flex items-center gap-1.5 rounded-[9px] border px-4 py-2 text-[13px] font-[560] transition-colors"
              style={{
                color: active ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
                background: active ? "var(--aurora-control-surface)" : "transparent",
                borderColor: active ? tint("--aurora-accent-primary", 30) : "transparent",
                boxShadow: active ? `0 0 0 1px ${tint("--aurora-accent-primary", 12)}` : "none",
              }}
            >
              {CAT_ICON[c.id]}
              {c.label}
              <span
                className="ml-0.5 font-mono text-[11px]"
                style={{ color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)" }}
              >
                {themeCounts[c.id]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-[18px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))" }}>
        {shown.map((t, i) => (
          <ThemeCard key={t.id} t={t} i={i} />
        ))}
      </div>

      <p className="mt-7 text-xs" style={{ color: "var(--aurora-text-muted)" }}>
        Previews are palette-faithful renders from each theme&apos;s real colors. Source of truth:{" "}
        <span className="font-mono">registry/aurora/styles/aurora.css</span>.
      </p>
    </section>
  )
}
