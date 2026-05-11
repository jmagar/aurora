"use client"

import { Button } from "@/registry/aurora/ui/button";
import React, { useState, useRef } from "react"
import { Terminal, TerminalLine } from "@/registry/aurora/blocks/navigation/terminal/terminal"

const INITIAL_LINES: TerminalLine[] = [
  { text: "aurora deploy --env production-edge --region us-east-1", type: "command" },
  { text: "Resolving deployment target: production-edge-gateway-v3", type: "output" },
  { text: "Authenticating with registry.aurora.dev…", type: "muted" },
  { text: "Pulling image aurora/gateway:2.14.1 (sha256:a3f8c2d…)", type: "output" },
  { text: "Running pre-deploy health checks…", type: "output" },
  { text: "  ✓ Redis connectivity: 3ms", type: "success" },
  { text: "  ✓ Postgres reachable: 8ms", type: "success" },
  { text: "  ✓ Secrets injected: 14 vars", type: "success" },
  { text: "  ⚠ CPU threshold at 78% — consider scaling", type: "warn" },
  { text: "Starting rolling deploy (3 replicas)…", type: "output" },
  { text: "  Replica 1/3 draining traffic…", type: "muted" },
  { text: "  Replica 1/3 swapped → aurora/gateway:2.14.1", type: "success" },
  { text: "  Replica 2/3 draining traffic…", type: "muted" },
  { text: "  Replica 2/3 swapped → aurora/gateway:2.14.1", type: "success" },
  { text: "  Replica 3/3 draining traffic…", type: "muted" },
  { text: "  Replica 3/3 swapped → aurora/gateway:2.14.1", type: "success" },
  { text: "Running post-deploy smoke tests…", type: "output" },
  { text: "  GET /health → 200 OK (12ms)", type: "success" },
  { text: "  GET /api/v2/status → 200 OK (24ms)", type: "success" },
  { text: "  GET /metrics → 500 Internal Server Error", type: "error" },
  { text: "  ERROR: /metrics endpoint failed smoke test — rolled back replica 3", type: "error" },
  { text: "Deploy completed with warnings. 2/3 replicas healthy.", type: "warn" },
]

export default function TerminalDemo() {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES)
  const [replaying, setReplaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function replay() {
    if (replaying) return
    setReplaying(true)
    setLines([])
    let idx = 0
    intervalRef.current = setInterval(() => {
      setLines((prev) => [...prev, INITIAL_LINES[idx]])
      idx++
      if (idx >= INITIAL_LINES.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setReplaying(false)
      }
    }, 120)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-6)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Terminal
        </h2>
        <Button variant="plain" size="unstyled"
          onClick={replay}
          disabled={replaying}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            background: replaying
              ? "var(--aurora-control-surface)"
              : "color-mix(in srgb, var(--aurora-accent-primary) 14%, var(--aurora-control-surface))",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "10px",
            color: replaying ? "var(--aurora-text-muted)" : "var(--aurora-accent-primary)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: replaying ? "not-allowed" : "pointer",
            opacity: replaying ? 0.6 : 1,
            transition: "all 0.15s",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M10 6A4 4 0 1 1 6 2M6 2L8.5 0M6 2L8.5 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {replaying ? "Replaying…" : "Replay"}
        </Button>
      </div>

      <Terminal
        lines={lines}
        title="production-edge deploy"
        status="connected"
      />

      <div style={{ marginTop: "24px" }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Compact variant
        </h3>
        <Terminal
          lines={[
            { text: "npm run build", type: "command" },
            { text: "Creating an optimized production build…", type: "output" },
            { text: "✓ Compiled successfully in 4.2s", type: "success" },
            { text: "✗ TypeScript error in src/gateway.ts:42", type: "error" },
          ]}
          title="build output"
          status="error"
          compact
        />
      </div>
    </div>
  )
}
