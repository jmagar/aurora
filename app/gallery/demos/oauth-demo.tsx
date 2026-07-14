"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { OAuth, OAuthApp, OAuthScope, OAuthToken, OAuthMode } from "@/registry/aurora/blocks/auth/oauth/oauth"

const APP: OAuthApp = {
  name: "Labby CLI",
  description:
    "The official Labby command-line tool. Requesting access to manage gateway routes and read metrics on your behalf.",
  developer: "Labby Inc.",
}

const SCOPES: OAuthScope[] = [
  {
    id: "routes:read",
    label: "Read gateway routes",
    description: "View all configured routing rules and their targets.",
  },
  {
    id: "routes:write",
    label: "Manage gateway routes",
    description: "Create, update, and delete routing rules.",
    sensitive: true,
  },
  {
    id: "metrics:read",
    label: "Read metrics",
    description: "Access request counts, latency histograms, and error rates.",
  },
  {
    id: "tokens:read",
    label: "List API tokens",
    description: "View existing API tokens (not their values).",
  },
  {
    id: "admin:write",
    label: "Full admin access",
    description: "Unrestricted access to all gateway management operations.",
    sensitive: true,
  },
]

const INITIAL_TOKENS: OAuthToken[] = [
  {
    id: "tok_abc123",
    name: "Labby CLI — dev laptop",
    scopes: ["routes:read", "metrics:read"],
    createdAt: "2026-04-01",
    lastUsed: "2026-05-07",
  },
  {
    id: "tok_def456",
    name: "CI / CD pipeline",
    scopes: ["routes:read", "routes:write", "metrics:read"],
    createdAt: "2026-03-15",
    lastUsed: "2026-05-06",
  },
  {
    id: "tok_ghi789",
    name: "Grafana integration",
    scopes: ["metrics:read"],
    createdAt: "2026-02-20",
    lastUsed: "2026-05-07",
  },
]

const MODES: { id: OAuthMode; label: string; description: string }[] = [
  { id: "consent", label: "Consent",       description: "Initial authorization screen" },
  { id: "success", label: "Authorized",    description: "Post-authorization success" },
  { id: "tokens",  label: "Token Manager", description: "Manage active tokens" },
]

export function OAuthDemo() {
  const [mode, setMode] = React.useState<OAuthMode>("consent")
  const [tokens, setTokens] = React.useState<OAuthToken[]>(INITIAL_TOKENS)

  function handleAllow() {
    setMode("success")
  }

  function handleRevoke(tokenId: string) {
    setTokens((prev) => prev.filter((t) => t.id !== tokenId))
  }

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
          Mode:
        </span>
        {MODES.map((m) => {
          const active = mode === m.id
          return (
            <Button variant="plain" size="unstyled"
              key={m.id}
              onClick={() => setMode(m.id)}
              title={m.description}
              style={{
                height: "28px",
                padding: "0 12px",
                borderRadius: "7px",
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
              {m.label}
            </Button>
          )
        })}
      </div>

      <div style={{ minHeight: mode === "tokens" ? "auto" : "560px", padding: mode === "tokens" ? "24px" : "0" }}>
        <OAuth
          app={APP}
          scopes={SCOPES}
          mode={mode}
          tokens={tokens}
          onAllow={handleAllow}
          onDeny={() => {}}
          onRevoke={handleRevoke}
        />
      </div>
    </div>
  )
}

export default OAuthDemo
