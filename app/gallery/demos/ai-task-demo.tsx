"use client";

import * as React from "react";
import { TaskList } from "@/registry/aurora/blocks/ai/elements/task";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiTaskDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Task"
        description="Agent task list — progress counter, per-row status, active running row."
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
        <TaskList
          tasks={[
            { id: "1", title: "Crawl docs.rs", status: "completed" },
            { id: "2", title: "Embed 4 198 Chunks", status: "running" },
            { id: "3", title: "Answer with Citations", status: "queued" },
          ]}
        />
      </div>
    </div>
  );
}
