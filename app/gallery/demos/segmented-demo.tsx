"use client";

import * as React from "react";
import { Segmented } from "@/registry/aurora/ui/segmented";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

// Demo chrome reproduces the Claude Design `Segmented` dsCard composition 1:1:
// a default-size control over a compact (`sm`) control, left-aligned with a
// 16px gap on the page surface.
const panel: React.CSSProperties = {
  background: "var(--aurora-page-bg)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--radius-2, 18px)",
  padding: "36px 30px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  alignItems: "flex-start",
};

export default function SegmentedDemo() {
  const [surface, setSurface] = React.useState("chat")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="Segmented"
        description="Aurora extension — a single-select segmented control. The active segment lifts onto a tinted cyan fill with a hairline accent ring and accent text; the rest stay muted on a shared pill surface. Ships in default and compact sizes."
      />

      <div style={panel}>
        <Segmented
          value={surface}
          onValueChange={setSurface}
          options={[
            { value: "chat", label: "Chat" },
            { value: "editor", label: "Editor" },
            { value: "terminal", label: "Terminal" },
          ]}
        />
        <Segmented
          size="sm"
          defaultValue="day"
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week", disabled: true },
            { value: "month", label: "Month" },
          ]}
        />
      </div>
    </div>
  );
}
