import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Blocks, Palette, SlidersHorizontal, ArrowRight } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Badge } from "@/registry/aurora/ui/badge"
import { LabbyMark } from "@/components/labby-brand"
import { SpectrumBar } from "@/components/site/site-ui"
import { PaletteWall } from "@/components/site/palette-wall"
import { panelStrong, tint } from "@/components/site/style-tokens"
import { AURORA_THEMES, AURORA_SPECTRUM, type AuroraTheme } from "@/lib/themes"
import registry from "@/registry.json"

// Derive the component count from the registry source so the marketing copy
// can never drift from the actual number of published registry items.
const REGISTRY_ITEM_COUNT = registry.items.length
const UI_PRIMITIVE_COUNT = registry.items.filter((i) => i.type === "registry:ui").length
const BLOCK_COUNT = registry.items.filter((i) => i.type === "registry:block").length

export const metadata = {
  title: "Aurora — one palette, every surface",
  description:
    "An operator-grade, dark-first design system for agent products: a shadcn component registry, cross-platform tokens, and matching themes for your editor, terminal, browser, and shell.",
}

const PILLARS = [
  {
    icon: <Blocks size={20} strokeWidth={1.6} />,
    tone: "--aurora-accent-primary",
    title: "Components",
    body: `${REGISTRY_ITEM_COUNT} registry items — ${UI_PRIMITIVE_COUNT} UI primitives plus ${BLOCK_COUNT} composed AI, workspace, files, auth, and feedback blocks. Install one with the shadcn CLI.`,
    meta: "Open the gallery",
    href: "/gallery/buttons",
  },
  {
    icon: <Palette size={20} strokeWidth={1.6} />,
    tone: "--aurora-accent-pink",
    title: "Themes",
    body: "The same palette, hand-ported to your editor, terminal, browser, and shell — Zed, Warp, Claude Code, Chrome, and six shell tools.",
    meta: "11 themes, 4 surfaces",
    href: "/themes",
  },
  {
    icon: <SlidersHorizontal size={20} strokeWidth={1.6} />,
    tone: "--aurora-accent-violet",
    title: "Tokens",
    body: "One source of truth in CSS custom properties, exported to Android via Style Dictionary. Dark-first, with a verified light mode.",
    meta: "View the token contract",
    href: "/tokens",
  },
]

const STATS: [string, string, string][] = [
  ["3", "Editors", "Zed, Warp, Claude Code"],
  ["1", "Browser", "Chrome — dark + light"],
  ["6", "Shell", "p10k, statusline, bat, mc, nano, zsh"],
  ["2", "Modes", "dark-first, light verified"],
]

function byId(id: string): AuroraTheme {
  return AURORA_THEMES.find((t) => t.id === id) ?? AURORA_THEMES[0]
}
const BENTO = [
  { theme: byId("zed"), big: true },
  { theme: byId("warp") },
  { theme: byId("chrome-dark") },
  { theme: byId("p10k") },
  { theme: byId("claude-code") },
]

