"use client";

import * as React from "react";
import { Skeleton, SkeletonRow } from "@/registry/aurora/ui/skeleton";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

// Demo chrome ported 1:1 from the Claude Design `Skeleton.dsCard` source.
const label: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  marginBottom: 11,
};

const panel: React.CSSProperties = {
  background:
    "linear-gradient(180deg, var(--aurora-panel-medium-top), var(--aurora-panel-medium))",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--radius-2, 18px)",
  padding: 15,
  boxShadow: "var(--aurora-shadow-subtle, var(--aurora-shadow-medium))",
};

const col: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 9,
};

export default function SkeletonDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Loading"
        heading="Skeleton"
        description="Loading placeholders — card, list, media. A shimmering surface that mirrors the shape of incoming content."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
        }}
      >
        {/* Media card */}
        <div>
          <div style={label}>Media card</div>
          <div style={panel}>
            <Skeleton height={92} style={{ borderRadius: 12, marginBottom: 13 }} />
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 11,
              }}
            >
              <Skeleton circle height={34} />
              <div style={col}>
                <Skeleton width="55%" height={11} />
                <Skeleton width="80%" height={9} />
              </div>
            </div>
            <Skeleton height={9} />
            <div style={{ height: 7 }} />
            <Skeleton width="65%" height={9} />
          </div>
        </div>

        {/* List rows */}
        <div>
          <div style={label}>List rows</div>
          <div style={panel}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
