"use client"

import * as React from "react"
import { Avatar as AuroraAvatar } from "@/registry/aurora/ui/avatar"
import { cn } from "@/lib/utils"

// ─── Types ──────────────────────────────────────────────────────────────────

export type MessageAvatarTone = "rose" | "cyan" | "success" | "muted"
export type MessageAvatarStatus = "online" | "away" | "busy" | "offline"

export interface MessageAvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Initials (or short label) rendered as the fallback. */
  label: string
  /** Optional image source — falls back to initials when missing/failed. */
  src?: string
  /** Accent family for the ring + initials. */
  tone?: MessageAvatarTone
  /** Presence dot. Omit to hide the dot entirely. */
  status?: MessageAvatarStatus
  /** Explicit pixel size (avatar is square/circular). */
  size?: number
}

// ─── Tone → accent token ──────────────────────────────────────────────────────

const toneColor: Record<MessageAvatarTone, string> = {
  rose: "var(--aurora-accent-pink)",
  cyan: "var(--aurora-accent-primary)",
  success: "var(--aurora-success)",
  muted: "var(--aurora-text-muted)",
}

// ─── Status → presence-dot color ──────────────────────────────────────────────

const statusColor: Record<MessageAvatarStatus, string> = {
  online: "var(--aurora-success)",
  away: "var(--aurora-warn)",
  busy: "var(--aurora-error)",
  offline: "var(--aurora-status-offline)",
}

// ─── MessageAvatar ────────────────────────────────────────────────────────────
// Circular initials/photo avatar with a tone-tinted ring and an optional glowing
// presence dot. Visual spec ported 1:1 from the Claude Design source.

const MessageAvatar = React.forwardRef<
  React.ElementRef<typeof AuroraAvatar>,
  MessageAvatarProps
>(
  (
    { className, label, src, tone = "rose", status, size = 34, style, ...props },
    ref
  ) => {
    const color = toneColor[tone]
    // Dot sits at the bottom-right corner, overlapping the avatar ring.
    // Size is 28-32% of avatar diameter; minimum 9px so it reads at small sizes.
    const dotSize = Math.max(9, Math.round(size * 0.3))
    // Positive offset pushes the dot inward so it never gets clipped by a parent.
    // It lands just inside the avatar ring, consistent with CD reference.
    const dotInset = Math.round(dotSize * 0.1)

    return (
      <span
        className={cn("relative inline-flex shrink-0", className)}
        style={{ width: size, height: size, overflow: "visible" }}
      >
        <AuroraAvatar
          ref={ref}
          variant="default"
          size={size}
          src={src}
          alt={label}
          fallback={label.slice(0, 2).toUpperCase()}
          style={{
            borderRadius: "50%",
            border: `1.5px solid color-mix(in srgb, ${color} 35%, var(--aurora-border-default))`,
            background: `color-mix(in srgb, ${color} 13%, var(--aurora-panel-medium))`,
            boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 8%, transparent), var(--aurora-highlight-medium)`,
            color,
            fontFamily: "var(--aurora-font-display)",
            fontSize: Math.max(11, Math.round(size * 0.35)),
            fontWeight: 800,
            ...style,
          }}
          {...props}
        />

        {status ? (
          <span
            role="img"
            aria-label={`Status: ${status}`}
            style={{
              position: "absolute",
              bottom: dotInset,
              right: dotInset,
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: statusColor[status],
              border: "2px solid var(--aurora-page-bg)",
              boxShadow: `0 0 6px ${statusColor[status]}`,
              // Ensure dot always renders above the avatar image
              zIndex: 1,
            }}
          />
        ) : null}
      </span>
    )
  }
)
MessageAvatar.displayName = "MessageAvatar"

export { MessageAvatar }
export default MessageAvatar
