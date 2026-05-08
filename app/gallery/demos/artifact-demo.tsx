"use client"

import React from "react"
import { Artifact } from "@/registry/aurora/blocks/artifact/artifact"

const TOML_CONTENT = `[gateway]
name = "aurora-production-edge"
version = "2.14.1"
region = "us-east-1"

[gateway.tls]
cert_path = "/etc/certs/prod.pem"
key_path = "/etc/certs/prod.key"
min_version = "TLS1.3"

[gateway.rate_limit]
enabled = true
window_ms = 60_000
max_requests = 500
burst = 100

[gateway.connection_pool]
max_connections = 64
idle_timeout_ms = 30_000
acquire_timeout_ms = 5_000

[gateway.logging]
level = "info"
format = "json"
output = "stdout"

[[gateway.upstream]]
name = "api-service"
url = "http://api:3000"
weight = 80
health_check = "/health"

[[gateway.upstream]]
name = "api-service-canary"
url = "http://api-canary:3000"
weight = 20
health_check = "/health"`

const TS_CONTENT = `import { Gateway } from "@aurora/gateway"
import { authMiddleware } from "./auth"
import { rateLimiter } from "./rate-limiter"

const gateway = new Gateway({
  port: 443,
  tls: {
    certPath: process.env.TLS_CERT_PATH!,
    keyPath: process.env.TLS_KEY_PATH!,
  },
})

gateway.use(rateLimiter({ windowMs: 60_000, max: 500 }))
gateway.use(authMiddleware)

gateway.upstream("/api/v1", {
  target: process.env.API_V1_URL!,
  rewrite: (path) => path.replace("/api/v1", ""),
})

gateway.upstream("/api/v2", {
  target: process.env.API_V2_URL!,
  rewrite: (path) => path.replace("/api/v2", ""),
})

gateway.listen().then(() => {
  console.log("Gateway listening on :443")
})`

export default function ArtifactDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-8)",
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
        Artifact
      </h2>

      {/* Panel variant */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          variant="panel" — full-featured with copy/download/expand
        </p>
        <Artifact
          variant="panel"
          title="Gateway Config"
          language="toml"
          code={TOML_CONTENT}
        />
      </div>

      {/* Card variant */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          variant="card" — compact collapsible in-chat card
        </p>
        <Artifact
          variant="card"
          title="gateway.ts"
          language="typescript"
          code={TS_CONTENT}
        />
      </div>

      {/* Inline variant */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          variant="inline" — bare code block with minimal toolbar
        </p>
        <Artifact
          variant="inline"
          title="connection-pool.toml"
          language="toml"
          code={`[connection_pool]
max_connections = 64
idle_timeout_ms = 30_000
acquire_timeout_ms = 5_000`}
        />
      </div>

      {/* Streaming */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          variant="panel" isStreaming — with blinking cursor and spinner
        </p>
        <Artifact
          variant="panel"
          title="auth.ts (generating…)"
          language="typescript"
          isStreaming={true}
          code={`import { verify } from "jsonwebtoken"
import type { Middleware } from "./types"

export const authMiddleware: Middleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]`}
        />
      </div>
    </div>
  )
}
