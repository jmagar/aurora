"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Scoped style layer (reads --aurora-* tokens)                              */
/* -------------------------------------------------------------------------- */

const STYLE_ID = "aurora-chat-message-styles"

const CHAT_MESSAGE_CSS = `
.aurora-chat-message {
  display: flex;
  flex-direction: column;
  font-family: var(--font-sans);
  color: var(--aurora-text-primary);
}
.aurora-chat-message[data-role="user"] {
  align-items: flex-end;
}
.aurora-chat-message[data-role="assistant"] {
  align-items: flex-start;
}

/* Assistant header row: avatar + author + time */
.aurora-chat-message__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.aurora-chat-message__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  border-radius: var(--aurora-radius-2, 10px);
  background: var(--aurora-panel-strong);
  border: 1px solid var(--aurora-border-strong);
  color: var(--aurora-accent-pink);
}
.aurora-chat-message__meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.aurora-chat-message__author {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--aurora-text-primary);
}
.aurora-chat-message__time {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--aurora-text-muted);
}

/* Bubble */
.aurora-chat-message__bubble {
  position: relative;
  max-width: 100%;
  padding: 12px 16px;
  border-radius: var(--aurora-radius-2, 10px);
  font-size: 15px;
  line-height: 1.55;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.aurora-chat-message[data-role="user"] .aurora-chat-message__bubble {
  background: color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent);
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent);
  color: var(--aurora-text-primary);
  text-align: right;
}
.aurora-chat-message[data-role="assistant"] .aurora-chat-message__bubble {
  background: var(--aurora-panel-medium);
  border-color: var(--aurora-border-default);
  color: var(--aurora-text-primary);
  text-align: left;
}
.aurora-chat-message__bubble p {
  margin: 0;
}
.aurora-chat-message__bubble p + p {
  margin-top: 12px;
}

/* Inline code chips */
.aurora-chat-message__bubble code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 2px 7px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--aurora-accent-pink) 12%, var(--aurora-panel-medium));
  color: var(--aurora-accent-pink);
}

/* Citations — sit below the bubble, aligned to the message column */
.aurora-chat-message__citations {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.aurora-chat-message[data-role="user"] .aurora-chat-message__citations {
  justify-content: flex-end;
}
.aurora-chat-message__citation {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: var(--aurora-radius-1, 6px);
  border: 1px solid var(--aurora-border-default);
  background: var(--aurora-control-surface);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  color: var(--aurora-text-muted);
  text-decoration: none;
  transition: border-color 120ms ease, color 120ms ease;
}
.aurora-chat-message__citation:hover {
  border-color: var(--aurora-border-strong);
  color: var(--aurora-text-primary);
}
.aurora-chat-message__citation-icon {
  color: var(--aurora-accent-pink);
  flex: 0 0 auto;
}
`

function useChatMessageStyles() {
  React.useInsertionEffect(() => {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement("style")
    el.id = STYLE_ID
    el.textContent = CHAT_MESSAGE_CSS
    document.head.appendChild(el)
  }, [])
}

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  )
}

function CitationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
    </svg>
  )
}

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

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
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
      ...props
    },
    ref,
  ) {
    useChatMessageStyles()
    void onCopy
    void onRetry

    const isAssistant = role === "assistant"
    const showHead = isAssistant && (author != null || time != null)

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
              <ShieldIcon />
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

        <div
          className="aurora-chat-message__bubble"
          role="article"
          aria-label={
            isAssistant
              ? `Message from ${typeof author === "string" ? author : "assistant"}`
              : "Your message"
          }
        >
          {children}
        </div>

        {citations && citations.length > 0 ? (
          <nav className="aurora-chat-message__citations" aria-label="Citations">
            {citations.map((citation, index) => (
              <a
                key={`${citation.href}-${index}`}
                className="aurora-chat-message__citation"
                href={citation.href}
              >
                <CitationIcon className="aurora-chat-message__citation-icon" />
                {citation.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    )
  },
)

ChatMessage.displayName = "ChatMessage"

export { ChatMessage }
export default ChatMessage
