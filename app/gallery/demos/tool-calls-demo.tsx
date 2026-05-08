"use client"

import React from "react"
import { ToolCalls, ToolCall } from "@/registry/aurora/blocks/tool-calls/tool-calls"

const now = new Date()
const ms = (n: number) => new Date(now.getTime() - n)

const MIXED_CALLS: ToolCall[] = [
  {
    id: "tc1",
    tool: "ReadFile",
    args: { path: "src/gateway/auth.ts" },
    status: "completed",
    result: `import { verify } from "jsonwebtoken"\nimport type { Request, Response, NextFunction } from "express"\n\nexport function authMiddleware(req: Request, res: Response, next: NextFunction) {\n  const token = req.headers.authorization?.split(" ")[1]\n  if (!token) return res.status(401).json({ error: "Unauthorized" })\n  try {\n    req.user = verify(token, process.env.JWT_SECRET!) as JWTPayload\n    next()\n  } catch {\n    res.status(403).json({ error: "Invalid token" })\n  }\n}`,
    startedAt: ms(4200),
    completedAt: ms(3800),
  },
  {
    id: "tc2",
    tool: "Bash",
    args: { command: "grep -r 'connectionPool' src/ --include='*.ts' -l" },
    status: "completed",
    result: "src/db/pool.ts\nsrc/config/database.ts\nsrc/services/query.ts",
    startedAt: ms(3700),
    completedAt: ms(3200),
  },
  {
    id: "tc3",
    tool: "WriteFile",
    args: {
      path: "src/config/connection-pool.ts",
      content:
        "export interface ConnectionPoolConfig {\n  maxConnections: number\n  idleTimeoutMs: number\n  acquireTimeoutMs: number\n}",
    },
    status: "running",
    startedAt: ms(800),
  },
  {
    id: "tc4",
    tool: "Grep",
    args: { pattern: "new Pool\(", path: "src/", flags: "-r" },
    status: "error",
    result:
      "Error: EACCES: permission denied, open 'src/vendor/pg/pool.ts'\nFailed to search in restricted directory.",
    startedAt: ms(400),
    completedAt: ms(200),
  },
]

const GROUPED_CALLS: ToolCall[] = [
  {
    id: "g1",
    tool: "ReadFile",
    args: { path: "src/routes/v1/users.ts" },
    status: "completed",
    result: "// Users v1 route handler\nexport const usersRouter = Router()\nusersRouter.get('/', listUsers)",
    startedAt: ms(6000),
    completedAt: ms(5600),
  },
  {
    id: "g2",
    tool: "ReadFile",
    args: { path: "src/routes/v1/sessions.ts" },
    status: "completed",
    result: "// Sessions v1 route handler\nexport const sessionsRouter = Router()\nsessionsRouter.post('/create', createSession)",
    startedAt: ms(5500),
    completedAt: ms(5100),
  },
  {
    id: "g3",
    tool: "ReadFile",
    args: { path: "src/routes/v1/health.ts" },
    status: "completed",
    result: "export const healthRouter = Router()\nhealthRouter.get('/', (_, res) => res.json({ status: 'ok' }))",
    startedAt: ms(5000),
    completedAt: ms(4600),
  },
]

export default function ToolCallsDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aurora-space-8)",
        padding: "var(--aurora-space-8) var(--aurora-space-4)",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Tool Calls — mixed statuses
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "12px",
          }}
        >
          Completed ReadFile, completed Bash, running WriteFile, error Grep. Click any row to expand args/result.
        </p>
        <ToolCalls calls={MIXED_CALLS} />
      </div>

      <div>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Tool Calls — grouped consecutive ReadFile
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            marginBottom: "12px",
          }}
        >
          Three consecutive ReadFile calls are automatically grouped into a single expandable row.
        </p>
        <ToolCalls calls={GROUPED_CALLS} />
      </div>
    </div>
  )
}
