"use client"

import * as React from "react"
import { ExternalLink, FileText, Globe, Monitor, SquareTerminal } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"

export interface SandboxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  command?: string
  status?: "ready" | "running" | "idle"
  runtime?: string
  /** Preview URL shown in the address bar. */
  url?: string
  /** Human-readable uptime, e.g. "4m 12s". Rendered as an "up …" chip. */
  uptime?: string
  paths?: string[]
  envCount?: number
}

const statusTone: Record<NonNullable<SandboxProps["status"]>, "success" | "info" | "neutral"> = {
  running: "success",
  ready: "info",
  idle: "neutral",
}

/** Monospace shell-prompt glyph (`>_`) used by the command chip and the
 * "Attach shell" affordance, matching the Claude Design source. */
function PromptGlyph({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        fontFamily: "var(--aurora-font-mono, 'JetBrains Mono', monospace)",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1,
        color,
        letterSpacing: "-0.04em",
      }}
    >
      {">_"}
    </span>
  )
}

const Sandbox = React.forwardRef<HTMLDivElement, SandboxProps>(
  (
    {
      title = "Sandbox",
      command = "pnpm dev",
      status = "running",
      runtime = "Node 20",
      url,
      uptime,
      paths = ["/workdir/app", "/workdir/.next"],
      envCount = 8,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={["grid gap-4 p-[18px]", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-surface-raised)",
        border: "1px solid var(--aurora-border-strong)",
        borderRadius: "var(--aurora-radius-2)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    >
      {/* Header: icon + title + status */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px]"
            style={{
              background: "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent)",
              color: "var(--aurora-accent-strong)",
            }}
          >
            <SquareTerminal className="size-4" aria-hidden />
          </span>
          <span
            className="truncate"
            style={{
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </span>
        </span>
        <Badge variant={statusTone[status]} dot={status === "running"} pulse={status === "running"}>
          {status}
        </Badge>
      </div>

      {/* Preview URL bar */}
      {url ? (
        <div
          className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-3"
          style={{
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
          }}
        >
          <Globe className="size-4 shrink-0" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="aurora-text-code min-w-0 flex-1 truncate"
            style={{ color: "var(--aurora-accent-strong)", fontSize: "13px" }}
          >
            {url}
          </a>
          <ExternalLink className="size-4 shrink-0" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
        </div>
      ) : null}

      {/* Runtime chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5"
          style={{
            background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-panel-medium))",
            border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)",
          }}
        >
          <PromptGlyph color="var(--aurora-accent-strong)" />
          <span
            className="aurora-text-code"
            style={{ color: "var(--aurora-accent-strong)", fontSize: "13px" }}
          >
            {command}
          </span>
        </span>
        <span
          className="inline-flex items-center rounded-[7px] px-2.5 py-1.5 aurora-text-code"
          style={{
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
            color: "var(--aurora-text-muted)",
            fontSize: "13px",
          }}
        >
          {runtime}
        </span>
        <span
          className="inline-flex items-center rounded-[7px] px-2.5 py-1.5 aurora-text-code"
          style={{
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
            color: "var(--aurora-text-muted)",
            fontSize: "13px",
          }}
        >
          {envCount} env
        </span>
        {uptime ? (
          <span
            className="inline-flex items-center rounded-[7px] px-2.5 py-1.5 aurora-text-code"
            style={{
              background: "var(--aurora-control-surface)",
              border: "1px solid var(--aurora-border-default)",
              color: "var(--aurora-text-muted)",
              fontSize: "13px",
            }}
          >
            up {uptime}
          </span>
        ) : null}
      </div>

      {/* Mounted paths */}
      <div
        className="grid gap-2.5 rounded-[10px] px-3.5 py-3"
        style={{
          background: "var(--aurora-control-surface)",
          border: "1px solid var(--aurora-border-default)",
        }}
      >
        {paths.map((path) => (
          <div key={path} className="flex items-center gap-2.5">
            <FileText className="size-4 shrink-0" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
            <span
              className="aurora-text-code truncate"
              style={{ color: "var(--aurora-text-primary)", fontSize: "13px" }}
            >
              {path}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="neutral" size="sm">
          <Monitor className="size-3.5" aria-hidden />
          Open Logs
        </Button>
        <Button type="button" variant="ghost" size="sm">
          <PromptGlyph color="var(--aurora-text-muted)" />
          Attach Shell
        </Button>
      </div>

      {children}
    </div>
  )
)
Sandbox.displayName = "Sandbox"

export { Sandbox }
export default Sandbox
