"use client"

import * as React from "react"
import { sanitizeMarkdownHref } from "@/lib/markdown-links"

/**
 * Minimal, dependency-free Markdown renderer tuned to Aurora tokens. Handles the
 * subset used by the theme READMEs: headings, paragraphs, lists, fenced code,
 * inline code, bold/italic/links, tables, blockquotes, and rules. Not a general
 * CommonMark engine — it covers what these docs actually use.
 */

type Block =
  | { kind: "h"; level: number; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; lang: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "quote"; text: string }
  | { kind: "hr" }

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // fenced code
    const fence = line.match(/^```(\w*)\s*$/)
    if (fence) {
      const lang = fence[1] || ""
      const buf: string[] = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i])
        i++
      }
      i++ // closing fence
      blocks.push({ kind: "code", lang, text: buf.join("\n") })
      continue
    }

    // blank
    if (/^\s*$/.test(line)) {
      i++
      continue
    }

    // hr
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      blocks.push({ kind: "hr" })
      i++
      continue
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      blocks.push({ kind: "h", level: h[1].length, text: h[2].trim() })
      i++
      continue
    }

    // table (header row + separator row of ---|---)
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const splitRow = (r: string) =>
        r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim())
      const head = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes("|") && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push({ kind: "table", head, rows })
      continue
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""))
        i++
      }
      blocks.push({ kind: "quote", text: buf.join(" ") })
      continue
    }

    // lists
    const ulm = line.match(/^\s*[-*+]\s+(.*)$/)
    const olm = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ulm || olm) {
      const ordered = !!olm
      const items: string[] = []
      while (i < lines.length) {
        const m = lines[i].match(ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/)
        if (!m) break
        items.push(m[1].trim())
        i++
      }
      blocks.push(ordered ? { kind: "ol", items } : { kind: "ul", items })
      continue
    }

    // paragraph (gather until blank / block start)
    const buf: string[] = [line]
    i++
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^\s*[-*+]\s/.test(lines[i]) &&
      !/^\s*\d+[.)]\s/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i])
    ) {
      buf.push(lines[i])
      i++
    }
    blocks.push({ kind: "p", text: buf.join(" ") })
  }

  return blocks
}

/** Inline: `code`, **bold**, *italic*, [text](url). Escaped, then re-injected. */
function Inline({ text }: { text: string }) {
  const nodes: React.ReactNode[] = []
  let key = 0
  // Tokenize on the supported inline patterns in priority order.
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="aurora-text-code"
          style={{
            background: "var(--aurora-control-surface)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: 6,
            padding: "1px 5px",
            color: "var(--aurora-accent-pink-strong)",
          }}
        >
          {tok.slice(1, -1)}
        </code>
      )
    } else if (tok.startsWith("**")) {
      nodes.push(<strong key={key++} style={{ fontWeight: 680, color: "var(--aurora-text-primary)" }}>{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith("*")) {
      nodes.push(<em key={key++}>{tok.slice(1, -1)}</em>)
    } else {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!
      const href = sanitizeMarkdownHref(lm[2])
      if (!href) {
        nodes.push(lm[1])
        last = m.index + tok.length
        continue
      }
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--aurora-accent-primary)", textDecoration: "underline", textUnderlineOffset: 2 }}
        >
          {lm[1]}
        </a>
      )
    }
    last = m.index + tok.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return <>{nodes}</>
}

export function Markdown({ source }: { source: string }) {
  const blocks = React.useMemo(() => parse(source), [source])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {blocks.map((b, idx) => {
        switch (b.kind) {
          case "h": {
            const cls =
              b.level <= 1 ? "aurora-text-section" : "aurora-text-section"
            const size = b.level <= 1 ? 19 : b.level === 2 ? 16 : 14
            return (
              <h3 key={idx} className={cls} style={{ fontSize: size, marginTop: idx === 0 ? 0 : 8 }}>
                <Inline text={b.text} />
              </h3>
            )
          }
          case "p":
            return (
              <p key={idx} className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)", margin: 0 }}>
                <Inline text={b.text} />
              </p>
            )
          case "ul":
            return (
              <ul key={idx} style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {b.items.map((it, j) => (
                  <li key={j} className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            )
          case "ol":
            return (
              <ol key={idx} style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                {b.items.map((it, j) => (
                  <li key={j} className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
                    <Inline text={it} />
                  </li>
                ))}
              </ol>
            )
          case "code":
            return (
              <pre
                key={idx}
                style={{
                  margin: 0,
                  overflowX: "auto",
                  background: "var(--aurora-control-surface)",
                  border: "1px solid var(--aurora-border-default)",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <code className="aurora-text-code" style={{ color: "var(--aurora-text-primary)", fontSize: 12.5, lineHeight: 1.6 }}>
                  {b.text}
                </code>
              </pre>
            )
          case "table":
            return (
              <div key={idx} style={{ overflowX: "auto", border: "1px solid var(--aurora-border-default)", borderRadius: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead>
                    <tr>
                      {b.head.map((c, j) => (
                        <th
                          key={j}
                          className="aurora-text-label"
                          style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid var(--aurora-border-strong)", background: "var(--aurora-panel-medium)" }}
                        >
                          <Inline text={c} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td
                            key={k}
                            className="aurora-text-table"
                            style={{ padding: "8px 12px", borderBottom: j < b.rows.length - 1 ? "1px solid var(--aurora-border-default)" : "none", color: "var(--aurora-text-muted)" }}
                          >
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case "quote":
            return (
              <blockquote
                key={idx}
                className="aurora-text-body-sm"
                style={{
                  margin: 0,
                  paddingLeft: 14,
                  borderLeft: "3px solid color-mix(in srgb, var(--aurora-accent-primary) 50%, transparent)",
                  color: "var(--aurora-text-muted)",
                }}
              >
                <Inline text={b.text} />
              </blockquote>
            )
          case "hr":
            return <hr key={idx} style={{ border: "none", borderTop: "1px solid var(--aurora-border-default)", margin: "4px 0" }} />
        }
      })}
    </div>
  )
}
