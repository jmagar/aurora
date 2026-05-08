"use client";

const COLOR_SECTIONS = [
  {
    label: "Surfaces",
    tokens: [
      { name: "page-bg",         cssVar: "var(--aurora-page-bg)" },
      { name: "nav-bg",          cssVar: "var(--aurora-nav-bg)" },
      { name: "panel-medium",    cssVar: "var(--aurora-panel-medium)" },
      { name: "panel-strong",    cssVar: "var(--aurora-panel-strong)" },
      { name: "control-surface", cssVar: "var(--aurora-control-surface)" },
      { name: "hover-bg",        cssVar: "var(--aurora-hover-bg)" },
    ],
  },
  {
    label: "Primary accent",
    tokens: [
      { name: "accent-primary", cssVar: "var(--aurora-accent-primary)" },
      { name: "accent-strong",  cssVar: "var(--aurora-accent-strong)" },
      { name: "accent-deep",    cssVar: "var(--aurora-accent-deep)" },
    ],
  },
  {
    label: "Secondary accent",
    tokens: [
      { name: "accent-pink",        cssVar: "var(--aurora-accent-pink)" },
      { name: "accent-pink-strong", cssVar: "var(--aurora-accent-pink-strong)" },
      { name: "accent-pink-deep",   cssVar: "var(--aurora-accent-pink-deep)" },
    ],
  },
  {
    label: "Status",
    tokens: [
      { name: "success", cssVar: "var(--aurora-success)" },
      { name: "warn",    cssVar: "var(--aurora-warn)" },
      { name: "error",   cssVar: "var(--aurora-error)" },
    ],
  },
  {
    label: "Borders",
    tokens: [
      { name: "border-default", cssVar: "var(--aurora-border-default)" },
      { name: "border-strong",  cssVar: "var(--aurora-border-strong)" },
    ],
  },
  {
    label: "Text",
    tokens: [
      { name: "text-primary", cssVar: "var(--aurora-text-primary)" },
      { name: "text-muted",   cssVar: "var(--aurora-text-muted)" },
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
          Aurora CSS custom properties that drive every surface, accent, status indicator, and text style across Labby.
        </p>
      </div>

      {COLOR_SECTIONS.map((section) => (
        <div key={section.label}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 12 }}>
            {section.label}
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
