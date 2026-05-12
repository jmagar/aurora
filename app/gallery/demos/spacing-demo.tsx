"use client";

import { GalleryPageIntro } from "@/components/gallery-page-intro";

const SPACING_SCALE = [
  { value: 4,  label: "4px",  token: "xs" },
  { value: 8,  label: "8px",  token: "sm" },
  { value: 10, label: "10px", token: "md-sm" },
  { value: 12, label: "12px", token: "md" },
  { value: 16, label: "16px", token: "lg" },
  { value: 20, label: "20px", token: "xl" },
  { value: 24, label: "24px", token: "2xl" },
];

const RADIUS_SCALE = [
  { value: "14px",   label: "14px",   name: "radius-1",   desc: "Panels, banners" },
  { value: "18px",   label: "18px",   name: "radius-2",   desc: "Cards, dialogs" },
  { value: "22px",   label: "22px",   name: "radius-3",   desc: "Large cards" },
  { value: "9999px", label: "9999px", name: "radius-pill", desc: "Pills, badges" },
  { value: "8px",    label: "8px",    name: "radius-sm",  desc: "Inputs, buttons" },
];

export default function SpacingDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <GalleryPageIntro
        eyebrow="Foundations"
        heading="Spacing & radius"
        description="The 4-point spacing grid and corner-radius scale that keep Labby layouts consistent and predictable."
      />

      {/* Spacing bars */}
      <div>
        <p className="aurora-demo-label" style={{ marginBottom: 16 }}>Spacing scale</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SPACING_SCALE.map((step) => (
            <div key={step.value} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  height: 24,
                  /* Scale bar width is proportional but capped so it fits narrow screens */
                  width: `min(${step.value * 7}px, 40vw)`,
                  minWidth: Math.min(step.value * 3, 24),
                  background: "var(--aurora-accent-primary)",
                  borderRadius: 4,
                  opacity: 0.72,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--aurora-text-primary)", fontVariantNumeric: "tabular-nums" }}>
                  {step.label}
                </span>
                <span style={{ fontSize: 11, color: "var(--aurora-text-muted)", fontFamily: "var(--aurora-font-mono)" }}>
                  --aurora-spacing-{step.token}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radius swatches */}
      <div>
        <p className="aurora-demo-label" style={{ marginBottom: 16 }}>Border-radius scale</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {RADIUS_SCALE.map((r) => (
            <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: r.value,
                  background: "var(--aurora-control-surface)",
                  border: "1.5px solid var(--aurora-border-strong)",
                  flexShrink: 0,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--aurora-text-primary)", margin: 0 }}>
                  {r.label}
                </p>
                <p style={{ fontSize: 10, color: "var(--aurora-text-muted)", margin: 0, fontFamily: "var(--aurora-font-mono)" }}>
                  --aurora-{r.name}
                </p>
                <p style={{ fontSize: 10, color: "var(--aurora-text-muted)", margin: 0, marginTop: 2 }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
