"use client"

import * as React from "react"
import { CheckCheck, FileText, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/aurora/ui/button"

// ─── Types ──────────────────────────────────────────────────────────────────

export type MessageTone = "assistant" | "user" | "error"

export type DeliveryStatus = "sent" | "delivered" | "read"

export interface MessageAttachment {
  /** File name shown in the attachment chip */
  name: string
  /** Secondary metadata (e.g. size) shown beneath the name */
  meta?: string
}

export interface MessageContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Bubble tone — drives tint, border, radius corner and meta chrome */
  tone?: MessageTone
  /** Sender name shown above the bubble (assistant/error tones) */
  sender?: React.ReactNode
  /** Timestamp shown in the meta row */
  time?: React.ReactNode
  /** Delivery state — renders ticks + label beneath a user bubble */
  status?: DeliveryStatus
  /** Attachment chips rendered inside the bubble */
  attachments?: MessageAttachment[]
  /** Append a blinking caret to signal an in-progress stream */
  streaming?: boolean
  /** Fires with the selected text when the user selects inside the bubble */
  onQuote?: (text: string) => void
  /** Renders a retry affordance beneath the bubble (error tone) */
  onRetry?: () => void
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

// ─── Tone styling ────────────────────────────────────────────────────────────
// assistant: neutral panel (cyan-leaning border), user: cyan tint, error: rose tint.

const bubbleTone: Record<
  MessageTone,
  { background: string; borderColor: string; shadow: string; radius: string }
> = {
  assistant: {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--axon-orange) 9%, var(--aurora-panel-strong)), var(--aurora-panel-medium))",
    borderColor: "color-mix(in srgb, var(--axon-orange) 26%, var(--aurora-border-strong))",
    shadow:
      "0 14px 30px color-mix(in srgb, var(--aurora-page-bg) 60%, transparent), var(--aurora-highlight-medium)",
    radius: "16px 16px 16px 6px",
  },
  user: {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-primary) 14%, var(--aurora-panel-medium)), color-mix(in srgb, var(--aurora-accent-primary) 7%, var(--aurora-panel-medium)))",
    borderColor: "color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-default))",
    shadow:
      "0 14px 30px color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent), var(--aurora-highlight-medium)",
    radius: "16px 16px 6px 16px",
  },
  error: {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--aurora-error) 11%, var(--aurora-panel-medium)), color-mix(in srgb, var(--aurora-error) 6%, var(--aurora-panel-medium)))",
    borderColor: "color-mix(in srgb, var(--aurora-error) 38%, var(--aurora-border-default))",
    shadow:
      "0 14px 30px color-mix(in srgb, var(--aurora-error) 8%, transparent), var(--aurora-highlight-medium)",
    radius: "16px 16px 16px 6px",
  },
}

const statusLabel: Record<DeliveryStatus, string> = {
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
}

// ─── Attachment chip ──────────────────────────────────────────────────────────

function AttachmentChip({ attachment }: { attachment: MessageAttachment }) {
  return (
    <div
      className="flex items-center gap-3 rounded-[12px] border px-3 py-2"
      style={{
        borderColor: "color-mix(in srgb, var(--aurora-border-strong) 70%, transparent)",
        background: "color-mix(in srgb, var(--aurora-page-bg) 35%, transparent)",
      }}
    >
      <FileText
        className="size-[18px] shrink-0"
        aria-hidden
        style={{ color: "var(--aurora-accent-primary)" }}
      />
      <div className="grid min-w-0">
        <span
          className="truncate"
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: 13.5,
            fontWeight: 700,
            color: "var(--aurora-text-primary)",
          }}
        >
          {attachment.name}
        </span>
        {attachment.meta ? (
          <span
            className="truncate"
            style={{ fontSize: 11.5, color: "var(--aurora-text-muted)" }}
          >
            {attachment.meta}
          </span>
        ) : null}
      </div>
    </div>
  )
}

