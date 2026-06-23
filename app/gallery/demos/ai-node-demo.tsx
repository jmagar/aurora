"use client";

import * as React from "react";
import { Node } from "@/registry/aurora/blocks/ai/elements/node";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiNodeDemo() {
  const [sel, setSel] = React.useState("indexer");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Node"
        description="Flow node — status accent, interactive select, handles."
      />

      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          padding: "22px 34px",
          borderRadius: "var(--aurora-radius-3)",
          border: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-page-bg)",
        }}
      >
        <Node
          title="embedder"
          description="batch 18 chunks"
          status="running"
          selected={sel === "embedder"}
          onClick={() => setSel("embedder")}
        />
        <Node
          title="indexer"
          description="upsert → store"
          status="done"
          selected={sel === "indexer"}
          onClick={() => setSel("indexer")}
        />
        <Node
          title="reranker"
          description="timed out"
          status="error"
          selected={sel === "reranker"}
          onClick={() => setSel("reranker")}
        />
      </div>
    </div>
  );
}
