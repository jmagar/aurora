"use client";

import * as React from "react";
import { StatCard } from "@/registry/aurora/ui/stat-card";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

// CD dsCard reproduces a radial accent glow behind the cards. Port it as a
// local stage so the demo matches the Claude Design preview 1:1.
const stageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  padding: "26px 30px",
  borderRadius: "var(--aurora-radius-2)",
  border: "1px solid var(--aurora-border-default)",
  background: "var(--aurora-page-bg)",
  backgroundImage:
    "radial-gradient(700px 360px at 12% -8%, color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent), transparent 60%)",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "stretch",
  flexWrap: "wrap",
};

export default function StatCardDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="StatCard"
        description="Compact metric tile with a leading icon chip, a directional trend badge, and a tighter compact tier — used across gateway dashboards and ops summaries."
      />

      <div style={stageStyle}>
        <div style={rowStyle}>
          <StatCard
            icon='<path d="M3 12h4l3 8 4-16 3 8h4"/>'
            label="P99 Latency"
            value="42ms"
            delta="-8%"
            trend="up"
            sub="vs 24h"
          />
          <StatCard
            icon='<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'
            label="Active Gateways"
            value="7"
            delta="+1"
            trend="flat"
          />
          <StatCard
            icon='<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>'
            label="Error Rate"
            value="0.3%"
            delta="+0.1%"
            trend="down"
            sub="vs 24h"
          />
        </div>
        <div style={rowStyle}>
          <StatCard compact label="Tokens" value="1.2M" delta="+4%" trend="up" />
          <StatCard compact label="Cost / Day" value="$38" delta="-2%" trend="up" />
          <StatCard compact label="Queue" value="0" delta="0" trend="flat" />
        </div>
      </div>
    </div>
  );
}
