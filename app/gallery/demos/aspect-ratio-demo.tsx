"use client";

import * as React from "react";
import { AspectRatio } from "@/registry/aurora/ui/aspect-ratio";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

const box: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  height: "100%",
  background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-control-surface))",
  border: "1px solid var(--aurora-border-strong)",
  borderRadius: 14,
  color: "var(--aurora-text-muted)",
  fontFamily: "var(--font-mono)",
  fontSize: 15,
  letterSpacing: "0.08em",
};

export default function AspectRatioDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Layout"
        heading="Aspect ratio"
        description="A fixed-ratio box that keeps content at a constant width-to-height proportion as the container resizes."
      />

      {/* CD stacks the two ratios vertically at a prominent size. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ width: 360 }}>
          <AspectRatio ratio={16 / 9}>
            <div style={box}>16 : 9</div>
          </AspectRatio>
        </div>
        <div style={{ width: 220 }}>
          <AspectRatio ratio={1}>
            <div style={box}>1 : 1</div>
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
