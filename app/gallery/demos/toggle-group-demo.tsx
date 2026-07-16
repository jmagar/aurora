"use client";

import * as React from "react";
import { Bold, Italic, Underline, Rows3, Columns3 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/registry/aurora/ui/toggle-group";
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

export default function ToggleGroupDemo() {
  const [layout, setLayout] = React.useState("rows")
  const [formatting, setFormatting] = React.useState<string[]>(["bold"])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="Controls"
        heading="ToggleGroup"
        description="Toggle button container — a row of mutually visible toggles that share one surface. Pressed state lifts each button onto a tinted accent fill with a hairline accent ring."
      />

      <div>
        <div style={label}>Single Selection</div>
        <div style={panel}>
          <ToggleGroup type="single" value={layout} onValueChange={(next) => setLayout(String(next || "rows"))}>
            <ToggleGroupItem value="rows" aria-label="Rows">
              <Rows3 size={16} aria-hidden />
              Rows
            </ToggleGroupItem>
            <ToggleGroupItem value="columns" aria-label="Columns">
              <Columns3 size={16} aria-hidden />
              Columns
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div>
        <div style={label}>Multiple Selection</div>
        <div style={panel}>
          <ToggleGroup type="multiple" value={formatting} onValueChange={(next) => setFormatting(Array.isArray(next) ? next : [String(next)].filter(Boolean))}>
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold size={16} aria-hidden />
              Bold
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic size={16} aria-hidden />
              Italic
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline size={16} aria-hidden />
              Underline
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
