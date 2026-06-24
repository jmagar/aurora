"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

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

type TokenType =
  | "keyword"    // control flow, declarations — orange
  | "type"       // PascalCase types, primitives — cyan-strong
  | "string"     // string literals — success/teal
  | "comment"    // inline + block comments — muted
  | "number"     // numeric literals — warn/amber
  | "function"   // call sites — accent-primary/cyan
  | "macro"      // Rust #[attr] / #! macros — rose/pink
  | "operator"   // punctuation, operators — accent-strong
  | "plain"      // everything else — primary text

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

interface Token { type: TokenType; text: string }

// ---------------------------------------------------------------------------
// Shared tokenizer utilities
// ---------------------------------------------------------------------------

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

/** Advance `rest` by `n` chars, appending a token. Returns new rest. */
function eat(result: Token[], rest: string, n: number, type: TokenType): string {
  result.push({ type, text: rest.slice(0, n) })
  return rest.slice(n)
}

// ---------------------------------------------------------------------------
// Language tokenizers
// ---------------------------------------------------------------------------

const RUST_KEYWORDS = /^(as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while|abstract|become|box|do|final|macro|override|priv|try|typeof|unsized|virtual|yield)\b/
const RUST_TYPES    = /^(bool|char|f32|f64|i8|i16|i32|i64|i128|isize|str|u8|u16|u32|u64|u128|usize|String|Vec|Option|Result|Box|Arc|Rc|Cell|RefCell|HashMap|HashSet|BTreeMap|BTreeSet|Mutex|RwLock|Pin|Cow)\b/
const RUST_BUILTIN  = /^(println|print|eprintln|eprint|format|vec|panic|assert|assert_eq|assert_ne|todo|unimplemented|unreachable|dbg|write|writeln|concat|include|env|cfg|derive|allow|warn|deny|forbid|deprecated|must_use|inline|test|cfg_attr)\b/

