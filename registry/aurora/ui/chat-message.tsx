"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
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
}

export { ChatMessage }
export default ChatMessage
