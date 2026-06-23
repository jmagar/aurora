"use client";

import * as React from "react";
import { Queue } from "@/registry/aurora/blocks/ai/elements/queue";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiQueueDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Queue"
        description="Processing queue — live positions, running head, ETA meta."
      />

      <div
        style={{
          maxWidth: 560,
          padding: "22px 26px",
          borderRadius: "var(--aurora-radius-3)",
          border: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-page-bg)",
        }}
      >
        <Queue
          title="Ingest jobs"
          items={[
            { id: 1, title: "embed: handbook.pdf", status: "done", meta: "8,004 chunks · 4.1s" },
            { id: 2, title: "embed: api-spec.md", status: "running", meta: "2,310 / 6,002" },
            { id: 3, title: "embed: changelog.md", status: "queued", meta: "~12s" },
            { id: 4, title: "embed: faq.md", status: "queued", meta: "~30s" },
          ]}
        />
      </div>
    </div>
  );
}
