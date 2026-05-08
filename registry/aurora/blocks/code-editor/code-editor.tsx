"use client"

import * as React from "react"

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
}

// ---------------------------------------------------------------------------
// Token colors (Aurora palette)
// ---------------------------------------------------------------------------

type TokenType = "keyword" | "string" | "comment" | "number" | "operator" | "type" | "function" | "plain"

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:  "var(--aurora-accent-primary)",
  string:   "var(--aurora-accent-pink)",
  comment:  "var(--aurora-text-muted)",
  number:   "var(--aurora-warn)",
  operator: "var(--aurora-accent-strong)",
  type:     "#b8d9f5",
  function: "#67cbfa",
  plain:    "var(--aurora-text-primary)",
}

interface Token { type: TokenType; text: string }

// ---------------------------------------------------------------------------
// Tiny tokenizer (same approach as code-block)
// ---------------------------------------------------------------------------

function tokenizeLine(line: string, lang: string): Token[] {
  if (lang === "typescript" || lang === "tsx" || lang === "javascript" || lang === "jsx") {
    return tokenizeTS(line)
  }
  if (lang === "css" || lang === "scss") return tokenizeCSS(line)
  if (lang === "json") return tokenizeJSON(line)
  if (lang === "bash" || lang === "sh") return tokenizeBash(line)
  return [{ type: "plain", text: line }]
}

