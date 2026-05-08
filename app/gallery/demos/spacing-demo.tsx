"use client";

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
  { value: "14px",   label: "14px",   name: "radius-1",    desc: "Panels, banners" },
  { value: "18px",   label: "18px",   name: "radius-2",    desc: "Cards, dialogs" },
  { value: "22px",   label: "22px",   name: "radius-3",    desc: "Large cards" },
  { value: "9999px", label: "9999px", name: "radius-pill",  desc: "Pills, badges" },
  { value: "8px",    label: "8px",    name: "radius-sm",   desc: "Inputs, buttons" },
];

export default function SpacingDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Foundations
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Spacing &amp; radius
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          The 4-point spacing grid and corner-radius scale that keep Labby layouts consistent and predictable.
        </p>
      </div>

      {/* Spacing bars */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 16 }}>
          Spacing scale
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SPACING_SCALE.map((step) => (
            <div key={step.value} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  height: 24,
                  width: step.value * 7,
                  minWidth: step.value * 7,
                  background: "var(--aurora-accent-primary)",
                  borderRadius: 4,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
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
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 16 }}>
          Border-radius scale
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {RADIUS_SCALE.map((r) => (
            <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: r.value,
                  background: "var(--aurora-control-surface)",
                  border: "1.5px solid var(--aurora-border-strong)",
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
