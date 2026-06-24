"use client"

import * as React from "react"
import { Check, CodeXml, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/aurora/ui/button"

export interface ResponseSource {
  /** Source title shown in the citation hover/focus preview. */
  title: string
  /** Source URL — rendered in the preview and used as the chip's link target. */
  href?: string
  /** Optional one-line description shown beneath the title in the preview. */
  description?: string
}

export interface ResponseProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Markdown answer body. Supports a focused subset matching the Claude Design
   * Response element: `**bold**`, inline `` `code` ``, fenced ```code blocks```
   * (with an optional language on the fence), `- ` bullet lists, and `[[n]]`
   * citation references that bind to `sources[n - 1]`.
   */
  markdown: string
  /** Ordered citation sources; a `[[n]]` reference maps to `sources[n - 1]`. */
  sources?: ResponseSource[]
  /** Fired when a citation chip is activated, with its 1-based index. */
  onCitationClick?: (index: number, source?: ResponseSource) => void
  /**
   * When true the answer renders with a soft trailing fade + caret, signalling
   * an in-progress stream. When the stream stops, set `streaming={false}`.
   */
  streaming?: boolean
}

/* ------------------------------------------------------------------ */
/* Code-fence syntax highlighter (mirrors the registry Snippet spec). */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set([
  "export", "import", "from", "default", "const", "let", "var", "function",
  "async", "await", "return", "if", "else", "for", "while", "new", "class",
  "extends", "typeof", "in", "of", "yield", "try", "catch", "finally", "throw",
  "def", "lambda", "true", "false", "null", "undefined", "None", "True",
  "False", "fn", "match", "pub", "use", "mut", "impl", "self",
])

const TOKEN_RE =
  /(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w$])/g

function tokenColor(word: string, prevSig: string, nextSig: string): string | undefined {
  if (KEYWORDS.has(word)) return "var(--aurora-accent-pink)"
  if (prevSig === "." || nextSig === "(") return "var(--aurora-accent-primary)"
  return undefined
}

function highlight(code: string): React.ReactNode[] {
  const tokens: { text: string; type: number }[] = []
  let match: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match[1]) tokens.push({ text: match[1], type: 1 })
    else if (match[2]) tokens.push({ text: match[2], type: 2 })
    else if (match[3]) tokens.push({ text: match[3], type: 3 })
    else if (match[4]) tokens.push({ text: match[4], type: 4 })
    else if (match[5]) tokens.push({ text: match[5], type: 5 })
    else tokens.push({ text: match[6] ?? "", type: 6 })
  }
  const out: React.ReactNode[] = []
  let key = 0
  let prevSig = ""
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i]
    if (t.type === 5) {
      out.push(<React.Fragment key={key++}>{t.text}</React.Fragment>)
      continue
    }
    let color: string | undefined
    if (t.type === 1) color = "var(--aurora-text-muted)"
    else if (t.type === 2) color = "var(--aurora-success)"
    else if (t.type === 3) color = "var(--axon-orange)"
    else if (t.type === 4) {
      let j = i + 1
      while (j < tokens.length && tokens[j].type === 5) j += 1
      const nextSig = j < tokens.length ? tokens[j].text : ""
      color = tokenColor(t.text, prevSig, nextSig)
    }
    if (t.type !== 5) prevSig = t.text.trim() ? t.text : prevSig
    out.push(
      <span key={key++} style={color ? { color } : undefined}>
        {t.text}
      </span>
    )
  }
  return out
}

function CodeCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }, [value])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy code"}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Copied" : "Copy code"}
      </span>
    </Button>
  )
}

function ResponseCodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div
      style={{
        background: "var(--aurora-panel-strong)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        overflow: "hidden",
        margin: "14px 0",
      }}
    >
      <div
        className="flex items-center justify-between gap-3"
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--aurora-border-default)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong-top) 70%, transparent), transparent)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <CodeXml className="size-4" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 22,
              padding: "0 9px",
              borderRadius: 7,
              fontFamily: "var(--aurora-font-mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--aurora-accent-pink)",
              background: "var(--aurora-accent-pink-surface)",
              border: "1px solid var(--aurora-accent-pink-border)",
            }}
          >
            {language}
          </span>
        </div>
        <CodeCopyButton value={code} />
      </div>
      <pre
        className="overflow-auto aurora-text-code"
        style={{
          margin: 0,
          padding: "14px 16px",
          background: "transparent",
          color: "var(--aurora-text-primary)",
          lineHeight: 1.7,
          whiteSpace: "pre",
        }}
      >
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Citation chip (rose, hover/focus preview) — mirrors InlineCitation. */
/* ------------------------------------------------------------------ */

