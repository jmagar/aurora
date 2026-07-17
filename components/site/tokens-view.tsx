"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { panelStrong } from "@/components/site/style-tokens"
import { useClipboard } from "@/lib/use-clipboard"

/* ── token data — names map 1:1 to Aurora-owned custom properties ── */

const SURFACES = [
  ["page-bg", "Page background (flat Tier 0)"],
  ["nav-bg", "Sidebars, nav rails"],
  ["panel-medium", "Tier 1 — toolbars, headers, cards"],
  ["panel-strong", "Tier 2 — inspectors, primary panels"],
  ["control-surface", "Input / control backgrounds"],
  ["hover-bg", "Hovered rows, menu items"],
] as const

const BORDERS = [
  ["border-default", "Resting separators, table rules"],
  ["border-strong", "Cards, inputs, selected surfaces"],
] as const

const TEXT = [
  ["text-primary", "Headings, body, control labels"],
  ["text-muted", "Captions, meta, descriptions"],
] as const

const ACCENTS = [
  { fam: "Cyan — Primary", base: "accent-primary", ramp: ["accent-deep", "accent-primary", "accent-strong"], use: "Primary CTAs, selection, focus, active state." },
  { fam: "Rose — Secondary", base: "accent-pink", ramp: ["accent-pink-deep", "accent-pink", "accent-pink-strong"], use: "Agent / send affordances, key labels, active filter tags. One or two touch points per screen." },
  { fam: "Axon Orange — AI / Automation", base: "axon-orange", ramp: ["axon-orange-deep", "axon-orange", "axon-orange-strong"], use: "AI / automation identity — model selectors, reasoning, autonomous actions." },
] as const

const STATUS = [
  ["info", "Informational, in-progress"],
  ["success", "Healthy, online, passed"],
  ["warn", "Degraded, attention"],
  ["error", "Failed, destructive"],
  ["neutral", "Idle, disabled, offline"],
] as const

const RADII = [
  ["radius-1", "14px", "Chips, buttons"],
  ["radius-2", "18px", "Small cards, popovers"],
  ["radius-3", "22px", "Panels (Tier 1, Tier 2)"],
] as const

const ELEVATION = [
  ["shadow-medium", "highlight-medium", "Tier 1 surfaces"],
  ["shadow-strong", "highlight-strong", "Tier 2 surfaces"],
] as const

const TYPE_RAMP: { cls: string; label: string; sample: string; note: string }[] = [
  { cls: "aurora-text-display-hero", label: "Display Hero", sample: "One palette", note: "Manrope 800 · marketing heroes" },
  { cls: "aurora-text-display-1", label: "Display 1", sample: "Active gateways", note: "Manrope 800 · page heroes, big numbers" },
  { cls: "aurora-text-display-2", label: "Display 2", sample: "Authorization", note: "Manrope 700 · section heroes" },
  { cls: "aurora-text-section", label: "Section", sample: "Production edge gateway", note: "Manrope 760 · section headers, card titles" },
  { cls: "aurora-text-lead", label: "Lead", sample: "Operator-grade design system for agent products.", note: "Inter 480 · intro paragraphs" },
  { cls: "aurora-text-body", label: "Body", sample: "Gateway connection lost. Retrying in 30 seconds.", note: "Inter 480 · 14px · default body" },
  { cls: "aurora-text-body-sm", label: "Body Small", sample: "Read-only mode — changes require admin approval.", note: "Inter 480 · 13px · compact body" },
  { cls: "aurora-text-ui", label: "UI", sample: "Deploy plugin", note: "Inter 560 · 13px · working UI text" },
  { cls: "aurora-text-control", label: "Control", sample: "Run query", note: "Inter 560 · control labels, buttons" },
  { cls: "aurora-text-label", label: "Label", sample: "Gateway name", note: "Inter 650 · 12px · form labels" },
  { cls: "aurora-text-caption", label: "Caption", sample: "Updated 2 minutes ago", note: "Inter 560 · 11px · captions" },
  { cls: "aurora-text-meta", label: "Meta", sample: "production-edge.lab.local", note: "Inter 560 · 11px muted · metadata" },
  { cls: "aurora-text-eyebrow", label: "Eyebrow", sample: "Gateway cluster", note: "Inter 650 · 11px uppercase · eyebrows" },
  { cls: "aurora-text-code", label: "Code", sample: "npx shadcn@latest add", note: "JetBrains Mono · code, IDs, paths" },
]

