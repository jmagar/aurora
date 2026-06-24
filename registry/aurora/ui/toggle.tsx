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

function Toggle({ ref, className, pressed, defaultPressed = false, onPressedChange, style, onClick, disabled, ...props }: ToggleProps & { ref?: React.Ref<HTMLButtonElement> }) {
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
        "inline-flex h-9 items-center justify-center gap-2 rounded-[10px] border px-3.5 transition-all",
        className
      )}
      style={{
        background: isPressed
          ? "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 85%, transparent), color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-control-surface)))"
          : "linear-gradient(180deg, color-mix(in srgb, var(--aurora-panel-strong) 92%, transparent), var(--aurora-control-surface))",
        borderColor: isPressed
          ? "color-mix(in srgb, var(--aurora-accent-primary) 48%, var(--aurora-border-strong))"
          : "var(--aurora-border-default)",
        boxShadow: isPressed
          ? "var(--aurora-highlight-strong), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 16%, transparent), var(--aurora-active-glow)"
          : "var(--aurora-highlight-medium)",
        color: isPressed ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-control)",
        fontWeight: "var(--aurora-weight-ui)",
        letterSpacing: "var(--aurora-letter-ui)",
        ...style,
      }}
      {...props}
    />
  )
}

export { Toggle }
export default Toggle