function CitationChip({
  index,
  source,
  onActivate,
}: {
  index: number
  source?: ResponseSource
  onActivate?: (index: number, source?: ResponseSource) => void
}) {
  const [open, setOpen] = React.useState(false)
  const hasPreview = Boolean(source?.title || source?.href)
  const previewId = React.useId()

  const chip = (
    <a
      href={source?.href ?? undefined}
      target={source?.href ? "_blank" : undefined}
      rel={source?.href ? "noreferrer noopener" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-[5px] border align-baseline no-underline",
        "transition-colors",
        "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
      )}
      aria-label={
        source?.title ? `Citation ${index}: ${source.title}` : `Citation ${index}`
      }
      aria-describedby={hasPreview && open ? previewId : undefined}
      onMouseEnter={hasPreview ? () => setOpen(true) : undefined}
      onMouseLeave={hasPreview ? () => setOpen(false) : undefined}
      onFocus={hasPreview ? () => setOpen(true) : undefined}
      onBlur={hasPreview ? () => setOpen(false) : undefined}
      onClick={() => onActivate?.(index, source)}
      style={{
        minWidth: "1.05rem",
        padding: "1px 6px",
        marginLeft: 3,
        borderColor: "color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent)",
        background: "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)",
        color: "var(--aurora-accent-pink)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.45,
        cursor: "pointer",
        ["--tw-ring-color" as string]:
          "color-mix(in srgb, var(--aurora-accent-pink) 45%, transparent)",
      }}
      onMouseOver={
        hasPreview
          ? (e) => {
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--aurora-accent-pink) 20%, transparent)"
              e.currentTarget.style.borderColor =
                "color-mix(in srgb, var(--aurora-accent-pink) 48%, transparent)"
            }
          : undefined
      }
      onMouseOut={
        hasPreview
          ? (e) => {
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)"
              e.currentTarget.style.borderColor =
                "color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent)"
            }
          : undefined
      }
    >
      {index}
    </a>
  )

  if (!hasPreview) return chip

  return (
    <span className="relative inline-block align-baseline" style={{ lineHeight: 0 }}>
      {chip}
      <span
        id={previewId}
        role="tooltip"
        hidden={!open}
        className="absolute left-1/2 z-50 grid gap-1 text-left"
        style={{
          bottom: "calc(100% + 8px)",
          transform: "translateX(-50%)",
          width: "max-content",
          maxWidth: 280,
          padding: "10px 12px",
          background: "var(--aurora-surface-raised)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-1)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        }}
      >
        {source?.title ? (
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.35,
              color: "var(--aurora-text-primary)",
            }}
          >
            {source.title}
          </span>
        ) : null}
        {source?.description ? (
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: 12,
              lineHeight: 1.4,
              color: "var(--aurora-text-muted)",
            }}
          >
            {source.description}
          </span>
        ) : null}
        {source?.href ? (
          <span
            style={{
              fontFamily: "var(--aurora-font-mono)",
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--aurora-accent-pink)",
              wordBreak: "break-all",
            }}
          >
            {source.href}
          </span>
        ) : null}
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Inline markdown: **bold**, `code`, and [[n]] citation references.   */
/* ------------------------------------------------------------------ */

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[\[\d+\]\])/g

function renderInline(
  text: string,
  keyPrefix: string,
  sources: ResponseSource[] | undefined,
  onCitationClick: ((index: number, source?: ResponseSource) => void) | undefined
): React.ReactNode[] {
  const parts = text.split(INLINE_RE).filter((p) => p !== "")
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} style={{ fontWeight: 700, color: "var(--aurora-text-primary)" }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          style={{
            fontFamily: "var(--aurora-font-mono)",
            fontSize: "0.86em",
            padding: "1px 6px",
            borderRadius: 6,
            color: "var(--axon-orange)",
            background: "color-mix(in srgb, var(--axon-orange) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--axon-orange) 26%, transparent)",
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    const citation = /^\[\[(\d+)\]\]$/.exec(part)
    if (citation) {
      const index = Number(citation[1])
      return (
        <CitationChip
          key={key}
          index={index}
          source={sources?.[index - 1]}
          onActivate={onCitationClick}
        />
      )
    }
    return <React.Fragment key={key}>{part}</React.Fragment>
  })
}

