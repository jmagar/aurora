"use client"

import * as React from "react"
import {
  ChevronRight,
  ExternalLink,
  Lock,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────

/** A single console line shown in the WebPreview console drawer. */
export interface WebPreviewLog {
  /** Severity tone — drives the message tint. */
  level: "info" | "log" | "warn" | "error"
  /** Console line text. */
  message: string
}

/** One selectable viewport in the toolbar. */
export type WebPreviewViewport = "desktop" | "tablet" | "mobile"

export interface WebPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL shown in the address bar. */
  url?: string
  /** Rendered preview surface (the generated page). */
  children?: React.ReactNode
  /** Height of the preview viewport area in px. Defaults to `232`. */
  height?: number
  /** Console lines shown in the footer drawer. */
  logs?: WebPreviewLog[]
  /** Active viewport. Uncontrolled default is `desktop`. */
  viewport?: WebPreviewViewport
  /** Default viewport for the uncontrolled case. Defaults to `desktop`. */
  defaultViewport?: WebPreviewViewport
  /** Fired when a viewport toggle is pressed. */
  onViewportChange?: (viewport: WebPreviewViewport) => void
  /** Fired when the refresh button is pressed. */
  onRefresh?: () => void
  /** Fired when the open-in-new button is pressed. */
  onOpenExternal?: () => void
  /** Whether the console drawer starts open. Defaults to `false`. */
  defaultConsoleOpen?: boolean
}

// ── Aurora token panel surface (mirrors the elements panelStyle) ────────────────
function webPreviewPanelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-surface-raised)",
    border: "1px solid var(--aurora-border-strong)",
    borderRadius: "var(--aurora-radius-1)",
    boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    ...style,
  }
}

const LOG_TONE: Record<WebPreviewLog["level"], string> = {
  info: "var(--aurora-text-muted)",
  log: "var(--aurora-text-primary)",
  warn: "var(--aurora-warn, var(--aurora-text-primary))",
  error: "var(--aurora-error, var(--aurora-accent-pink))",
}

const VIEWPORTS: ReadonlyArray<{
  id: WebPreviewViewport
  label: string
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}> = [
  { id: "desktop", label: "Desktop", Icon: Monitor },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "mobile", label: "Mobile", Icon: Smartphone },
]

