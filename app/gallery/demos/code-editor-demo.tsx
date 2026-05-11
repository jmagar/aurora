"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { CodeEditor, DiffLine, Diagnostic } from "@/registry/aurora/blocks/files/code-editor/code-editor"

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

async fn get_config(
    axum::extract::State(state): axum::extract::State<AppState>,
) -> Json<GatewayConfig> {
    Json((*state.config).clone())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = Arc::new(GatewayConfig {
        host: "0.0.0.0".to_string(),
        port: 8080,
        max_connections: 1024,
        tls_enabled: true,
    });

    let state = AppState { config };

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/config", get(get_config))
        .with_state(state);

    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app).await?;

    Ok(())
}`

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

export function CodeEditorDemo() {
  const [mode, setMode] = React.useState<"normal" | "diff" | "errors">("normal")

  const tabs = [
    { id: "normal" as const, label: "Normal" },
    { id: "diff"   as const, label: "Diff mode" },
    { id: "errors" as const, label: "Diagnostics" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {tabs.map((tab) => {
          const active = mode === tab.id
          return (
            <Button variant="plain" size="unstyled"
              key={tab.id}
              onClick={() => setMode(tab.id)}
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
              {tab.label}
            </Button>
          )
        })}
      </div>

      {mode === "normal" && (
        <CodeEditor filename="gateway.rs" language="rust" code={RUST_CODE} variant="full" />
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
        <CodeEditor filename="gateway.rs" language="rust" code={RUST_CODE} errors={DIAGNOSTICS} variant="full" />
      )}

      <div
        style={{
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
          marginTop: "8px",
        }}
      >
        Compact variant
      </div>
      <CodeEditor
        filename="config.toml"
        language="toml"
        code={`[gateway]\nhost = "0.0.0.0"\nport = 8080\ntls_enabled = true\nmax_connections = 1024`}
        variant="compact"
      />
    </div>
  )
}

export default CodeEditorDemo
