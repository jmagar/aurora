"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// CSS injected once
// ---------------------------------------------------------------------------

const ARTIFACT_CSS = `
@keyframes aurora-blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@keyframes aurora-spin {
  to { transform: rotate(360deg); }
}
`

let artifactCSSInjected = false
function ensureArtifactCSS() {
  if (artifactCSSInjected || typeof document === "undefined") return
  const el = document.createElement("style")
  el.textContent = ARTIFACT_CSS
  document.head.appendChild(el)
  artifactCSSInjected = true
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ArtifactVariant = "panel" | "card" | "inline"

export interface ArtifactProps {
  title: string
  language: string
  code: string
  preview?: React.ReactNode
  variant?: ArtifactVariant
  isStreaming?: boolean
  className?: string
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4.5" y="1.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 4.5H2a1 1 0 00-1 1V12a1 1 0 001 1h6.5a1 1 0 001-1v-.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8.5 1.5H12.5V5.5M5.5 12.5H1.5V8.5M12.5 1.5L8 6M1.5 12.5L6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9.5 4.5H12.5M9.5 4.5V1.5M9.5 4.5L13 1M4.5 9.5H1.5M4.5 9.5V12.5M4.5 9.5L1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M4 3.5L1 6.5L4 9.5M9 3.5L12 6.5L9 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <ellipse cx="6.5" cy="6.5" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Simple syntax highlighter (no-dep, Aurora token colors)
// ---------------------------------------------------------------------------

const LANG_COLORS: Record<string, string> = {
  typescript: "var(--aurora-code-type)",
  javascript: "var(--aurora-warn)",
  tsx: "var(--aurora-code-function)",
  jsx: "var(--aurora-code-function)",
  python: "var(--aurora-accent-deep)",
  rust: "var(--aurora-accent-pink-deep)",
  go: "var(--aurora-accent-primary)",
  bash: "var(--aurora-success)",
  sh: "var(--aurora-success)",
  json: "var(--aurora-accent-pink)",
  css: "var(--aurora-accent-deep)",
  html: "var(--aurora-error)",
  sql: "var(--aurora-warn)",
  yaml: "var(--aurora-error)",
  toml: "var(--aurora-accent-pink-deep)",
}

function LanguageBadge({ language }: { language: string }) {
  const color = LANG_COLORS[language.toLowerCase()] ?? "var(--aurora-accent-primary)"
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        borderRadius: 6,
        padding: "1px 7px",
        letterSpacing: "0.02em",
      }}
    >
      {language}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick?: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
      }}
    >
      {children}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Code display with optional streaming cursor
// ---------------------------------------------------------------------------

function CodeDisplay({
  code,
  isStreaming,
  maxHeight,
}: {
  code: string
  isStreaming?: boolean
  maxHeight?: string | number
}) {
  return (
    <pre
      style={{
        margin: 0,
        padding: "14px 16px",
        overflowX: "auto",
        overflowY: maxHeight ? "auto" : "visible",
        maxHeight,
        fontSize: 13,
        lineHeight: 1.65,
        fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        color: "var(--aurora-text-primary)",
        whiteSpace: "pre",
        background: "transparent",
      }}
    >
      <code>{code}</code>
      {isStreaming && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "var(--aurora-accent-primary)",
            marginLeft: 1,
            verticalAlign: "text-bottom",
            borderRadius: 1,
            animation: "aurora-blink-cursor 1s step-end infinite",
          }}
        />
      )}
    </pre>
  )
}

// ---------------------------------------------------------------------------
// Tab pill
// ---------------------------------------------------------------------------

function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? "neutral" : "ghost"}
      size="sm"
      onClick={onClick}
      style={{
        gap: 5,
        fontSize: 12,
      }}
    >
      {children}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Copy helper
// ---------------------------------------------------------------------------

function useCopy(text: string) {
  const [copied, setCopied] = React.useState(false)
  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }, [text])
  return { copied, copy }
}

// ---------------------------------------------------------------------------
// Download helper
// ---------------------------------------------------------------------------

