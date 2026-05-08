"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PermissionVariant = "modal" | "banner" | "inline"

export interface PermissionPromptProps {
  /** Name of the tool or permission being requested */
  tool: string
  /** Human-readable description of the action */
  action: string
  /** File path, command, or resource target */
  target?: string
  variant?: PermissionVariant
  /** Marks this as a destructive/dangerous operation */
  isDangerous?: boolean
  onAllow?: () => void
  onDeny?: () => void
  onAllowAlways?: () => void
  /** Control visibility externally */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function ShieldIcon({ danger }: { danger?: boolean }) {
  const color = danger ? "var(--aurora-error)" : "var(--aurora-accent-primary)"
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2L15.5 4.5V9C15.5 12.5 12.5 15.5 9 16.5C5.5 15.5 2.5 12.5 2.5 9V4.5L9 2Z"
        stroke={color}
        strokeWidth="1.4"
        fill={`color-mix(in srgb, ${color} 10%, transparent)`}
        strokeLinejoin="round"
      />
      {danger ? (
        <path
          d="M9 6.5V10M9 12V12.1"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M6.5 9L8.2 10.7L11.5 7.3"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2L14.5 13H1.5L8 2Z"
        stroke="var(--aurora-warn)"
        strokeWidth="1.3"
        fill="color-mix(in srgb, var(--aurora-warn) 10%, transparent)"
        strokeLinejoin="round"
      />
      <path d="M8 6.5V9.5M8 11V11.1" stroke="var(--aurora-warn)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 5L5.5 6.5L3.5 8M7 8H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Action buttons
// ---------------------------------------------------------------------------

interface ActionButtonsProps {
  isDangerous?: boolean
  onAllow?: () => void
  onDeny?: () => void
  onAllowAlways?: () => void
  compact?: boolean
}

function ActionButtons({
  isDangerous,
  onAllow,
  onDeny,
  onAllowAlways,
  compact,
}: ActionButtonsProps) {
  const [hoveredAllow, setHoveredAllow] = React.useState(false)
  const [hoveredAlways, setHoveredAlways] = React.useState(false)
  const [hoveredDeny, setHoveredDeny] = React.useState(false)

  const allowBg = isDangerous
    ? hoveredAllow
      ? "color-mix(in srgb, var(--aurora-error) 22%, var(--aurora-control-surface))"
      : "color-mix(in srgb, var(--aurora-error) 12%, var(--aurora-control-surface))"
    : hoveredAllow
    ? "color-mix(in srgb, var(--aurora-accent-primary) 22%, var(--aurora-control-surface))"
    : "color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-control-surface))"

  const allowColor = isDangerous ? "var(--aurora-error)" : "var(--aurora-accent-primary)"
  const allowBorder = isDangerous
    ? "1px solid color-mix(in srgb, var(--aurora-error) 35%, transparent)"
    : "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"

  const gap = compact ? 6 : 8

  return (
    <div style={{ display: "flex", alignItems: "center", gap, flexWrap: "wrap" }}>
      {/* Allow */}
      <button
        type="button"
        onClick={onAllow}
        onMouseEnter={() => setHoveredAllow(true)}
        onMouseLeave={() => setHoveredAllow(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          height: compact ? 28 : 32,
          padding: compact ? "0 10px" : "0 14px",
          borderRadius: 10,
          border: allowBorder,
          background: allowBg,
          color: allowColor,
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          cursor: "pointer",
          transition: "background 120ms, border-color 120ms",
          outline: "none",
        }}
      >
        {isDangerous ? "Run anyway" : "Allow"}
      </button>

      {/* Allow always */}
      {!isDangerous && (
        <button
          type="button"
          onClick={onAllowAlways}
          onMouseEnter={() => setHoveredAlways(true)}
          onMouseLeave={() => setHoveredAlways(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: compact ? 28 : 32,
            padding: compact ? "0 10px" : "0 14px",
            borderRadius: 10,
            border: "1px solid var(--aurora-border-default)",
            background: hoveredAlways ? "var(--aurora-hover-bg)" : "transparent",
            color: "var(--aurora-text-muted)",
            fontSize: compact ? 12 : 13,
            fontWeight: 500,
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            cursor: "pointer",
            transition: "background 120ms",
            outline: "none",
            whiteSpace: "nowrap",
          }}
        >
          Allow always
        </button>
      )}

      {/* Deny */}
      <button
        type="button"
        onClick={onDeny}
        onMouseEnter={() => setHoveredDeny(true)}
        onMouseLeave={() => setHoveredDeny(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: compact ? 28 : 32,
          padding: compact ? "0 10px" : "0 14px",
          borderRadius: 10,
          border: "1px solid var(--aurora-border-default)",
          background: hoveredDeny ? "var(--aurora-hover-bg)" : "transparent",
          color: "var(--aurora-text-muted)",
          fontSize: compact ? 12 : 13,
          fontWeight: 500,
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          cursor: "pointer",
          transition: "background 120ms",
          outline: "none",
        }}
      >
        Deny
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Target display (file/command chip)
// ---------------------------------------------------------------------------

function TargetChip({ target }: { target: string }) {
  const isCommand =
    target.startsWith("$") ||
    /^[a-z]+\s/.test(target) ||
    target.includes("&&") ||
    target.includes("|")

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 8,
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
        <TerminalIcon />
      </span>
      <code
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          color: isCommand ? "var(--aurora-accent-strong)" : "var(--aurora-text-primary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {target}
      </code>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Danger warning strip
// ---------------------------------------------------------------------------

function DangerStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 10,
        background: "color-mix(in srgb, var(--aurora-error) 8%, transparent)",
        border: "1px solid color-mix(in srgb, var(--aurora-error) 28%, transparent)",
      }}
    >
      <WarningIcon />
      <p
        style={{
          margin: 0,
          fontSize: 12,
          lineHeight: 1.5,
          color: "var(--aurora-error)",
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          fontWeight: 500,
        }}
      >
        This operation may be destructive or irreversible. Review carefully before
        proceeding.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared content block
// ---------------------------------------------------------------------------

function PromptContent({
  tool,
  action,
  target,
  isDangerous,
  onAllow,
  onDeny,
  onAllowAlways,
  compact,
}: {
  tool: string
  action: string
  target?: string
  isDangerous?: boolean
  onAllow?: () => void
  onDeny?: () => void
  onAllowAlways?: () => void
  compact?: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }}>
      {/* Tool + action */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flexShrink: 0, marginTop: 1 }}>
          <ShieldIcon danger={isDangerous} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: compact ? 12 : 13,
              fontWeight: 600,
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              lineHeight: 1.4,
            }}
          >
            {tool}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: compact ? 11 : 12,
              color: "var(--aurora-text-muted)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              lineHeight: 1.5,
            }}
          >
            {action}
          </p>
        </div>
      </div>

      {/* Target */}
      {target && <TargetChip target={target} />}

      {/* Danger warning */}
      {isDangerous && <DangerStrip />}

      {/* Buttons */}
      <ActionButtons
        isDangerous={isDangerous}
        onAllow={onAllow}
        onDeny={onDeny}
        onAllowAlways={onAllowAlways}
        compact={compact}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal variant
