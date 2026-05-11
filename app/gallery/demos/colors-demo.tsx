"use client";

const COLOR_SECTIONS = [
  {
    label: "Brand tokens — identity",
    description: "Use cyan and rose for Aurora identity. Use violet to signal AI or automation emphasis. Never use brand tokens to communicate status.",
    tokens: [
      { name: "accent-primary", cssVar: "var(--aurora-accent-primary)" },
      { name: "accent-pink",    cssVar: "var(--aurora-accent-pink)" },
      { name: "accent-violet",  cssVar: "var(--aurora-accent-violet)" },
    ],
  },
  {
    label: "Semantic tokens — meaning",
    description: "Use these roles in component APIs instead of reaching for hue names. Each role ships a full surface / border / foreground family.",
    tokens: [
      { name: "info",    cssVar: "var(--aurora-info)" },
      { name: "success", cssVar: "var(--aurora-success)" },
      { name: "warn",    cssVar: "var(--aurora-warn)" },
      { name: "error",   cssVar: "var(--aurora-error)" },
      { name: "neutral", cssVar: "var(--aurora-neutral)" },
    ],
  },
  {
    label: "Interaction tokens — behavior",
    description: "Use these shared tokens for overlays, selection, disabled states, and pressed states.",
    tokens: [
      { name: "overlay",          cssVar: "var(--aurora-overlay)" },
      { name: "disabled-surface", cssVar: "var(--aurora-disabled-surface)" },
      { name: "subtle-bg",        cssVar: "var(--aurora-subtle-bg)" },
      { name: "selected-bg",      cssVar: "var(--aurora-selected-bg)" },
      { name: "pressed-bg",       cssVar: "var(--aurora-pressed-bg)" },
    ],
  },
];

export default function ColorsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Foundations
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Color tokens
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Aurora colors separate brand tokens for identity, semantic tokens for meaning, and interaction tokens for behavior. Reach for semantic roles in component APIs — never use brand tokens to communicate state.
        </p>
      </div>

      {COLOR_SECTIONS.map((section) => (
        <div key={section.label}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 4 }}>
            {section.label}
          </p>
          <p style={{ fontSize: 12, color: "var(--aurora-text-muted)", marginBottom: 12, lineHeight: 1.5 }}>
            {section.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {section.tokens.map((token) => (
              <div key={token.name} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 112 }}>
                <div
                  style={{
                    width: 112,
                    height: 60,
                    borderRadius: 14,
                    background: token.cssVar,
                    border: "1px solid var(--aurora-border-default)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--aurora-text-primary)", margin: 0, lineHeight: 1.4 }}>
                    {token.name}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--aurora-text-muted)", margin: 0, fontFamily: "var(--aurora-font-mono)", lineHeight: 1.4 }}>
                    --aurora-{token.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
