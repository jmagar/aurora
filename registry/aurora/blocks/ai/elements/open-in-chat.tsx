"use client"

/**
 * Aurora OpenInChat — hand-off-to-chat action.
 *
 * Visual layer ported 1:1 from the Claude Design source: a paper-plane lead icon
 * and three intents — `default` is the rose lit-outline "Open in chat" send action
 * (rose border + glow with rose label + icon), `outline` is the neutral bordered
 * control ("Debug in chat", primary label), and `ghost` is the borderless muted
 * affordance ("Ask about this"). Reads only `--aurora-*` tokens so it renders
 * pixel-identical in dark + `.light`.
 *
 * Architecture stays shadcn/registry: the Aurora `Button` (Radix `Slot`/`cva`)
 * carries the whole visual layer (states, focus ring, sizing), `forwardRef`,
 * `displayName`, and the full `React.ButtonHTMLAttributes` escape hatch are
 * preserved. CD's `variant`/`size` prop vocabulary is kept verbatim and mapped
 * onto the Button underneath.
 */

import * as React from "react"
import { Send } from "lucide-react"
import { Button, type ButtonSize } from "@/registry/aurora/ui/button"

export interface OpenInChatProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /**
   * Intent. `default` is the rose send action, `outline` is the neutral bordered
   * control, `ghost` is the borderless muted affordance.
   */
  variant?: "default" | "outline" | "ghost"
  /** Control size — matches the Aurora Button scale. */
  size?: ButtonSize
}

// Map CD's OpenInChat variant vocabulary onto Aurora Button variants.
const VARIANT_MAP = {
  default: "rose",
  outline: "neutral",
  ghost: "ghost",
} as const

const OpenInChat = React.forwardRef<HTMLButtonElement, OpenInChatProps>(
  ({ variant = "default", size = "default", children = "Open in chat", style, ...props }, ref) => {
    // The rose intent paints its label + icon in the pink accent (CD spec); the
    // neutral/ghost intents inherit their Button variant's text color.
    const rose = variant === "default"
    return (
      <Button
        ref={ref}
        type="button"
        variant={VARIANT_MAP[variant]}
        size={size}
        style={rose ? { color: "var(--aurora-accent-pink)", ...style } : style}
        {...props}
      >
        <Send className="size-3.5" aria-hidden />
        {children}
      </Button>
    )
  }
)
OpenInChat.displayName = "OpenInChat"

export { OpenInChat }
export default OpenInChat
