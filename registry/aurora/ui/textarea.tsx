"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Auto-grow to fit content up to maxRows */
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, style, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)

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
          "flex min-h-[80px] w-full px-3 py-2",
          // Typography
          "font-[var(--aurora-font-sans,_Inter,_sans-serif)]",
          "text-[var(--aurora-text-primary)]",
          "placeholder:text-[var(--aurora-text-muted)]",
          // Border
          "border border-[var(--aurora-border-strong)]",
          // Rounded
          "rounded-[var(--aurora-radius-1)]",
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
          background: "var(--aurora-control-surface, #0c1a24)",
          fontSize: "var(--aurora-type-body-sm)",
          fontWeight: "var(--aurora-weight-body)",
          letterSpacing: "var(--aurora-letter-ui)",
          lineHeight: "1.55",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = [
            "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)",
            "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)",
          ].join(", ")
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none"
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