const WebPreview = React.memo(
  function WebPreview(
    { ref,
      url = "preview",
      children,
      height = 232,
      logs = [],
      viewport: viewportProp,
      defaultViewport = "desktop",
      onViewportChange,
      onRefresh,
      onOpenExternal,
      defaultConsoleOpen = false,
      className,
      style,
      ...props
    }: WebPreviewProps & { ref?: React.Ref<HTMLDivElement> },
  ) {
    const [internalViewport, setInternalViewport] =
      React.useState<WebPreviewViewport>(defaultViewport)
    const viewport = viewportProp ?? internalViewport
    const [consoleOpen, setConsoleOpen] = React.useState(defaultConsoleOpen)

    const handleViewport = React.useCallback(
      (next: WebPreviewViewport) => {
        if (viewportProp == null) setInternalViewport(next)
        onViewportChange?.(next)
      },
      [viewportProp, onViewportChange],
    )

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden", className)}
        style={webPreviewPanelStyle(style)}
        {...props}
      >
        {/* Toolbar: refresh · address bar · viewport toggles · open-external */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Reload preview"
            className="grid size-8 shrink-0 place-items-center rounded-[8px] transition-colors"
            style={{
              border: "1px solid var(--aurora-border-default)",
              background:
                "color-mix(in srgb, var(--aurora-panel-medium) 70%, transparent)",
              color: "var(--aurora-text-muted)",
            }}
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>

          {/* Address bar */}
          <div
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[9px] px-3"
            style={{
              height: 34,
              border: "1px solid var(--aurora-border-default)",
              background:
                "color-mix(in srgb, var(--aurora-panel-strong) 80%, transparent)",
            }}
          >
            <Lock
              className="size-3.5 shrink-0"
              aria-hidden
              style={{ color: "var(--aurora-success)" }}
            />
            <span
              className="min-w-0 flex-1 truncate"
              style={{
                color: "var(--aurora-text-primary)",
                fontFamily: "var(--aurora-font-mono)",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "-0.005em",
                lineHeight: 1.2,
              }}
            >
              {url}
            </span>
            {/* Live status dot */}
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{
                background: "var(--aurora-success)",
                boxShadow:
                  "0 0 0 3px color-mix(in srgb, var(--aurora-success) 22%, transparent)",
              }}
            />
            <span className="sr-only">Connected</span>
          </div>

          {/* Viewport toggles */}
          <div
            className="flex shrink-0 items-center gap-0.5 rounded-[9px] p-0.5"
            role="group"
            aria-label="Preview viewport"
            style={{
              border: "1px solid var(--aurora-border-default)",
              background:
                "color-mix(in srgb, var(--aurora-panel-medium) 70%, transparent)",
            }}
          >
            {VIEWPORTS.map(({ id, label, Icon }) => {
              const active = viewport === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleViewport(id)}
                  aria-label={label}
                  aria-pressed={active}
                  className="grid size-7 place-items-center rounded-[7px] transition-colors"
                  style={
                    active
                      ? {
                          border:
                            "1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-strong))",
                          background:
                            "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)",
                          color: "var(--aurora-accent-primary)",
                        }
                      : {
                          border: "1px solid transparent",
                          background: "transparent",
                          color: "var(--aurora-text-muted)",
                        }
                  }
                >
                  <Icon className="size-4" aria-hidden />
                </button>
              )
            })}
          </div>

          {/* Open external */}
          <button
            type="button"
            onClick={onOpenExternal}
            aria-label="Open in new tab"
            className="grid size-8 shrink-0 place-items-center rounded-[8px] transition-colors"
            style={{
              border: "1px solid transparent",
              background: "transparent",
              color: "var(--aurora-text-muted)",
            }}
          >
            <ExternalLink className="size-4" aria-hidden />
          </button>
        </div>

        {/* Divider */}
        <div
          aria-hidden
          style={{ height: 1, background: "var(--aurora-border-default)" }}
        />

        {/* Preview viewport */}
        <div
          className="relative overflow-auto"
          style={{
            height,
            background: "var(--aurora-panel-strong)",
            backgroundImage:
              "radial-gradient(420px 240px at 50% 0%, color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent), transparent 60%)",
          }}
        >
          {children}
        </div>

        {/* Console drawer */}
        <div
          aria-hidden
          style={{ height: 1, background: "var(--aurora-border-default)" }}
        />
        <button
          type="button"
          onClick={() => setConsoleOpen((o) => !o)}
          aria-expanded={consoleOpen}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors"
          style={{ background: "transparent" }}
        >
          <ChevronRight
            className="size-4 shrink-0 transition-transform"
            aria-hidden
            style={{
              color: "var(--aurora-text-muted)",
              transform: consoleOpen ? "rotate(90deg)" : "none",
            }}
          />
          <span
            className="flex-1"
            style={{
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-sans)",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "-0.005em",
            }}
          >
            Console
          </span>
          <span
            className="shrink-0 tabular-nums"
            style={{
              color: "var(--aurora-text-muted)",
              fontFamily: "var(--aurora-font-mono)",
              fontSize: 13,
            }}
          >
            {logs.length}
          </span>
        </button>

        {consoleOpen && logs.length > 0 ? (
          <div
            role="log"
            className="overflow-auto px-4 pb-3"
            style={{
              maxHeight: 160,
              background:
                "color-mix(in srgb, var(--aurora-panel-strong) 60%, transparent)",
              borderTop: "1px solid var(--aurora-border-default)",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: "8px 0 0" }}>
              {logs.map((log, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 py-1"
                  style={{
                    fontFamily: "var(--aurora-font-mono)",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    className="shrink-0 uppercase tabular-nums"
                    style={{
                      color: "var(--aurora-text-muted)",
                      opacity: 0.7,
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      paddingTop: 2,
                      minWidth: "3.25em",
                    }}
                  >
                    {log.level}
                  </span>
                  <span style={{ color: LOG_TONE[log.level] }}>
                    {log.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    )
  },
)
WebPreview.displayName = "WebPreview"

export { WebPreview }
export default WebPreview