function downloadText(filename: string, text: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

// ---------------------------------------------------------------------------
// Panel variant (full-featured)
// ---------------------------------------------------------------------------

function ArtifactPanel({
  title,
  language,
  code,
  preview,
  isStreaming,
  style,
}: ArtifactProps) {
  const [tab, setTab] = React.useState<"code" | "preview">("code")
  const [expanded, setExpanded] = React.useState(false)
  const { copied, copy } = useCopy(code)

  const hasPreview = !!preview

  return (
    <div
      style={{
        background: "var(--aurora-panel-medium)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--radius-2, 18px)",
        overflow: "hidden",
        boxShadow: [
          "0 2px 16px rgba(0,0,0,0.28)",
          "0 1px 0 rgba(255,255,255,0.03) inset",
        ].join(", "),
        ...style,
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 12px",
          borderBottom: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-panel-strong)",
        }}
      >
        {/* Title + badge */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <LanguageBadge language={language} />

        {/* Streaming indicator */}
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "1.5px solid var(--aurora-accent-primary)",
              borderTopColor: "transparent",
              animation: "aurora-spin 0.7s linear infinite",
            }}
          />
        )}
      </div>

      {/* Tab bar (only if preview exists) */}
      {hasPreview && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 10px",
            borderBottom: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-strong)",
          }}
        >
          <TabPill active={tab === "code"} onClick={() => setTab("code")}>
            <CodeIcon />
            Code
          </TabPill>
          <TabPill active={tab === "preview"} onClick={() => setTab("preview")}>
            <EyeIcon />
            Preview
          </TabPill>

          {/* Toolbar on right */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
            <ToolbarBtn onClick={copy} title={copied ? "Copied!" : "Copy code"}>
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7L5.5 10.5L12 4" stroke="var(--aurora-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <CopyIcon />
              )}
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => downloadText(`${title}.${language}`, code)}
              title="Download"
            >
              <DownloadIcon />
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => setExpanded((e) => !e)}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </ToolbarBtn>
          </div>
        </div>
      )}

      {/* Toolbar without tabs */}
      {!hasPreview && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            padding: "4px 8px",
            borderBottom: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-panel-strong)",
          }}
        >
          <ToolbarBtn onClick={copy} title={copied ? "Copied!" : "Copy code"}>
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7L5.5 10.5L12 4" stroke="var(--aurora-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <CopyIcon />
            )}
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => downloadText(`${title}.${language}`, code)}
            title="Download"
          >
            <DownloadIcon />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => setExpanded((e) => !e)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </ToolbarBtn>
        </div>
      )}

      {/* Body */}
      <div style={{ background: "var(--aurora-bg)" }}>
        {tab === "code" || !hasPreview ? (
          <CodeDisplay
            code={code}
            isStreaming={isStreaming}
            maxHeight={expanded ? undefined : 380}
          />
        ) : (
          <div
            style={{
              padding: 16,
              minHeight: 120,
              maxHeight: expanded ? undefined : 400,
              overflowY: "auto",
            }}
          >
            {preview}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Card variant (compact in-chat mini card)
// ---------------------------------------------------------------------------

function ArtifactCard({ title, language, code, isStreaming, style }: ArtifactProps) {
  const [open, setOpen] = React.useState(false)
  const { copied, copy } = useCopy(code)
  const preview = code.split("\n").slice(0, 3).join("\n")

  return (
    <div
      style={{
        background: "var(--aurora-panel-medium)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-1)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Header row */}
      <Button variant="plain" size="unstyled"
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <CodeIcon />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <LanguageBadge language={language} />
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "1.5px solid var(--aurora-accent-primary)",
              borderTopColor: "transparent",
              animation: "aurora-spin 0.7s linear infinite",
            }}
          />
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            color: "var(--aurora-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
            flexShrink: 0,
          }}
        >
          <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Collapsed preview */}
      {!open && (
        <div
          style={{
            padding: "0 12px 10px",
            fontSize: 11,
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            color: "var(--aurora-text-muted)",
            whiteSpace: "pre",
            overflow: "hidden",
            borderTop: "1px solid var(--aurora-border-default)",
          }}
        >
          <pre style={{ margin: "8px 0 0", padding: 0, background: "transparent" }}>
            {preview}
            {code.split("\n").length > 3 && (
              <span style={{ color: "var(--aurora-text-muted)", opacity: 0.6 }}>
                {"\n"}…
              </span>
            )}
          </pre>
        </div>
      )}

      {/* Expanded full code */}
      {open && (
        <div style={{ borderTop: "1px solid var(--aurora-border-default)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              padding: "4px 8px",
              background: "var(--aurora-panel-strong)",
            }}
          >
            <ToolbarBtn onClick={copy} title={copied ? "Copied!" : "Copy"}>
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7L5.5 10.5L12 4" stroke="var(--aurora-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <CopyIcon />
              )}
            </ToolbarBtn>
          </div>
          <div style={{ background: "var(--aurora-bg)" }}>
            <CodeDisplay code={code} isStreaming={isStreaming} maxHeight={320} />
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline variant (bare code block, single line toolbar)
// ---------------------------------------------------------------------------

function ArtifactInline({ title, language, code, isStreaming, style }: ArtifactProps) {
  const { copied, copy } = useCopy(code)

  return (
    <div
      style={{
        background: "var(--aurora-bg)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-1)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 10px",
          background: "var(--aurora-panel-strong)",
          borderBottom: "1px solid var(--aurora-border-default)",
        }}
      >
        <LanguageBadge language={language} />
        <span
          style={{
            fontSize: 12,
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            flex: 1,
          }}
        >
          {title}
        </span>
        <ToolbarBtn onClick={copy} title={copied ? "Copied!" : "Copy"}>
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 4" stroke="var(--aurora-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <CopyIcon />
          )}
        </ToolbarBtn>
      </div>
      <CodeDisplay code={code} isStreaming={isStreaming} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main exported Artifact component
// ---------------------------------------------------------------------------

export function Artifact({
  variant = "panel",
  ...props
}: ArtifactProps) {
  React.useEffect(() => {
    ensureArtifactCSS()
  }, [])

  if (variant === "card") return <ArtifactCard {...props} variant={variant} />
  if (variant === "inline") return <ArtifactInline {...props} variant={variant} />
  return <ArtifactPanel {...props} variant={variant} />
}

export default Artifact