// ---------------------------------------------------------------------------

function ModalPrompt({
  tool,
  action,
  target,
  isDangerous,
  onAllow,
  onDeny,
  onAllowAlways,
  open = true,
  onOpenChange,
}: PermissionPromptProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange?.(false)
        onDeny?.()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange, onDeny])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Permission request: ${tool}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange?.(false)
          onDeny?.()
        }
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          background: "var(--aurora-panel-strong)",
          border: isDangerous
            ? "1px solid color-mix(in srgb, var(--aurora-error) 40%, transparent)"
            : "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--radius-2, 18px)",
          padding: 24,
          boxShadow: [
            "0 24px 64px rgba(0,0,0,0.5)",
            isDangerous
              ? "0 0 0 1px color-mix(in srgb, var(--aurora-error) 15%, transparent)"
              : "0 0 0 1px rgba(41,182,246,0.06)",
          ].join(", "),
        }}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            onOpenChange?.(false)
            onDeny?.()
          }}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "var(--aurora-text-muted)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <CloseIcon />
        </button>

        <div style={{ paddingRight: 32 }}>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDangerous ? "var(--aurora-error)" : "var(--aurora-accent-primary)",
              fontFamily: "var(--font-sans, Inter, sans-serif)",
            }}
          >
            {isDangerous ? "Dangerous action" : "Permission required"}
          </p>

          <PromptContent
            tool={tool}
            action={action}
            target={target}
            isDangerous={isDangerous}
            onAllow={onAllow}
            onDeny={() => {
              onOpenChange?.(false)
              onDeny?.()
            }}
            onAllowAlways={onAllowAlways}
          />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Banner variant (top-of-page inline strip)
