"use client";

import * as React from "react";
import { Button } from "@/registry/aurora/ui/button"
import { ToggleGroup } from "@/registry/aurora/ui/toggle-group";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

// Demo chrome ported 1:1 from the Claude Design `ToggleGroup.dsCard` source.
const label: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--aurora-text-muted)",
  marginBottom: 11,
};

const panel: React.CSSProperties = {
  background: "var(--aurora-page-bg)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--radius-2, 18px)",
  padding: "46px 30px",
  display: "flex",
  justifyContent: "center",
};

// `.tg` button — exact values from the CD dsCard injected CSS.
const tgBase: React.CSSProperties = {
  height: 30,
  padding: "0 14px",
  border: "none",
  borderRadius: 8,
  background: "none",
  color: "var(--aurora-text-muted)",
  font: "560 13px var(--font-sans)",
  cursor: "pointer",
};

const tgPressed: React.CSSProperties = {
  color: "var(--aurora-accent-strong)",
  background:
    "color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface))",
  boxShadow:
    "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)",
};

type Key = "bold" | "italic" | "under";

function ToggleButton({
  k,
  pressed,
  onToggle,
  children,
}: {
  k: Key;
  pressed: boolean;
  onToggle: (k: Key) => void;
  children: React.ReactNode;
}) {
  return (
    <Button variant="plain" size="unstyled"
      type="button"
      aria-pressed={pressed}
      onClick={() => onToggle(k)}
      style={pressed ? { ...tgBase, ...tgPressed } : tgBase}
    >
      {children}
    </Button>
  );
}

export default function ToggleGroupDemo() {
  const [on, setOn] = React.useState<Record<Key, boolean>>({
    bold: true,
    italic: false,
    under: false,
  });
  const toggle = (k: Key) => setOn((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="ToggleGroup"
        description="Toggle button container — a row of mutually visible toggles that share one surface. Pressed state lifts each button onto a tinted accent fill with a hairline accent ring."
      />

      <div>
        <div style={label}>Text formatting</div>
        <div style={panel}>
          <ToggleGroup>
            <ToggleButton k="bold" pressed={on.bold} onToggle={toggle}>
              <b>B</b>
            </ToggleButton>
            <ToggleButton k="italic" pressed={on.italic} onToggle={toggle}>
              <i>I</i>
            </ToggleButton>
            <ToggleButton k="under" pressed={on.under} onToggle={toggle}>
              <u>U</u>
            </ToggleButton>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
