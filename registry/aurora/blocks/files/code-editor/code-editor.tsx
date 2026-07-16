"use client"

import * as React from "react"
import { FileCode, X } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { tokenizeCode, type Token, type TokenType } from "./tokenizer"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiffLine {
  type: "add" | "remove" | "unchanged"
  content: string
  lineNumber?: number
}

export interface Diagnostic {
  line: number
  col?: number
  message: string
  severity?: "error" | "warning" | "info"
}

export interface CodeEditorProps {
  filename: string
  language: string
  code: string
  diff?: DiffLine[]
  errors?: Diagnostic[]
  variant?: "full" | "compact"
  onClose?: () => void
  /** Drop the outer border/radius/shadow so the editor sits flush inside a
   * parent frame (e.g. the CodeWorkspace block). */
  embedded?: boolean
}

// ---------------------------------------------------------------------------
// Token colors (Aurora palette)
// ---------------------------------------------------------------------------

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:  "var(--axon-orange, #ff9645)",
  type:     "var(--aurora-accent-strong, #67cbfa)",
  string:   "var(--aurora-success, #7dd3c7)",
  comment:  "var(--aurora-text-muted)",
  number:   "var(--aurora-warn)",
  function: "var(--aurora-accent-primary)",
  macro:    "var(--aurora-accent-pink, #f9a8c4)",
  operator: "var(--aurora-text-muted)",
  plain:    "var(--aurora-text-primary)",
}

// ---------------------------------------------------------------------------
// Static style objects — hoisted to module scope
// ---------------------------------------------------------------------------

const CE = {
  minimapContainer: {
    width: "60px",
    flexShrink: 0,
    background: "var(--aurora-control-surface)",
    borderLeft: "1px solid var(--aurora-border-default)",
    overflowY: "hidden",
    padding: "8px 4px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1px",
  } as React.CSSProperties,

  minimapLineBase: {
    height: "2px",
    borderRadius: "1px",
    opacity: 0.6,
  } as React.CSSProperties,

  langBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "1px 7px",
    borderRadius: "5px",
    background: "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)",
    border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 20%, transparent)",
    color: "var(--aurora-accent-primary)",
    fontFamily: "var(--aurora-font-mono)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.02em",
  } as React.CSSProperties,

  codeLineRow: {
    display: "flex",
    alignItems: "flex-start",
    minHeight: "20px",
  } as React.CSSProperties,

  diffPrefixBase: {
    width: "16px",
    flexShrink: 0,
    fontFamily: "var(--aurora-font-mono)",
    fontSize: "12px",
    lineHeight: "20px",
    textAlign: "center" as const,
    userSelect: "none" as const,
  } as React.CSSProperties,

  lineNumBase: {
    minWidth: "36px",
    flexShrink: 0,
    fontFamily: "var(--aurora-font-mono)",
    fontSize: "12px",
    lineHeight: "20px",
    textAlign: "right" as const,
    paddingRight: "12px",
    userSelect: "none" as const,
    opacity: 0.7,
  } as React.CSSProperties,

  gutterIcon: {
    width: "16px",
    flexShrink: 0,
    fontSize: "10px",
    lineHeight: "20px",
    textAlign: "center" as const,
    userSelect: "none" as const,
  } as React.CSSProperties,

  codeContent: {
    flex: 1,
    fontFamily: "var(--aurora-font-mono)",
    fontSize: "13px",
    lineHeight: "20px",
    whiteSpace: "pre" as const,
    overflow: "visible" as const,
  } as React.CSSProperties,

  errorPanel: {
    borderTop: "1px solid var(--aurora-border-default)",
    background: "color-mix(in srgb, var(--aurora-error) 5%, var(--aurora-panel-strong))",
    padding: "6px 12px",
    maxHeight: "120px",
    overflowY: "auto" as const,
  } as React.CSSProperties,

  errorPanelHeading: {
    fontSize: "11px",
    fontFamily: "var(--aurora-font-sans)",
    fontWeight: 600,
    color: "var(--aurora-error)",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  } as React.CSSProperties,

  errorRowBase: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    fontSize: "12px",
    fontFamily: "var(--aurora-font-sans)",
    padding: "2px 0",
  } as React.CSSProperties,

  errorRowWarn: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    fontSize: "12px",
    fontFamily: "var(--aurora-font-sans)",
    padding: "2px 0",
    color: "var(--aurora-warn)",
  } as React.CSSProperties,

  errorRowError: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    fontSize: "12px",
    fontFamily: "var(--aurora-font-sans)",
    padding: "2px 0",
    color: "var(--aurora-error)",
  } as React.CSSProperties,

  errorRowPos: {
    fontFamily: "var(--aurora-font-mono)",
    opacity: 0.7,
    flexShrink: 0,
  } as React.CSSProperties,

  errorRowMsg: { color: "var(--aurora-text-primary)" } as React.CSSProperties,

  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "0 12px",
    height: "24px",
    background: "var(--aurora-panel-strong)",
    borderTop: "1px solid var(--aurora-border-default)",
    fontFamily: "var(--aurora-font-sans)",
    fontSize: "11px",
    color: "var(--aurora-text-muted)",
    flexShrink: 0,
  } as React.CSSProperties,

  statusBarLang: { color: "var(--aurora-accent-primary)" } as React.CSSProperties,
  statusBarSpacer: { flex: 1 } as React.CSSProperties,

  titleBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px",
    height: "38px",
    background: "var(--aurora-panel-strong)",
    borderBottom: "1px solid var(--aurora-border-default)",
    flexShrink: 0,
  } as React.CSSProperties,

  titleBarFileIcon: { flexShrink: 0 } as React.CSSProperties,

  titleBarFilename: {
    fontFamily: "var(--aurora-font-sans)",
    fontSize: "13px",
    color: "var(--aurora-text-primary)",
    fontWeight: 500,
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  titleBarCloseBtn: { width: "22px", height: "22px", fontSize: "13px" } as React.CSSProperties,

  codeAreaRow: { display: "flex", flex: 1, minHeight: 0, overflow: "hidden" } as React.CSSProperties,

  codeScrollArea: {
    flex: 1,
    overflowY: "auto" as const,
    overflowX: "auto" as const,
    padding: "8px 0",
    background: "var(--aurora-control-surface)",
  } as React.CSSProperties,
} as const

