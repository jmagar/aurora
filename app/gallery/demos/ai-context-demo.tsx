"use client";

import * as React from "react";
import { ContextPanel } from "@/registry/aurora/blocks/ai/elements/context";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiContextDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Context panel"
        description="Token-budget meter for an agent's context window — segmented usage, a hatched reserved-output slice, a compact action, and a near-limit warning state."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 540 }}>
        {/* Streaming, healthy usage */}
        <ContextPanel
          label="Context"
          limit={128000}
          reserved={8000}
          streaming
          segments={[
            { label: "System", value: 8200 },
            { label: "Messages", value: 61000 },
            { label: "Tools", value: 15000 },
          ]}
        />

        {/* Near limit, with compact action + warning */}
        <ContextPanel
          label="Context"
          limit={128000}
          reserved={8000}
          onCompact={() => {}}
          segments={[
            { label: "System", value: 8200 },
            { label: "Messages", value: 96000 },
            { label: "Tools", value: 15000 },
          ]}
        />

        {/* Compact inline variant */}
        <ContextPanel
          variant="compact"
          label="Context"
          used={119000}
          limit={128000}
          onCompact={() => {}}
        />
      </div>
    </div>
  );
}
