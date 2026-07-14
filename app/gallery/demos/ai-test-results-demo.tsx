"use client";

import * as React from "react";
import { TestResults } from "@/registry/aurora/blocks/ai/elements/test-results";
import type { TestResult } from "@/registry/aurora/blocks/ai/elements/test-results";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

const results: TestResult[] = [
  { name: "serde::derive", status: "passed", duration: "12ms" },
  { name: "serde::enum", status: "failed", duration: "8ms" },
  { name: "serde::skip", status: "skipped" },
];

export default function AiTestResultsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="AI elements"
        heading="Test Results"
        description="A compact test-run summary: pass/fail counts, a segmented progress bar, and per-test rows with status icons, durations, and result badges."
      />

      <div
        style={{
          background: "var(--aurora-page-bg)",
          borderRadius: "var(--aurora-radius-2)",
          padding: 26,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 428 }}>
          <TestResults results={results} />
        </div>
      </div>
    </div>
  );
}
