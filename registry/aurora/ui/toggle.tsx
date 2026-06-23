"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Controlled pressed state. Pair with `onPressedChange`. */
  pressed?: boolean
  /** Initial pressed state for the uncontrolled toggle. */
  defaultPressed?: boolean
  /** Fires with the next pressed value whenever the toggle changes. */
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, defaultPressed = false, onPressedChange, style, onClick, disabled, ...props }, ref) => {
    const isControlled = pressed !== undefined
    const [internal, setInternal] = React.useState(defaultPressed)
    const isPressed = isControlled ? pressed : internal

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || disabled) return
      const next = !isPressed
      if (!isControlled) setInternal(next)
      onPressedChange?.(next)
    }

    return (
      <Button
        variant="plain"
        size="unstyled"
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          // CD Toggle geometry (1:1 with the dsCard render): Aurora-button sizing —
          // 32px tall, 13px horizontal padding, 9px radius, 7px gap.
          "inline-flex h-8 items-center justify-center gap-[7px] rounded-[9px] border px-[13px] transition-all",
          className
        )}
        style={{
          // Pressed: solid accent-tinted surface, cyan border + a single hard cyan
          // ring, and — the key CD detail — accent-strong (cyan) text, not white.
          background: isPressed
            ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-control-surface))"
            : "var(--aurora-control-surface)",
          borderColor: isPressed
            ? "color-mix(in srgb, var(--aurora-accent-primary) 42%, var(--aurora-border-strong))"
            : "var(--aurora-border-strong)",
          boxShadow: isPressed
            ? "inset 0 1px 0 rgba(255,255,255,0.055), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          color: isPressed ? "var(--aurora-accent-strong)" : "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "13px",
          fontWeight: 560,
          ...style,
        }}
        {...props}
      />
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle }
export default Toggle
