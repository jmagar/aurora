"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { WebPreview, WebPreviewVariant } from "@/registry/aurora/blocks/web-preview/web-preview"

const VARIANTS: { id: WebPreviewVariant; label: string; description: string }[] = [
  { id: "browser",     label: "Browser chrome", description: "Full browser chrome with URL bar" },
  { id: "unfurl-card", label: "Unfurl card",    description: "Compact link preview card" },
  { id: "skeleton",    label: "Skeleton",        description: "Loading shimmer state" },
  { id: "error",       label: "Error",           description: "Failed to load state" },
]

export function WebPreviewDemo() {
  const [variant, setVariant] = React.useState<WebPreviewVariant>("browser")
  const [isLoading, setIsLoading] = React.useState(false)

  function simulateLoad() {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {VARIANTS.map((v) => {
          const active = variant === v.id
          return (
            <Button variant="plain" size="unstyled"
              key={v.id}
              onClick={() => setVariant(v.id)}
              title={v.description}
              style={{
                height: "32px",
                padding: "0 14px",
                borderRadius: "8px",
                border: active
                  ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
                  : "1px solid var(--aurora-border-default)",
                background: active
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)"
                  : "transparent",
                color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "12px",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {v.label}
            </Button>
          )
        })}
        {variant === "browser" && (
          <Button variant="plain" size="unstyled"
            onClick={simulateLoad}
            style={{
              height: "32px",
              padding: "0 14px",
              borderRadius: "8px",
              border: "1px solid var(--aurora-border-default)",
              background: "transparent",
              color: "var(--aurora-text-muted)",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Simulate loading
          </Button>
        )}
      </div>

      {variant === "browser" && (
        <WebPreview
          url="https://prod.lab.local"
          title="Labby Gateway — Production"
          variant="browser"
          isLoading={isLoading}
        />
      )}

      {variant === "unfurl-card" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <WebPreview
            url="https://prod.lab.local/dashboard"
            title="Gateway Dashboard"
            description="Real-time metrics, active connections, and route configuration for the Labby AI gateway."
            variant="unfurl-card"
          />
          <WebPreview
            url="https://staging.lab.local"
            title="Staging Environment"
            description="Pre-production gateway instance for integration testing."
            variant="unfurl-card"
          />
          <WebPreview
            url="https://lab.local/docs/api"
            title="API Reference"
            description="Complete REST API documentation for Labby gateway endpoints."
            variant="unfurl-card"
          />
        </div>
      )}

      {variant === "skeleton" && (
        <WebPreview url="https://prod.lab.local/reports" variant="skeleton" />
      )}

      {variant === "error" && (
        <WebPreview url="https://prod.lab.local/internal/trace" variant="error" />
      )}
    </div>
  )
}

export default WebPreviewDemo
