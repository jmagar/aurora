"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TerminalLine {
  text: string
  type?: "command" | "output" | "error" | "warn" | "success" | "muted"
}

export interface TerminalProps {
  lines: TerminalLine[]
  title?: string
  status?: "connected" | "idle" | "error"
  compact?: boolean
  onKill?: () => void
  onClear?: () => void
  onRun?: () => void
}

// ---------------------------------------------------------------------------
// Aurora "Labby" stacked-plane SVG mark (4 diamond paths, 10px)
// ---------------------------------------------------------------------------

function LabbyMark({ size = 10 }: { size?: number }) {
  const s = size
  return (
    <svg
      width={s}
      height={s * 1.4}
      viewBox="0 0 10 14"
      fill="none"
      aria-label="Aurora"
      style={{ flexShrink: 0 }}
    >
      {/* Four stacked diamond planes, slightly offset vertically */}
      <path d="M5 0L9 2.5L5 5L1 2.5Z" fill="var(--aurora-accent-primary)" opacity="0.95" />
      <path d="M5 3L9 5.5L5 8L1 5.5Z" fill="var(--aurora-accent-primary)" opacity="0.75" />
      <path d="M5 6L9 8.5L5 11L1 8.5Z" fill="var(--aurora-accent-primary)" opacity="0.5" />
      <path d="M5 9L9 11.5L5 14L1 11.5Z" fill="var(--aurora-accent-primary)" opacity="0.28" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Status dot
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: TerminalProps["status"] }) {
  const color =
    status === "connected"
      ? "var(--aurora-success)"
      : status === "idle"
      ? "var(--aurora-warn)"
      : "var(--aurora-error)"

  return (
    <span
      title={status}
      style={{
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 5px ${color}`,
        flexShrink: 0,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Titlebar action buttons (aurora neutral square style)
// ---------------------------------------------------------------------------

function TitlebarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode
  onClick?: () => void
  title?: string
}) {
  return (
    <Button
      type="button"
      variant="neutral"
      size="icon"
      onClick={onClick}
      title={title}
      style={{
        width: "26px",
        height: "22px",
        fontSize: "10px",
        fontFamily: "var(--aurora-font-mono)",
      }}
    >
      {children}
    </Button>
  )
}

// Three neutral square dots (NOT mac traffic lights)
function WindowDots() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "2px",
            background: "var(--aurora-border-strong)",
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Line color mapping
// ---------------------------------------------------------------------------

function getLineColor(type: TerminalLine["type"]): string {
  switch (type) {
    case "command":
      return "var(--aurora-accent-primary)"
    case "error":
      return "var(--aurora-error)"
    case "warn":
      return "var(--aurora-warn)"
    case "success":
      return "var(--aurora-success)"
    case "muted":
      return "var(--aurora-text-muted)"
    case "output":
    default:
      return "var(--aurora-text-primary)"
  }
}

function LinePrefix({ type }: { type?: TerminalLine["type"] }) {
  if (type === "command") {
    return (
      <span
        style={{
          color: "var(--aurora-accent-strong)",
          userSelect: "none",
          marginRight: "2px",
          fontWeight: 600,
        }}
      >
        $
      </span>
    )
  }
  if (type === "error") {
    return (
      <span
        style={{
          color: "var(--aurora-error)",
          userSelect: "none",
          marginRight: "2px",
        }}
      >
        ✗
      </span>
    )
  }
  if (type === "success") {
    return (
      <span
        style={{
          color: "var(--aurora-success)",
          userSelect: "none",
          marginRight: "2px",
        }}
      >
        ✓
      </span>
    )
  }
  if (type === "warn") {
    return (
      <span
        style={{
          color: "var(--aurora-warn)",
          userSelect: "none",
          marginRight: "2px",
        }}
      >
        ⚠
      </span>
    )
  }
  return null
}

// ---------------------------------------------------------------------------
// Full titlebar (38px)
// ---------------------------------------------------------------------------

function Titlebar({
  title,
  status,
  compact,
  onKill,
  onClear,
  onRun,
}: Pick<TerminalProps, "title" | "status" | "compact" | "onKill" | "onClear" | "onRun">) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? "6px" : "8px",
        padding: compact ? "0 10px" : "0 12px",
        height: compact ? "30px" : "38px",
        background: "var(--aurora-panel-strong)",
        borderBottom: "1px solid var(--aurora-border-default)",
        boxShadow: "var(--aurora-highlight-medium)",
        flexShrink: 0,
      }}
    >
      {/* Left: Labby mark + session name */}
      <LabbyMark size={compact ? 8 : 10} />
      <span
        style={{
          fontFamily: "var(--aurora-font-mono)",
          fontSize: compact ? "11px" : "12px",
          color: "var(--aurora-text-muted)",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {title ?? "terminal"}
      </span>

      {/* Status dot */}
      <StatusDot status={status ?? "connected"} />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Action buttons */}
      {!compact && (
        <>
          {onKill && (
            <TitlebarButton onClick={onKill} title="Kill session">
              ×
            </TitlebarButton>
          )}
          {onClear && (
            <TitlebarButton onClick={onClear} title="Clear output">
              ⌫
            </TitlebarButton>
          )}
          {onRun && (
            <TitlebarButton onClick={onRun} title="Run">
              ▶
            </TitlebarButton>
          )}
        </>
      )}

      {/* Three neutral square dots */}
      <WindowDots />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Terminal component
// ---------------------------------------------------------------------------

export function Terminal({
  lines,
  title,
  status = "connected",
  compact = false,
  onKill,
  onClear,
  onRun,
}: TerminalProps) {
  const bodyRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when lines change
  React.useEffect(() => {
    const el = bodyRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [lines])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--aurora-page-bg)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        overflow: "hidden",
        boxShadow: "var(--aurora-shadow-medium)",
        fontFamily: "var(--aurora-font-mono)",
      }}
    >
      <Titlebar
        title={title}
        status={status}
        compact={compact}
        onKill={onKill}
        onClear={onClear}
        onRun={onRun}
      />

      {/* Body */}
      <div
        ref={bodyRef}
        style={{
          padding: compact ? "8px 12px" : "12px 16px",
          overflowY: "auto",
          maxHeight: compact ? "180px" : "420px",
          lineHeight: "1.6",
          fontSize: compact ? "12px" : "13px",
        }}
      >
        {lines.length === 0 && (
          <div
            style={{
              color: "var(--aurora-text-muted)",
              fontStyle: "italic",
              opacity: 0.6,
            }}
          >
            No output
          </div>
        )}

        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "2px",
              color: getLineColor(line.type),
              ...(line.type === "error"
                ? {
                    background: "color-mix(in srgb, var(--aurora-error) 6%, transparent)",
                    marginLeft: "-16px",
                    paddingLeft: "16px",
                    marginRight: "-16px",
                    paddingRight: "16px",
                  }
                : {}),
            }}
          >
            <LinePrefix type={line.type} />
            <span
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                flex: 1,
                minWidth: 0,
              }}
            >
              {line.text}
            </span>
          </div>
        ))}

        {/* Blinking cursor at end */}
        {status === "connected" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginTop: "2px",
            }}
          >
            <span style={{ color: "var(--aurora-accent-primary)" }}>$ </span>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "14px",
                background: "var(--aurora-accent-primary)",
                opacity: 0.7,
                marginLeft: "2px",
                borderRadius: "1px",
                animation: "aurora-cursor-blink 1s step-end infinite",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes aurora-cursor-blink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default Terminal
