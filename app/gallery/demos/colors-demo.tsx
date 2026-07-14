"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"

const COLOR_SECTIONS = [
  {
    label: "Brand tokens - identity",
    description: "Use cyan and rose for Aurora identity. Use Axon orange to signal AI or automation emphasis. Never use brand tokens to communicate status.",
    tokens: [
      { name: "accent-primary", cssVar: "var(--aurora-accent-primary)" },
      { name: "accent-pink", cssVar: "var(--aurora-accent-pink)" },
      { name: "axon-orange", cssVar: "var(--axon-orange)" },
    ],
  },
  {
    label: "Semantic tokens - meaning",
    description: "Use these roles in component APIs instead of reaching for hue names. Each role ships a full surface / border / foreground family.",
    tokens: [
      { name: "info", cssVar: "var(--aurora-info)" },
      { name: "success", cssVar: "var(--aurora-success)" },
      { name: "warn", cssVar: "var(--aurora-warn)" },
      { name: "error", cssVar: "var(--aurora-error)" },
      { name: "neutral", cssVar: "var(--aurora-neutral)" },
    ],
  },
  {
    label: "Interaction tokens - behavior",
    description: "Use these shared tokens for overlays, selection, disabled states, and pressed states.",
    tokens: [
      { name: "overlay", cssVar: "var(--aurora-overlay)" },
      { name: "disabled-surface", cssVar: "var(--aurora-disabled-surface)" },
      { name: "subtle-bg", cssVar: "var(--aurora-subtle-bg)" },
      { name: "selected-bg", cssVar: "var(--aurora-selected-bg)" },
      { name: "pressed-bg", cssVar: "var(--aurora-pressed-bg)" },
    ],
  },
]

export default function ColorsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <GalleryPageIntro
        eyebrow="Foundations"
        heading="Color Tokens"
        description="Aurora colors separate brand tokens for identity, semantic tokens for meaning, and interaction tokens for behavior."
      />

      {COLOR_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="aurora-demo-label" style={{ marginBottom: 4 }}>
            {section.label}
          </p>
          <p style={{ fontSize: 12, color: "var(--aurora-text-muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
            {section.description}
          </p>
          <div className="aurora-demo-swatch-grid">
            {section.tokens.map((token) => (
              <div key={token.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2 / 1",
                    minHeight: 52,
                    borderRadius: 12,
                    background: token.cssVar,
                    border: "1px solid var(--aurora-border-default)",
                  }}
                />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--aurora-text-primary)", margin: 0, lineHeight: 1.4 }}>
                    {token.name}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--aurora-text-muted)", margin: 0, fontFamily: "var(--aurora-font-mono)", lineHeight: 1.4 }}>
                    {token.name.startsWith("axon-") ? `--${token.name}` : `--aurora-${token.name}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