function BentoTile({ theme, big }: { theme: AuroraTheme; big?: boolean }) {
  return (
    <Link
      href="/themes"
      className={`aurora-bento-tile group relative overflow-hidden rounded-[var(--aurora-radius-3)] transition-all duration-200 hover:-translate-y-1 ${big ? "aurora-bento-big" : ""}`}
      style={panelStrong}
    >
      <Image
        src={theme.preview}
        alt={`${theme.name} — ${theme.tool}`}
        fill
        sizes={big ? "(max-width:760px) 100vw, 560px" : "(max-width:760px) 50vw, 280px"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5"
        style={{
          background:
            "linear-gradient(0deg, color-mix(in srgb, var(--aurora-page-bg) 92%, transparent), transparent)",
        }}
      >
        <div>
          <div className="aurora-text-section" style={{ fontSize: big ? 16 : 13, color: "var(--aurora-text-primary)" }}>
            {theme.name}
          </div>
          <div className="text-[11px]" style={{ color: "var(--aurora-text-muted)" }}>
            {theme.tool}
          </div>
        </div>
        {theme.badge && (
          <Badge tone={theme.badge.tone} size="sm">
            {theme.badge.label}
          </Badge>
        )}
      </div>
    </Link>
  )
}

export default function LandingPage() {
  return (
    <>
      <section className="relative py-20 text-center md:py-28">
        <div className="aurora-ribbon" aria-hidden />
        <div
          className="aurora-reveal relative mx-auto mb-7 w-fit"
          style={{
            filter: "drop-shadow(0 10px 30px color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent))",
          }}
        >
          <LabbyMark size={78} />
        </div>
        <h1 className="aurora-reveal aurora-text-display-hero mx-auto max-w-[18ch]" style={{ animationDelay: "60ms" }}>
          One palette.
          <br />
          <span className="aurora-gradient-text">Every surface.</span>
        </h1>
        <p className="aurora-reveal aurora-text-lead mx-auto mt-5 max-w-[640px]" style={{ animationDelay: "120ms" }}>
          Aurora is an operator-grade, dark-first design system for agent products — a shadcn component
          registry, cross-platform tokens, and matching themes for the editors, terminals, and tools you live in.
        </p>
        <div className="aurora-reveal mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "180ms" }}>
          <Button variant="aurora" size="lg" asChild>
            <Link href="/gallery/buttons">
              <Blocks size={16} strokeWidth={1.75} />
              Browse components
            </Link>
          </Button>
          <Button variant="rose" size="lg" asChild>
            <Link href="/themes">
              <Palette size={16} strokeWidth={1.75} />
              Explore themes
            </Link>
          </Button>
        </div>
        <div className="aurora-reveal mx-auto mt-8 w-fit max-w-full" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-3 rounded-[var(--aurora-radius-1)] py-2.5 pl-4 pr-3" style={panelStrong}>
            <span className="aurora-text-code" style={{ color: "var(--aurora-accent-primary)" }}>$</span>
            <code className="aurora-text-code truncate" style={{ color: "var(--aurora-text-primary)" }}>
              npx shadcn@latest add https://aurora.tootie.tv/r/aurora-tokens.json
            </code>
          </div>
        </div>
      </section>

      <div className="aurora-reveal mb-2 flex items-center gap-4" style={{ animationDelay: "300ms" }}>
        <span className="aurora-text-eyebrow shrink-0">Spectrum</span>
        <SpectrumBar colors={AURORA_SPECTRUM} className="!h-2 flex-1" />
      </div>

      <PaletteWall />

      <section className="mt-12 grid gap-[18px] md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Link
            key={p.title}
            href={p.href}
            className="aurora-reveal aurora-card group rounded-[var(--aurora-radius-3)] p-6 transition-all duration-200 hover:-translate-y-1"
            style={{ ...panelStrong, animationDelay: `${360 + i * 70}ms` }}
          >
            <div
              className="mb-4 grid size-11 place-items-center rounded-[14px]"
              style={{ background: tint(p.tone, 16), color: `var(${p.tone})`, border: `1px solid ${tint(p.tone, 34)}` }}
            >
              {p.icon}
            </div>
            <h3 className="aurora-text-section">{p.title}</h3>
            <p className="aurora-text-body-sm mb-4 mt-1.5" style={{ color: "var(--aurora-text-muted)" }}>
              {p.body}
            </p>
            <span
              className="aurora-text-control inline-flex items-center gap-1.5 transition-all group-hover:gap-2.5"
              style={{ color: "var(--aurora-accent-primary)" }}
            >
              {p.meta} <ArrowRight size={14} strokeWidth={2} />
            </span>
          </Link>
        ))}
      </section>

      <section className="pt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="aurora-text-eyebrow mb-2">Themes</div>
            <h2 className="aurora-text-display-2">Your whole workspace, in Aurora</h2>
            <p className="aurora-text-lead mt-2 max-w-[560px]">
              Not just the app — the navy base, cyan primary, rose secondary, and violet AI accents reach every
              tool you touch. Pick a surface and install in one line.
            </p>
          </div>
          <Button variant="neutral" asChild className="hidden shrink-0 sm:inline-flex">
            <Link href="/themes">
              See all themes <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </Button>
        </div>

        <div className="aurora-bento">
          {BENTO.map((b) => (
            <BentoTile key={b.theme.id} theme={b.theme} big={b.big} />
          ))}
        </div>

        <div className="mt-5 grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))" }}>
          {STATS.map(([n, t, l]) => (
            <div
              key={t}
              className="rounded-[var(--aurora-radius-2)] px-[18px] py-4"
              style={{
                background: "var(--aurora-panel-medium)",
                border: "1px solid var(--aurora-border-default)",
                boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
              }}
            >
              <div className="flex items-baseline gap-2">
                <div
                  style={{
                    fontFamily: "var(--aurora-font-display)",
                    fontSize: 30,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--aurora-text-primary)",
                  }}
                >
                  {n}
                </div>
                <div className="aurora-text-eyebrow">{t}</div>
              </div>
              <div className="aurora-text-caption mt-1.5" style={{ color: "var(--aurora-text-muted)" }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