// ─── MessageContent ────────────────────────────────────────────────────────────
// Self-contained chat bubble: sender/time meta, attachment chips, streaming caret,
// delivery ticks (user) and a retry affordance (error).

const MessageContent = (
    { ref,
      className,
      style,
      tone = "assistant",
      sender,
      time,
      status,
      attachments,
      streaming = false,
      onQuote,
      onRetry,
      children,
      ...props
    }: MessageContentProps & { ref?: React.Ref<HTMLDivElement> }
  ) => {
    const isUser = tone === "user"
    const palette = bubbleTone[tone]
    const showTopMeta = sender != null || (time != null && !isUser)

    const handleQuote = React.useCallback(() => {
      if (!onQuote || typeof window === "undefined") return
      const selection = window.getSelection()?.toString().trim()
      if (selection) onQuote(selection)
    }, [onQuote])

    return (
      <div
        className={cn("flex w-fit max-w-full flex-col", className)}
        style={{
          alignItems: isUser ? "flex-end" : "flex-start",
          ...style,
        }}
      >
        {/* Top meta: sender + time (or bare time for the user tone) */}
        {showTopMeta ? (
          <div
            className="mb-[7px] flex items-center gap-2"
            style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
          >
            {sender != null ? (
              <span
                style={{
                  fontFamily: "var(--aurora-font-display)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--aurora-text-primary)",
                }}
              >
                {sender}
              </span>
            ) : null}
            {time != null && !isUser ? (
              <span
                className="aurora-text-meta"
                style={{
                  color: "var(--aurora-text-muted)",
                }}
              >
                {time}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Bare timestamp above a user bubble */}
        {isUser && time != null ? (
          <span
            className="mb-[7px] aurora-text-meta"
            style={{
              color: "var(--aurora-text-muted)",
            }}
          >
            {time}
          </span>
        ) : null}

        {/* The bubble */}
        <div
          ref={ref}
          className="min-w-0 border px-4 py-3 aurora-text-body"
          style={{
            borderRadius: palette.radius,
            background: palette.background,
            borderColor: palette.borderColor,
            boxShadow: palette.shadow,
            lineHeight: "var(--aurora-line-body)",
          }}
          onMouseUp={onQuote ? handleQuote : undefined}
          {...props}
        >
          <div className="grid gap-3">
            {children != null ? (
              <div>
                {children}
                {streaming ? (
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: "1em",
                      marginLeft: 1,
                      verticalAlign: "text-bottom",
                      borderRadius: 1,
                      background: "var(--aurora-accent-pink)",
                      animation: "aurora-msg-caret 1.1s steps(1) infinite",
                    }}
                  />
                ) : null}
              </div>
            ) : null}

            {attachments && attachments.length > 0 ? (
              <div className="grid gap-2">
                {attachments.map((attachment, index) => (
                  <AttachmentChip key={`${attachment.name}-${index}`} attachment={attachment} />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Delivery ticks beneath a user bubble */}
        {isUser && status ? (
          <div
            className="mt-[7px] flex items-center gap-1.5"
            style={{ color: status === "read" ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)" }}
          >
            <CheckCheck className="size-[15px]" aria-hidden />
            <span
              style={{
                fontFamily: "var(--aurora-font-display)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {statusLabel[status]}
            </span>
          </div>
        ) : null}

        {/* Retry affordance beneath an error bubble */}
        {onRetry ? (
          <Button
            type="button"
            onClick={onRetry}
            aria-label="Retry sending message"
            variant="destructive"
            size="icon"
            className="mt-[10px] size-9 rounded-[10px]"
            style={{
              borderColor: "color-mix(in srgb, var(--aurora-error) 38%, var(--aurora-border-default))",
              color: "var(--aurora-error)",
            }}
            iconLeft={<RotateCcw size={16} strokeWidth={1.75} aria-hidden data-icon="inline-start" />}
          >
            <span className="sr-only">Retry sending message</span>
          </Button>
        ) : null}
      </div>
    )
  }
MessageContent.displayName = "MessageContent"

export { MessageContent }
export default MessageContent
