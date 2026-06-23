"use client"

import * as React from "react"
import { Avatar as AuroraAvatar } from "@/registry/aurora/ui/avatar"

// ─── Types ──────────────────────────────────────────────────────────────────

export type ConversationProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Caps the scroll height of the thread (px). Defaults to 520. */
  maxHeight?: number
}

export interface MessageProps extends React.HTMLAttributes<HTMLElement> {
  role?: "assistant" | "user" | "system"
}

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  /** Accent family for the avatar ring + glyph. */
  tone?: "cyan" | "rose" | "muted"
}

// ─── Conversation ─────────────────────────────────────────────────────────────

const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({ className, style, maxHeight = 520, ...props }, ref) => (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-label="Conversation"
      className={["grid gap-4 border p-4", className].filter(Boolean).join(" ")}
      style={{
        border: "1px solid var(--aurora-border-strong)",
        borderRadius: "var(--aurora-radius-1)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 96%, transparent), var(--aurora-panel-medium))",
        maxHeight,
        overflowY: "auto",
        ...style,
      }}
      {...props}
    />
  )
)
Conversation.displayName = "Conversation"

// ─── Message (row) ────────────────────────────────────────────────────────────

const Message = React.forwardRef<HTMLElement, MessageProps>(
  ({ className, role = "assistant", style, ...props }, ref) => {
    const isUser = role === "user"
    return (
      <article
        ref={ref}
        className={["flex gap-3", className].filter(Boolean).join(" ")}
        data-role={role}
        style={{
          // User rows mirror: avatar moves to the right, bubble hugs the right edge.
          flexDirection: isUser ? "row-reverse" : "row",
          justifyContent: isUser ? "flex-end" : "flex-start",
          alignItems: "flex-start",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      />
    )
  }
)
Message.displayName = "Message"

// ─── MessageAvatar ────────────────────────────────────────────────────────────

const MessageAvatar = React.forwardRef<
  React.ElementRef<typeof AuroraAvatar>,
  MessageAvatarProps
>(({ className, label, tone = "muted", style, ...props }, ref) => {
  const color =
    tone === "cyan"
      ? "var(--aurora-accent-primary)"
      : tone === "rose"
        ? "var(--aurora-accent-pink)"
        : "var(--aurora-text-muted)"

  return (
    <AuroraAvatar
      ref={ref}
      size={36}
      alt={label}
      fallback={label.slice(0, 2).toUpperCase()}
      className={className}
      style={{
        borderRadius: "50%",
        border: `1.5px solid color-mix(in srgb, ${color} 45%, var(--aurora-border-default))`,
        background: `color-mix(in srgb, ${color} 12%, var(--aurora-panel-medium))`,
        boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 7%, transparent), var(--aurora-highlight-medium)`,
        color,
        fontFamily: "var(--aurora-font-display)",
        fontSize: 12,
        fontWeight: 800,
        ...style,
      }}
      {...props}
    />
  )
})
MessageAvatar.displayName = "MessageAvatar"

// ─── MessageContent (bubble) ──────────────────────────────────────────────────

const bubbleTone = {
  assistant: {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--aurora-text-muted) 8%, var(--aurora-panel-medium)), color-mix(in srgb, var(--aurora-text-muted) 4%, var(--aurora-panel-medium)))",
    borderColor:
      "color-mix(in srgb, var(--aurora-text-muted) 22%, var(--aurora-border-default))",
    shadow:
      "0 14px 30px color-mix(in srgb, #000 18%, transparent), var(--aurora-highlight-medium)",
  },
  user: {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--aurora-accent-primary) 13%, var(--aurora-panel-medium)), color-mix(in srgb, var(--aurora-accent-primary) 7%, var(--aurora-panel-medium)))",
    borderColor:
      "color-mix(in srgb, var(--aurora-accent-primary) 38%, var(--aurora-border-default))",
    shadow:
      "0 14px 30px color-mix(in srgb, var(--aurora-accent-primary) 7%, transparent), var(--aurora-highlight-medium)",
  },
  system: {
    background:
      "color-mix(in srgb, var(--aurora-text-muted) 8%, var(--aurora-panel-medium))",
    borderColor: "var(--aurora-border-default)",
    shadow: "var(--aurora-highlight-medium)",
  },
} as const

const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    tone?: MessageProps["role"]
    /** Constrain prose width like a chat bubble. */
    prose?: boolean
  }
>(({ className, style, tone = "assistant", prose, ...props }, ref) => {
  const t = tone ?? "assistant"
  return (
    <div
      ref={ref}
      className={[
        "min-w-0 border px-4 py-3 aurora-text-body",
        t === "user"
          ? "rounded-[16px_16px_6px_16px]"
          : "rounded-[16px_16px_16px_6px]",
        prose ? "max-w-[42ch]" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: bubbleTone[t].background,
        borderColor: bubbleTone[t].borderColor,
        boxShadow: bubbleTone[t].shadow,
        lineHeight: "var(--aurora-line-body)",
        // Hug content so the bubble doesn't stretch the full row width.
        width: "fit-content",
        ...style,
      }}
      {...props}
    />
  )
})
MessageContent.displayName = "MessageContent"

export { Conversation, Message, MessageAvatar, MessageContent }
