"use client";

import * as React from "react";
import { Checkpoint } from "@/registry/aurora/blocks/ai/elements/checkpoint";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiCheckpointDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Checkpoint"
        description="Saved checkpoint — status, metadata, and the restore / compact actions. The default card surfaces step, time, and snapshot size with Diff + Restore; the compact variant collapses to a single interactive row."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 11,
          maxWidth: 480,
        }}
      >
        <Checkpoint
          label="Before migration"
          description="State persisted at step 4"
          status="current"
          step={4}
          time="2m ago"
          size="2.4 MB"
          badge
          onView={() => {}}
          onRestore={() => {}}
        />
        <Checkpoint
          variant="compact"
          label="Initial scaffold"
          status="saved"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
