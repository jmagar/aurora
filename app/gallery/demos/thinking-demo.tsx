"use client"

import React from "react"
import { Thinking } from "@/registry/aurora/blocks/ai/thinking/thinking"

export default function ThinkingDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-6)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
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
        Thinking
      </h2>

      <p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "8px", fontWeight: 500 }}>
        AI reasoning surface — violet marks automation and generated output. Semantic colors (success, error) remain reserved for step outcomes.
      </p>

      {/* 1. Thinking expanded with content */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          type=&quot;thinking&quot; - expanded with content
        </p>
        <Thinking
          type="thinking"
          defaultOpen={true}
          duration={4}
          content={`The user wants to refactor the gateway service. Let me think through the key concerns:

1. The current auth middleware is tightly coupled to the HTTP layer — we should extract it into a standalone module that can be unit-tested independently.

2. The connection pool configuration lives in three separate files. Consolidating into a single config struct will make it easier to pass through dependency injection.

3. We need to preserve backward compatibility for the /api/v1 routes while introducing the new /api/v2 routing layer. A versioned router approach should work here.

I'll propose a three-phase refactor plan that keeps the service running throughout.`}
        />
      </div>

      {/* 2. Thinking collapsed */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          type=&quot;thinking&quot; - collapsed (defaultOpen=false)
        </p>
        <Thinking
          type="thinking"
          defaultOpen={false}
          duration={7}
          content="The request involves a complex multi-step migration. I considered several strategies including blue-green, canary, and rolling deployments before settling on a hybrid approach that minimizes downtime..."
        />
      </div>

      {/* 3. Plan with 6 steps */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          type=&quot;plan&quot; - 6 steps mixed statuses
        </p>
        <Thinking
          type="plan"
          defaultOpen={true}
          steps={[
            {
              label: "Audit existing gateway routes and middleware",
              status: "done",
              detail: "Documented 24 routes across 3 route groups",
            },
            {
              label: "Extract auth middleware into standalone module",
              status: "done",
              detail: "Created pkg/auth with full unit test coverage",
            },
            {
              label: "Consolidate connection pool configuration",
              status: "inprog",
              detail: "Merging configs from 3 files into ConnectionPoolConfig struct",
            },
            {
              label: "Introduce versioned router for /api/v2",
              status: "pending",
            },
            {
              label: "Write integration tests for dual-version routing",
              status: "pending",
            },
            {
              label: "Deploy canary to staging and monitor error rates",
              status: "pending",
            },
          ]}
          isStreaming={true}
        />
      </div>
    </div>
  )
}
