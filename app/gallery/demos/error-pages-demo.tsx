"use client"

import * as React from "react"
import { ErrorPage } from "@/registry/aurora/blocks/error-page/error-page"

type ErrorCode = 404 | 403 | 500

const VARIANTS: { code: ErrorCode; label: string; description: string }[] = [
  { code: 404, label: "404 — Not found",     description: "Resource missing or moved" },
  { code: 403, label: "403 — Access denied", description: "Insufficient permissions" },
  { code: 500, label: "500 — Server error",  description: "Internal failure with auto-retry" },
]

export function ErrorPagesDemo() {
  const [active, setActive] = React.useState<ErrorCode>(404)
  const [retryCount, setRetryCount] = React.useState(0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 24px",
          borderBottom: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-panel-strong)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            marginRight: "4px",
          }}
        >
          Variant:
        </span>
        {VARIANTS.map((v) => {
          const isActive = active === v.code
          return (
            <button
              key={v.code}
              onClick={() => { setActive(v.code); setRetryCount(0) }}
              title={v.description}
              style={{
                height: "28px",
                padding: "0 12px",
                borderRadius: "7px",
                border: isActive
                  ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
                  : "1px solid var(--aurora-border-default)",
                background: isActive
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)"
                  : "transparent",
                color: isActive ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {v.label}
            </button>
          )
        })}

        {retryCount > 0 && (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--aurora-font-mono)",
              fontSize: "11px",
              color: "var(--aurora-warn)",
            }}
          >
            Retry #{retryCount}
          </span>
        )}
      </div>

      <div key={`${active}-${retryCount}`} style={{ minHeight: "500px", position: "relative" }}>
        {active === 404 && (
          <ErrorPage
            code={404}
            path="/api/v1/gateways/unknown-uuid"
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        )}
        {active === 403 && (
          <ErrorPage
            code={403}
            path="/admin/system/tokens"
          />
        )}
        {active === 500 && (
          <ErrorPage
            code={500}
            incidentId="INC-2026-0508-042a"
            countdown={15}
            onRetry={() => setRetryCount((c) => c + 1)}
          />
        )}
      </div>
    </div>
  )
}

export default ErrorPagesDemo
