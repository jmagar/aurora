"use client"

import React from "react"
import { CodeBlock } from "@/registry/aurora/blocks/workspace/code-block/code-block"

const RUST_CODE = `use std::sync::Arc;
use tokio::sync::RwLock;

/// Gateway connection pool with configurable limits.
pub struct ConnectionPool {
    config: PoolConfig,
    connections: Arc<RwLock<Vec<Connection>>>,
}

impl ConnectionPool {
    pub fn new(config: PoolConfig) -> Self {
        Self {
            config,
            connections: Arc::new(RwLock::new(Vec::new())),
        }
    }

    pub async fn acquire(&self) -> Result<Connection, PoolError> {
        let mut pool = self.connections.write().await;
        if let Some(conn) = pool.pop() {
            return Ok(conn);
        }
        if pool.len() < self.config.max_connections {
            let conn = Connection::connect(&self.config.url).await?;
            return Ok(conn);
        }
        Err(PoolError::Exhausted)
    }
}`

const DIFF_CODE = `diff --git a/src/gateway/auth.ts b/src/gateway/auth.ts
index a3f8c2d..b9e14f1 100644
--- a/src/gateway/auth.ts
+++ b/src/gateway/auth.ts
@@ -1,12 +1,18 @@
 import { verify } from "jsonwebtoken"
 import type { Request, Response, NextFunction } from "express"
+import { RateLimiter } from "./rate-limiter"

+const limiter = new RateLimiter({ windowMs: 60_000, max: 100 })

 export function authMiddleware(
   req: Request,
   res: Response,
   next: NextFunction,
 ) {
+  if (!limiter.check(req.ip)) {
+    return res.status(429).json({ error: "Rate limit exceeded" })
+  }
   const token = req.headers.authorization?.split(" ")[1]
   if (!token) return res.status(401).json({ error: "Unauthorized" })
   try {`

const BASH_CODE = `#!/usr/bin/env bash
# Deploy script for Aurora gateway

set -euo pipefail

ENVIRONMENT=\${1:-staging}
REGISTRY="registry.aurora.dev"
IMAGE="aurora/gateway"
VERSION=\$(git describe --tags --abbrev=0)

echo "Deploying \${IMAGE}:\${VERSION} to \${ENVIRONMENT}…"

docker build --platform linux/amd64 \
  --build-arg VERSION="\${VERSION}" \
  --tag "\${REGISTRY}/\${IMAGE}:\${VERSION}" .

docker push "\${REGISTRY}/\${IMAGE}:\${VERSION}"

kubectl set image deployment/gateway \
  gateway="\${REGISTRY}/\${IMAGE}:\${VERSION}" \
  --namespace="\${ENVIRONMENT}" \
  --record

kubectl rollout status deployment/gateway \
  --namespace="\${ENVIRONMENT}" \
  --timeout=120s`

export default function CodeBlockDemo() {
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
        Code Block
      </h2>

      {/* Rust with filename and line numbers */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          Rust — syntax highlighted, filename badge, line numbers
        </p>
        <CodeBlock
          code={RUST_CODE}
          language="rust"
          filename="src/gateway.rs"
          showLineNumbers={true}
        />
      </div>

      {/* Diff view */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          Diff view — additions/removals/headers color-coded
        </p>
        <CodeBlock
          code={DIFF_CODE}
          language="diff"
          filename="auth.ts (patch)"
          variant="diff"
        />
      </div>

      {/* Bash command block */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
          Bash — deploy script
        </p>
        <CodeBlock
          code={BASH_CODE}
          language="bash"
          filename="scripts/deploy.sh"
        />
      </div>
    </div>
  )
}