/* ------------------------------------------------------------------ */
/* Block parser: paragraphs, fenced code, and bullet lists.            */
/* ------------------------------------------------------------------ */

type Block =
  | { kind: "code"; code: string; language: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string }

function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = []
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  let i = 0
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join("\n") })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push({ kind: "list", items: list })
      list = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]
    const fence = /^```(\w+)?\s*$/.exec(line)
    if (fence) {
      flushParagraph()
      flushList()
      const language = fence[1] ?? "text"
      const body: string[] = []
      i += 1
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i])
        i += 1
      }
      i += 1 // skip closing fence
      blocks.push({ kind: "code", code: body.join("\n"), language })
      continue
    }
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      list.push(bullet[1])
      i += 1
      continue
    }
    if (line.trim() === "") {
      flushParagraph()
      flushList()
      i += 1
      continue
    }
    flushList()
    paragraph.push(line)
    i += 1
  }
  flushParagraph()
  flushList()
  return blocks
}

/* ------------------------------------------------------------------ */
/* Response                                                            */
/* ------------------------------------------------------------------ */

const STYLE_ID = "aurora-response-style"
const STYLE_CSS = `
@keyframes aurora-response-fade-in {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes aurora-response-caret {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.aurora-response-block { animation: aurora-response-fade-in var(--aurora-motion, 240ms) ease-out both; }
.aurora-response-caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 2px;
  vertical-align: text-bottom;
  border-radius: 1px;
  background: var(--aurora-accent-primary);
  animation: aurora-response-caret 1s step-end infinite;
}
`

function useResponseStyle() {
  React.useEffect(() => {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement("style")
    el.id = STYLE_ID
    el.textContent = STYLE_CSS
    document.head.appendChild(el)
  }, [])
}

const Response = React.forwardRef<HTMLDivElement, ResponseProps>(
  (
    { markdown, sources, onCitationClick, streaming = false, className, style, ...props },
    ref
  ) => {
    useResponseStyle()
    const blocks = React.useMemo(() => parseBlocks(markdown), [markdown])
    const lastIndex = blocks.length - 1

    return (
      <div
        ref={ref}
        className={cn("aurora-text-body", className)}
        style={{
          fontFamily: "var(--aurora-font-sans)",
          fontSize: 15,
          lineHeight: 1.6,
          color: "var(--aurora-text-primary)",
          opacity: streaming ? 0.96 : 1,
          ...style,
        }}
        aria-busy={streaming || undefined}
        aria-live={streaming ? "polite" : undefined}
        {...props}
      >
        {blocks.map((block, bi) => {
          const isLast = bi === lastIndex
          if (block.kind === "code") {
            return (
              <div className="aurora-response-block" key={`b-${bi}`}>
                <ResponseCodeBlock code={block.code} language={block.language} />
              </div>
            )
          }
          if (block.kind === "list") {
            return (
              <ul
                className="aurora-response-block"
                key={`b-${bi}`}
                style={{
                  listStyle: "none",
                  margin: "10px 0",
                  padding: 0,
                  display: "grid",
                  gap: 8,
                }}
              >
                {block.items.map((item, li) => (
                  <li
                    key={`b-${bi}-${li}`}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <span
                      aria-hidden
                      style={{
                        marginTop: "0.62em",
                        flex: "0 0 auto",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--aurora-accent-primary)",
                      }}
                    />
                    <span style={{ flex: 1 }}>
                      {renderInline(item, `b-${bi}-${li}`, sources, onCitationClick)}
                      {streaming && isLast && li === block.items.length - 1 ? (
                        <span className="aurora-response-caret" aria-hidden />
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )
          }
          return (
            <p
              className="aurora-response-block"
              key={`b-${bi}`}
              style={{ margin: "10px 0" }}
            >
              {renderInline(block.text, `b-${bi}`, sources, onCitationClick)}
              {streaming && isLast ? (
                <span className="aurora-response-caret" aria-hidden />
              ) : null}
            </p>
          )
        })}
      </div>
    )
  }
)
Response.displayName = "Response"

export { Response }
export default Response