// ---------------------------------------------------------------------------

function BannerPrompt({
  tool,
  action,
  target,
  isDangerous,
  onAllow,
  onDeny,
  onAllowAlways,
  open = true,
  onOpenChange,
  style,
}: PermissionPromptProps) {
  if (!open) return null

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        background: isDangerous
          ? "color-mix(in srgb, var(--aurora-error) 10%, var(--aurora-panel-strong))"
          : "var(--aurora-panel-strong)",
        borderBottom: isDangerous
          ? "1px solid color-mix(in srgb, var(--aurora-error) 40%, transparent)"
          : "1px solid var(--aurora-border-default)",
        boxShadow: isDangerous
          ? "0 2px 12px color-mix(in srgb, var(--aurora-error) 12%, transparent)"
          : "0 2px 8px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      <ShieldIcon danger={isDangerous} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
          }}
        >
          {tool}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            marginLeft: 6,
          }}
        >
          — {action}
        </span>
        {target && (
          <code
            style={{
              marginLeft: 8,
              fontSize: 11,
              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
              color: "var(--aurora-accent-strong)",
              background: "var(--aurora-control-surface)",
              borderRadius: 5,
              padding: "1px 6px",
              border: "1px solid var(--aurora-border-default)",
            }}
          >
            {target}
          </code>
        )}
      </div>

      <ActionButtons
        isDangerous={isDangerous}
        onAllow={onAllow}
        onDeny={() => {
          onOpenChange?.(false)
          onDeny?.()
        }}
        onAllowAlways={onAllowAlways}
        compact
      />

      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          onOpenChange?.(false)
          onDeny?.()
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          borderRadius: 7,
          border: "none",
          background: "transparent",
          color: "var(--aurora-text-muted)",
          cursor: "pointer",
          flexShrink: 0,
          outline: "none",
        }}
      >
        <CloseIcon />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline variant (embedded in chat thread)
// ---------------------------------------------------------------------------

function InlinePrompt({
  tool,
  action,
  target,
  isDangerous,
  onAllow,
  onDeny,
  onAllowAlways,
  style,
}: PermissionPromptProps) {
  return (
    <div
      style={{
        background: isDangerous
          ? "color-mix(in srgb, var(--aurora-error) 6%, var(--aurora-panel-medium))"
          : "var(--aurora-panel-medium)",
        border: isDangerous
          ? "1px solid color-mix(in srgb, var(--aurora-error) 35%, transparent)"
          : "1px solid var(--aurora-border-default)",
        borderLeft: isDangerous
          ? "3px solid var(--aurora-error)"
          : "3px solid var(--aurora-accent-primary)",
        borderRadius: "var(--radius-1, 14px)",
        padding: "14px 16px",
        ...style,
      }}
    >
      <PromptContent
        tool={tool}
        action={action}
        target={target}
        isDangerous={isDangerous}
        onAllow={onAllow}
        onDeny={onDeny}
        onAllowAlways={onAllowAlways}
        compact
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function PermissionPrompt({ variant = "inline", ...props }: PermissionPromptProps) {
  if (variant === "modal") return <ModalPrompt {...props} variant={variant} />
  if (variant === "banner") return <BannerPrompt {...props} variant={variant} />
  return <InlinePrompt {...props} variant={variant} />
}

export default PermissionPrompt
