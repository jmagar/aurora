"use client";

import * as React from "react";
import { Branch } from "@/registry/aurora/blocks/ai/elements/branch";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiBranchDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Branch"
        description="Versioned answer navigation — step between alternative generations with per-version model metadata, a row of progress dots, and copy / regenerate actions."
      />

      <div style={{ maxWidth: 500 }}>
        <Branch
          defaultIndex={1}
          badge
          onCopy={() => {}}
          onRegenerate={() => {}}
          versions={[
            {
              content:
                "Serde's derive generates Serialize / Deserialize impls at compile time.",
              model: "sonnet-4",
              time: "0.6s",
            },
            {
              content:
                "The #[derive(Serialize)] macro expands to a trait impl during compilation — no runtime reflection is involved.",
              model: "sonnet-4",
              time: "0.9s",
            },
            {
              content:
                "At compile time, serde_derive walks your struct's fields and emits a Serialize impl. Zero runtime cost.",
              model: "opus-4",
              time: "1.2s",
            },
          ]}
        />
      </div>
    </div>
  );
}
