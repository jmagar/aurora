"use client";

import * as React from "react";
import { GalleryPageIntro } from "@/components/gallery-page-intro";
import { LabbyLockup, LabbyMark, LabbyWordmark } from "@/components/labby-brand";

const MARK_SIZES = [96, 64, 32, 20];
const WORD_SIZES = [48, 32, 20];

export default function BrandDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Brand"
        heading="Logo & mark"
        description='The Labby stacked-plane mark and wordmark at every usage size. The mark uses four rhombus planes in depth, and the wordmark keeps the pink accent on the "y".'
      />

      {/* Mark sizes */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 16 }}>
          Stacked-plane mark
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          {MARK_SIZES.map((size) => (
            <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: Math.max(size + 20, 52),
                  height: Math.max(size + 20, 52),
                  background: "var(--aurora-control-surface)",
                  border: "1px solid var(--aurora-border-default)",
                  borderRadius: 14,
                }}
              >
                <LabbyMark size={size} />
              </div>
              <span style={{ fontSize: 11, color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>
                {size}px
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wordmark sizes */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 16 }}>
          Wordmark
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {WORD_SIZES.map((size) => (
            <div key={size} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <LabbyWordmark fontSize={size} />
              <span style={{ fontSize: 11, color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>
                {size}px
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lockup */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 16 }}>
          Lockup
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "18px 24px",
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 18,
            boxShadow: "var(--aurora-highlight-medium)",
          }}
        >
          <LabbyLockup markSize={36} wordmarkSize={28} />
        </div>
      </div>
    </div>
  );
}
