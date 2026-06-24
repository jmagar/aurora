"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { CodeEditor, DiffLine, Diagnostic } from "@/registry/aurora/blocks/files/code-editor/code-editor"

// ---------------------------------------------------------------------------
// Sample code snippets — one per supported language
// ---------------------------------------------------------------------------

const RUST_CODE = `use axum::{
    routing::{get, post},
    Router, Json,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::net::TcpListener;

#[derive(Debug, Serialize, Deserialize)]
pub struct GatewayConfig {
    pub host: String,
    pub port: u16,
    pub max_connections: usize,
    pub tls_enabled: bool,
}

#[derive(Clone)]
pub struct AppState {
    config: Arc<GatewayConfig>,
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok", "version": "0.1.0" }))
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = Arc::new(GatewayConfig {
        host: "0.0.0.0".to_string(),
        port: 8080,
        max_connections: 1024,
        tls_enabled: true,
    });
    let app = Router::new()
        .route("/health", get(health_check))
        .with_state(AppState { config });
    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app).await?;
    Ok(())
}`

const TS_CODE = `import * as React from "react"
import { useCallback, useEffect, useState } from "react"

export interface GatewayConfig {
  host: string
  port: number
  maxConnections: number
  tlsEnabled: boolean
}

async function fetchConfig(url: string): Promise<GatewayConfig> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`)
  }
  return response.json() as Promise<GatewayConfig>
}

export function useGatewayConfig(endpoint: string) {
  const [config, setConfig] = useState<GatewayConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const cfg = await fetchConfig(endpoint)
      setConfig(cfg)
    } catch (err) {
      setError(String(err))
    }
  }, [endpoint])

  useEffect(() => { load() }, [load])
  return { config, error, reload: load }
}`

const PYTHON_CODE = `import asyncio
from dataclasses import dataclass
from typing import Optional

@dataclass
class GatewayConfig:
    host: str = "0.0.0.0"
    port: int = 8080
    max_connections: int = 1024
    tls_enabled: bool = True

async def health_check(config: GatewayConfig) -> dict:
    """Return service health status."""
    return {
        "status": "ok",
        "host": config.host,
        "port": config.port,
    }

async def main() -> None:
    config = GatewayConfig(port=9090, tls_enabled=False)
    result = await health_check(config)
    print(f"Status: {result['status']}")

if __name__ == "__main__":
    asyncio.run(main())`

const TOML_CODE = `[gateway]
host = "0.0.0.0"
port = 8080
tls_enabled = true
max_connections = 1024

[gateway.tls]
cert_path = "/etc/ssl/certs/server.crt"
key_path = "/etc/ssl/private/server.key"

[[gateway.upstreams]]
name = "api-primary"
url = "http://10.0.0.1:3000"
weight = 80

[[gateway.upstreams]]
name = "api-secondary"
url = "http://10.0.0.2:3000"
weight = 20`

const SNIPPETS: Record<string, { filename: string; language: string; code: string }> = {
  rust:       { filename: "gateway.rs",     language: "rust",       code: RUST_CODE },
  typescript: { filename: "useConfig.ts",   language: "typescript", code: TS_CODE },
  python:     { filename: "gateway.py",     language: "python",     code: PYTHON_CODE },
  toml:       { filename: "gateway.toml",   language: "toml",       code: TOML_CODE },
}

// ---------------------------------------------------------------------------
// Diff + diagnostic fixtures
// ---------------------------------------------------------------------------

const DIFF_LINES: DiffLine[] = [
  { type: "unchanged", content: "use axum::{" },
  { type: "unchanged", content: "    routing::{get, post}," },
  { type: "unchanged", content: "    Router, Json," },
  { type: "unchanged", content: "};" },
  { type: "unchanged", content: "" },
  { type: "remove",    content: "use std::sync::Arc;" },
  { type: "add",       content: "use std::sync::{Arc, RwLock};" },
  { type: "unchanged", content: "" },
  { type: "unchanged", content: "#[derive(Clone)]" },
  { type: "unchanged", content: "pub struct AppState {" },
  { type: "remove",    content: "    config: Arc<GatewayConfig>," },
  { type: "add",       content: "    config: Arc<RwLock<GatewayConfig>>," },
  { type: "unchanged", content: "}" },
  { type: "unchanged", content: "" },
  { type: "unchanged", content: "async fn get_config(" },
  { type: "unchanged", content: "    axum::extract::State(state): axum::extract::State<AppState>," },
  { type: "unchanged", content: ") -> Json<GatewayConfig> {" },
  { type: "remove",    content: "    Json((*state.config).clone())" },
  { type: "add",       content: "    let cfg = state.config.read().unwrap();" },
  { type: "add",       content: "    Json(cfg.clone())" },
  { type: "unchanged", content: "}" },
]

const DIAGNOSTICS: Diagnostic[] = [
  { line: 22, col: 14, message: "unused variable `x` — consider prefixing with `_`", severity: "warning" },
  { line: 38, col: 5,  message: "cannot borrow `config` as mutable more than once at a time", severity: "error" },
]

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

const MODES = ["normal", "diff", "errors"] as const
type Mode = typeof MODES[number]

const LANGS = Object.keys(SNIPPETS) as (keyof typeof SNIPPETS)[]

export function CodeEditorDemo() {
  const [mode, setMode] = React.useState<Mode>("normal")
  const [lang, setLang] = React.useState<keyof typeof SNIPPETS>("rust")

  const snippet = SNIPPETS[lang]

  const tabStyle = (active: boolean): React.CSSProperties => ({
    height: "30px",
    padding: "0 12px",
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
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>

      {/* Mode tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Mode</span>
        {MODES.map((m) => (
          <Button key={m} variant="plain" size="unstyled" onClick={() => setMode(m)} style={tabStyle(mode === m)}>
            {m === "normal" ? "Normal" : m === "diff" ? "Diff" : "Diagnostics"}
          </Button>
        ))}
      </div>

      {/* Language tabs (only shown in normal/diagnostics mode) */}
      {mode !== "diff" && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--aurora-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Language</span>
          {LANGS.map((l) => (
            <Button key={l} variant="plain" size="unstyled" onClick={() => setLang(l)} style={tabStyle(lang === l)}>
              {l}
            </Button>
          ))}
        </div>
      )}

      {/* Editor */}
      {mode === "normal" && (
        <CodeEditor filename={snippet.filename} language={snippet.language} code={snippet.code} variant="full" />
      )}
      {mode === "diff" && (
        <CodeEditor
          filename="app_state.rs"
          language="rust"
          code={DIFF_LINES.map((d) => d.content).join("\n")}
          diff={DIFF_LINES}
          variant="full"
        />
      )}
      {mode === "errors" && (
        <CodeEditor filename={snippet.filename} language={snippet.language} code={snippet.code} errors={DIAGNOSTICS} variant="full" />
      )}

      {/* Compact variant */}
      <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginTop: "8px" }}>
        Compact variant
      </div>
      <CodeEditor
        filename="gateway.toml"
        language="toml"
        code={TOML_CODE}
        variant="compact"
      />
    </div>
  )
}

export default CodeEditorDemo
