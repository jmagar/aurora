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
          // On vs off must read at a glance, so the states diverge hard:
          //  · On  = lit + raised: stronger accent fill, bright cyan border, a
          //    hard cyan ring + soft outer glow, accent-strong (cyan) text.
          //  · Off = recessed + flat: darker surface with an inset shadow so it
          //    looks pressed-in/inactive, a subtle border, muted text.
          background: isPressed
            ? "color-mix(in srgb, var(--aurora-accent-primary) 18%, var(--aurora-control-surface))"
            : "color-mix(in srgb, var(--aurora-control-surface) 86%, #000)",
          borderColor: isPressed
            ? "color-mix(in srgb, var(--aurora-accent-primary) 58%, var(--aurora-border-strong))"
            : "var(--aurora-border-default)",
          boxShadow: isPressed
            ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent), 0 0 14px color-mix(in srgb, var(--aurora-accent-primary) 26%, transparent)"
            : "inset 0 1px 3px rgba(0,0,0,0.32)",
          color: isPressed ? "var(--aurora-accent-strong)" : "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          // Control tokens resolve to CD's 13px / 560; keep the indirection so the
          // toggle tracks retuning. CD computes the toggle label at letter-spacing
          // `normal` (not the 0.005em ui token), so pin it explicitly.
          fontSize: "var(--aurora-type-control)",
          fontWeight: "var(--aurora-weight-ui)",
          letterSpacing: "normal",
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
