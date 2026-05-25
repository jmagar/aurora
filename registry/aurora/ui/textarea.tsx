"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaState = "error" | "warn" | "success"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Auto-grow to fit content up to maxRows */
  autoResize?: boolean
  /** Validation state. Sets border color and glow ring using Aurora status tokens. */
  state?: TextareaState
  /** Convenience alias for state="error". When both are set, `state` wins. */
  error?: boolean
}

const STATE_TOKENS = {
  error: {
    border: "var(--aurora-error)",
    ring: "var(--aurora-error)",
  },
  warn: {
    border: "var(--aurora-warn)",
    ring: "var(--aurora-warn)",
  },
  success: {
    border: "var(--aurora-success)",
    ring: "var(--aurora-success)",
  },
} as const

function stateRestShadow(color: string): string {
  return `0 0 0 1px color-mix(in srgb, ${color} 30%, transparent), var(--aurora-highlight-medium)`
}

function stateFocusShadow(color: string): string {
  return [
    `0 0 0 3px color-mix(in srgb, ${color} 22%, transparent)`,
    `0 0 0 1px color-mix(in srgb, ${color} 55%, transparent)`,
    "var(--aurora-highlight-medium)",
  ].join(", ")
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, style, state: stateProp, error, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)
    const effectiveState: TextareaState | undefined = stateProp ?? (error ? "error" : undefined)
    const tokens = effectiveState ? STATE_TOKENS[effectiveState] : null

    // Merge external ref with internal ref
    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      },
      [ref]
    )

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize && internalRef.current) {
          internalRef.current.style.height = "auto"
          internalRef.current.style.height = `${internalRef.current.scrollHeight}px`
        }
        onChange?.(e)
      },
      [autoResize, onChange]
    )

    return (
      <textarea
        ref={setRef}
        className={cn(
          // Layout
          "flex min-h-[112px] w-full min-w-0 px-3.5 py-3",
          // Typography
          "font-[var(--aurora-font-sans)]",
          "text-[var(--aurora-text-primary)]",
          "placeholder:text-[var(--aurora-text-muted)]",
          // Border
          "border border-[var(--aurora-border-strong)]",
          // Rounded
          "rounded-[12px]",
          // Scrollbar
          "resize-y",
          // Transition
          "transition-all duration-150 ease-out",
          // Focus
          "focus-visible:outline-none",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed",
          // Auto-resize overrides manual resize
          autoResize && "resize-none overflow-hidden",
          className
        )}
        style={{
          background: "var(--aurora-control-surface)",
          fontSize: "var(--aurora-type-body-sm)",
          fontWeight: "var(--aurora-weight-body)",
          letterSpacing: "var(--aurora-letter-ui)",
          lineHeight: "1.55",
          borderColor: tokens?.border ?? "var(--aurora-border-strong)",
          boxShadow: tokens ? stateRestShadow(tokens.ring) : "var(--aurora-highlight-medium)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = tokens?.border ?? "var(--aurora-border-strong)"
          e.currentTarget.style.boxShadow = tokens
            ? stateFocusShadow(tokens.ring)
            : [
                "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)",
                "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)",
                "var(--aurora-highlight-medium)",
              ].join(", ")
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = tokens?.border ?? "var(--aurora-border-strong)"
          e.currentTarget.style.boxShadow = tokens ? stateRestShadow(tokens.ring) : "var(--aurora-highlight-medium)"
          props.onBlur?.(e)
        }}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
export default Textarea
