"use client";

import * as React from "react";
import { StatusDot } from "@/registry/aurora/ui/status-dot";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function StatusDotDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Aurora Extensions"
        heading="StatusDot"
        description="Aurora extension — self-glowing live dots that pair a semantic status color with a label, used in gateway health rows, crawl monitors, and update banners."
      />

      {/* CD dsCard composition: four stacked status rows, the two live ones pulsing. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <StatusDot status="ready" pulse label="Gateway ready" />
        <StatusDot status="running" pulse label="Crawl running" />
        <StatusDot status="error" label="edge-3 down" />
        <StatusDot status="info" label="2 updates available" />
      </div>
    </div>
  );
}
