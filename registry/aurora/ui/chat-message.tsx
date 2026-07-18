"use client"

import * as React from "react"
import { Copy, Link2, RotateCcw, Shield } from "lucide-react"

import { Button } from "./button"
import { cn } from "@/lib/utils"
import { safeHttpUrl } from "@/registry/aurora/lib/safe-url"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ChatMessageRole = "user" | "assistant"

export interface ChatMessageCitation {
  label: string
  href: string
}

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Who is speaking. User turns align right; assistant turns align left with an avatar. */
  role: ChatMessageRole
  /** Display name shown in the assistant header. */
  author?: React.ReactNode
  /** Timestamp shown next to the author. */
  time?: React.ReactNode
  /** Source citations rendered as monospace chips below the bubble. */
  citations?: ChatMessageCitation[]
  /** Optional copy handler (reserved for action affordances). */
  onCopy?: () => void
  /** Optional retry handler (reserved for action affordances). */
  onRetry?: () => void
  children?: React.ReactNode
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

function ChatMessage(
  {
    role,
    author,
    time,
    citations,
    onCopy,
    onRetry,
    className,
    children,
    ref,
    ...props
  }: ChatMessageProps & { ref?: React.Ref<HTMLDivElement> },
) {
  const isAssistant = role === "assistant"
  const showHead = isAssistant && (author != null || time != null)
  const showActions = isAssistant && (onCopy != null || onRetry != null)

  return (
    <div
      ref={ref}
      data-role={role}
      className={cn("aurora-chat-message", className)}
      {...props}
    >
      {showHead ? (
        <div className="aurora-chat-message__head">
          <span className="aurora-chat-message__avatar" aria-hidden="true">
            <Shield size={18} strokeWidth={1.7} />
          </span>
          <span className="aurora-chat-message__meta">
            {author != null ? (
              <span className="aurora-chat-message__author">{author}</span>
            ) : null}
            {time != null ? (
              <span className="aurora-chat-message__time">{time}</span>
            ) : null}
          </span>
        </div>
      ) : null}

      <article
        className="aurora-chat-message__bubble"
        aria-label={
          isAssistant
            ? `Message from ${typeof author === "string" ? author : "assistant"}`
            : "Your message"
        }
      >
        {children}
      </article>

      {citations && citations.length > 0 ? (
        <nav className="aurora-chat-message__citations" aria-label="Citations">
          {citations.map((citation, index) => safeHttpUrl(citation.href) ? (
            <a
              key={`${citation.href}-${index}`}
              className="aurora-chat-message__citation"
              href={safeHttpUrl(citation.href)}
              style={{
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-label)",
                fontWeight: "var(--aurora-weight-ui)",
                letterSpacing: "var(--aurora-letter-label)",
              }}
            >
              <Link2
                className="aurora-chat-message__citation-icon"
                size={13}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {citation.label}
            </a>
          ) : (
            <span key={`${citation.href}-${index}`} className="aurora-chat-message__citation" aria-disabled="true">{citation.label}</span>
          ))}
        </nav>
      ) : null}

      {showActions ? (
        <div
          aria-label="Message actions"
          className="flex flex-wrap items-center gap-2"
          style={{ marginTop: citations?.length ? 8 : 10 }}
        >
          {onCopy ? (
            <Button
              variant="plain"
              size="unstyled"
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-[color-mix(in_srgb,var(--aurora-accent-primary)_10%,transparent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
              style={{
                color: "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-label)",
                fontWeight: "var(--aurora-weight-ui)",
                letterSpacing: "var(--aurora-letter-label)",
                lineHeight: "var(--aurora-line-dense)",
              }}
            >
              <Copy data-icon="inline-start" size={14} strokeWidth={1.75} aria-hidden="true" />
              Copy
            </Button>
          ) : null}
          {onRetry ? (
            <Button
              variant="plain"
              size="unstyled"
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-[color-mix(in_srgb,var(--aurora-accent-pink)_10%,transparent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--aurora-focus-ring)]"
              style={{
                color: "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-label)",
                fontWeight: "var(--aurora-weight-ui)",
                letterSpacing: "var(--aurora-letter-label)",
                lineHeight: "var(--aurora-line-dense)",
              }}
            >
              <RotateCcw data-icon="inline-start" size={14} strokeWidth={1.75} aria-hidden="true" />
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { ChatMessage }
export default ChatMessage
