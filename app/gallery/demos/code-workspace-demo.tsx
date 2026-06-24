"use client"

import * as React from "react"
import { TreeNode } from "@/registry/aurora/blocks/files/file-tree/file-tree"
import { CodeWorkspace, FileEntry } from "@/registry/aurora/blocks/files/code-workspace/code-workspace"

// ---------------------------------------------------------------------------
// Demo tree — a small Axon-style Rust src/ layout
// ---------------------------------------------------------------------------

const TREE: TreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "main-rs",   name: "main.rs",   type: "file", language: "rust" },
      { id: "config-rs", name: "config.rs", type: "file", language: "rust" },
      { id: "routes-rs", name: "routes.rs", type: "file", language: "rust" },
    ],
  },
  { id: "cargo-toml", name: "Cargo.toml", type: "file", language: "toml" },
]

// ---------------------------------------------------------------------------
// Demo file contents
// ---------------------------------------------------------------------------

const FILES: Record<string, FileEntry> = {
  "main-rs": {
    filename: "main.rs",
    language: "rust",
    code: `use axum::{routing::get, Router};
use tokio::net::TcpListener;
use std::sync::Arc;

mod config;
mod routes;

use config::AppConfig;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = Arc::new(AppConfig::from_env()?);

    let app = Router::new()
        .route("/health", get(routes::health))
        .route("/api/v1/query", get(routes::query))
        .with_state(config);

    let addr = "0.0.0.0:8080";
    let listener = TcpListener::bind(addr).await?;
    println!("Listening on {addr}");
    axum::serve(listener, app).await?;
    Ok(())
}`,
  },

  "config-rs": {
    filename: "config.rs",
    language: "rust",
    code: `use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct AppConfig {
    /// Qdrant collection to query against.
    pub collection: String,
    /// Maximum results returned per query.
    pub top_k: usize,
    /// TEI embedding service base URL.
    pub tei_url: String,
}

impl AppConfig {
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Self {
            collection: std::env::var("COLLECTION")
                .unwrap_or_else(|_| "aurora".to_string()),
            top_k: std::env::var("TOP_K")
                .unwrap_or_else(|_| "10".to_string())
                .parse()?,
            tei_url: std::env::var("TEI_URL")
                .unwrap_or_else(|_| "http://localhost:8080".to_string()),
        })
    }
}`,
  },

  "routes-rs": {
    filename: "routes.rs",
    language: "rust",
    code: `use axum::{extract::{Query, State}, Json};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::config::AppConfig;

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub version: &'static str,
}

pub async fn health() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok", version: env!("CARGO_PKG_VERSION") })
}

#[derive(Debug, Deserialize)]
pub struct QueryParams {
    pub q: String,
    #[serde(default = "default_k")]
    pub k: usize,
}

fn default_k() -> usize { 10 }

#[derive(Debug, Serialize)]
pub struct QueryResult {
    pub id: String,
    pub score: f32,
    pub payload: serde_json::Value,
}

pub async fn query(
    State(cfg): State<Arc<AppConfig>>,
    Query(params): Query<QueryParams>,
) -> Json<Vec<QueryResult>> {
    // TODO: call TEI → embed → Qdrant search
    let _ = (cfg, params);
    Json(vec![])
}`,
  },

  "cargo-toml": {
    filename: "Cargo.toml",
    language: "toml",
    code: `[package]
name = "aurora-query"
version = "0.1.0"
edition = "2021"

[dependencies]
anyhow = "1"
axum = { version = "0.7", features = ["query"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }`,
  },
}

// ---------------------------------------------------------------------------
// Demo component
// ---------------------------------------------------------------------------

export function CodeWorkspaceDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
      <CodeWorkspace
        tree={TREE}
        files={FILES}
        defaultSelectedId="main-rs"
        defaultExpandedIds={["src"]}
        height={480}
      />
    </div>
  )
}

export default CodeWorkspaceDemo
