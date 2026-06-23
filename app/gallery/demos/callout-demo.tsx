"use client";

import * as React from "react";
import { Callout } from "@/registry/aurora/ui/callout";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function CalloutDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Callout"
        description="A status message with a left accent bar. Each tone carries a small glowing dot, a bold title, and a tinted surface keyed to its semantic color — info, success, and warn shown here."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 520,
        }}
      >
        <Callout variant="info" title="Heads up">
          Crawl depth is capped at 4 for this workspace.
        </Callout>
        <Callout variant="success" title="Indexed">
          642 pages · 4 198 chunks now searchable.
        </Callout>
        <Callout variant="warn" title="Rate limited">
          Backing off docs.rs for 2s.
        </Callout>
      </div>
    </div>
  );
}
