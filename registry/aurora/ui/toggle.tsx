"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export type ToggleSize = "sm" | "md" | "lg"

// Geometry per size, in px for INLINE styles. This must be inline, not Tailwind
// utility classes: the Button `size="unstyled"` reset (`.aurora-btn--unstyled`)
// is injected as an unlayered <style> at runtime, and unlayered rules beat
// Tailwind's @layer utilities — so class-based padding/radius/gap get reset to 0
// after hydration (the flash-then-collapse). Inline styles win the cascade both
// before and after injection. `md` is 1:1 with the original CD dsCard render.
const SIZE: Record<
  ToggleSize,
  { h: number; px: number; radius: number; gap: number; font: string }
> = {
  sm: { h: 28, px: 10, radius: 7, gap: 6, font: "var(--aurora-type-caption)" },
  md: { h: 32, px: 13, radius: 9, gap: 7, font: "var(--aurora-type-control)" },
  lg: { h: 36, px: 16, radius: 10, gap: 8, font: "var(--aurora-type-control)" },
}

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Controlled pressed state. Pair with `onPressedChange`. */
  pressed?: boolean
  /** Initial pressed state for the uncontrolled toggle. */
  defaultPressed?: boolean
  /** Fires with the next pressed value whenever the toggle changes. */
  onPressedChange?: (pressed: boolean) => void
  /** Control size. Defaults to "md". */
  size?: ToggleSize
  /**
   * Square, icon-only toggle (toolbar buttons like bold/italic). Removes the
   * horizontal padding and matches width to height. Pass an `aria-label` — the
   * icon carries no accessible text.
   */
  iconOnly?: boolean
}

function Toggle({
  ref,
  className,
  pressed,
  defaultPressed = false,
  onPressedChange,
  size = "md",
  iconOnly = false,
  style,
  onClick,
  disabled,
  ...props
}: ToggleProps & { ref?: React.Ref<HTMLButtonElement> }) {
    const isControlled = pressed !== undefined
    const [internal, setInternal] = React.useState(defaultPressed)
    const isPressed = isControlled ? pressed : internal
    const s = SIZE[size] ?? SIZE.md

    if (process.env.NODE_ENV !== "production" && iconOnly && !props["aria-label"] && !props["aria-labelledby"]) {
      console.warn("[Aurora Toggle] `iconOnly` toggles need an `aria-label` — the icon has no accessible text.")
    }

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
          // Geometry is inline (see SIZE) — utilities here would be reset by the
          // unlayered .aurora-btn--unstyled rule. Only non-geometry classes live here.
          "inline-flex items-center justify-center transition-all",
          disabled && "cursor-not-allowed",
          className
        )}
        style={{
          // Box geometry — inline so it survives the .aurora-btn--unstyled reset.
          height: s.h,
          width: iconOnly ? s.h : undefined,
          padding: iconOnly ? 0 : `0 ${s.px}px`,
          gap: s.gap,
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: s.radius,
          boxSizing: "border-box",
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
          fontSize: s.font,
          fontWeight: "var(--aurora-weight-ui)",
          letterSpacing: "normal",
          // Recede a disabled toggle without changing its pressed/unpressed hue.
          opacity: disabled ? 0.5 : undefined,
          ...style,
        }}
        {...props}
      />
    )
}

export { Toggle }
export default Toggle
