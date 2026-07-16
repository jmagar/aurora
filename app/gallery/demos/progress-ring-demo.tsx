"use client";

import { GalleryPageIntro } from "@/components/gallery-page-intro";
import { ProgressRing } from "@/registry/aurora/ui/progress-ring";

const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "var(--aurora-text-muted)",
  textAlign: "center" as const,
  marginTop: 8,
};

export default function ProgressRingDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="ProgressRing"
        description="A circular progress indicator with a centered value label. Aurora extension for compact, at-a-glance health and completion metrics."
      />

      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: 36,
          background: "var(--aurora-page-bg)",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--radius-2, 18px)",
        }}
      >
        <div>
          <ProgressRing value={68} size={120} thickness={8} />
        </div>
        <div>
          <ProgressRing value={92} color="var(--aurora-success)" size={120} thickness={8} />
          <div style={labelStyle}>Healthy</div>
        </div>
        <div>
          <ProgressRing value={41} size={120} thickness={8} hideLabel aria-label="Queue Completion">
            <span style={{ fontFamily: "var(--aurora-font-sans)", fontSize: 13, color: "var(--aurora-text-muted)" }}>
              41 Jobs
            </span>
          </ProgressRing>
          <div style={labelStyle}>Queued</div>
        </div>
      </div>
    </div>
  );
}
