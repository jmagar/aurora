"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Checkbox } from "@/registry/aurora/ui/checkbox"

export default function CheckboxDemo() {
  const [colorCode, setColorCode] = React.useState(true);
  const [stream, setStream] = React.useState(true);
  const [compact, setCompact] = React.useState(false);
  // Indeterminate parent — checked when all children on, indeterminate when some
  const allOn = colorCode && stream && compact;
  const someOn = colorCode || stream || compact;
  const parentIndeterminate = someOn && !allOn;

  function toggleAll() {
    const next = !allOn;
    setColorCode(next);
    setStream(next);
    setCompact(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Form elements"
        heading="Checkbox"
        description="Tinted accent fill + glow when checked. Supports tri-state indeterminate for partially-selected groups."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340 }}>
        {/* Indeterminate parent */}
        <Checkbox
          checked={allOn}
          indeterminate={parentIndeterminate}
          onCheckedChange={toggleAll}
        >
          Display settings
        </Checkbox>

        {/* Indented children */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 28 }}>
          <Checkbox checked={colorCode} onCheckedChange={setColorCode}>
            Color-code by operation
          </Checkbox>
          <Checkbox checked={stream} onCheckedChange={setStream}>
            Stream tokens
          </Checkbox>
          <Checkbox checked={compact} onCheckedChange={setCompact}>
            Compact density
          </Checkbox>
        </div>

        {/* Disabled */}
        <Checkbox checked={false} disabled>
          Read-only (disabled)
        </Checkbox>
      </div>
    </div>
  )
}
