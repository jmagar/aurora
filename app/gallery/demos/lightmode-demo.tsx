"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Badge, type BadgeTone } from "@/registry/aurora/ui/badge";
import { Button } from "@/registry/aurora/ui/button";

type BadgeEntry = { label: string; tone: BadgeTone };

const BADGES: BadgeEntry[] = [
  { label: "Live", tone: "success" },
  { label: "Degraded", tone: "warn" },
  { label: "Unreachable", tone: "error" },
  { label: "Default", tone: "info" },
];

type StatEntry = { label: string; value: string; delta: string; positive: boolean | undefined };

const STATS: StatEntry[] = [
  { label: "Active Gateways", value: "7", delta: "+1 this week", positive: true },
  { label: "Req / min", value: "1,284", delta: "stable", positive: undefined },
  { label: "Error Rate", value: "0.12%", delta: "+0.04%", positive: false },
];

export default function LightmodeDemo() {
  return (
    <div className="light" style={{ background: "var(--aurora-page-bg)", borderRadius: "var(--aurora-radius-2)", padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
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
          <Badge key={b.label} tone={b.tone} dot>
            {b.label}
          </Badge>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="aurora">Deploy</Button>
        <Button variant="neutral">Configure</Button>
        <Button variant="destructive">Delete</Button>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 8, border: "1px solid var(--aurora-warn-border)", background: "var(--aurora-warn-surface)" }}>
        <TriangleAlert size={16} strokeWidth={1.7} style={{ marginTop: 1, color: "var(--aurora-warn)", flexShrink: 0 }} aria-hidden />
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