const tokenVar = (n: string) => n.startsWith("axon-") ? `--${n}` : `--aurora-${n}`
const v = (n: string) => `var(${tokenVar(n)})`

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="aurora-reveal">
      <div className="aurora-text-eyebrow mb-2">{eyebrow}</div>
      <h2 className="aurora-text-display-2 mb-5">{title}</h2>
      {children}
    </section>
  )
}

function TokenName({ name }: { name: string }) {
  const { copied, error, copy } = useClipboard(1100)
  const full = tokenVar(name)
  return (
    <button
      type="button"
      onClick={() => void copy(full)}
      aria-label={copied ? `Copied ${full}` : error ? `Unable to copy ${full}` : `Copy ${full}`}
      className="aurora-text-code inline-flex items-center gap-1.5"
      style={{ color: "var(--aurora-text-muted)", fontSize: 11.5 }}
      title="Copy token name"
    >
      {full}
      {copied ? <Check size={11} strokeWidth={2} style={{ color: "var(--aurora-success)" }} /> : <Copy size={11} strokeWidth={1.6} style={{ color: error ? "var(--aurora-error)" : undefined, opacity: 0.6 }} />}
    </button>
  )
}

function Swatch({ name, desc, height = 60 }: { name: string; desc: string; height?: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        style={{
          height, borderRadius: 12, background: v(name),
          border: "1px solid var(--aurora-border-default)",
          boxShadow: "var(--aurora-highlight-medium)",
        }}
      />
      <div>
        <div className="aurora-text-ui" style={{ color: "var(--aurora-text-primary)" }}>{name}</div>
        <div className="aurora-text-caption mb-1" style={{ color: "var(--aurora-text-muted)" }}>{desc}</div>
        <TokenName name={name} />
      </div>
    </div>
  )
}

