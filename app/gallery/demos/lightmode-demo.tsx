"use client";

import * as React from "react";

type BadgeEntry = { label: string; bg: string; border: string; color: string; dot: string };

const BADGES: BadgeEntry[] = [
  { label: "Live", bg: "color-mix(in srgb, #7dd3c7 12%, transparent)", border: "color-mix(in srgb, #7dd3c7 30%, transparent)", color: "var(--aurora-success)", dot: "#7dd3c7" },
  { label: "Degraded", bg: "color-mix(in srgb, #c6a36b 12%, transparent)", border: "color-mix(in srgb, #c6a36b 30%, transparent)", color: "var(--aurora-warn)", dot: "#c6a36b" },
  { label: "Unreachable", bg: "color-mix(in srgb, #c78490 12%, transparent)", border: "color-mix(in srgb, #c78490 30%, transparent)", color: "var(--aurora-error)", dot: "#c78490" },
  { label: "Default", bg: "color-mix(in srgb, #29b6f6 12%, transparent)", border: "color-mix(in srgb, #29b6f6 30%, transparent)", color: "var(--aurora-accent-primary)", dot: "#29b6f6" },
];

type StatEntry = { label: string; value: string; delta: string; positive: boolean | undefined };

const STATS: StatEntry[] = [
  { label: "Active Gateways", value: "7", delta: "+1 this week", positive: true },
  { label: "Req / min", value: "1,284", delta: "stable", positive: undefined },
  { label: "Error Rate", value: "0.12%", delta: "+0.04%", positive: false },
];

export default function LightmodeDemo() {
  return (
    <div className="light" style={{ background: "#f0f6f8", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--aurora-text-muted)", margin: 0 }}>
        Light mode surface — CSS var remap
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 200px))", gap: 12 }}>
        {STATS.map((stat) => (
          <div key={stat.label} style={{ padding: "14px 16px", background: "var(--aurora-panel-medium)", border: "1px solid var(--aurora-border-strong)", borderRadius: "var(--aurora-radius-2)", boxShadow: "var(--aurora-shadow-medium)", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--aurora-text-muted)", lineHeight: 1 }}>{stat.label}</span>
            <span style={{ fontFamily: "var(--aurora-font-display)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.04em", color: "var(--aurora-text-primary)", lineHeight: 1 }}>{stat.value}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: stat.positive === undefined ? "var(--aurora-text-muted)" : stat.positive ? "var(--aurora-accent-strong)" : "var(--aurora-error)" }}>{stat.delta}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginRight: 4 }}>Badges:</span>
        {BADGES.map((b) => (
          <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 4, border: "1px solid " + b.border, background: b.bg, color: b.color, fontSize: 10, fontFamily: "var(--aurora-font-mono, monospace)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", backgroundColor: b.dot, boxShadow: "0 0 4px " + b.dot, flexShrink: 0 }} />
            {b.label}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button style={{ display: "inline-flex", alignItems: "center", height: 32, padding: "0 14px", borderRadius: "var(--aurora-radius-1)", border: "none", background: "linear-gradient(180deg, #4dc8fa 0%, #1da8e6 100%)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 0 1px color-mix(in srgb, #29b6f6 40%, transparent), 0 2px 10px color-mix(in srgb, #29b6f6 25%, transparent)" }}>Deploy</button>
        <button style={{ display: "inline-flex", alignItems: "center", height: 32, padding: "0 14px", borderRadius: "var(--aurora-radius-1)", border: "1px solid var(--aurora-border-strong)", background: "var(--aurora-control-surface)", color: "var(--aurora-text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Configure</button>
        <button style={{ display: "inline-flex", alignItems: "center", height: 32, padding: "0 14px", borderRadius: "var(--aurora-radius-1)", border: "1px solid color-mix(in srgb, #c78490 35%, transparent)", background: "color-mix(in srgb, #c78490 10%, transparent)", color: "var(--aurora-error)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 8, border: "1px solid color-mix(in srgb, #c6a36b 30%, transparent)", background: "color-mix(in srgb, #c6a36b 10%, transparent)" }}>
        <span style={{ fontSize: 15, lineHeight: 1, marginTop: 1, color: "var(--aurora-warn)" }} aria-hidden>&#9888;</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--aurora-warn)" }}>Staging gateway degraded</span>
          <span style={{ fontSize: 12, color: "var(--aurora-text-muted)" }}>P99 latency has exceeded 200 ms for the past 5 minutes. Consider scaling the replica count or investigating upstream dependencies.</span>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--aurora-text-muted)", fontStyle: "italic", margin: 0 }}>
        All colors use Aurora CSS variables and remap automatically inside the{" "}
        <code style={{ fontFamily: "var(--aurora-font-mono, monospace)", background: "var(--aurora-panel-strong)", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>.light</code>{" "}
        scope.
      </p>
    </div>
  );
}
