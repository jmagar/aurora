"use client"

import * as React from "react"
import {
  Check,
  ChevronDown,
  CircleAlert,
  CircleDashed,
  Wrench,
} from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

/**
 * Tool — a single collapsible tool call, CD-parity.
 *
 * Architecture: self-contained shadcn-registry component. Keeps the Button
 * escape hatch (`plain`/`unstyled`) for the disclosure trigger, `forwardRef`,
 * `displayName`, and `React.memo`. Fully a11y: the trigger drives
 * `aria-expanded`/`aria-controls` and the body is a labelled `region`.
 *
 * Visuals ported 1:1 from the Claude Design `Tool.dsCard`: rose accent on the
 * wrench + tool name, status glyph on the right, a JSON args card with
 * syntax tints, and muted footer children.
 */

export type ToolStatus = "pending" | "running" | "done" | "error"

export interface ToolProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tool identifier, e.g. `axon.search`. Rendered in the rose accent. */
  name: string
  /** Lifecycle status — drives the right-hand status glyph. */
  status?: ToolStatus
  /** Open by default (uncontrolled). */
  defaultOpen?: boolean
  /** Controlled open state. */
  open?: boolean
  /** Controlled open change handler. */
  onOpenChange?: (open: boolean) => void
  /** Structured tool input, pretty-printed in the args card. */
  args?: unknown
  /** Result / summary content, rendered under the args card. */
  children?: React.ReactNode
}

const STATUS_META: Record<
  ToolStatus,
  {
    color: string
    spin?: boolean
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean | "true" }>
    label: string
  }
> = {
  pending: { color: "var(--aurora-text-muted)", Icon: CircleDashed, label: "pending" },
  running: { color: "var(--aurora-accent-primary)", spin: true, Icon: CircleDashed, label: "running" },
  done: { color: "var(--aurora-success)", Icon: Check, label: "done" },
  error: { color: "var(--aurora-error)", Icon: CircleAlert, label: "error" },
}

function StatusGlyph({ status }: { status: ToolStatus }) {
  const meta = STATUS_META[status]
  const Icon = meta.Icon
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "999px",
        color: meta.color,
        boxShadow:
          status === "done"
            ? `0 0 10px color-mix(in srgb, ${meta.color} 45%, transparent)`
            : undefined,
        flexShrink: 0,
        animation: meta.spin ? "aurora-tool-spin 0.8s linear infinite" : undefined,
      }}
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
    </span>
  )
}

function renderJson(value: unknown): React.ReactNode {
  const json = JSON.stringify(value, null, 2)
  if (json === undefined) return null

  // Tokenize for syntax tints matching the CD args card.
  const parts: React.ReactNode[] = []
  const regex =
    /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = regex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{json.slice(lastIndex, match.index)}</span>)
    }
    if (match[1]) {
      // object key
      parts.push(
        <span key={key++} style={{ color: "var(--aurora-text-primary)" }}>
          {match[1]}
        </span>,
      )
    } else if (match[2]) {
      // string value
      parts.push(
        <span key={key++} style={{ color: "var(--aurora-success)" }}>
          {match[2]}
        </span>,
      )
    } else if (match[3]) {
      // number
      parts.push(
        <span key={key++} style={{ color: "var(--aurora-warn)" }}>
          {match[3]}
        </span>,
      )
    } else if (match[4]) {
      // boolean / null
      parts.push(
        <span key={key++} style={{ color: "var(--aurora-accent-strong)" }}>
          {match[4]}
        </span>,
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < json.length) {
    parts.push(<span key={key++}>{json.slice(lastIndex)}</span>)
  }
  return parts
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

const ToolImpl = React.forwardRef<HTMLDivElement, ToolProps>(function Tool(
  {
    name,
    status = "done",
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    args,
    children,
    style,
    ...rest
  },
  ref,
) {
  const reactId = React.useId()
  const bodyId = `aurora-tool-${reactId}`
  const isControlled = openProp !== undefined
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = isControlled ? openProp : openState

  const toggle = React.useCallback(() => {
    const next = !open
    if (!isControlled) setOpenState(next)
    onOpenChange?.(next)
  }, [open, isControlled, onOpenChange])

  const hasArgs = args !== undefined
  const hasBody = hasArgs || children != null

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        border: `1px solid ${open ? "var(--aurora-border-strong)" : "var(--aurora-border-default)"}`,
        borderRadius: 16,
        background: "var(--aurora-panel-strong)",
        boxShadow: open
          ? "var(--aurora-shadow-medium), var(--aurora-highlight-medium)"
          : "var(--aurora-highlight-medium)",
        overflow: "hidden",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        ...style,
      }}
      {...rest}
    >
      <Button
        variant="plain"
        size="unstyled"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={hasBody ? bodyId : undefined}
        aria-label={`${name} tool call, ${STATUS_META[status].label}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: "16px 18px",
          background: open
            ? "linear-gradient(180deg, var(--aurora-panel-strong-top) 0%, var(--aurora-panel-strong) 100%)"
            : "none",
          border: "none",
          borderBottom: open ? "1px solid var(--aurora-border-default)" : "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <ChevronDown
          size={16}
          aria-hidden="true"
          style={{
            color: "var(--aurora-text-muted)",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.15s ease",
            flexShrink: 0,
          }}
        />
        <Wrench
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          style={{ color: "var(--aurora-accent-pink)", flexShrink: 0 }}
        />
        <span
          style={{
            minWidth: 0,
            flex: 1,
            color: "var(--aurora-accent-pink)",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.3,
            fontFamily: "var(--aurora-font-mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>
        <StatusGlyph status={status} />
      </Button>

      {open && hasBody && (
        <div
          id={bodyId}
          role="region"
          aria-label={`${name} details`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            padding: "20px 22px 22px",
          }}
        >
          {hasArgs && (
            <pre
              style={{
                margin: 0,
                background: "var(--aurora-control-surface)",
                border: "1px solid var(--aurora-border-default)",
                borderRadius: 12,
                padding: "18px 20px",
                color: "var(--aurora-text-primary)",
                fontSize: 15,
                lineHeight: 1.6,
                fontFamily: "var(--aurora-font-mono)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowX: "auto",
              }}
            >
              {renderJson(args)}
            </pre>
          )}
          {children != null && (
            <div
              style={{
                color: "var(--aurora-text-muted)",
                fontSize: 16,
                lineHeight: 1.4,
              }}
            >
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

ToolImpl.displayName = "Tool"

export const Tool = React.memo(ToolImpl)
// React.memo wrapper loses displayName; restore it for devtools/registry.
;(Tool as React.NamedExoticComponent).displayName = "Tool"

export default Tool