function tokenizeRust(line: string): Token[] {
  const result: Token[] = []
  let rest = line

  while (rest.length > 0) {
    // Block comment
    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/", 2)
      const len = end === -1 ? rest.length : end + 2
      rest = eat(result, rest, len, "comment")
      continue
    }
    // Line comment (// and //!)
    if (rest.startsWith("//")) { result.push({ type: "comment", text: rest }); break }

    // Rust attribute / macro: #[...] or #![...]
    if (rest.startsWith("#[") || rest.startsWith("#![")) {
      const close = rest.indexOf("]")
      const len = close === -1 ? rest.length : close + 1
      rest = eat(result, rest, len, "macro")
      continue
    }

    // String (double-quoted, raw r"..." r#"..."# handled partially)
    if (rest[0] === '"') {
      let i = 1
      while (i < rest.length) {
        if (rest[i] === '\\') { i += 2; continue }
        if (rest[i] === '"') { i++; break }
        i++
      }
      rest = eat(result, rest, i, "string")
      continue
    }
    // Char literal
    if (rest[0] === "'") {
      let i = 1
      while (i < rest.length) {
        if (rest[i] === '\\') { i += 2; continue }
        if (rest[i] === "'") { i++; break }
        i++
      }
      // Distinguish char literals from lifetime params (short 'a, 'static etc.)
      const snippet = rest.slice(0, i)
      rest = eat(result, rest, i, snippet.length <= 3 || snippet.includes('\\') ? "string" : "plain")
      continue
    }

    // Macro call: name! (before keyword/type matching so vec!/println! etc. colour correctly)
    const macroCallMatch = rest.match(/^([A-Za-z_][A-Za-z0-9_]*)!/)
    if (macroCallMatch) {
      rest = eat(result, rest, macroCallMatch[1].length, "macro")
      // leave the '!' as operator on next iteration
      continue
    }

    // Keywords
    const kwMatch = rest.match(RUST_KEYWORDS)
    if (kwMatch) { rest = eat(result, rest, kwMatch[0].length, "keyword"); continue }

    // Built-in types
    const typeMatch = rest.match(RUST_TYPES)
    if (typeMatch) { rest = eat(result, rest, typeMatch[0].length, "type"); continue }

    // PascalCase identifiers → type
    const pascalMatch = rest.match(/^[A-Z][A-Za-z0-9_]*/)
    if (pascalMatch) { rest = eat(result, rest, pascalMatch[0].length, "type"); continue }

    // Function call: ident(
    const fnCallMatch = rest.match(/^([a-z_][A-Za-z0-9_]*)(?=\s*\()/)
    if (fnCallMatch) { rest = eat(result, rest, fnCallMatch[0].length, "function"); continue }

    // Builtin macros (without !) treated as functions
    const builtinMatch = rest.match(RUST_BUILTIN)
    if (builtinMatch) { rest = eat(result, rest, builtinMatch[0].length, "function"); continue }

    // Numbers: hex, binary, octal, float, int (with optional suffix/underscores)
    const numMatch = rest.match(/^(?:0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?(?:_?[a-z0-9]*)?)/)
    if (numMatch && /\d/.test(numMatch[0][0])) { rest = eat(result, rest, numMatch[0].length, "number"); continue }

    // Operators and punctuation
    const opMatch = rest.match(/^(?:->|=>|::|\.\.=?|&&|\|\||[+\-*/%&|^~<>=!?.,:;@#{}()[\]])/)
    if (opMatch) { rest = eat(result, rest, opMatch[0].length, "operator"); continue }

    result.push({ type: "plain", text: rest[0] }); rest = rest.slice(1)
  }
  return mergeAdjacentPlain(result)
}

const TS_KEYWORDS = /^(const|let|var|function|return|import|export|from|as|type|interface|extends|implements|class|new|if|else|for|while|do|switch|case|break|continue|async|await|try|catch|finally|throw|typeof|instanceof|in|of|default|null|undefined|true|false|void|never|any|string|number|boolean|object|readonly|private|public|protected|static|abstract|enum|namespace|declare|satisfies|using|keyof|infer|is|override)\b/

function tokenizeTS(line: string): Token[] {
  const result: Token[] = []
  let rest = line

  while (rest.length > 0) {
    if (rest.startsWith("//")) { result.push({ type: "comment", text: rest }); break }
    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/", 2)
      const len = end === -1 ? rest.length : end + 2
      rest = eat(result, rest, len, "comment")
      continue
    }

    // Template literal (simplified — no nested ${} colouring)
    if (rest[0] === '`') {
      let i = 1
      while (i < rest.length) {
        if (rest[i] === '\\') { i += 2; continue }
        if (rest[i] === '`') { i++; break }
        i++
      }
      rest = eat(result, rest, i, "string")
      continue
    }
    // String
    if (rest[0] === '"' || rest[0] === "'") {
      const q = rest[0]
      let i = 1
      while (i < rest.length) {
        if (rest[i] === '\\') { i += 2; continue }
        if (rest[i] === q) { i++; break }
        i++
      }
      rest = eat(result, rest, i, "string")
      continue
    }

    const kwMatch = rest.match(TS_KEYWORDS)
    if (kwMatch) { rest = eat(result, rest, kwMatch[0].length, "keyword"); continue }

    // PascalCase → type
    const pascalMatch = rest.match(/^[A-Z][A-Za-z0-9_$]*/)
    if (pascalMatch) { rest = eat(result, rest, pascalMatch[0].length, "type"); continue }

    // Function call
    const fnCallMatch = rest.match(/^([A-Za-z_$][A-Za-z0-9_$]*)(?=\s*\()/)
    if (fnCallMatch) { rest = eat(result, rest, fnCallMatch[0].length, "function"); continue }

    // Number
    const numMatch = rest.match(/^\b\d+(\.\d+)?([eE][+-]?\d+)?\b/)
    if (numMatch) { rest = eat(result, rest, numMatch[0].length, "number"); continue }

    // Operator
    const opMatch = rest.match(/^(?:===?|!==?|&&|\|\||=>|\?\?|[+\-*/%&|^~<>=!?.,:;@#{}()[\]])/)
    if (opMatch) { rest = eat(result, rest, opMatch[0].length, "operator"); continue }

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
    const numMatch = value.match(/[\d.]+(?:px|em|rem|%|vh|vw|ch|ex|dvh|dvw)?/)
    if (numMatch) {
      const idx = value.indexOf(numMatch[0])
      if (idx > 0) result.push({ type: "plain", text: value.slice(0, idx) })
      result.push({ type: "number", text: numMatch[0] })
      const after = value.slice(idx + numMatch[0].length)
      if (after) result.push({ type: "plain", text: after })
    } else {
      result.push({ type: "string", text: value })
    }
    return result
  }
  // Selector-like line
  if (rest.match(/^[.#:[\w-]/)) result.push({ type: "type", text: rest })
  else result.push({ type: "plain", text: rest })
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
    const numMatch = rest.match(/^-?\d+(\.\d+)?([eE][+-]?\d+)?/)
    if (numMatch) { result.push({ type: "number", text: numMatch[0] }); rest = rest.slice(numMatch[0].length); continue }
    const kwMatch = rest.match(/^(true|false|null)/)
    if (kwMatch) { result.push({ type: "keyword", text: kwMatch[0] }); rest = rest.slice(kwMatch[0].length); continue }
    result.push({ type: "plain", text: rest[0] }); rest = rest.slice(1)
  }
  return mergeAdjacentPlain(result)
}

function tokenizeBash(line: string): Token[] {
  const trimmed = line.trimStart()
  if (trimmed.startsWith("#")) return [{ type: "comment", text: line }]
  const result: Token[] = []
  let rest = line

  // Leading indent
  const indentLen = line.length - trimmed.length
  if (indentLen > 0) { result.push({ type: "plain", text: line.slice(0, indentLen) }); rest = trimmed }

  // Shell keywords
  const kwMatch = rest.match(/^(if|then|else|elif|fi|for|while|do|done|case|esac|in|function|return|local|export|readonly|declare|source|\.|echo|cd|ls|rm|cp|mv|mkdir|touch|grep|sed|awk|find|cat|head|tail|sort|uniq|wc|cut|tr|xargs|chmod|chown|curl|wget|git|npm|pnpm|yarn|cargo|rustc|node|python|pip|make|sudo)\b/)
  if (kwMatch) { rest = eat(result, rest, kwMatch[0].length, "keyword"); }

  // Walk remaining characters
  while (rest.length > 0) {
    // String
    if (rest[0] === '"' || rest[0] === "'") {
      const q = rest[0]
      let i = 1
      while (i < rest.length) {
        if (rest[i] === '\\') { i += 2; continue }
        if (rest[i] === q) { i++; break }
        i++
      }
      rest = eat(result, rest, i, "string")
      continue
    }
    // Variable $VAR or ${VAR}
    if (rest[0] === '$') {
      const varMatch = rest.match(/^\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/)
      if (varMatch) { rest = eat(result, rest, varMatch[0].length, "type"); continue }
    }
    // Flags --foo / -f
    const flagMatch = rest.match(/^--?[A-Za-z][\w-]*/)
    if (flagMatch) { rest = eat(result, rest, flagMatch[0].length, "macro"); continue }
    // Numbers
    const numMatch = rest.match(/^\b\d+\b/)
    if (numMatch) { rest = eat(result, rest, numMatch[0].length, "number"); continue }

    result.push({ type: "plain", text: rest[0] }); rest = rest.slice(1)
  }
  return mergeAdjacentPlain(result)
}

// ---------------------------------------------------------------------------
// Top-level dispatcher
// ---------------------------------------------------------------------------

function tokenizeLine(line: string, lang: string): Token[] {
  switch (lang) {
    case "rust": case "rs":
      return tokenizeRust(line)
    case "typescript": case "tsx": case "javascript": case "jsx": case "ts": case "js":
      return tokenizeTS(line)
    case "css": case "scss":
      return tokenizeCSS(line)
    case "json":
      return tokenizeJSON(line)
    case "bash": case "sh": case "zsh":
      return tokenizeBash(line)
    default:
      // Best-effort: try TS tokenizer for unknown langs (handles most C-family syntax gracefully)
      return tokenizeTS(line)
  }
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
}

function CodeLine({ lineIndex, content, language, diffType, errorDiagnostics }: CodeLineProps) {
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
    { filename, language, code, diff, errors = [], variant = "full", onClose, embedded = false },
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
          border: embedded ? "none" : "1px solid var(--aurora-border-default)",
          borderRadius: embedded ? 0 : "var(--aurora-radius-2)",
          overflow: "hidden",
          boxShadow: embedded ? "none" : "var(--aurora-shadow-medium)",
          fontFamily: "var(--aurora-font-mono)",
          ...(embedded ? { flex: 1, minWidth: 0 } : null),
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
            <Button
              type="button"
              variant="neutral"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: "22px",
                height: "22px",
                fontSize: "13px",
              }}
            >
              ×
            </Button>
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
