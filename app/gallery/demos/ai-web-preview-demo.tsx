"use client";

import * as React from "react";
import { Button } from "@/registry/aurora/ui/button"
import { WebPreview } from "@/registry/aurora/blocks/ai/elements/web-preview";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

export default function AiWebPreviewDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="WebPreview"
        description="A browser frame for live-rendering generated pages — a reload button, a lock-prefixed monospace address bar with a connected status dot, desktop/tablet/mobile viewport toggles, and an open-in-new-tab affordance. The body hosts the rendered page over a subtle cyan top glow, and a collapsible console drawer surfaces dev logs with a count badge."
      />

      <div style={{ maxWidth: 560 }}>
        <WebPreview
          url="aurora.tootie.tv/preview"
          height={232}
          onRefresh={() => {}}
          logs={[
            { level: "info", message: "vite v5 ready in 412ms" },
            { level: "log", message: "[hmr] connected" },
            { level: "warn", message: "useEffect missing dependency: theme" },
          ]}
        >
          <div
            style={{
              minHeight: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: 22,
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--aurora-font-display)",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--aurora-text-primary)",
              }}
            >
              One palette.
              <br />
              Every surface.
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--aurora-text-muted)",
                margin: 0,
              }}
            >
              Live preview of the generated page
            </p>
            <Button variant="plain" size="unstyled"
              type="button"
              style={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                height: 34,
                padding: "0 16px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--aurora-text-primary)",
                border:
                  "1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-strong))",
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent), transparent 58%), var(--aurora-control-surface)",
              }}
            >
              Get Started
            </Button>
          </div>
        </WebPreview>
      </div>
    </div>
  );
}
