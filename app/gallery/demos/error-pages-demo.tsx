"use client"

import * as React from "react"
import { ErrorPage } from "@/registry/aurora/blocks/feedback/error-page/error-page"
import { GalleryPageIntro } from "@/components/gallery-page-intro"

/**
 * Gallery demo — shows all three ErrorPage variants (404, 403, 500) in a
 * bounded viewport-height column so the card is centered within its own
 * section rather than pushed far down the gallery page.
 */
export function ErrorPagesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <GalleryPageIntro
        eyebrow="Feedback"
        heading="Error Pages"
        description="404, 403, and 500 error pages with path chips, countdown auto-retry, and Aurora panel styling."
      />

      {/* 404 */}
      <div
        style={{
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
          overflow: "hidden",
        }}
      >
        <ErrorPage
          code={404}
          path="/gateways/edge-9/logs"
          onRetry={() => {}}
          fullPage={false}
        />
      </div>

      {/* 403 */}
      <div
        style={{
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
          overflow: "hidden",
        }}
      >
        <ErrorPage
          code={403}
          path="/gateways/edge-9/logs"
          fullPage={false}
        />
      </div>

      {/* 500 with countdown */}
      <div
        style={{
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
          overflow: "hidden",
        }}
      >
        <ErrorPage
          code={500}
          incidentId="inc-2b4f8e"
          onRetry={() => {}}
          countdown={10}
          fullPage={false}
        />
      </div>
    </div>
  )
}

export default ErrorPagesDemo