function tokenizeTS(line: string): Token[] {
  const keywords = /\b(const|let|var|function|return|import|export|from|type|interface|extends|implements|class|new|if|else|for|while|do|switch|case|break|continue|async|await|try|catch|finally|throw|typeof|instanceof|in|of|default|null|undefined|true|false|void|never|any|string|number|boolean|object|readonly|private|public|protected|static|abstract|enum|namespace|declare|as|is)\b/
  const result: Token[] = []
  let rest = line
  while (rest.length > 0) {
    if (rest.startsWith("//")) { result.push({ type: "comment", text: rest }); break }
    const strMatch = rest.match(/^(['"`])(?:\\.|(?!\1)[^\\])*\1/)
    if (strMatch) { result.push({ type: "string", text: strMatch[0] }); rest = rest.slice(strMatch[0].length); continue }
    const kwMatch = rest.match(keywords)
    if (kwMatch && rest.startsWith(kwMatch[0])) { result.push({ type: "keyword", text: kwMatch[0] }); rest = rest.slice(kwMatch[0].length); continue }
    const numMatch = rest.match(/^\b\d+(\.\d+)?\b/)
    if (numMatch) { result.push({ type: "number", text: numMatch[0] }); rest = rest.slice(numMatch[0].length); continue }
    const fnMatch = rest.match(/^([A-Za-z_$][A-Za-z0-9_$]*)(?=\s*\()/)
    if (fnMatch) { result.push({ type: "function", text: fnMatch[0] }); rest = rest.slice(fnMatch[0].length); continue }
    const typeMatch = rest.match(/^[A-Z][A-Za-z0-9_$]*/)
    if (typeMatch) { result.push({ type: "type", text: typeMatch[0] }); rest = rest.slice(typeMatch[0].length); continue }
    result.push({ type: "plain", text: rest[0] }); rest = rest.slice(1)
  }
  return mergeAdjacentPlain(result)
}

function tokenizeCSS(line: string): Token[] {
  const result: Token[] = []
  let rest = line.trimStart()
  const indent = line.slice(0, line.length - rest.length)
  if (indent) result.push({ type: "plain", text: indent })
  if (rest.startsWith("/*")) { result.push({ type: "comment", text: rest }); return result }
  const propMatch = rest.match(/^(--?[\w-]+|[\w-]+)\s*:/)
  if (propMatch) {
    result.push({ type: "keyword", text: propMatch[1] })
    rest = rest.slice(propMatch[1].length)
    const colonIdx = rest.indexOf(":")
    result.push({ type: "operator", text: rest.slice(0, colonIdx + 1) })
    const value = rest.slice(colonIdx + 1)
    const numMatch = value.match(/[\d.]+(?:px|em|rem|%|vh|vw)?/)
    if (numMatch) {
      const before = value.slice(0, value.indexOf(numMatch[0]))
      if (before) result.push({ type: "plain", text: before })
      result.push({ type: "number", text: numMatch[0] })
      const after = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length)
      if (after) result.push({ type: "plain", text: after })
    } else {
      result.push({ type: "string", text: value })
    }
    return result
  }
  result.push({ type: "plain", text: rest })
  return result
}

function tokenizeJSON(line: string): Token[] {
  const result: Token[] = []
  let rest = line
  while (rest.length > 0) {
    const strMatch = rest.match(/^"(?:\\.|[^"\\])*"/)
    if (strMatch) {
      const isKey = rest.slice(strMatch[0].length).trimStart().startsWith(":")
      result.push({ type: isKey ? "keyword" : "string", text: strMatch[0] })
      rest = rest.slice(strMatch[0].length); continue
    }
    const numMatch = rest.match(/^-?\d+(\.\d+)?/)
    if (numMatch) { result.push({ type: "number", text: numMatch[0] }); rest = rest.slice(numMatch[0].length); continue }
    const kwMatch = rest.match(/^(true|false|null)/)
    if (kwMatch) { result.push({ type: "operator", text: kwMatch[0] }); rest = rest.slice(kwMatch[0].length); continue }
    result.push({ type: "plain", text: rest[0] }); rest = rest.slice(1)
  }
  return mergeAdjacentPlain(result)
}

function tokenizeBash(line: string): Token[] {
  if (line.trimStart().startsWith("#")) return [{ type: "comment", text: line }]
  const result: Token[] = []
  let rest = line
  const cmdMatch = rest.match(/^\s*([a-z][\w.-]*)/)
  if (cmdMatch) {
    if (cmdMatch[1]) { result.push({ type: "function", text: cmdMatch[0] }); rest = rest.slice(cmdMatch[0].length) }
  }
  const flagsMatch = rest.match(/(--?[\w-]+)/)
  if (flagsMatch) {
    const idx = rest.indexOf(flagsMatch[0])
    result.push({ type: "plain", text: rest.slice(0, idx) })
    result.push({ type: "keyword", text: flagsMatch[0] })
    rest = rest.slice(idx + flagsMatch[0].length)
  }
  if (rest) result.push({ type: "plain", text: rest })
  return result
}

function mergeAdjacentPlain(tokens: Token[]): Token[] {
  return tokens.reduce<Token[]>((acc, tok) => {
    const prev = acc[acc.length - 1]
    if (prev && prev.type === "plain" && tok.type === "plain") {
      prev.text += tok.text
    } else {
      acc.push({ ...tok })
    }
    return acc
  }, [])
}

// ---------------------------------------------------------------------------
// Minimap column (visual only)
// ---------------------------------------------------------------------------

function Minimap({ lines }: { lines: string[] }) {
  const shown = lines.slice(0, 80)
  return (
    <div
      style={{
        width: "60px",
        flexShrink: 0,
        background: "var(--aurora-control-surface)",
        borderLeft: "1px solid var(--aurora-border-default)",
        overflowY: "hidden",
        padding: "8px 4px",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
      }}
    >
      {shown.map((line, i) => {
        const trimmed = line.trim()
        const width = Math.min(52, Math.max(4, trimmed.length * 0.65))
        return (
          <div
            key={i}
            style={{
              height: "2px",
              width: `${width}px`,
              background:
                trimmed.startsWith("//") || trimmed.startsWith("#")
                  ? "var(--aurora-text-muted)"
                  : trimmed
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 30%, var(--aurora-border-strong))"
                  : "transparent",
              borderRadius: "1px",
              opacity: 0.6,
            }}
          />
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Language badge
// ---------------------------------------------------------------------------

function LanguageBadge({ language }: { language: string }) {
  return (
    <span
      style={{
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
      }}
    >
      {language}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Squiggly underline style injection
// ---------------------------------------------------------------------------

const SQUIGGLE_STYLE = `
@keyframes aurora-error-squiggle {}
.aurora-squiggle {
  text-decoration: underline wavy var(--aurora-error) 1px;
  text-underline-offset: 2px;
}
.aurora-warn-squiggle {
  text-decoration: underline wavy var(--aurora-warn) 1px;
  text-underline-offset: 2px;
}
`

// ---------------------------------------------------------------------------
// Code line renderer
// ---------------------------------------------------------------------------

interface CodeLineProps {
  lineIndex: number
  content: string
  language: string
  diffType?: "add" | "remove" | "unchanged"
  errorDiagnostics?: Diagnostic[]
  showGutterError?: boolean
}

function CodeLine({ lineIndex, content, language, diffType, errorDiagnostics, showGutterError }: CodeLineProps) {
  const tokens = tokenizeLine(content, language)

  const bgColor =
    diffType === "add"
      ? "color-mix(in srgb, var(--aurora-success) 10%, transparent)"
      : diffType === "remove"
      ? "color-mix(in srgb, var(--aurora-error) 10%, transparent)"
      : "transparent"

  const linePrefix =
    diffType === "add" ? "+" : diffType === "remove" ? "−" : " "

  const hasError = errorDiagnostics && errorDiagnostics.some((d) => d.severity !== "warning" && d.severity !== "info")
  const hasWarn = errorDiagnostics && errorDiagnostics.some((d) => d.severity === "warning")

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        background: bgColor,
        minHeight: "20px",
      }}
    >
      {/* Diff prefix */}
      <span
        style={{
          width: "16px",
          flexShrink: 0,
          color:
            diffType === "add"
              ? "var(--aurora-success)"
              : diffType === "remove"
              ? "var(--aurora-error)"
              : "transparent",
          fontFamily: "var(--aurora-font-mono)",
          fontSize: "12px",
          lineHeight: "20px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {linePrefix}
      </span>

      {/* Line number */}
      <span
        style={{
          minWidth: "36px",
          flexShrink: 0,
          color: hasError
            ? "var(--aurora-error)"
            : hasWarn
            ? "var(--aurora-warn)"
            : "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-mono)",
          fontSize: "12px",
          lineHeight: "20px",
          textAlign: "right",
          paddingRight: "12px",
          userSelect: "none",
          opacity: 0.7,
        }}
      >
        {lineIndex + 1}
      </span>

      {/* Gutter error icon */}
      <span
        style={{
          width: "16px",
          flexShrink: 0,
          fontSize: "10px",
          lineHeight: "20px",
          textAlign: "center",
          color: hasError
            ? "var(--aurora-error)"
            : hasWarn
            ? "var(--aurora-warn)"
            : "transparent",
          userSelect: "none",
        }}
      >
        {hasError ? "●" : hasWarn ? "▲" : ""}
      </span>

      {/* Code content */}
      <span
        style={{
          flex: 1,
          fontFamily: "var(--aurora-font-mono)",
          fontSize: "13px",
          lineHeight: "20px",
          whiteSpace: "pre",
          overflow: "visible",
        }}
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
}

// ---------------------------------------------------------------------------
// Error panel
// ---------------------------------------------------------------------------

function ErrorPanel({ errors }: { errors: Diagnostic[] }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--aurora-border-default)",
        background: "color-mix(in srgb, var(--aurora-error) 5%, var(--aurora-panel-strong))",
        padding: "6px 12px",
        maxHeight: "120px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontFamily: "var(--aurora-font-sans)",
          fontWeight: 600,
          color: "var(--aurora-error)",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Problems ({errors.length})
      </div>
      {errors.map((err, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            fontSize: "12px",
            fontFamily: "var(--aurora-font-sans)",
            color: err.severity === "warning" ? "var(--aurora-warn)" : "var(--aurora-error)",
            padding: "2px 0",
          }}
        >
          <span style={{ fontFamily: "var(--aurora-font-mono)", opacity: 0.7, flexShrink: 0 }}>
            {err.line}:{err.col ?? 0}
          </span>
          <span style={{ color: "var(--aurora-text-primary)" }}>{err.message}</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------

function StatusBar({
  language,
  lineCount,
}: {
  language: string
  lineCount: number
}) {
  return (
    <div
      style={{
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
      }}
    >
      <span>Ln 1, Col 1</span>
      <span>UTF-8</span>
      <span style={{ color: "var(--aurora-accent-primary)" }}>{language}</span>
      <div style={{ flex: 1 }} />
      <span>{lineCount} lines</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main CodeEditor component
// ---------------------------------------------------------------------------

export const CodeEditor = React.forwardRef<HTMLDivElement, CodeEditorProps>(
  function CodeEditor(
    { filename, language, code, diff, errors = [], variant = "full", onClose },
    ref
  ) {
    const lines = code.split("\n")
    const isDiff = diff && diff.length > 0
    const isCompact = variant === "compact"

    // Map line numbers to diagnostics
    const diagByLine = React.useMemo(() => {
      const map: Record<number, Diagnostic[]> = {}
      for (const diag of errors) {
        if (!map[diag.line]) map[diag.line] = []
        map[diag.line].push(diag)
      }
      return map
    }, [errors])

    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "var(--aurora-bg, var(--aurora-panel-medium))",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          overflow: "hidden",
          boxShadow: "var(--aurora-shadow-medium)",
          fontFamily: "var(--aurora-font-mono)",
        }}
      >
        <style>{SQUIGGLE_STYLE}</style>

        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 12px",
            height: "38px",
            background: "var(--aurora-panel-strong)",
            borderBottom: "1px solid var(--aurora-border-default)",
            flexShrink: 0,
          }}
        >
          {/* File icon */}
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M7.5 1H2C1.448 1 1 1.448 1 2V12C1 12.552 1.448 13 2 13H11C11.552 13 12 12.552 12 12V5.5L7.5 1Z"
              stroke="var(--aurora-accent-primary)"
              strokeWidth="1"
              fill="none"
              opacity="0.8"
            />
            <path d="M7.5 1V5.5H12" stroke="var(--aurora-accent-primary)" strokeWidth="1" opacity="0.5" />
          </svg>

          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "13px",
              color: "var(--aurora-text-primary)",
              fontWeight: 500,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {filename}
          </span>

          <LanguageBadge language={language} />

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "22px",
                height: "22px",
                borderRadius: "6px",
                background: "transparent",
                border: "1px solid var(--aurora-border-default)",
                color: "var(--aurora-text-muted)",
                cursor: "pointer",
                fontSize: "13px",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Code area + minimap */}
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {/* Code scroll area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "auto",
              padding: "8px 0",
              background: "var(--aurora-control-surface)",
            }}
          >
            {isDiff
              ? diff!.map((dl, i) => (
                  <CodeLine
                    key={i}
                    lineIndex={i}
                    content={dl.content}
                    language={language}
                    diffType={dl.type}
                    errorDiagnostics={diagByLine[i + 1]}
                  />
                ))
              : lines.map((line, i) => (
                  <CodeLine
                    key={i}
                    lineIndex={i}
                    content={line}
                    language={language}
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
)

export default CodeEditor
