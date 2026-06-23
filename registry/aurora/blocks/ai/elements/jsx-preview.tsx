"use client"

import * as React from "react"
import { Check, Code2, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export interface JsxPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source to render in the preview surface. */
  code: string
  /** Filename shown in the header, e.g. `DeployButton.jsx`. */
  filename?: string
  /** Language pill label. Defaults to `JSX`. */
  language?: string
  /** Show the gutter line numbers. Defaults to `true`. */
  lineNumbers?: boolean
}

// ── Aurora token panel surface (mirrors the elements panelStyle) ───────────────
function jsxPanelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-surface-raised)",
    border: "1px solid var(--aurora-border-strong)",
    borderRadius: "var(--aurora-radius-1)",
    boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    ...style,
  }
}

// ── Lightweight JSX token tinting (cosmetic — not a real tokenizer) ────────────
const KEYWORDS = new Set([
  "export",
  "function",
  "return",
  "const",
  "let",
  "var",
  "import",
  "from",
  "default",
  "if",
  "else",
  "for",
  "while",
  "new",
  "await",
  "async",
])

type Tone =
  | "keyword"
  | "tag"
  | "string"
  | "comment"
  | "punctuation"
  | "plain"

const TONE_COLOR: Record<Tone, string> = {
  keyword: "var(--aurora-accent-pink)",
  tag: "var(--aurora-code-function)",
  string: "var(--aurora-accent-strong)",
  comment: "var(--aurora-text-muted)",
  punctuation: "var(--aurora-text-muted)",
  plain: "var(--aurora-text-primary)",
}

// Split a line into tinted spans. Order matters: strings/comments first so we
// don't re-tokenize their contents.
function tintLine(line: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  // Match strings, comments, JSX tags, identifiers, or any other run.
  const re =
    /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*)|([A-Za-z_$][\w$]*)|([^\sA-Za-z_$"'`/]+)|(\s+|.)/g
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(line)) !== null) {
    const [, comment, str, tag, ident, punct] = m
    const text = m[0]
    let tone: Tone = "plain"
    if (comment) tone = "comment"
    else if (str) tone = "string"
    else if (tag) tone = "tag"
    else if (ident) tone = KEYWORDS.has(ident) ? "keyword" : "plain"
    else if (punct) tone = "punctuation"
    out.push(
      tone === "plain" ? (
        text
      ) : (
        <span key={`${keyPrefix}-${i}`} style={{ color: TONE_COLOR[tone] }}>
          {text}
        </span>
      ),
    )
    i += 1
  }
  return out
}

const JsxPreview = React.memo(
  React.forwardRef<HTMLDivElement, JsxPreviewProps>(function JsxPreview(
    {
      code,
      filename,
      language = "JSX",
      lineNumbers = true,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const [copied, setCopied] = React.useState(false)
    const lines = React.useMemo(() => code.split("\n"), [code])

    const handleCopy = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      } catch {
        /* clipboard unavailable */
      }
    }, [code])

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden", className)}
        style={jsxPanelStyle(style)}
        {...props}
      >
        {/* Header: code icon · filename · language pill · copy */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Code2
            className="size-4 shrink-0"
            aria-hidden
            style={{ color: "var(--aurora-accent-primary)" }}
          />
          <span
            className="min-w-0 flex-1 truncate"
            style={{
              color: "var(--aurora-text-primary)",
              fontFamily: "var(--aurora-font-mono)",
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: "-0.005em",
              lineHeight: 1.2,
            }}
          >
            {filename ?? "preview"}
          </span>
          <span
            className="shrink-0 rounded-[7px] px-1.5 py-0.5"
            style={{
              border: "1px solid var(--aurora-accent-pink-border)",
              background: "var(--aurora-accent-pink-surface)",
              color: "var(--aurora-accent-pink)",
              fontFamily: "var(--aurora-font-mono)",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.08em",
              lineHeight: 1.4,
            }}
          >
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied source" : "Copy source"}
            className="grid size-8 shrink-0 place-items-center rounded-[8px] transition-colors"
            style={{
              border: "1px solid var(--aurora-border-default)",
              background: "color-mix(in srgb, var(--aurora-panel-medium) 70%, transparent)",
              color: "var(--aurora-text-muted)",
            }}
          >
            {copied ? (
              <Check className="size-4" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {copied ? "Copied" : ""}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div aria-hidden style={{ height: 1, background: "var(--aurora-border-default)" }} />

        {/* Body: line-numbered, tinted source */}
        <pre
          className="overflow-auto aurora-text-code"
          style={{
            margin: 0,
            padding: "14px 0",
            background: "var(--aurora-panel-strong)",
            lineHeight: 1.65,
            tabSize: 2,
          }}
        >
          <code style={{ display: "block" }}>
            {lines.map((line, idx) => (
              <span key={idx} className="grid grid-cols-[auto_minmax(0,1fr)]">
                {lineNumbers ? (
                  <span
                    aria-hidden
                    className="select-none pr-4 pl-5 text-right tabular-nums"
                    style={{ color: "var(--aurora-text-muted)", opacity: 0.7, minWidth: "3.25em" }}
                  >
                    {idx + 1}
                  </span>
                ) : (
                  <span aria-hidden />
                )}
                <span className="whitespace-pre pr-5" style={{ color: "var(--aurora-text-primary)" }}>
                  {line.length === 0 ? " " : tintLine(line, `l${idx}`)}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    )
  }),
)
JsxPreview.displayName = "JsxPreview"

export { JsxPreview }