// ---------------------------------------------------------------------------
// Minimap column (visual only)
// ---------------------------------------------------------------------------

const Minimap = React.memo(function Minimap({ lines }: { lines: string[] }) {
  const shown = lines.slice(0, 80)
  return (
    <div style={CE.minimapContainer}>
      {shown.map((line, i) => {
        const trimmed = line.trim()
        const width = Math.min(52, Math.max(4, trimmed.length * 0.65))
        const bg =
          trimmed.startsWith("//") || trimmed.startsWith("#")
            ? "var(--aurora-text-muted)"
            : trimmed
            ? "color-mix(in srgb, var(--aurora-accent-primary) 30%, var(--aurora-border-strong))"
            : "transparent"
        return (
          <div
            key={i}
            style={{ ...CE.minimapLineBase, width: `${width}px`, background: bg }}
          />
        )
      })}
    </div>
  )
})

// ---------------------------------------------------------------------------
// Language badge
// ---------------------------------------------------------------------------

function LanguageBadge({ language }: { language: string }) {
  return <span style={CE.langBadge}>{language}</span>
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// ---------------------------------------------------------------------------
// Code line renderer
// ---------------------------------------------------------------------------

interface CodeLineProps {
  lineIndex: number
  diffType?: "add" | "remove" | "unchanged"
  errorDiagnostics?: Diagnostic[]
  tokens: Token[]
}

const CodeLine = React.memo(function CodeLine({
  lineIndex,
  diffType,
  errorDiagnostics,
  tokens,
}: CodeLineProps) {

  const bgColor =
    diffType === "add"
      ? "color-mix(in srgb, var(--aurora-success) 10%, transparent)"
      : diffType === "remove"
      ? "color-mix(in srgb, var(--aurora-error) 10%, transparent)"
      : "transparent"

  const linePrefix = diffType === "add" ? "+" : diffType === "remove" ? "−" : " "

  const hasError =
    errorDiagnostics &&
    errorDiagnostics.some((d) => d.severity !== "warning" && d.severity !== "info")
  const hasWarn =
    errorDiagnostics && errorDiagnostics.some((d) => d.severity === "warning")

  const diffPrefixColor =
    diffType === "add"
      ? "var(--aurora-success)"
      : diffType === "remove"
      ? "var(--aurora-error)"
      : "transparent"

  const lineNumColor = hasError
    ? "var(--aurora-error)"
    : hasWarn
    ? "var(--aurora-warn)"
    : "var(--aurora-text-muted)"

  const gutterColor = hasError
    ? "var(--aurora-error)"
    : hasWarn
    ? "var(--aurora-warn)"
    : "transparent"

  return (
    <div style={{ ...CE.codeLineRow, background: bgColor }}>
      {/* Diff prefix */}
      <span style={{ ...CE.diffPrefixBase, color: diffPrefixColor }}>{linePrefix}</span>

      {/* Line number */}
      <span style={{ ...CE.lineNumBase, color: lineNumColor }}>{lineIndex + 1}</span>

      {/* Gutter error icon */}
      <span style={{ ...CE.gutterIcon, color: gutterColor }}>
        {hasError ? "●" : hasWarn ? "▲" : ""}
      </span>

      {/* Code content */}
      <span
        style={CE.codeContent}
        className={hasError ? "aurora-squiggle" : hasWarn ? "aurora-warn-squiggle" : undefined}
      >
        {tokens.map((tok, i) => (
          <span key={i} style={{ color: TOKEN_COLORS[tok.type] }}>
            {tok.text}
          </span>
        ))}
      </span>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Error panel
// ---------------------------------------------------------------------------

function ErrorPanel({ errors }: { errors: Diagnostic[] }) {
  return (
    <div style={CE.errorPanel}>
      <div style={CE.errorPanelHeading}>Problems ({errors.length})</div>
      {errors.map((err, i) => (
        <div
          key={i}
          style={err.severity === "warning" ? CE.errorRowWarn : CE.errorRowError}
        >
          <span style={CE.errorRowPos}>{err.line}:{err.col ?? 0}</span>
          <span style={CE.errorRowMsg}>{err.message}</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------

function StatusBar({ language, lineCount }: { language: string; lineCount: number }) {
  return (
    <div style={CE.statusBar}>
      <span>Ln 1, Col 1</span>
      <span>UTF-8</span>
      <span style={CE.statusBarLang}>{language}</span>
      <div style={CE.statusBarSpacer} />
      <span>{lineCount} lines</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main CodeEditor component
// ---------------------------------------------------------------------------

export const CodeEditor = function CodeEditor(
    { ref, filename, language, code, diff, errors = [], variant = "full", onClose, embedded = false }: CodeEditorProps & { ref?: React.Ref<HTMLDivElement> }
  ) {
    const lines = React.useMemo(() => code.split("\n"), [code])
    const isDiff = diff && diff.length > 0
    const isCompact = variant === "compact"
    const displayedLines = React.useMemo(
      () => isDiff ? diff.map((line) => line.content) : lines,
      [diff, isDiff, lines],
    )
    const tokenLines = React.useMemo(
      () => tokenizeCode(displayedLines.join("\n"), language),
      [displayedLines, language],
    )

    // Map line numbers to diagnostics
    const diagByLine = React.useMemo(() => {
      const map: Record<number, Diagnostic[]> = {}
      for (const diag of errors) {
        if (!map[diag.line]) map[diag.line] = []
        map[diag.line].push(diag)
      }
      return map
    }, [errors])

    // Memoized root style — only recomputes when embedded changes
    const rootStyle = React.useMemo<React.CSSProperties>(
      () => ({
        display: "flex",
        flexDirection: "column",
        background: "var(--aurora-bg, var(--aurora-panel-medium))",
        border: embedded ? "none" : "1px solid var(--aurora-border-default)",
        borderRadius: embedded ? 0 : "var(--aurora-radius-2)",
        overflow: "hidden",
        boxShadow: embedded ? "none" : "var(--aurora-shadow-medium)",
        fontFamily: "var(--aurora-font-mono)",
        ...(embedded ? { flex: 1, minWidth: 0 } : null),
      }),
      [embedded]
    )

    return (
      <div ref={ref} style={rootStyle}>
        {/* Title bar */}
        <div style={CE.titleBar}>
          {/* File icon */}
          <FileCode
            size={14}
            strokeWidth={1.65}
            aria-hidden
            style={{ ...CE.titleBarFileIcon, color: "var(--aurora-accent-primary)" }}
          />

          <span style={CE.titleBarFilename}>{filename}</span>

          <LanguageBadge language={language} />

          {onClose && (
            <Button
              type="button"
              variant="neutral"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              style={CE.titleBarCloseBtn}
            >
              <X size={13} strokeWidth={1.65} aria-hidden />
            </Button>
          )}
        </div>

        {/* Code area + minimap */}
        <div style={CE.codeAreaRow}>
          {/* Code scroll area */}
          <div style={CE.codeScrollArea}>
            {isDiff
              ? diff!.map((dl, i) => (
                  <CodeLine
                    key={i}
                    lineIndex={i}
                    tokens={tokenLines[i] ?? []}
                    diffType={dl.type}
                    errorDiagnostics={diagByLine[i + 1]}
                  />
                ))
              : lines.map((line, i) => (
                  <CodeLine
                    key={i}
                    lineIndex={i}
                    tokens={tokenLines[i] ?? []}
                    errorDiagnostics={diagByLine[i + 1]}
                  />
                ))}
          </div>

          {/* Minimap (full variant only) */}
          {!isCompact && <Minimap lines={isDiff ? diff!.map((d) => d.content) : lines} />}
        </div>

        {/* Error panel */}
        {errors.length > 0 && <ErrorPanel errors={errors} />}

        {/* Status bar (full variant only) */}
        {!isCompact && (
          <StatusBar
            language={language}
            lineCount={isDiff ? diff!.length : lines.length}
          />
        )}
      </div>
    )
  }

export default CodeEditor