export function TokensView() {
  return (
    <div className="flex flex-col gap-16 pt-12 pb-4">
      <header className="aurora-reveal relative">
        <div className="aurora-ribbon" aria-hidden style={{ height: 320 }} />
        <div className="relative">
          <div className="aurora-text-eyebrow mb-2.5">Foundations</div>
          <h1 className="aurora-text-display-1 mb-3">Tokens</h1>
          <p className="aurora-text-lead max-w-[640px]">
            Every Aurora surface reads from these CSS custom properties — declared once in{" "}
            <span className="aurora-text-code" style={{ color: "var(--aurora-text-primary)" }}>registry/aurora/styles/aurora.css</span>{" "}
            for dark and light. Click any token name to copy it. Never hard-code hex in product code.
          </p>
        </div>
      </header>

      <Section eyebrow="Color" title="Surfaces & Borders">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {SURFACES.map(([n, d]) => <Swatch key={n} name={n} desc={d} />)}
          {BORDERS.map(([n, d]) => <Swatch key={n} name={n} desc={d} />)}
        </div>
      </Section>

      <Section eyebrow="Color" title="Text">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {TEXT.map(([n, d]) => (
            <div key={n} className="flex flex-col gap-2">
              <div
                className="grid place-items-center"
                style={{ height: 60, borderRadius: 12, background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)" }}
              >
                <span style={{ color: v(n), fontWeight: 700, fontSize: 18, fontFamily: "var(--aurora-font-display)" }}>Aa</span>
              </div>
              <div>
                <div className="aurora-text-ui" style={{ color: "var(--aurora-text-primary)" }}>{n}</div>
                <div className="aurora-text-caption mb-1" style={{ color: "var(--aurora-text-muted)" }}>{d}</div>
                <TokenName name={n} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Color" title="Accents">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {ACCENTS.map((a) => (
            <div key={a.fam} className="rounded-[var(--aurora-radius-3)] p-5" style={panelStrong}>
              <div className="aurora-text-section mb-1" style={{ fontSize: 15 }}>{a.fam}</div>
              <p className="aurora-text-caption mb-4" style={{ color: "var(--aurora-text-muted)" }}>{a.use}</p>
              <div className="flex overflow-hidden rounded-[10px]" style={{ height: 44, border: "1px solid var(--aurora-border-default)" }}>
                {a.ramp.map((r) => <div key={r} style={{ flex: 1, background: v(r) }} title={tokenVar(r)} />)}
              </div>
              <div className="mt-2"><TokenName name={a.base} /></div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Color" title="Status — Muted, Never Neon">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {STATUS.map(([n, d]) => (
            <div key={n} className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2.5 px-3"
                style={{
                  height: 60, borderRadius: 12,
                  background: v(`${n}-surface`),
                  border: `1px solid ${v(`${n}-border`)}`,
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 999, background: v(n), boxShadow: `0 0 6px ${v(n)}` }} />
                <span className="aurora-text-control" style={{ color: v(`${n}-foreground`) }}>{n}</span>
              </div>
              <div>
                <div className="aurora-text-caption mb-1" style={{ color: "var(--aurora-text-muted)" }}>{d}</div>
                <TokenName name={n} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Typography" title="Type Ramp">
        <div className="overflow-hidden rounded-[var(--aurora-radius-3)]" style={panelStrong}>
          {TYPE_RAMP.map((row, i) => (
            <div
              key={row.cls}
              className="grid items-center gap-5 px-6 py-4"
              style={{
                gridTemplateColumns: "150px 1fr",
                borderBottom: i < TYPE_RAMP.length - 1 ? "1px solid var(--aurora-border-default)" : "none",
              }}
            >
              <div>
                <div className="aurora-text-label" style={{ color: "var(--aurora-text-primary)" }}>{row.label}</div>
                <div className="aurora-text-meta mt-0.5">{row.note}</div>
              </div>
              <div className={row.cls} style={{ color: "var(--aurora-text-primary)", minWidth: 0 }}>{row.sample}</div>
            </div>
          ))}
        </div>
        <p className="aurora-text-caption mt-3" style={{ color: "var(--aurora-text-muted)" }}>
          Manrope for display, Inter for working UI, JetBrains Mono only for code, paths, IDs, and hashes.
        </p>
      </Section>

      <Section eyebrow="Shape" title="Radii">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {RADII.map(([n, val, use]) => (
            <div key={n} className="flex items-center gap-4 rounded-[var(--aurora-radius-2)] p-4" style={{ background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-default)" }}>
              <div
                style={{
                  width: 56, height: 56, flexShrink: 0,
                  borderRadius: v(n),
                  background: "color-mix(in srgb, var(--aurora-accent-primary) 18%, var(--aurora-control-surface))",
                  border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 38%, transparent)",
                }}
              />
              <div>
                <div className="aurora-text-ui" style={{ color: "var(--aurora-text-primary)" }}>{n} <span className="aurora-text-code" style={{ color: "var(--aurora-text-muted)" }}>{val}</span></div>
                <div className="aurora-text-caption mb-1" style={{ color: "var(--aurora-text-muted)" }}>{use}</div>
                <TokenName name={n} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Elevation" title="Shadows & Highlights">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {ELEVATION.map(([shadow, highlight, use]) => (
            <div key={shadow} className="flex flex-col gap-3">
              <div
                style={{
                  height: 90, borderRadius: "var(--aurora-radius-3)",
                  background: "var(--aurora-panel-strong)",
                  border: "1px solid var(--aurora-border-strong)",
                  boxShadow: `${v(shadow)}, ${v(highlight)}`,
                }}
              />
              <div>
                <div className="aurora-text-ui" style={{ color: "var(--aurora-text-primary)" }}>{use}</div>
                <div className="mt-1 flex flex-col gap-0.5">
                  <TokenName name={shadow} />
                  <TokenName name={highlight} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="aurora-text-caption mt-3" style={{ color: "var(--aurora-text-muted)" }}>
          Pair an inset highlight with every shadow — flat-shadowed panels read as plastic without it.
        </p>
      </Section>

      <Section eyebrow="Install" title="Use the Tokens">
        <div className="rounded-[var(--aurora-radius-3)] p-5" style={panelStrong}>
          <p className="aurora-text-body-sm mb-3" style={{ color: "var(--aurora-text-muted)" }}>
            Install the token layer first; every component reads from it.
          </p>
          <div className="flex items-center gap-3 rounded-[var(--aurora-radius-1)] px-4 py-2.5" style={{ background: "var(--aurora-control-surface)", border: "1px solid var(--aurora-border-default)" }}>
            <span className="aurora-text-code" style={{ color: "var(--aurora-accent-primary)" }}>$</span>
            <code className="aurora-text-code truncate" style={{ color: "var(--aurora-text-primary)" }}>
              npx shadcn@latest add https://aurora.tootie.tv/r/aurora-tokens.json
            </code>
          </div>
        </div>
      </Section>
    </div>
  )
}
