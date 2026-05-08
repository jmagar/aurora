"use client";

const TYPE_ROWS = [
  {
    label: "Display 1",
    meta: "34px · 800 · -0.045em",
    style: {
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: "-0.045em",
      lineHeight: 1.1,
      color: "var(--aurora-text-primary)",
      fontFamily: "var(--aurora-font-display, Inter, sans-serif)",
    },
    text: "Active gateways",
  },
  {
    label: "Display 2",
    meta: "19px · 700",
    style: {
      fontSize: 19,
      fontWeight: 700,
      color: "var(--aurora-text-primary)",
      fontFamily: "var(--aurora-font-display, Inter, sans-serif)",
    },
    text: "Authorization",
  },
  {
    label: "Compact title",
    meta: "17px · 800",
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: "var(--aurora-text-primary)",
      fontFamily: "var(--aurora-font-display, Inter, sans-serif)",
    },
    text: "Backend unavailable",
  },
  {
    label: "Card title",
    meta: "15px · 800",
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: "var(--aurora-text-primary)",
      fontFamily: "var(--aurora-font-display, Inter, sans-serif)",
    },
    text: "Production edge gateway",
  },
  {
    label: "Metric",
    meta: "28px · 800 · tabular-nums",
    style: {
      fontSize: 28,
      fontWeight: 800,
      fontVariantNumeric: "tabular-nums" as const,
      color: "var(--aurora-text-primary)",
      fontFamily: "var(--aurora-font-display, Inter, sans-serif)",
    },
    text: "1,284",
  },
  {
    label: "Body",
    meta: "14px · 1.55",
    style: {
      fontSize: 14,
      lineHeight: 1.55,
      color: "var(--aurora-text-primary)",
    },
    text: "Gateway connection lost. Retrying in 30 seconds. Check the upstream routing table for misconfigurations.",
  },
  {
    label: "Control",
    meta: "13px · 600",
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--aurora-text-primary)",
    },
    text: "Deploy plugin",
  },
  {
    label: "Dense",
    meta: "13px · 1.4",
    style: {
      fontSize: 13,
      lineHeight: 1.4,
      color: "var(--aurora-text-primary)",
    },
    text: "Read-only mode — changes require admin approval",
  },
  {
    label: "Dense meta",
    meta: "11px · muted",
    style: {
      fontSize: 11,
      color: "var(--aurora-text-muted)",
      lineHeight: 1.4,
    },
    text: "production-edge.lab.local",
  },
  {
    label: "Eyebrow",
    meta: "11px · 600 · UPPERCASE · 0.18em",
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.18em",
      color: "var(--aurora-text-muted)",
    },
    text: "Gateway cluster",
  },
  {
    label: "Mono",
    meta: "JetBrains Mono · 13px · accent-pink",
    style: {
      fontSize: 13,
      fontFamily: "var(--aurora-font-mono, 'JetBrains Mono', monospace)",
      color: "var(--aurora-accent-pink)",
    },
    text: "production-edge.lab.local",
  },
];

export default function TypeDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Foundations
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Typography scale
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Aurora text styles used across every screen in Labby — from dashboard metrics to dense gateway logs.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {TYPE_ROWS.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "grid",
              gridTemplateColumns: "152px 1fr",
              gap: 24,
              padding: "16px 24px",
              alignItems: "center",
              borderBottom: i < TYPE_ROWS.length - 1 ? "1px solid var(--aurora-border-default)" : "none",
              background: i % 2 !== 0 ? "color-mix(in srgb, var(--aurora-border-default) 25%, transparent)" : "transparent",
            }}
          >
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--aurora-text-primary)", margin: 0, lineHeight: 1.4 }}>
                {row.label}
              </p>
              <p style={{ fontSize: 10, color: "var(--aurora-text-muted)", margin: 0, fontFamily: "var(--aurora-font-mono)", lineHeight: 1.4, marginTop: 2 }}>
                {row.meta}
              </p>
            </div>
            <div style={row.style}>{row.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
