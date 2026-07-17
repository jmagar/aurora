"use client";

import * as React from "react";
import { Rating } from "@/registry/aurora/ui/rating";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

const lbl: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  marginBottom: 10,
};

const big: React.CSSProperties = {
  fontFamily: "var(--aurora-font-display)",
  fontWeight: 800,
  fontSize: 34,
  letterSpacing: "-0.03em",
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  color: "var(--aurora-text-primary)",
};

const meta: React.CSSProperties = {
  fontSize: 12,
  color: "var(--aurora-text-muted)",
  marginTop: 3,
};

export default function RatingDemo() {
  const [v, setV] = React.useState(4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Rating"
        description="Stars for scored feedback. Interactive keyboard-selectable input, read-only aggregate display, and a disabled state for locked reviews."
      />

      <div
        style={{
          backgroundImage:
            "radial-gradient(560px 320px at 16% -10%, color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent), transparent 60%)",
          borderRadius: 18,
          padding: 30,
          maxWidth: 520,
        }}
      >
        {/* Interactive */}
        <div style={{ marginBottom: 22 }}>
          <div style={lbl}>Interactive</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Rating value={v} onChange={setV} size={26} />
            <span style={{ fontSize: 13, color: "var(--aurora-text-muted)" }}>
              {v} / 5
            </span>
          </div>
        </div>

        {/* Aggregate · read-only */}
        <div>
          <div style={lbl}>Aggregate · read-only</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <div style={big}>4.8</div>
              <div style={meta}>1,284 reviews</div>
            </div>
            <div
              style={{
                width: 1,
                height: 38,
                background: "var(--aurora-border-default)",
              }}
            />
            <Rating value={5} readOnly size={18} />
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={lbl}>Disabled</div>
          <Rating value={3} disabled size={22} aria-label="Locked Rating" />
        </div>
      </div>
    </div>
  );
}
