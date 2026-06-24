"use client"

import * as React from "react"

/**
 * PaletteWall — the Aurora palette made literal. Ported from the Claude Design
 * `aurora-site` home centerpiece. Every swatch is a live `var(--aurora-*)`
 * token, so it remaps automatically in light/dark; clicking a chip copies the
 * *resolved* hex (read at runtime, never hardcoded, so it can't drift from
 * `registry/aurora/styles/aurora.css`).
 */

interface Swatch {
  token: string
  name: string
  role: string
  /** marks an accent swatch (shows the "accent" badge) */
  strong?: boolean
}

interface Group {
  group: string
  swatches: Swatch[]
}

const PALETTE: Group[] = [
  {
    group: "Base · navy",
    swatches: [
      { token: "--aurora-page-bg", name: "Page", role: "Tier 0 · flat background" },
      { token: "--aurora-nav-bg", name: "Nav", role: "Sidebars · nav rails" },
      { token: "--aurora-control-surface", name: "Control", role: "Inputs · controls" },
      { token: "--aurora-panel-medium", name: "Panel medium", role: "Tier 1 · cards · headers" },
      { token: "--aurora-panel-strong", name: "Panel strong", role: "Tier 2 · inspectors" },
      { token: "--aurora-hover-bg", name: "Hover", role: "Hovered rows · menu items" },
    ],
  },
  {
    group: "Accent · cyan (primary)",
    swatches: [
      { token: "--aurora-accent-deep", name: "Deep", role: "Pressed · deep cyan" },
      { token: "--aurora-accent-primary", name: "Primary", role: "CTAs · focus · selection", strong: true },
      { token: "--aurora-accent-strong", name: "Strong", role: "Hover · lit emphasis" },
      { token: "--aurora-accent-button", name: "Button", role: "Filled hero action" },
    ],
  },
  {
    group: "Accent · rose (secondary)",
    swatches: [
      { token: "--aurora-accent-pink-deep", name: "Deep", role: "Pressed rose" },
      { token: "--aurora-accent-pink", name: "Rose", role: "Send · agent affordances", strong: true },
      { token: "--aurora-accent-pink-strong", name: "Strong", role: "Hover emphasis" },
      { token: "--aurora-accent-pink-button", name: "Button", role: "Filled rose action" },
    ],
  },
  {
    group: "Accent · violet (AI)",
    swatches: [
      { token: "--aurora-accent-violet-deep", name: "Deep", role: "Pressed violet" },
      { token: "--aurora-accent-violet", name: "Violet", role: "AI · automation identity", strong: true },
      { token: "--aurora-accent-violet-strong", name: "Strong", role: "Hover emphasis" },
      { token: "--aurora-accent-violet-button", name: "Button", role: "Filled violet action" },
    ],
  },
  {
    group: "Accent · axon orange (async)",
    swatches: [
      { token: "--axon-orange-deep", name: "Deep", role: "Pressed orange" },
      { token: "--axon-orange", name: "Orange", role: "Async · heavy jobs", strong: true },
      { token: "--axon-orange-strong", name: "Strong", role: "Hover emphasis" },
    ],
  },
  {
    group: "Status · muted, never neon",
    swatches: [
      { token: "--aurora-info", name: "Info", role: "Informational" },
      { token: "--aurora-success", name: "Success", role: "Healthy · complete" },
      { token: "--aurora-warn", name: "Warn", role: "Caution · degraded" },
      { token: "--aurora-error", name: "Error", role: "Failure · blocked" },
      { token: "--aurora-neutral", name: "Neutral", role: "Idle · inactive" },
    ],
  },
  {
    group: "Borders & text",
    swatches: [
      { token: "--aurora-border-default", name: "Border", role: "Separators · table rules" },
      { token: "--aurora-border-strong", name: "Border strong", role: "Cards · inputs · selected" },
      { token: "--aurora-text-primary", name: "Text", role: "Headings · body · labels" },
      { token: "--aurora-text-muted", name: "Text muted", role: "Captions · meta" },
    ],
  },
]

const ALL_TOKENS = PALETTE.flatMap((g) => g.swatches.map((s) => s.token))

function resolveHexes(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const cs = getComputedStyle(document.documentElement)
  const out: Record<string, string> = {}
  for (const t of ALL_TOKENS) out[t] = cs.getPropertyValue(t).trim()
  return out
}

export function PaletteWall() {
  const [hexes, setHexes] = React.useState<Record<string, string>>({})
  const [copied, setCopied] = React.useState<string | null>(null)
  const [light, setLight] = React.useState(false)

  // Resolve hexes after mount and whenever the html theme class flips.
  React.useEffect(() => {
    const sync = () => {
      setHexes(resolveHexes())
      setLight(document.documentElement.classList.contains("light"))
    }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  const copy = (token: string) => {
    const hex = hexes[token]
    if (!hex) return
    try {
      navigator.clipboard?.writeText(hex)
    } catch {
      /* clipboard unavailable — no-op */
    }
    setCopied(token)
    window.setTimeout(() => setCopied((c) => (c === token ? null : c)), 1100)
  }

  return (
    <section style={{ marginTop: "clamp(48px, 7vw, 84px)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <span className="aurora-text-eyebrow" style={{ color: "var(--aurora-text-muted)" }}>
            The palette
          </span>
          <h2
            style={{
              fontFamily: "var(--aurora-font-display)",
              fontWeight: 800,
              fontSize: "clamp(24px, 3vw, 30px)",
              letterSpacing: "-0.03em",
              margin: "8px 0 0",
              color: "var(--aurora-text-primary)",
            }}
          >
            Navy base, three accents, muted status
          </h2>
        </div>
        <span
          style={{
            fontSize: 12.5,
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-mono)",
          }}
        >
          {light ? "light remap" : "dark canon"} · click any chip to copy
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {PALETTE.map((grp) => (
          <div key={grp.group}>
            <div
              className="aurora-text-eyebrow"
              style={{ fontSize: 10, marginBottom: 10, color: "var(--aurora-text-muted)" }}
            >
              {grp.group}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {grp.swatches.map((s) => {
                const isC = copied === s.token
                const hex = hexes[s.token] || ""
                return (
                  <button
                    key={s.token}
                    type="button"
                    onClick={() => copy(s.token)}
                    title={`Copy ${hex || s.token}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: 116,
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: "var(--aurora-radius-2)",
                      border: "1px solid var(--aurora-border-default)",
                      overflow: "hidden",
                      background: `var(${s.token})`,
                      boxShadow: "var(--aurora-shadow-medium)",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        padding: 9,
                      }}
                    >
                      {s.strong ? (
                        <span
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "rgba(0,0,0,0.28)",
                            color: "#fff",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          accent
                        </span>
                      ) : null}
                    </div>
                    <div
                      style={{
                        padding: "9px 11px",
                        background: "color-mix(in srgb, var(--aurora-page-bg) 86%, transparent)",
                        backdropFilter: "blur(8px)",
                        borderTop: "1px solid var(--aurora-border-default)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 12.5,
                            color: "var(--aurora-text-primary)",
                          }}
                        >
                          {s.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--aurora-font-mono)",
                            fontSize: 10.5,
                            color: isC ? "var(--aurora-success)" : "var(--aurora-text-muted)",
                          }}
                        >
                          {isC ? "copied" : hex}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "var(--aurora-text-muted)",
                          marginTop: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {s.role}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PaletteWall
