"use client";

import * as React from "react";

function LabbyMark({ size = 32 }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="Labby mark"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom plane — deepest */}
      <path d="M4 28L20 38L36 28L20 18Z" fill="var(--aurora-accent-deep)" opacity="0.5" />
      {/* Third plane */}
      <path d="M4 22L20 32L36 22L20 12Z" fill="var(--aurora-accent-primary)" opacity="0.6" />
      {/* Second plane */}
      <path d="M4 16L20 26L36 16L20 6Z" fill="var(--aurora-accent-strong)" opacity="0.78" />
      {/* Top plane — brightest */}
      <path d="M4 10L20 20L36 10L20 0Z" fill="var(--aurora-accent-primary)" />
    </svg>
  );
}

function LabbyWordmark({ fontSize = 32 }: { fontSize: number }) {
  return (
    <span
      aria-label="Labby"
      style={{
        fontFamily: "var(--aurora-font-display, Inter, sans-serif)",
        fontSize,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      <span style={{ color: "var(--aurora-text-primary)" }}>Labb</span>
      <span style={{ color: "var(--aurora-accent-pink)" }}>y</span>
    </span>
  );
}

const MARK_SIZES = [96, 64, 32, 20];
const WORD_SIZES = [48, 32, 20];

export default function BrandDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Brand
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Logo &amp; mark
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          The Labby stacked-plane mark and wordmark at every usage size. The mark uses four rhombus planes in depth; the &quot;y&quot; in the wordmark carries the pink accent.
        </p>
      </div>

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
            gap: 12,
            padding: "16px 24px",
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 18,
          }}
        >
          <LabbyMark size={36} />
          <LabbyWordmark fontSize={28} />
        </div>
      </div>
    </div>
  );
}
