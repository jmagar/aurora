"use client";

import * as React from "react";
import { Activity, LayoutGrid, TriangleAlert } from "lucide-react";
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
            icon={<Activity size={16} aria-hidden />}
            label="P99 Latency"
            value="42ms"
            delta="-8%"
            trend="up"
            sub="vs 24h"
          />
          <StatCard
            icon={<LayoutGrid size={16} aria-hidden />}
            label="Active Gateways"
            value="7"
            delta="+1"
            trend="flat"
          />
          <StatCard
            icon={<TriangleAlert size={16} aria-hidden />}
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
